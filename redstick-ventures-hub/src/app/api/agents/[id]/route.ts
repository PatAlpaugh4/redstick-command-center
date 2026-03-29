import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AgentStatus = ["ACTIVE", "INACTIVE", "ERROR", "MAINTENANCE"] as const;

const mockAgents = [
  {
    id: "1",
    name: "Deal Screener",
    description: "Automatically screens inbound deals",
    type: "SCREENING",
    status: "ACTIVE",
    config: { threshold: 0.7 },
    lastRun: "2024-01-15T10:30:00Z",
    successRate: 94,
    totalRuns: 1247,
    tokenUsage: 456000,
  },
];

const updateAgentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(AgentStatus).optional(),
  config: z.record(z.any()).optional(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const agent = mockAgents.find(a => a.id === id);
    
    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: agent });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateAgentSchema.parse(body);
    
    const agentIndex = mockAgents.findIndex(a => a.id === id);
    if (agentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      );
    }
    
    const updatedAgent = {
      ...mockAgents[agentIndex],
      ...validatedData,
    };
    
    mockAgents[agentIndex] = updatedAgent;
    
    return NextResponse.json({
      success: true,
      data: updatedAgent,
      message: "Agent updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const agentIndex = mockAgents.findIndex(a => a.id === id);
    
    if (agentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Agent not found" },
        { status: 404 }
      );
    }
    
    // Don't allow deletion of active agents
    if (mockAgents[agentIndex].status === "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "Cannot delete active agent. Deactivate first." },
        { status: 400 }
      );
    }
    
    mockAgents.splice(agentIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
