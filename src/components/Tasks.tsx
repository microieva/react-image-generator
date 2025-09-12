import React, { useEffect, useMemo } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  CircularProgress,
  IconButton,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDateFormatting } from '../hooks/useDateFormatting';
import { Task } from '../types/api';
import { useTasks } from '../hooks/useTasks';


const formatDate = (dateString: string) => {
  return useDateFormatting(dateString);
};

const getStatusColor = (status: string) => {
  const statusColors = {
    completed: 'success',
    processing: 'primary',
    pending: 'default',
    failed: 'error',
    error: 'error',
    cancelled: 'warning',
  } as const;

  return statusColors[status as keyof typeof statusColors] || 'default';
};

const TaskRow = React.memo(({ 
  task, 
  cancellingIds, 
  onCancel, 
  onRefresh, 
  onClick,
  onNavigate 
}: { 
  task: Task;
  cancellingIds: string[];
  onCancel: (taskId: string) => void;
  onRefresh: (taskId: string, e?: React.MouseEvent) => void;
  onClick: (taskId: string) => void;
  onNavigate: (path: string) => void;
}) => {
  const isProcessing = task.status === 'processing';
  const isCancelling = cancellingIds.includes(task.taskId);

  return (
    <TableRow 
      hover
      onClick={isProcessing ? () => onNavigate(`/generate-stream/${task.taskId}`) : undefined}
      sx={{ cursor: isProcessing ? 'pointer' : 'default' }}
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
        <Box display="flex" alignItems="center" gap={1}>
          <Box width="100%" mr={1}>
            <CircularProgress 
              variant="determinate" 
              value={task.status !== 'completed' ? task.progress : 100} 
              size={20}
              color={
                task.status === 'completed' ? 'success' : 
                task.status === 'failed' || task.status === 'cancelled' ? 'error' : 'primary'
              }
            />
          </Box>
          <Typography variant="body2">
            {task.status !== 'completed' ? `${task.progress}%` : '100%'}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh(task.taskId, e);
            }}
            title="Refresh progress"
            sx={{ visibility: task.status === 'completed' ? 'hidden' : 'visible' }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell align="left">{formatDate(task.created_at)}</TableCell>
      <TableCell align="left">
        {(task.status === 'processing' || task.status === 'pending') ? (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onCancel(task.taskId);
            }}
            disabled={isCancelling}
            color="error"
            aria-label={`Cancel task ${task.taskId}`}
          >
            {isCancelling ? (
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
  );
});

TaskRow.displayName = 'TaskRow';

export const Tasks: React.FC = () => {
  const { tasks,
    loading,
    error,
    deletionError,
    cancellingIds,
    isDeleting,
    fetchTasks,
    handleCancel,
    refreshTaskProgress,
    deleteTasks,
    handleNavigate } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, []);

  const tableHeader = useMemo(() => (
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
  ), []);

  const tableRows = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <Alert severity="error">{error}</Alert>
          </TableCell>
        </TableRow>
      );
    }

    return tasks.map((task) => (
      <TaskRow
        key={task.taskId}
        task={task}
        cancellingIds={cancellingIds}
        onCancel={handleCancel}
        onRefresh={refreshTaskProgress}
        onClick={() => {}}
        onNavigate={handleNavigate}
      />
    ));
  }, [tasks, loading, error, cancellingIds, handleCancel, refreshTaskProgress, handleNavigate]);

    if (loading){
      return (
        <Container maxWidth="lg" sx={{ minHeight:'85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      );
    }
    if (tasks.length > 0) {
      return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={8}>
              <Typography variant="h4" component="h1">
                Ongoing Tasks
              </Typography>
              <Box display="flex" alignItems="center" >
                {deletionError && (
                  <Alert severity="error" sx={{py:0}} onClose={() => {}}>
                    {deletionError}
                  </Alert>
                )}
                <IconButton
                  onClick={deleteTasks} 
                  disabled={tasks.length === 0 || Boolean(deletionError) || tasks.every(t => t.status ==='processing')}
                  aria-label="Refresh tasks">
                  {isDeleting ? (
                    <CircularProgress size={20} />
                  ) : (
                    <DeleteForeverIcon />
                  )}
                </IconButton>
                <IconButton 
                  onClick={fetchTasks} 
                  color="inherit"
                  disabled={loading}
                  aria-label="Refresh tasks"
                >
                  <RefreshIcon />
                </IconButton>  
              </Box>
            </Box>
              <TableContainer sx={{ maxHeight: '50vh' }}>
                <Table size="small" sx={{ minWidth: 650 }} stickyHeader>
                  {tableHeader}
                  <TableBody>
                    {tableRows}
                  </TableBody>
                </Table>
              </TableContainer>
          </Paper>
        </Container>
      );
    } return (
      <Container maxWidth="lg" sx={{minHeight:'85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <Typography variant="body1">No ongoing tasks found.</Typography>
        </Box>
      </Container>
    )

};