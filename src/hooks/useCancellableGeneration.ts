import { useState, useRef, useCallback, useEffect } from 'react';
import axios, { AxiosResponse, type CancelTokenSource } from 'axios';
import type { GenerationResult, GenerationState, GenerationStatus, SSEProgressEvent } from '../types/api';
import env from '../utils/env';

export const useCancellableGeneration = (id?:string) => {
    const [state, setState] = useState<GenerationState>({
        loading: Boolean(id),
        error: '',
        progress: 0,
        taskId: id || null,
        cancelled: false,
        status: 'pending',
        prompt_str: id ? '':undefined
    });

    const eventSourceRef = useRef<EventSource | null>(null);
    const cancelTokenSource = useRef<CancelTokenSource | null>(null);
    
    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    useEffect(()=> {
        id && getProgress() 
        id && getStream()
    }, [id])

    const generate = useCallback(async (prompt: string): Promise<string | null> => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel('New generation started');
        }

        cancelTokenSource.current = axios.CancelToken.source();

        try {
            const response = await axios.post(
                `${env.apiBaseUrl}/generate`,
                { prompt},
                {
                    cancelToken: cancelTokenSource.current.token
                }
            );

            const taskId = response.data.task_id;    
            setState(prev => ({ 
                ...prev, 
                taskId,
                status: 'pending'
            }));

            return taskId;

        } catch (error: any) {
            if (axios.isCancel(error)) {
                setState(prev => ({ 
                    ...prev, 
                    loading: false, 
                    cancelled: true,
                    status: 'cancelled'
                }));
            } else {
                setState(prev => ({ 
                    ...prev, 
                    loading: false, 
                    error: error.message || 'Generation failed',
                    status: 'error'
                }));
            }
            return null;
        }
    }, []);

    const generateWithSSE = useCallback(async (prompt: string): Promise<GenerationResult | null> => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        setState({
            loading: true,
            error: '',
            progress: 0,
            taskId: null,
            cancelled: false,
            status: 'pending',
        });
        const task_id = await generate(prompt);

        if (!task_id) {
            setState(prev => ({ ...prev, loading: false, error: 'Failed to start generation' }));
            return null;
        }

        if (task_id) {
            return new Promise((resolve) => {      
                eventSourceRef.current = new EventSource(`${env.apiBaseUrl}/generate-stream/${task_id}`);
    
                eventSourceRef.current.onmessage = (event) => {
                    try {
                        const data: SSEProgressEvent = JSON.parse(event.data);

                        if (data) {
                            setState(prev => {
                                if (prev.progress === data.progress) {
                                    return prev;
                                }
                                return {
                                    ...prev,
                                    taskId: data.task_id,
                                    progress: data.progress,
                                    status: data.status,
                                    cancelled: data.status === 'cancelled',
                                    error: data.error || prev.error
                                }});
                        }
    
                        if (data.status === 'completed' && data.result) {
                            if (eventSourceRef.current) {
                                eventSourceRef.current.close();
                            }
                            setState(prev => ({ ...prev, loading: false }));
                            resolve(data.result);
                        }
    
                        if (data.status === 'error') {
                            if (eventSourceRef.current) {
                                eventSourceRef.current.close();
                            }
                            setState(prev => ({ 
                                ...prev, 
                                loading: false, 
                                error: data.error || 'Generation failed' 
                            }));
                            resolve(null);
                        }
    
                    } catch (error) {
                        console.error('Error parsing SSE data:', error);
                    }
                };
    
                eventSourceRef.current.onerror = (error) => {
                    console.error('SSE connection error:', error);
                    if (eventSourceRef.current) {
                        eventSourceRef.current.close();
                    }
                    setState(prev => ({ 
                        ...prev, 
                        loading: false, 
                        error: 'Connection failed'
                    }));
                    resolve(null);
                };
            });
        } else {
            return null;
        }
    }, []);

    const cancel = useCallback(async () => {
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

    const reset = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel('Reset');
        }

        setState({
            loading: false,
            error: '',
            progress: 0,
            taskId: null,
            cancelled: false,
            status: 'pending',
        });
    }, []);

    const getProgress = useCallback(async () => {
        try {
            const response:AxiosResponse<GenerationStatus> = await axios.get(`${env.apiBaseUrl}/status/${id}`);

            if (response.status === 200) {
                setState(prev => ({ 
                    ...prev,
                    loading: Boolean(id),
                    progress: response.data.progress || state.progress,
                    cancelled: Boolean(response.data.cancelled_at),
                    status: response.data.status,
                    prompt_str: response.data.prompt
                    // this response has result to use it!!! add to state or add seperate getter?
                }));
            } else {
                setState(prev => ({ 
                    ...prev, 
                    error: response.data.error || 'Generation failed' 
                }));
            }
        } catch (error: any) {
            setState(prev => ({ 
                ...prev, 
                error: error.response?.data?.error || 'Unfortunately, generation failed..' 
            }));
        }
    },[id])

    const getStream = useCallback(async()=> {
         if (id) {
            return new Promise((resolve) => {      
                eventSourceRef.current = new EventSource(`${env.apiBaseUrl}/generate-stream/${id}`);
    
                eventSourceRef.current.onmessage = (event) => {
                    try {
                        const data: SSEProgressEvent = JSON.parse(event.data);

                        if (data) {
                            setState(prev => {
                                if (prev.progress === data.progress) {
                                    return prev;
                                }
                                return {
                                    ...prev,
                                    taskId: data.task_id,
                                    progress: data.progress,
                                    status: data.status,
                                    cancelled: data.status === 'cancelled',
                                    error: data.error || prev.error
                                }});
                        }
    
                        if (data.status === 'completed' && data.result) {
                            if (eventSourceRef.current) {
                                eventSourceRef.current.close();
                            }
                            setState(prev => ({ ...prev, loading: false }));
                            resolve(data.result);
                        }
    
                        if (data.status === 'error') {
                            if (eventSourceRef.current) {
                                eventSourceRef.current.close();
                            }
                            setState(prev => ({ 
                                ...prev, 
                                loading: false, 
                                error: data.error || 'Generation failed' 
                            }));
                            resolve(null);
                        }
    
                    } catch (error) {
                        console.error('Error parsing SSE data:', error);
                    }
                };
    
                eventSourceRef.current.onerror = (error) => {
                    console.error('SSE connection error:', error);
                    if (eventSourceRef.current) {
                        eventSourceRef.current.close();
                    }
                    setState(prev => ({ 
                        ...prev, 
                        loading: false, 
                        error: 'Connection failed 2' 
                    }));
                    resolve(null);
                };
            });
        } else {
            return null;
        }
    }, [id])

    return {
        generate: generateWithSSE, 
        cancel,
        reset,
        ...state,
    };
};
