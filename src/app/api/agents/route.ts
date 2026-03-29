import { NextRequest, NextResponse } from 'next/server'
import { Agent, AgentType, AgentStatus, CreateAgentInput, UpdateAgentInput } from '@/types/agent'

// Mock data store - In production, this would be a database
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

// GET /api/agents - List all agents
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    
    // Optional filtering
    const type = searchParams.get('type') as AgentType | null
    const status = searchParams.get('status') as AgentStatus | null
    
    let filteredAgents = [...agents]
    
    if (type) {
      filteredAgents = filteredAgents.filter(agent => agent.type === type)
    }
    
    if (status) {
      filteredAgents = filteredAgents.filter(agent => agent.status === status)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredAgents,
      meta: {
        total: filteredAgents.length,
        filters: { type, status }
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch agents'
    }, { status: 500 })
  }
}

// POST /api/agents - Create new agent
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateAgentInput = await request.json()
    
    // Validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Name is required and must be a non-empty string'
      }, { status: 400 })
    }
    
    if (!body.type || !['SCREENING', 'RESEARCH', 'PORTFOLIO', 'OUTREACH', 'DILIGENCE', 'REPORTING'].includes(body.type)) {
      return NextResponse.json({
        success: false,
        error: 'Valid type is required (SCREENING, RESEARCH, PORTFOLIO, OUTREACH, DILIGENCE, REPORTING)'
      }, { status: 400 })
    }
    
    if (!body.description || typeof body.description !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Description is required'
      }, { status: 400 })
    }
    
    // Generate unique ID
    const id = `agent-${String(agents.length + 1).padStart(3, '0')}`
    
    const newAgent: Agent = {
      id,
      name: body.name.trim(),
      description: body.description.trim(),
      type: body.type,
      status: body.status || 'INACTIVE',
      config: body.config || {},
      lastRun: null,
      successRate: 0,
      totalRuns: 0,
      tokenUsage: 0
    }
    
    agents.push(newAgent)
    
    return NextResponse.json({
      success: true,
      data: newAgent,
      message: 'Agent created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create agent'
    }, { status: 500 })
  }
}
