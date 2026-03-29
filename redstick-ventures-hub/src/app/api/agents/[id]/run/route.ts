import { NextRequest, NextResponse } from "next/server";

const mockAgents = [
  {
    id: "1",
    name: "Deal Screener",
    status: "ACTIVE",
    lastRun: "2024-01-15T10:30:00Z",
    successRate: 94,
    totalRuns: 1247,
    tokenUsage: 456000,
  },
];

interface RouteParams {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const agent = mockAgents.find(a => a.id === id);
    
    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      );
    }
    
    if (agent.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Agent is not active" },
        { status: 400 }
      );
    }
    
    // Generate run ID
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Simulate async execution
    const duration = Math.floor(Math.random() * 6) + 2; // 2-8 seconds
    const tokenUsage = Math.floor(Math.random() * 3000) + 500;
    const success = Math.random() > 0.1; // 90% success rate
    
    // Update agent stats
    agent.totalRuns += 1;
    agent.tokenUsage += tokenUsage;
    agent.lastRun = new Date().toISOString();
    agent.successRate = Math.round(
      ((agent.successRate * (agent.totalRuns - 1)) + (success ? 100 : 0)) / agent.totalRuns
    );
    
    return NextResponse.json({
      success: true,
      data: {
        runId,
        agentId: id,
        status: "RUNNING",
        startedAt: new Date().toISOString(),
        estimatedDuration: duration,
      },
      message: "Agent execution started",
    }, { status: 202 });
  } catch (error) {
    console.error("Error running agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run agent" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get("runId");
    
    if (!runId) {
      return NextResponse.json(
        { success: false, error: "Run ID required" },
        { status: 400 }
      );
    }
    
    // Simulate run status check
    const isComplete = Math.random() > 0.5;
    
    return NextResponse.json({
      success: true,
      data: {
        runId,
        agentId: id,
        status: isComplete ? "COMPLETED" : "RUNNING",
        completedAt: isComplete ? new Date().toISOString() : null,
        result: isComplete ? { processed: 42, matches: 8 } : null,
      },
    });
  } catch (error) {
    console.error("Error checking run status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check run status" },
      { status: 500 }
    );
  }
}
