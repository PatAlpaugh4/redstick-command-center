// ============================================
// PROJECTS API ROUTE
// ============================================
// API endpoints for project CRUD operations.
// GET: List projects
// POST: Create new project

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getRandomColor } from '@/lib/utils'

// GET /api/projects - List all projects for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const includeArchived = searchParams.get('includeArchived') === 'true'
    
    // Build filter
    const where: any = { userId: session.user.id }
    if (!includeArchived) where.isArchived = false
    
    // Fetch projects with task counts
    const projects = await prisma.project.findMany({
      where,
      include: {
        _count: {
          select: { tasks: true }
        },
        tasks: {
          where: { status: 'DONE' },
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Format response
    const formattedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      color: project.color,
      isArchived: project.isArchived,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskCount: project._count.tasks,
      completedTaskCount: project.tasks.length
    }))
    
    return NextResponse.json({
      success: true,
      data: formattedProjects
    })
    
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { name, description, color } = body
    
    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      )
    }
    
    // Create project
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || getRandomColor(),
        userId: session.user.id
      }
    })
    
    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
