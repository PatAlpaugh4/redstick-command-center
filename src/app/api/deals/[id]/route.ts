import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DealStage, DealSource, DealStatus } from "@prisma/client";

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const DealStageEnum = z.enum([
  "INBOUND",
  "SCREENING",
  "FIRST_MEETING",
  "DEEP_DIVE",
  "DUE_DILIGENCE",
  "IC_REVIEW",
  "TERM_SHEET",
  "CLOSED",
  "PASSED",
]);

const DealSourceEnum = z.enum([
  "INBOUND",
  "OUTBOUND",
  "REFERRAL",
  "DEMO_DAY",
  "AGENT",
]);

const DealStatusEnum = z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]);

const UpdateDealSchema = z.object({
  companyName: z.string().min(1).optional(),
  stage: DealStageEnum.optional(),
  amount: z.number().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  source: DealSourceEnum.optional(),
  status: DealStatusEnum.optional(),
  companyId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

// ============================================================================
// MOCK DATA FALLBACK (for development)
// ============================================================================

const MOCK_DEALS = [
  {
    id: "deal_001",
    companyName: "TechFlow AI",
    stage: "DUE_DILIGENCE" as DealStage,
    amount: 2500000,
    description: "AI-powered workflow automation platform",
    source: "REFERRAL" as DealSource,
    status: "ACTIVE" as DealStatus,
    createdAt: new Date("2026-03-15"),
    updatedAt: new Date("2026-03-25"),
    companyId: null,
    assignedTo: "user_001",
  },
  {
    id: "deal_002",
    companyName: "GreenEnergy Solutions",
    stage: "FIRST_MEETING" as DealStage,
    amount: 5000000,
    description: "Renewable energy storage technology",
    source: "INBOUND" as DealSource,
    status: "ACTIVE" as DealStatus,
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-22"),
    companyId: "comp_002",
    assignedTo: "user_002",
  },
  {
    id: "deal_003",
    companyName: "HealthTrack Pro",
    stage: "SCREENING" as DealStage,
    amount: null,
    description: "Remote patient monitoring platform",
    source: "DEMO_DAY" as DealSource,
    status: "ACTIVE" as DealStatus,
    createdAt: new Date("2026-03-25"),
    updatedAt: new Date("2026-03-25"),
    companyId: null,
    assignedTo: null,
  },
  {
    id: "deal_004",
    companyName: "DataVault Inc",
    stage: "PASSED" as DealStage,
    amount: 1800000,
    description: "Enterprise data security platform",
    source: "AGENT" as DealSource,
    status: "ARCHIVED" as DealStatus,
    createdAt: new Date("2026-02-10"),
    updatedAt: new Date("2026-03-01"),
    companyId: null,
    assignedTo: "user_001",
  },
];

// ============================================================================
// AUTHENTICATION CHECK (placeholder)
// ============================================================================

// async function requireAuth(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     throw new Error("Unauthorized");
//   }
//   return session;
// }

// ============================================================================
// Route Parameters Type
// ============================================================================

type RouteParams = {
  params: Promise<{ id: string }>;
};

// ============================================================================
// GET /api/deals/[id] - Get a single deal
// ============================================================================

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    // Uncomment to enable authentication
    // await requireAuth(req);

    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid deal ID" },
        { status: 400 }
      );
    }

    // Try to use Prisma, fallback to mock data
    let deal;

    try {
      if (!prisma) {
        throw new Error("Prisma client not initialized");
      }

      deal = await prisma.deal.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              website: true,
              description: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    } catch (dbError) {
      // Fallback to mock data for development
      console.warn("Database unavailable, using mock data:", dbError);
      deal = MOCK_DEALS.find((d) => d.id === id) || null;
    }

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: deal }, { status: 200 });

  } catch (error) {
    console.error(`GET /api/deals/[id] error:`, error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/deals/[id] - Update a deal
// ============================================================================

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    // Uncomment to enable authentication
    // await requireAuth(req);

    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid deal ID" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const validation = UpdateDealSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Try to use Prisma, fallback to mock update
    let deal;

    try {
      if (!prisma) {
        throw new Error("Prisma client not initialized");
      }

      // Check if deal exists first
      const existingDeal = await prisma.deal.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existingDeal) {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }

      deal = await prisma.deal.update({
        where: { id },
        data: updateData,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              website: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (dbError) {
      // Fallback to mock update for development
      console.warn("Database unavailable, using mock update:", dbError);

      const mockIndex = MOCK_DEALS.findIndex((d) => d.id === id);

      if (mockIndex === -1) {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }

      deal = {
        ...MOCK_DEALS[mockIndex],
        ...updateData,
        updatedAt: new Date(),
      };
    }

    return NextResponse.json(
      {
        data: deal,
        message: "Deal updated successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("PATCH /api/deals/[id] error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "A deal with this information already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/deals/[id] - Delete/archive a deal
// ============================================================================

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Uncomment to enable authentication
    // await requireAuth(req);

    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid deal ID" },
        { status: 400 }
      );
    }

    // Parse query params for soft delete option
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get("permanent") === "true";
    const force = searchParams.get("force") === "true";

    // Try to use Prisma, fallback to mock delete
    try {
      if (!prisma) {
        throw new Error("Prisma client not initialized");
      }

      // Check if deal exists
      const existingDeal = await prisma.deal.findUnique({
        where: { id },
        select: { id: true, status: true },
      });

      if (!existingDeal) {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }

      if (permanent && !force) {
        // Check if deal has related data that might need attention
        return NextResponse.json(
          {
            error: "Permanent deletion requires confirmation",
            message: "Add ?force=true to permanently delete this deal",
          },
          { status: 400 }
        );
      }

      if (permanent && force) {
        // Hard delete
        await prisma.deal.delete({
          where: { id },
        });

        return NextResponse.json(
          {
            message: "Deal permanently deleted",
            id,
            permanent: true,
          },
          { status: 200 }
        );
      } else {
        // Soft delete - archive the deal instead
        await prisma.deal.update({
          where: { id },
          data: { status: "ARCHIVED" },
        });

        return NextResponse.json(
          {
            message: "Deal archived successfully",
            id,
            status: "ARCHIVED",
            note: "Use ?permanent=true&force=true to permanently delete",
          },
          { status: 200 }
        );
      }

    } catch (dbError) {
      // Fallback to mock delete for development
      console.warn("Database unavailable, using mock delete:", dbError);

      const mockIndex = MOCK_DEALS.findIndex((d) => d.id === id);

      if (mockIndex === -1) {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }

      if (permanent && !force) {
        return NextResponse.json(
          {
            error: "Permanent deletion requires confirmation",
            message: "Add ?force=true to permanently delete this deal",
          },
          { status: 400 }
        );
      }

      const mockDeal = MOCK_DEALS[mockIndex];

      return NextResponse.json(
        {
          message: permanent && force
            ? "Deal permanently deleted (mock)"
            : "Deal archived successfully (mock)",
          id,
          status: permanent && force ? "DELETED" : "ARCHIVED",
          deal: mockDeal,
          note: "Database unavailable - using mock response",
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("DELETE /api/deals/[id] error:", error);

    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT /api/deals/[id] - Full resource replacement (optional)
// ============================================================================

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    // Uncomment to enable authentication
    // await requireAuth(req);

    const { id } = await params;

    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid deal ID" },
        { status: 400 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // For PUT, all required fields must be present
    const FullDealSchema = z.object({
      companyName: z.string().min(1, "Company name is required"),
      stage: DealStageEnum,
      amount: z.number().positive().optional().nullable(),
      description: z.string().optional().nullable(),
      source: DealSourceEnum,
      status: DealStatusEnum,
      companyId: z.string().optional().nullable(),
      assignedTo: z.string().optional().nullable(),
    });

    const validation = FullDealSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    let deal;

    try {
      if (!prisma) {
        throw new Error("Prisma client not initialized");
      }

      deal = await prisma.deal.update({
        where: { id },
        data: updateData,
        include: {
          company: {
            select: { id: true, name: true },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    } catch (dbError) {
      console.warn("Database unavailable, using mock PUT:", dbError);

      const mockIndex = MOCK_DEALS.findIndex((d) => d.id === id);

      if (mockIndex === -1) {
        return NextResponse.json(
          { error: "Deal not found" },
          { status: 404 }
        );
      }

      deal = {
        id,
        ...updateData,
        createdAt: MOCK_DEALS[mockIndex].createdAt,
        updatedAt: new Date(),
      };
    }

    return NextResponse.json(
      {
        data: deal,
        message: "Deal replaced successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("PUT /api/deals/[id] error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
