import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AgentType = ["SCREENING", "RESEARCH", "PORTFOLIO", "OUTREACH", "DILIGENCE", "REPORTING"] as const;
const AgentStatus = ["ACTIVE", "INACTIVE", "ERROR", "MAINTENANCE"] as const;

const mockAgents = [
  {
    id: "1",
    name: "Deal Screener",
    description: "Automatically screens inbound deals against investment criteria",
    type: "SCREENING",
    status: "ACTIVE",
    config: { threshold: 0.7, autoRun: true },
    lastRun: "2024-01-15T10:30:00Z",
    successRate: 94,
    totalRuns: 1247,
    tokenUsage: 456000,
  },
  {
    id: "2",
    name: "Market Intel",
    description: "Monitors market trends and competitor movements",
    type: "RESEARCH",
    status: "ACTIVE",
    config: { frequency: "hourly", sectors: ["agtech", "food"] },
    lastRun: "2024-01-15T09:15:00Z",
    successRate: 98,
    totalRuns: 3420,
    tokenUsage: 890000,
  },
  {
    id: "3",
    name: "Portfolio Monitor",
    description: "Tracks portfolio company metrics and alerts on anomalies",
    type: "PORTFOLIO",
    status: "ACTIVE",
    config: { checkInterval: 30, metrics: ["arr", "burn", "growth"] },
    lastRun: "2024-01-15T08:45:00Z",
    successRate: 99,
    totalRuns: 876,
    tokenUsage: 234000,
  },
];

const createAgentSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(AgentType),
  config: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    
    let filteredAgents = [...mockAgents];
    if (type) filteredAgents = filteredAgents.filter(a => a.type === type);
    if (status) filteredAgents = filteredAgents.filter(a => a.status === status);
    
    return NextResponse.json({ success: true, data: filteredAgents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAgentSchema.parse(body);
    
    const newAgent = {
      id: Math.random().toString(36).substring(2, 9),
      ...validatedData,
      status: "INACTIVE",
      lastRun: null,
      successRate: 0,
      totalRuns: 0,
      tokenUsage: 0,
    };
    
    mockAgents.push(newAgent);
    
    return NextResponse.json(
      { success: true, data: newAgent, message: "Agent created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
