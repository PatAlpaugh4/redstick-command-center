import { NextRequest, NextResponse } from 'next/server'
import { Agent, AgentRunInput, AgentRunResult } from '@/types/agent'

// Mock data store - In production, this would be a database
// Shared with the parent routes
let agents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Deal Screener Pro',
    description: 'Automatically screens incoming deal flow based on investment criteria, team quality, and market size.',
    type: 'SCREENING',
    status: 'ACTIVE',
    config: {
      minTeamSize: 2,
      minMarketSize: 10000000,
      industries: ['SaaS', 'AI', 'Fintech'],
      autoReject: true
    },
    lastRun: '2026-03-27T10:30:00Z',
    successRate: 0.94,
    totalRuns: 156,
    tokenUsage: 456000
  },
  {
    id: 'agent-002',
    name: 'Market Research Analyst',
    description: 'Conducts comprehensive market research including TAM/SAM/SOM analysis, competitive landscape, and trend identification.',
    type: 'RESEARCH',
    status: 'ACTIVE',
    config: {
      sources: ['Crunchbase', 'PitchBook', 'LinkedIn', 'Industry Reports'],
      deepDive: true,
      reportFormat: 'standard'
    },
    lastRun: '2026-03-27T14:15:00Z',
    successRate: 0.89,
    totalRuns: 89,
    tokenUsage: 892000
  },
  {
    id: 'agent-003',
    name: 'Portfolio Monitor',
    description: 'Tracks portfolio company performance, monitors KPIs, and alerts on potential issues or milestones.',
    type: 'PORTFOLIO',
    status: 'ACTIVE',
    config: {
      metrics: ['ARR', 'Burn Rate', 'Headcount', 'NRR'],
      alertThresholds: {
        burnRate: 6,
        runway: 12
      },
      checkFrequency: 'daily'
    },
    lastRun: '2026-03-28T08:00:00Z',
    successRate: 0.97,
    totalRuns: 312,
    tokenUsage: 234000
  },
  {
    id: 'agent-004',
    name: 'Outreach Assistant',
    description: 'Drafts personalized outreach emails to founders and manages follow-up sequences.',
    type: 'OUTREACH',
    status: 'INACTIVE',
    config: {
      tone: 'professional',
      maxFollowUps: 3,
      personalizationLevel: 'high',
      templates: ['introduction', 'follow_up', 'pass']
    },
    lastRun: '2026-03-20T16:45:00Z',
    successRate: 0.76,
    totalRuns: 45,
    tokenUsage: 178000
  },
  {
    id: 'agent-005',
    name: 'Due Diligence Assistant',
    description: 'Assists with due diligence by analyzing legal documents, financial statements, and reference checks.',
    type: 'DILIGENCE',
    status: 'MAINTENANCE',
    config: {
      checkCategories: ['legal', 'financial', 'technical', 'commercial'],
      riskThreshold: 'medium',
      generateReport: true
    },
    lastRun: '2026-03-25T11:20:00Z',
    successRate: 0.88,
    totalRuns: 23,
    tokenUsage: 567000
  },
  {
    id: 'agent-006',
    name: 'LP Report Generator',
    description: 'Generates quarterly LP reports with portfolio performance, deployment updates, and market insights.',
    type: 'REPORTING',
    status: 'ACTIVE',
    config: {
      sections: ['overview', 'performance', 'deployment', 'exits', 'pipeline'],
      format: 'pdf',
      includeBenchmarks: true
    },
    lastRun: '2026-03-01T09:00:00Z',
    successRate: 0.92,
    totalRuns: 12,
    tokenUsage: 345000
  }
]

// In-memory store for run jobs (in production, use Redis or database)
const runningJobs: Map<string, AgentRunResult> = new Map()

// Helper function to find agent by ID
function findAgentById(id: string): Agent | undefined {
  return agents.find(agent => agent.id === id)
}

// Helper function to generate run ID
function generateRunId(): string {
  return `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to simulate async agent execution
async function simulateAgentExecution(
  agent: Agent,
  runId: string,
  input?: Record<string, any>
): Promise<void> {
  // Simulate variable execution time based on agent type (2-8 seconds)
  const executionTime = 2000 + Math.random() * 6000
  
  // Update job status to running
  const startTime = new Date().toISOString()
  const job: AgentRunResult = {
    runId,
    agentId: agent.id,
    status: 'RUNNING',
    startedAt: startTime,
    estimatedDuration: Math.round(executionTime / 1000)
  }
  runningJobs.set(runId, job)
  
  // Simulate async execution
  setTimeout(() => {
    // Simulate 90% success rate
    const success = Math.random() < 0.9
    const endTime = new Date().toISOString()
    const tokensUsed = Math.floor(Math.random() * 50000) + 1000
    
    const completedJob: AgentRunResult = {
      ...job,
      status: success ? 'COMPLETED' : 'FAILED',
      completedAt: endTime,
      output: success ? generateMockOutput(agent, input) : undefined,
      error: success ? undefined : 'Simulated execution error: Rate limit exceeded',
      tokensUsed,
      executionTime: Math.round(executionTime)
    }
    
    // Update agent stats if successful
    if (success) {
      const agentIndex = agents.findIndex(a => a.id === agent.id)
      if (agentIndex !== -1) {
        agents[agentIndex].lastRun = endTime
        agents[agentIndex].totalRuns += 1
        agents[agentIndex].tokenUsage += tokensUsed
        // Recalculate success rate
        const oldSuccessRate = agents[agentIndex].successRate
        const oldTotal = agents[agentIndex].totalRuns - 1
        agents[agentIndex].successRate = (oldSuccessRate * oldTotal + 1) / agents[agentIndex].totalRuns
      }
    }
    
    runningJobs.set(runId, completedJob)
    
    // Clean up job after 5 minutes
    setTimeout(() => {
      runningJobs.delete(runId)
    }, 5 * 60 * 1000)
  }, executionTime)
}

// Helper function to generate mock output based on agent type
function generateMockOutput(agent: Agent, input?: Record<string, any>): Record<string, any> {
  const outputs: Record<string, Record<string, any>> = {
    SCREENING: {
      dealsAnalyzed: Math.floor(Math.random() * 20) + 5,
      passed: Math.floor(Math.random() * 5) + 1,
      rejected: Math.floor(Math.random() * 10) + 2,
      topCandidates: [
        { company: 'TechFlow AI', score: 0.92, reason: 'Strong team, growing market' },
        { company: 'DataSync Pro', score: 0.87, reason: 'Great traction in enterprise' }
      ]
    },
    RESEARCH: {
      marketSize: {
        tam: Math.floor(Math.random() * 50) + 10,
        sam: Math.floor(Math.random() * 10) + 2,
        som: Math.floor(Math.random() * 2) + 0.5
      },
      competitors: ['Competitor A', 'Competitor B', 'Competitor C'],
      trends: ['AI adoption accelerating', 'Enterprise demand growing', 'Regulatory changes incoming'],
      riskFactors: ['Market saturation', 'High customer acquisition costs']
    },
    PORTFOLIO: {
      companiesMonitored: Math.floor(Math.random() * 10) + 5,
      alerts: Math.floor(Math.random() * 3),
      milestones: [
        { company: 'Startup X', milestone: 'Reached $1M ARR' },
        { company: 'Startup Y', milestone: 'Closed Series A' }
      ],
      concerns: []
    },
    OUTREACH: {
      emailsDrafted: Math.floor(Math.random() * 10) + 3,
      personalizedCount: Math.floor(Math.random() * 5) + 2,
      followUpsScheduled: Math.floor(Math.random() * 5) + 1
    },
    DILIGENCE: {
      documentsAnalyzed: Math.floor(Math.random() * 50) + 10,
      riskScore: Math.floor(Math.random() * 100),
      redFlags: ['Minor IP concern', 'Standard market risks'],
      recommendations: ['Proceed with caution', 'Request additional financial docs']
    },
    REPORTING: {
      reportGenerated: true,
      sections: ['Executive Summary', 'Portfolio Performance', 'Deployment Update', 'Market Outlook'],
      pages: Math.floor(Math.random() * 20) + 10
    }
  }
  
  return {
    agentType: agent.type,
    executedAt: new Date().toISOString(),
    input: input || null,
    ...outputs[agent.type]
  }
}

// POST /api/agents/[id]/run - Trigger agent execution
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Agent ID is required'
      }, { status: 400 })
    }
    
    const agent = findAgentById(id)
    
    if (!agent) {
      return NextResponse.json({
        success: false,
        error: 'Agent not found'
      }, { status: 404 })
    }
    
    // Check if agent is active
    if (agent.status !== 'ACTIVE') {
      return NextResponse.json({
        success: false,
        error: `Cannot run agent with status: ${agent.status}. Agent must be ACTIVE.`,
        data: { status: agent.status }
      }, { status: 409 })
    }
    
    // Parse optional input
    let input: Record<string, any> | undefined
    try {
      const body: AgentRunInput = await request.json()
      input = body.input
    } catch {
      // No input provided, which is fine
    }
    
    // Generate run ID
    const runId = generateRunId()
    
    // Start async execution
    simulateAgentExecution(agent, runId, input)
    
    // Return immediately with "running" status
    return NextResponse.json({
      success: true,
      data: {
        runId,
        agentId: agent.id,
        status: 'RUNNING',
        message: 'Agent execution started',
        estimatedDuration: 5, // seconds
        startedAt: new Date().toISOString()
      }
    }, { status: 202 })
  } catch (error) {
    console.error('Error triggering agent:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to trigger agent execution'
    }, { status: 500 })
  }
}

// GET /api/agents/[id]/run - Check run status (optional endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const runId = searchParams.get('runId')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Agent ID is required'
      }, { status: 400 })
    }
    
    if (!runId) {
      return NextResponse.json({
        success: false,
        error: 'runId query parameter is required'
      }, { status: 400 })
    }
    
    const job = runningJobs.get(runId)
    
    if (!job) {
      return NextResponse.json({
        success: false,
        error: 'Run job not found or has expired'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: job
    }, { status: 200 })
  } catch (error) {
    console.error('Error checking run status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check run status'
    }, { status: 500 })
  }
}
