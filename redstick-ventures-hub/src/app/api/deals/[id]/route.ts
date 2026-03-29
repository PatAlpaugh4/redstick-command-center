import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock deals data (shared with parent route)
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
];

// Validation schemas
const updateDealSchema = z.object({
  companyName: z.string().min(1).optional(),
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
  ]).optional(),
  amount: z.number().optional(),
  description: z.string().optional(),
  source: z.enum(["INBOUND", "OUTBOUND", "REFERRAL", "DEMO_DAY", "AGENT"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  companyId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/deals/[id] - Get single deal
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const deal = mockDeals.find(d => d.id === id);
    
    if (!deal) {
      return NextResponse.json(
        { success: false, error: "Deal not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: deal });
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

// PATCH /api/deals/[id] - Update deal
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateDealSchema.parse(body);
    
    const dealIndex = mockDeals.findIndex(d => d.id === id);
    if (dealIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Deal not found" },
        { status: 404 }
      );
    }
    
    const updatedDeal = {
      ...mockDeals[dealIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };
    
    mockDeals[dealIndex] = updatedDeal;
    
    return NextResponse.json({
      success: true,
      data: updatedDeal,
      message: "Deal updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update deal" },
      { status: 500 }
    );
  }
}

// DELETE /api/deals/[id] - Delete deal
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";
    
    const dealIndex = mockDeals.findIndex(d => d.id === id);
    if (dealIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Deal not found" },
        { status: 404 }
      );
    }
    
    if (permanent) {
      mockDeals.splice(dealIndex, 1);
      return NextResponse.json({ success: true, message: "Deal permanently deleted" });
    } else {
      mockDeals[dealIndex] = {
        ...mockDeals[dealIndex],
        status: "ARCHIVED",
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, message: "Deal archived" });
    }
  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
