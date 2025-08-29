export interface GenerationRequest {
  prompt: string
  max_tokens?: number
  temperature?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
}

// export interface GenerationResponse {
//   success: boolean
//   data?: {
//     generated_text: string
//     id: string
//     timestamp: string
//     model?: string
//     usage?: {
//       prompt_tokens: number
//       completion_tokens: number
//       total_tokens: number
//     }
//   }
//   error?: string
// }
export interface GenerationResponse {
  status: string
  taskId: string
  images?: Array<{
    image_url: string
    image_path: string
    filename: string
  }>
  prompt?: string
  message?: string
  error?: string
}

export interface ImageGenerationResponse {
  success: boolean
  data?: {
    images: Array<{
      url: string
      base64?: string
      id: string
      prompt: string
      timestamp: string
    }>
    model?: string
    generation_time?: number
  }
  error?: string
}

export interface GenerationRequest {
  prompt: string
  width?: number
  height?: number
  num_images?: number
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
export interface GenerationStatusResponse {
  task_id: string
  status: string //'pending', 'processing', 'completed', 'cancelled', 'error'
  progress: number | null
  created_at: string
  started_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancelled: boolean
  has_result: boolean
  error: string | null
  result: GenerationResult | null; 
}
export interface GenerationResult {
  image_url: string
  prompt: string
  task_id: string
  generation_time?: number
}

export interface SSEProgressEvent {
    task_id: string;
    status: string;
    progress: number;
    message?: string;
    result?: GenerationResult;
    error?: string;
}