// ============================================
// TASKS API ROUTE
// ============================================
// API endpoints for task CRUD operations.
// GET: List tasks
// POST: Create new task

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { TaskStatus, Priority } from '@prisma/client'

// GET /api/tasks - List all tasks for the current user
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
    const status = searchParams.get('status') as TaskStatus | null
    const priority = searchParams.get('priority') as Priority | null
    const projectId = searchParams.get('projectId')
    
    // Build filter
    const where: any = { userId: session.user.id }
    if (status) where.status = status
    if (priority) where.priority = priority
    if (projectId) where.projectId = projectId
    
    // Fetch tasks
    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json({
      success: true,
      data: tasks
    })
    
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
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
    const { title, description, status, priority, dueDate, projectId } = body
    
    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }
    
    // Get max order for the project
    const maxOrderTask = await prisma.task.findFirst({
      where: { userId: session.user.id, projectId: projectId || null },
      orderBy: { order: 'desc' }
    })
    const newOrder = (maxOrderTask?.order || 0) + 1
    
    // Create task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId || null,
        userId: session.user.id,
        order: newOrder
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: task,
      message: 'Task created successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
