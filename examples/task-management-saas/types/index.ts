// ============================================
// TASK MANAGEMENT SAAS - TYPESCRIPT TYPES
// ============================================

import { TaskStatus, Priority } from '@prisma/client'

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
  image: string | null
}

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
  id: string
  name: string
  description: string | null
  color: string
  isArchived: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  taskCount?: number
  completedTaskCount?: number
}

export interface CreateProjectInput {
  name: string
  description?: string
  color?: string
}

export interface UpdateProjectInput {
  name?: string
  description?: string
  color?: string
  isArchived?: boolean
}

// ============================================
// TASK TYPES
// ============================================

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: Date | null
  order: number
  projectId: string | null
  project: Project | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: Date
  projectId?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: Date
  projectId?: string
  order?: number
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  tasksByPriority: {
    LOW: number
    MEDIUM: number
    HIGH: number
    URGENT: number
  }
  tasksByStatus: {
    TODO: number
    IN_PROGRESS: number
    IN_REVIEW: number
    DONE: number
  }
  recentTasks: Task[]
}

// ============================================
// SOCKET.IO TYPES
// ============================================

export interface ServerToClientEvents {
  'task:created': (task: Task) => void
  'task:updated': (task: Task) => void
  'task:deleted': (taskId: string) => void
  'project:created': (project: Project) => void
  'project:updated': (project: Project) => void
  'project:deleted': (projectId: string) => void
}

export interface ClientToServerEvents {
  'task:create': (task: CreateTaskInput) => void
  'task:update': (taskId: string, updates: UpdateTaskInput) => void
  'task:delete': (taskId: string) => void
  'join:project': (projectId: string) => void
  'leave:project': (projectId: string) => void
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: TaskStatus) => void
}

export interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
  onArchive?: (projectId: string) => void
}

export interface TaskFormProps {
  task?: Task
  projects: Project[]
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => void
  onCancel: () => void
}

export interface ProjectFormProps {
  project?: Project
  onSubmit: (data: CreateProjectInput | UpdateProjectInput) => void
  onCancel: () => void
}
