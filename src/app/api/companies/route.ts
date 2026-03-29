import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Company {
  id: string;
  name: string;
  sector: string;
  stage: string;
  website?: string | null;
  description?: string | null;
  founded?: number | null;
  employees?: number | null;
  investment?: number | null;
  valuation?: number | null;
  status: 'ACTIVE' | 'ACQUIRED' | 'IPO' | 'SHUTDOWN';
  createdAt: string;
  updatedAt: string;
}

interface CreateCompanyInput {
  name: string;
  sector: string;
  stage: string;
  website?: string;
  description?: string;
  founded?: number;
  employees?: number;
  investment?: number;
  valuation?: number;
  status?: 'ACTIVE' | 'ACQUIRED' | 'IPO' | 'SHUTDOWN';
}

interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// Mock Data (Fallback when Prisma is not available)
// ============================================================================

let mockCompanies: Company[] = [
  {
    id: 'clxyz1234567890abcdef1',
    name: 'TechFlow AI',
    sector: 'Artificial Intelligence',
    stage: 'Series A',
    website: 'https://techflow.ai',
    description: 'AI-powered workflow automation platform',
    founded: 2021,
    employees: 45,
    investment: 5000000,
    valuation: 25000000,
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-03-20T14:22:00.000Z',
  },
  {
    id: 'clxyz1234567890abcdef2',
    name: 'GreenEnergy Solutions',
    sector: 'Clean Energy',
    stage: 'Series B',
    website: 'https://greenenergy.io',
    description: 'Renewable energy infrastructure technology',
    founded: 2019,
    employees: 120,
    investment: 25000000,
    valuation: 100000000,
    status: 'ACTIVE',
    createdAt: '2024-01-20T09:00:00.000Z',
    updatedAt: '2024-03-25T11:15:00.000Z',
  },
  {
    id: 'clxyz1234567890abcdef3',
    name: 'DataSync Pro',
    sector: 'Enterprise Software',
    stage: 'Seed',
    website: 'https://datasync.pro',
    description: 'Real-time data synchronization platform',
    founded: 2023,
    employees: 12,
    investment: 750000,
    valuation: 4000000,
    status: 'ACTIVE',
    createdAt: '2024-02-05T16:45:00.000Z',
    updatedAt: '2024-03-28T08:30:00.000Z',
  },
  {
    id: 'clxyz1234567890abcdef4',
    name: 'CloudScale Systems',
    sector: 'Cloud Infrastructure',
    stage: 'Series C',
    website: 'https://cloudscale.io',
    description: 'Scalable cloud computing infrastructure',
    founded: 2018,
    employees: 280,
    investment: 75000000,
    valuation: 500000000,
    status: 'ACQUIRED',
    createdAt: '2023-11-10T12:00:00.000Z',
    updatedAt: '2024-02-15T09:45:00.000Z',
  },
  {
    id: 'clxyz1234567890abcdef5',
    name: 'MedTech Innovations',
    sector: 'Healthcare',
    stage: 'Series B',
    website: 'https://medtechinno.com',
    description: 'AI-driven medical diagnostics platform',
    founded: 2020,
    employees: 85,
    investment: 18000000,
    valuation: 75000000,
    status: 'IPO',
    createdAt: '2023-12-01T10:00:00.000Z',
    updatedAt: '2024-03-10T13:20:00.000Z',
  },
];

// ============================================================================
// Prisma Client (with fallback)
// ============================================================================

let prisma: any;
let usePrisma = false;

try {
  // Dynamic import to handle cases where Prisma isn't set up yet
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  usePrisma = true;
} catch (error) {
  console.warn('Prisma not available, using mock data fallback');
  usePrisma = false;
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateCuid(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'c';
  for (let i = 0; i < 24; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function validateCompanyInput(data: Partial<CreateCompanyInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  } else if (data.name.length > 255) {
    errors.push({ field: 'name', message: 'Name must be less than 255 characters' });
  }

  if (!data.sector || typeof data.sector !== 'string' || data.sector.trim().length === 0) {
    errors.push({ field: 'sector', message: 'Sector is required and must be a non-empty string' });
  }

  if (!data.stage || typeof data.stage !== 'string' || data.stage.trim().length === 0) {
    errors.push({ field: 'stage', message: 'Stage is required and must be a non-empty string' });
  }

  if (data.website !== undefined && data.website !== null) {
    if (typeof data.website !== 'string') {
      errors.push({ field: 'website', message: 'Website must be a string' });
    } else if (data.website && !/^https?:\/\/.+/.test(data.website)) {
      errors.push({ field: 'website', message: 'Website must be a valid URL starting with http:// or https://' });
    }
  }

  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push({ field: 'description', message: 'Description must be a string' });
  }

  if (data.founded !== undefined && data.founded !== null) {
    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(data.founded) || data.founded < 1900 || data.founded > currentYear) {
      errors.push({ field: 'founded', message: `Founded must be an integer between 1900 and ${currentYear}` });
    }
  }

  if (data.employees !== undefined && data.employees !== null) {
    if (!Number.isInteger(data.employees) || data.employees < 0) {
      errors.push({ field: 'employees', message: 'Employees must be a non-negative integer' });
    }
  }

  if (data.investment !== undefined && data.investment !== null) {
    if (typeof data.investment !== 'number' || data.investment < 0) {
      errors.push({ field: 'investment', message: 'Investment must be a non-negative number' });
    }
  }

  if (data.valuation !== undefined && data.valuation !== null) {
    if (typeof data.valuation !== 'number' || data.valuation < 0) {
      errors.push({ field: 'valuation', message: 'Valuation must be a non-negative number' });
    }
  }

  const validStatuses = ['ACTIVE', 'ACQUIRED', 'IPO', 'SHUTDOWN'];
  if (data.status !== undefined && data.status !== null && !validStatuses.includes(data.status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  return errors;
}

// ============================================================================
// GET /api/companies - List all companies with optional filters
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const stage = searchParams.get('stage');
    const status = searchParams.get('status');

    let companies: Company[];

    if (usePrisma) {
      const where: any = {};
      if (sector) where.sector = sector;
      if (stage) where.stage = stage;
      if (status) where.status = status;

      const prismaCompanies = await prisma.company.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      companies = prismaCompanies.map((c: any) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }));
    } else {
      companies = [...mockCompanies];

      if (sector) {
        companies = companies.filter((c) => c.sector.toLowerCase() === sector.toLowerCase());
      }
      if (stage) {
        companies = companies.filter((c) => c.stage.toLowerCase() === stage.toLowerCase());
      }
      if (status) {
        companies = companies.filter((c) => c.status === status.toUpperCase());
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: companies,
        count: companies.length,
        filters: { sector, stage, status },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch companies',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/companies - Create a new company
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    let body: CreateCompanyInput;

    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    const validationErrors = validateCompanyInput(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newCompany: Company = {
      id: generateCuid(),
      name: body.name.trim(),
      sector: body.sector.trim(),
      stage: body.stage.trim(),
      website: body.website?.trim() || null,
      description: body.description?.trim() || null,
      founded: body.founded ?? null,
      employees: body.employees ?? null,
      investment: body.investment ?? null,
      valuation: body.valuation ?? null,
      status: body.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    if (usePrisma) {
      const created = await prisma.company.create({
        data: {
          name: newCompany.name,
          sector: newCompany.sector,
          stage: newCompany.stage,
          website: newCompany.website,
          description: newCompany.description,
          founded: newCompany.founded,
          employees: newCompany.employees,
          investment: newCompany.investment,
          valuation: newCompany.valuation,
          status: newCompany.status,
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            ...created,
            createdAt: created.createdAt.toISOString(),
            updatedAt: created.updatedAt.toISOString(),
          },
          message: 'Company created successfully',
        },
        { status: 201 }
      );
    } else {
      mockCompanies.unshift(newCompany);

      return NextResponse.json(
        {
          success: true,
          data: newCompany,
          message: 'Company created successfully (mock)',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create company',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
