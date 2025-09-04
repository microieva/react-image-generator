// export interface GenerationResponse {
//   status: string
//   taskId: string
//   images?: Array<{
//     image_url: string
//     image_path: string
//     filename: string
//   }>
//   prompt?: string
//   message?: string
//   error?: string
// }

// export interface ImageGenerationResponse {
//   success: boolean
//   data?: {
//     images: Array<{
//       url: string
//       base64?: string
//       id: string
//       prompt: string
//       timestamp: string
//     }>
//     model?: string
//     generation_time?: number
//   }
//   error?: string
// }

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

/*
ENDPOINT /status/<task_id>
 return {
        "task_id": task_id,
        "status": task_data['status'],
        "progress": task_data.get('progress'),
        "created_at": task_data['created_at'],
        "started_at": task_data.get('started_at'),
        "completed_at": task_data.get('completed_at'),
        "cancelled": task_data.get('cancelled', False),
        "has_result": 'result' in task_data
    }*/