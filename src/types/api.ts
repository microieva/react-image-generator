export interface GenerationRequest {
  prompt: string
}

export interface CancelRequest {
  task_id: string
}
export interface CancelationResponse {
  status: string
  message: string
  error?: string
  task_id?: string
}
export interface GenerationState {
    loading: boolean
    error: string
    progress: number
    taskId: string | null
    cancelled: boolean
    status: string
    prompt_str?: string | undefined
}
export interface TasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
  deletionError: string | null
  cancellingIds: string[]
  isDeleting: boolean
}
export interface TaskState {
  loading:boolean
  taskId:string | null
  status:string,
  progress:number,
  error:string | null

  tasks?: Task[]
}
export interface GenerationStatus {
    task_id: string
    status: string // 'pending', 'processing', 'completed', 'cancelled', 'error'
    progress?: number
    created_at: string
    started_at?: string
    completed_at?: string
    cancelled_at?: string
    result?: GenerationResult | null
    error?: string
    prompt?:string
}
export interface GenerationResult {
    task_id: string
    image_url: string        
    prompt: string
}
export interface SSEProgressEvent {
    task_id: string
    status: string
    progress: number
    message?: string
    result?: GenerationResult
    error?: string
}

export interface TasksStream {
  total_tasks:number,
  tasks:Task[]
}

export interface Task {
  taskId: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  created_at: string;
}

export interface TaskProgress {
  taskId: string;
  progress: number;
  status: Task['status'];
}