import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock deals data
const mockDeals = [
  {
    id: "1",
    companyName: "AquaCulture Labs",
    stage: "DUE_DILIGENCE",
    amount: 4200000,
    description: "Sustainable aquaculture technology platform",
    source: "INBOUND",
    status: "ACTIVE",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    companyId: "1",
    assignedTo: "1",
  },
  {
    id: "2",
    companyName: "FarmGrid Analytics",
    stage: "IC_REVIEW",
    amount: 1800000,
    description: "Precision agriculture data analytics",
    source: "REFERRAL",
    status: "ACTIVE",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
    companyId: "2",
    assignedTo: "2",
  },
  {
    id: "3",
    companyName: "VerticalHarvest",
    stage: "TERM_SHEET",
    amount: 12000000,
    description: "Vertical farming operations",
    source: "OUTBOUND",
    status: "ACTIVE",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
    companyId: "3",
    assignedTo: "1",
  },
  {
    id: "4",
    companyName: "ProteinFuture",
    stage: "DEEP_DIVE",
    amount: 3500000,
    description: "Alternative protein production",
    source: "DEMO_DAY",
    status: "ACTIVE",
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
    companyId: null,
    assignedTo: "3",
  },
];

// Validation schema
const dealSchema = z.object({
  companyName: z.string().min(1),
  stage: z.enum([
    "INBOUND",
    "SCREENING",
    "FIRST_MEETING",
    "DEEP_DIVE",
    "DUE_DILIGENCE",
    "IC_REVIEW",
    "TERM_SHEET",
    "CLOSED",
    "PASSED",
  ]),
  amount: z.number().optional(),
  description: z.string().optional(),
  source: z.enum(["INBOUND", "OUTBOUND", "REFERRAL", "DEMO_DAY", "AGENT"]),
  companyId: z.string().optional(),
  assignedTo: z.string().optional(),
});

// GET /api/deals - List all deals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filter params
    const stage = searchParams.get("stage");
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const companyId = searchParams.get("companyId");
    const assignedTo = searchParams.get("assignedTo");
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    
    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    
    // Filter deals
    let filteredDeals = [...mockDeals];
    
    if (stage) filteredDeals = filteredDeals.filter(d => d.stage === stage);
    if (status) filteredDeals = filteredDeals.filter(d => d.status === status);
    if (source) filteredDeals = filteredDeals.filter(d => d.source === source);
    if (companyId) filteredDeals = filteredDeals.filter(d => d.companyId === companyId);
    if (assignedTo) filteredDeals = filteredDeals.filter(d => d.assignedTo === assignedTo);
    
    // Sort
    filteredDeals.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    
    // Paginate
    const total = filteredDeals.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedDeals = filteredDeals.slice(start, end);
    
    return NextResponse.json({
      success: true,
      data: paginatedDeals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      meta: {
        filters: { stage, status, source, companyId, assignedTo },
        sort: { sortBy, sortOrder },
      },
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

// POST /api/deals - Create new deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = dealSchema.parse(body);
    
    // Create new deal
    const newDeal = {
      id: Math.random().toString(36).substring(2, 9),
      ...validatedData,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In real app: await prisma.deal.create({ data: newDeal })
    mockDeals.push(newDeal);
    
    return NextResponse.json(
      { success: true, data: newDeal, message: "Deal created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create deal" },
      { status: 500 }
    );
  }
}

// PATCH /api/deals - Bulk update
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, updates } = body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No deal IDs provided" },
        { status: 400 }
      );
    }
    
    // In real app: await prisma.deal.updateMany({ where: { id: { in: ids } }, data: updates })
    const updatedDeals = mockDeals.filter(d => ids.includes(d.id)).map(d => ({
      ...d,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
    
    return NextResponse.json({
      success: true,
      data: updatedDeals,
      message: `${updatedDeals.length} deals updated`,
    });
  } catch (error) {
    console.error("Error updating deals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update deals" },
      { status: 500 }
    );
  }
}
