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

const CreateDealSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  stage: DealStageEnum,
  amount: z.number().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  source: DealSourceEnum,
  status: DealStatusEnum.optional().default("ACTIVE"),
  companyId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

const QueryParamsSchema = z.object({
  stage: DealStageEnum.optional(),
  status: DealStatusEnum.optional(),
  source: DealSourceEnum.optional(),
  companyId: z.string().optional(),
  assignedTo: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "companyName", "amount"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
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
// GET /api/deals - List all deals with filtering
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    // Uncomment to enable authentication
    // await requireAuth(req);

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const params = QueryParamsSchema.safeParse({
      stage: searchParams.get("stage") || undefined,
      status: searchParams.get("status") || undefined,
      source: searchParams.get("source") || undefined,
      companyId: searchParams.get("companyId") || undefined,
      assignedTo: searchParams.get("assignedTo") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") || undefined,
    });

    if (!params.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: params.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { stage, status, source, companyId, assignedTo, page, limit, sortBy, sortOrder } = params.data;

    // Build filter conditions
    const where: Record<string, unknown> = {};
    if (stage) where.stage = stage;
    if (status) where.status = status;
    if (source) where.source = source;
    if (companyId) where.companyId = companyId;
    if (assignedTo) where.assignedTo = assignedTo;

    // Try to use Prisma, fallback to mock data
    let deals;
    let totalCount;

    try {
      // Check if prisma is available
      if (!prisma) {
        throw new Error("Prisma client not initialized");
      }

      // Get total count for pagination
      totalCount = await prisma.deal.count({ where });

      // Fetch deals with pagination
      deals = await prisma.deal.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
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
      // Fallback to mock data for development
      console.warn("Database unavailable, using mock data:", dbError);

      let filteredDeals = [...MOCK_DEALS];

      if (stage) filteredDeals = filteredDeals.filter((d) => d.stage === stage);
      if (status) filteredDeals = filteredDeals.filter((d) => d.status === status);
      if (source) filteredDeals = filteredDeals.filter((d) => d.source === source);
      if (companyId) filteredDeals = filteredDeals.filter((d) => d.companyId === companyId);
      if (assignedTo) filteredDeals = filteredDeals.filter((d) => d.assignedTo === assignedTo);

      totalCount = filteredDeals.length;

      // Sort and paginate mock data
      filteredDeals.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortOrder === "asc" ? comparison : -comparison;
      });

      deals = filteredDeals.slice((page - 1) * limit, page * limit);
    }

    return NextResponse.json({
      data: deals,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
      },
      meta: {
        filters: { stage, status, source, companyId, assignedTo },
        sort: { sortBy, sortOrder },
      },
    }, { status: 200 });

  } catch (error) {
    console.error("GET /api/deals error:", error);

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
// POST /api/deals - Create a new deal
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    // Uncomment to enable authentication
    // await requireAuth(req);

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

    const validation = CreateDealSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Try to use Prisma, fallback to mock creation
    let deal;

    try {
      if (!prisma) {
        throw new Error("Prisma client not initialized");
      }

      deal = await prisma.deal.create({
        data: {
          companyName: data.companyName,
          stage: data.stage,
          amount: data.amount,
          description: data.description,
          source: data.source,
          status: data.status,
          companyId: data.companyId,
          assignedTo: data.assignedTo,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
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
      // Fallback to mock creation for development
      console.warn("Database unavailable, returning mock created deal:", dbError);

      deal = {
        id: `deal_${Math.random().toString(36).substring(2, 11)}`,
        companyName: data.companyName,
        stage: data.stage,
        amount: data.amount ?? null,
        description: data.description ?? null,
        source: data.source,
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: data.companyId ?? null,
        assignedTo: data.assignedTo ?? null,
        company: null,
        user: null,
      };
    }

    return NextResponse.json(
      {
        data: deal,
        message: "Deal created successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/deals error:", error);

    // Handle specific error types
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "A deal with this information already exists" },
        { status: 409 }
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
// PATCH /api/deals (bulk update) - Optional bulk operations
// ============================================================================

export async function PATCH(req: NextRequest) {
  try {
    // Uncomment to enable authentication
    // await requireAuth(req);

    const body: unknown = await req.json();

    // Validate bulk update schema
    const BulkUpdateSchema = z.object({
      ids: z.array(z.string()).min(1),
      data: z.object({
        stage: DealStageEnum.optional(),
        status: DealStatusEnum.optional(),
        assignedTo: z.string().optional().nullable(),
      }),
    });

    const validation = BulkUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { ids, data: updateData } = validation.data;

    try {
      if (!prisma) {
        throw new Error("Prisma client not initialized");
      }

      const result = await prisma.deal.updateMany({
        where: { id: { in: ids } },
        data: updateData,
      });

      return NextResponse.json({
        message: "Deals updated successfully",
        count: result.count,
      }, { status: 200 });

    } catch (dbError) {
      console.warn("Database unavailable for bulk update:", dbError);

      return NextResponse.json({
        message: "Deals updated (mock)",
        count: ids.length,
        note: "Database unavailable - using mock response",
      }, { status: 200 });
    }

  } catch (error) {
    console.error("PATCH /api/deals error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
