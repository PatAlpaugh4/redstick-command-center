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

interface UpdateCompanyInput {
  name?: string;
  sector?: string;
  stage?: string;
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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================================
// Mock Data (Shared with main route - in production, use a database)
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
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  usePrisma = true;
} catch (error) {
  console.warn('Prisma not available in [id] route, using mock data fallback');
  usePrisma = false;
}

// ============================================================================
// Helper Functions
// ============================================================================

function isValidCuid(id: string): boolean {
  return /^c[a-z0-9]{24}$/.test(id);
}

function validateUpdateInput(data: Partial<UpdateCompanyInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name !== undefined) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Name must be a non-empty string' });
    } else if (data.name.length > 255) {
      errors.push({ field: 'name', message: 'Name must be less than 255 characters' });
    }
  }

  if (data.sector !== undefined && (typeof data.sector !== 'string' || data.sector.trim().length === 0)) {
    errors.push({ field: 'sector', message: 'Sector must be a non-empty string' });
  }

  if (data.stage !== undefined && (typeof data.stage !== 'string' || data.stage.trim().length === 0)) {
    errors.push({ field: 'stage', message: 'Stage must be a non-empty string' });
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
// GET /api/companies/[id] - Get a single company by ID
// ============================================================================

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id || !isValidCuid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid company ID format',
          message: 'Company ID must be a valid CUID',
        },
        { status: 400 }
      );
    }

    let company: Company | null;

    if (usePrisma) {
      const prismaCompany = await prisma.company.findUnique({
        where: { id },
      });

      company = prismaCompany
        ? {
            ...prismaCompany,
            createdAt: prismaCompany.createdAt.toISOString(),
            updatedAt: prismaCompany.updatedAt.toISOString(),
          }
        : null;
    } else {
      company = mockCompanies.find((c) => c.id === id) || null;
    }

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
          message: `No company found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: company,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching company:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch company',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/companies/[id] - Update a company
// ============================================================================

export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id || !isValidCuid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid company ID format',
          message: 'Company ID must be a valid CUID',
        },
        { status: 400 }
      );
    }

    let body: UpdateCompanyInput;

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

    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No fields provided for update',
          message: 'At least one field must be provided to update',
        },
        { status: 400 }
      );
    }

    const validationErrors = validateUpdateInput(body);
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

    if (usePrisma) {
      const existingCompany = await prisma.company.findUnique({
        where: { id },
      });

      if (!existingCompany) {
        return NextResponse.json(
          {
            success: false,
            error: 'Company not found',
            message: `No company found with ID: ${id}`,
          },
          { status: 404 }
        );
      }

      const updateData: any = {};
      if (body.name !== undefined) updateData.name = body.name.trim();
      if (body.sector !== undefined) updateData.sector = body.sector.trim();
      if (body.stage !== undefined) updateData.stage = body.stage.trim();
      if (body.website !== undefined) updateData.website = body.website?.trim() || null;
      if (body.description !== undefined) updateData.description = body.description?.trim() || null;
      if (body.founded !== undefined) updateData.founded = body.founded;
      if (body.employees !== undefined) updateData.employees = body.employees;
      if (body.investment !== undefined) updateData.investment = body.investment;
      if (body.valuation !== undefined) updateData.valuation = body.valuation;
      if (body.status !== undefined) updateData.status = body.status;

      const updated = await prisma.company.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            ...updated,
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
          },
          message: 'Company updated successfully',
        },
        { status: 200 }
      );
    } else {
      const companyIndex = mockCompanies.findIndex((c) => c.id === id);

      if (companyIndex === -1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Company not found',
            message: `No company found with ID: ${id}`,
          },
          { status: 404 }
        );
      }

      const updatedCompany: Company = {
        ...mockCompanies[companyIndex],
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.sector !== undefined && { sector: body.sector.trim() }),
        ...(body.stage !== undefined && { stage: body.stage.trim() }),
        ...(body.website !== undefined && { website: body.website?.trim() || null }),
        ...(body.description !== undefined && { description: body.description?.trim() || null }),
        ...(body.founded !== undefined && { founded: body.founded }),
        ...(body.employees !== undefined && { employees: body.employees }),
        ...(body.investment !== undefined && { investment: body.investment }),
        ...(body.valuation !== undefined && { valuation: body.valuation }),
        ...(body.status !== undefined && { status: body.status }),
        updatedAt: new Date().toISOString(),
      };

      mockCompanies[companyIndex] = updatedCompany;

      return NextResponse.json(
        {
          success: true,
          data: updatedCompany,
          message: 'Company updated successfully (mock)',
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(`Error updating company:`, error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
          message: 'The company you are trying to update does not exist',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update company',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/companies/[id] - Delete a company
// ============================================================================

export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id || !isValidCuid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid company ID format',
          message: 'Company ID must be a valid CUID',
        },
        { status: 400 }
      );
    }

    if (usePrisma) {
      const existingCompany = await prisma.company.findUnique({
        where: { id },
      });

      if (!existingCompany) {
        return NextResponse.json(
          {
            success: false,
            error: 'Company not found',
            message: `No company found with ID: ${id}`,
          },
          { status: 404 }
        );
      }

      await prisma.company.delete({
        where: { id },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Company deleted successfully',
          data: { id },
        },
        { status: 200 }
      );
    } else {
      const companyIndex = mockCompanies.findIndex((c) => c.id === id);

      if (companyIndex === -1) {
        return NextResponse.json(
          {
            success: false,
            error: 'Company not found',
            message: `No company found with ID: ${id}`,
          },
          { status: 404 }
        );
      }

      const deletedCompany = mockCompanies[companyIndex];
      mockCompanies = mockCompanies.filter((c) => c.id !== id);

      return NextResponse.json(
        {
          success: true,
          message: 'Company deleted successfully (mock)',
          data: { id: deletedCompany.id },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(`Error deleting company:`, error);

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Company not found',
          message: 'The company you are trying to delete does not exist',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete company',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
