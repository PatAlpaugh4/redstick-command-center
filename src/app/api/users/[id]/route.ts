import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

// Auth middleware placeholder
async function getAuthSession(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null,
    };
  }

  return { error: null, user: session.user };
}

// Check if user is admin
async function requireAdmin(req: NextRequest) {
  const { error, user } = await getAuthSession(req);
  if (error) return { error, user: null };
  
  if (user!.role !== 'ADMIN') {
    return {
      error: NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 }),
      user: null,
    };
  }

  return { error: null, user };
}

// Check if user is self or admin
async function requireSelfOrAdmin(req: NextRequest, userId: string) {
  const { error, user } = await getAuthSession(req);
  if (error) return { error, user: null };
  
  if (user!.role !== 'ADMIN' && user!.id !== userId) {
    return {
      error: NextResponse.json({ error: 'Forbidden - Can only modify own profile' }, { status: 403 }),
      user: null,
    };
  }

  return { error: null, user };
}

// Validation schema for updating a user
const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['ADMIN', 'PARTNER', 'ANALYST']).optional(),
  image: z.string().url('Invalid image URL').optional().nullable(),
});

// Params type for dynamic routes
interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/users/[id] - Get user profile
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { error } = await getAuthSession(req);
    if (error) return error;

    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        // Include related data
        deals: {
          select: {
            id: true,
            name: true,
            status: true,
          },
          take: 5,
        },
        agentRuns: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user profile (self or admin)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    
    const { error, user: authUser } = await requireSelfOrAdmin(req, id);
    if (error) return error;

    const body = await req.json();
    
    // Validate input
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, role, image } = validationResult.data;

    // Non-admin users cannot change their role
    if (role && authUser!.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Only admins can change roles' },
        { status: 403 }
      );
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (image !== undefined) updateData.image = image;
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { error } = await requireAdmin(req);
    if (error) return error;

    const { id } = params;

    // Prevent admin from deleting themselves
    const session = await getServerSession(authOptions);
    if (session?.user?.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
