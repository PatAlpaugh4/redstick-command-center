import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock companies data
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
  {
    id: "3",
    name: "VerticalHarvest",
    sector: "Vertical Farming",
    stage: "Series B",
    website: "https://verticalharvest.com",
    description: "Vertical farming operations",
    founded: 2019,
    employees: 45,
    investment: 3000000,
    valuation: 25000000,
    status: "ACTIVE",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "4",
    name: "ProteinFuture",
    sector: "Alternative Protein",
    stage: "Series A",
    website: "https://proteinfuture.com",
    description: "Alternative protein production",
    founded: 2021,
    employees: 12,
    investment: 1800000,
    valuation: 6000000,
    status: "ACTIVE",
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
  },
  {
    id: "5",
    name: "SupplyChain AI",
    sector: "Supply Chain",
    stage: "Seed",
    website: "https://supplychainai.io",
    description: "AI-powered supply chain optimization",
    founded: 2022,
    employees: 8,
    investment: 500000,
    valuation: 4000000,
    status: "ACTIVE",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

// Validation schema
const companySchema = z.object({
  name: z.string().min(1),
  sector: z.string().min(1),
  stage: z.string().min(1),
  website: z.string().url().optional(),
  description: z.string().optional(),
  founded: z.number().optional(),
  employees: z.number().optional(),
  investment: z.number().optional(),
  valuation: z.number().optional(),
});

// GET /api/companies - List all companies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filter params
    const sector = searchParams.get("sector");
    const stage = searchParams.get("stage");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    // Filter companies
    let filteredCompanies = [...mockCompanies];
    
    if (sector) filteredCompanies = filteredCompanies.filter(c => c.sector === sector);
    if (stage) filteredCompanies = filteredCompanies.filter(c => c.stage === stage);
    if (status) filteredCompanies = filteredCompanies.filter(c => c.status === status);
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCompanies = filteredCompanies.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.sector.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredCompanies,
      meta: {
        total: filteredCompanies.length,
        filters: { sector, stage, status, search },
      },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = companySchema.parse(body);
    
    // Check for duplicate name
    const existingCompany = mockCompanies.find(
      c => c.name.toLowerCase() === validatedData.name.toLowerCase()
    );
    
    if (existingCompany) {
      return NextResponse.json(
        { success: false, error: "Company with this name already exists" },
        { status: 409 }
      );
    }
    
    // Create new company
    const newCompany = {
      id: Math.random().toString(36).substring(2, 9),
      ...validatedData,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCompanies.push(newCompany);
    
    return NextResponse.json(
      { success: true, data: newCompany, message: "Company created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create company" },
      { status: 500 }
    );
  }
}
