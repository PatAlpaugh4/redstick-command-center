import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

const UserRole = ["ADMIN", "PARTNER", "ANALYST"] as const;

const mockUsers = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@redstick.vc",
    role: "ADMIN",
    image: null,
    createdAt: "2024-01-01T00:00:00Z",
    deals: [],
    agentRuns: [],
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@redstick.vc",
    role: "PARTNER",
    image: null,
    createdAt: "2024-01-01T00:00:00Z",
    deals: [],
    agentRuns: [],
  },
];

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(UserRole).optional(),
  password: z.string().min(8).optional(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check for duplicate email
    if (validatedData.email) {
      const existingUser = mockUsers.find(
        u => u.id !== id && u.email === validatedData.email
      );
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Email already in use" },
          { status: 409 }
        );
      }
    }
    
    // Hash password if provided
    let updateData = { ...validatedData };
    if (validatedData.password) {
      updateData.password = await hash(validatedData.password, 12) as any;
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...updateData,
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const userIndex = mockUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    
    // Prevent self-deletion
    // In real app: check session user id against params id
    
    mockUsers.splice(userIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
