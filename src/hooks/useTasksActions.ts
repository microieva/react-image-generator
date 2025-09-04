import { useCallback, useEffect, useRef, useState } from "react";
import { SSEProgressEvent, Task, TasksStream, TaskState } from "../types/api";
import axios, { CancelTokenSource } from "axios";
import env from "../utils/env";

export const useTasksActions = (id?:string) => {
    const [state, setState] = useState<TaskState>({
        loading: false,
        tasks: [],
        taskId: id || '',
        status:'',
        progress:0,
        error:null
    });
    const eventSourceRef = useRef<EventSource | null>(null);
    const cancelTokenSource = useRef<CancelTokenSource | null>(null);

    const cancel = useCallback(async (id?:string) => {
        console.log('can i pass the id to cancel like this ? ', id)
      if (!state.taskId) {
          setState(prev => ({ 
              ...prev, 
              cancelled: true, 
              loading: false,
              status: 'cancelled'
          }));
          return;
      }

      try {
          const response = await axios.post(`${env.apiBaseUrl}/cancel-generation`, { 
              task_id: state.taskId
          });
          if (response.status === 200 && response.data.status === 'success') {
              setState(prev => ({ 
                  ...prev, 
                  cancelled: true, 
                  loading: false,
                  status: 'cancelled',
                  taskId: null
              }));
          } else {
              setState(prev => ({ 
                  ...prev, 
                  error: response.data.error || 'Cancellation failed' 
              }));
          }
      } catch (error: any) {
          setState(prev => ({ 
              ...prev, 
              error: error.response?.data?.error || 'Cancellation failed' 
          }));
      }
    }, [state.taskId]);

    // const progress = useCallback(async()=> {
    //     if (state.taskId) {
    //         return new Promise((resolve) => {      
    //             eventSourceRef.current = new EventSource(`${env.apiBaseUrl}/generate-stream/${state.taskId}`);
    
    //             eventSourceRef.current.onmessage = (event) => {
    //                 try {
    //                     const data: SSEProgressEvent = JSON.parse(event.data);

    //                     if (data) {
    //                         setState(prev => {
    //                             if (prev.progress === data.progress) {
    //                                 return prev;
    //                             }
    //                             return {
    //                                 ...prev,
    //                                 taskId: data.task_id,
    //                                 progress: data.progress,
    //                                 status: data.status,
    //                                 cancelled: data.status === 'cancelled',
    //                                 error: data.error || prev.error
    //                             }});
    //                     }
    
    //                     if (data.status === 'completed' && data.result) {
    //                         if (eventSourceRef.current) {
    //                             eventSourceRef.current.close();
    //                         }
    //                         setState(prev => ({ ...prev, loading: false }));
    //                         resolve(data.result);
    //                     }
    
    //                     if (data.status === 'error') {
    //                         if (eventSourceRef.current) {
    //                             eventSourceRef.current.close();
    //                         }
    //                         setState(prev => ({ 
    //                             ...prev, 
    //                             loading: false, 
    //                             error: data.error || 'Generation failed' 
    //                         }));
    //                         resolve(null);
    //                     }
    
    //                 } catch (error) {
    //                     console.error('Error parsing SSE data:', error);
    //                 }
    //             };
    
    //             eventSourceRef.current.onerror = (error) => {
    //                 console.error('SSE connection error:', error);
    //                 if (eventSourceRef.current) {
    //                     eventSourceRef.current.close();
    //                 }
    //                 setState(prev => ({ 
    //                     ...prev, 
    //                     loading: false, 
    //                     error: 'Connection failed' 
    //                 }));
    //                 resolve(null);
    //             };
    //         });
    //     } else {
    //         return null;
    //     }
    // }, [state.taskId])

    return {

        cancel,
        ...state,
    };
}