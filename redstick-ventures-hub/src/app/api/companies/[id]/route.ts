import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const mockCompanies = [
  {
    id: "1",
    name: "AquaCulture Labs",
    sector: "Aquaculture",
    stage: "Series A",
    website: "https://aqualabs.com",
    description: "Sustainable aquaculture technology",
    founded: 2021,
    employees: 24,
    investment: 2000000,
    valuation: 12000000,
    status: "ACTIVE",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "FarmGrid Analytics",
    sector: "AgTech",
    stage: "Series A",
    website: "https://farmgrid.io",
    description: "Precision agriculture analytics",
    founded: 2020,
    employees: 18,
    investment: 1500000,
    valuation: 8000000,
    status: "ACTIVE",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
  },
];

const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  sector: z.string().min(1).optional(),
  stage: z.string().min(1).optional(),
  website: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  founded: z.number().optional().nullable(),
  employees: z.number().optional().nullable(),
  investment: z.number().optional().nullable(),
  valuation: z.number().optional().nullable(),
  status: z.enum(["ACTIVE", "ACQUIRED", "IPO", "SHUTDOWN"]).optional(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const company = mockCompanies.find(c => c.id === id);
    
    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateCompanySchema.parse(body);
    
    const companyIndex = mockCompanies.findIndex(c => c.id === id);
    if (companyIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }
    
    const updatedCompany = {
      ...mockCompanies[companyIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };
    
    mockCompanies[companyIndex] = updatedCompany;
    
    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: "Company updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update company" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const companyIndex = mockCompanies.findIndex(c => c.id === id);
    
    if (companyIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }
    
    mockCompanies.splice(companyIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
