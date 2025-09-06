import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import { Cancel as CancelIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import axios from 'axios';
import env from '../utils/env';
import { useDateFormatting } from '../hooks/useDateFormatting';
import { Task } from '../types/api';
import { useNavigate } from 'react-router-dom';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingIds, setCancellingIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
       const response = await axios.get(`${env.apiBaseUrl}/tasks`);
      
      if (response.status !== 200) {
        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }
      
      const data:Map<string, Object> = response.data.tasks;
      const tasks: Task[] = Object.entries(data).map(([taskId, taskData]) => ({
        taskId,
        ...taskData
      }));
      setTasks(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCancel = async (taskId: string) => {
    try {
      setCancellingIds(prev => [...prev, taskId]);
      const response = await axios.post(`${env.apiBaseUrl}/cancel-generation`, { 
          task_id: taskId
      });
      if (response.status === 200 && response.data.status === 'success') {
          fetchTasks();
      } else {
          setError(response.data.error || 'Cancellation failed');
      }
    } catch (error: any) {   
        setError(error.response?.data?.error || 'Cancellation failed'); 
    } finally {
      setCancellingIds(prev => prev.filter(id => id !== taskId));
    }
  }

  const formatDate = (dateString: string) => {
    return useDateFormatting(dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'primary';
      case 'pending':
        return 'default';
      case 'failed':
        return 'error';
      case 'error':
        return 'error';
      case 'cancelled':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Ongoing Tasks
          </Typography>
          <IconButton 
            onClick={fetchTasks} 
            color="primary"
            disabled={loading}
            aria-label="Refresh tasks"
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Typography variant="body1" textAlign="center" py={4}>
            No ongoing tasks found.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Task ID</TableCell>
                  <TableCell align="left">Prompt</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Progress</TableCell>
                  <TableCell align="left">Created At</TableCell>
                  <TableCell align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow 
                    key={task.taskId} 
                    hover 
                    onClick={()=>navigate(`/generate-stream/${task.taskId}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontFamily: 'monospace' }} align="left">
                      {task.taskId}
                    </TableCell>
                    <TableCell 
                      align="left"
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                      title={task.prompt}
                    >
                      {task.prompt}
                    </TableCell>
                    <TableCell align="left">
                      
                      <Chip 
                        label={task.status} 
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Box display="flex" alignItems="center">
                        <Box width="100%" mr={1}>
                          <CircularProgress 
                            variant="determinate" 
                            value={task.progress} 
                            size={20}
                            color={
                              task.status === 'completed' ? 'success' : 
                              task.status === 'failed' || task.status === 'cancelled' ? 'error' : 'primary'
                            }
                          />
                        </Box>
                        <Typography variant="body2">
                          {task.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{formatDate(task.created_at)}</TableCell>
                    <TableCell align="left">
                      {task.status === 'processing' || task.status === 'pending' ? (
                        <IconButton
                          onClick={(e) => {e.stopPropagation(); handleCancel(task.taskId)}}
                          disabled={cancellingIds.includes(task.taskId)}
                          color="error"
                          aria-label={`Cancel task ${task.taskId}`}
                        >
                          {cancellingIds.includes(task.taskId) ? (
                            <CircularProgress size={20} />
                          ) : (
                            <CancelIcon />
                          )}
                        </IconButton>
                      ) : (
                        <IconButton disabled>
                          <CancelIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};