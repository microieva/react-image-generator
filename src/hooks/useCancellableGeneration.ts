import { useState, useRef, useCallback, useEffect } from 'react';
import axios, { type CancelTokenSource } from 'axios';
import type { GenerationResult, SSEProgressEvent } from '../types/api';
import env from '../utils/env';

interface GenerationState {
    loading: boolean;
    error: string;
    progress: number;
    taskId: string | null;
    cancelled: boolean;
    status: string;
}

export const useCancellableGeneration = () => {
    const [state, setState] = useState<GenerationState>({
        loading: false,
        error: '',
        progress: 0,
        taskId: null,
        cancelled: false,
        status: 'idle',
    });

    const eventSourceRef = useRef<EventSource | null>(null);
    const cancelTokenSource = useRef<CancelTokenSource | null>(null);
    const progressRef = useRef(0);
    
    // Keep ref in sync with state
    useEffect(() => {
        progressRef.current = state.progress;
    }, [state.progress]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    const generate = useCallback(async (prompt: string): Promise<string | null> => {
        // Cleanup previous connections
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        if (cancelTokenSource.current) {
            cancelTokenSource.current.cancel('New generation started');
        }

        cancelTokenSource.current = axios.CancelToken.source();

        setState({
            loading: true,
            error: '',
            progress: 0,
            taskId: null,
            cancelled: false,
            status: 'pending',
        });

        try {
            const response = await axios.post(
                `${env.apiBaseUrl}/generate`,
                { 
                    prompt,
                    steps: 20,
                    guidance_scale: 7.5
                },
                {
                    cancelToken: cancelTokenSource.current.token,
                    timeout: 300000,
                }
            );

            const taskId = response.data.task_id;    
            setState(prev => ({ 
                ...prev, 
                taskId,
                status: 'processing'
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
                    error: error.response?.data?.error || 'Generation failed',
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
                        progressRef.current = data.progress;
                        if (Math.abs(data.progress - state.progress) >= 5 || data.status !== state.status) {
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
            const response = await axios.post(`${env.apiBaseUrl}/generate-stream`, { 
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
            status: 'idle',
        });
    }, []);

    // const getprogress = useCallback(() => {
    //     return state.progress;
    // }, [state.progress]);

    const getprogress = useCallback(() => {
        return progressRef.current;
    }, []);

    return {
        generate: generateWithSSE, 
        cancel,
        reset,
        getprogress, 
        ...state,
    };
};
