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
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@redstick.vc",
    role: "PARTNER",
    image: null,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Dr. Elena Rodriguez",
    email: "elena@redstick.vc",
    role: "PARTNER",
    image: null,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(UserRole).default("ANALYST"),
});

// GET /api/users - List users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    
    let filteredUsers = [...mockUsers];
    
    if (role) filteredUsers = filteredUsers.filter(u => u.role === role);
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Remove sensitive data
    const safeUsers = filteredUsers.map(({ ...user }) => user);
    
    return NextResponse.json({ success: true, data: safeUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create user (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);
    
    // Check for duplicate email
    const existingUser = mockUsers.find(u => u.email === validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);
    
    // Create user
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      image: null,
      createdAt: new Date().toISOString(),
    };
    
    mockUsers.push({ ...newUser, password: hashedPassword } as any);
    
    return NextResponse.json(
      { success: true, data: newUser, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
