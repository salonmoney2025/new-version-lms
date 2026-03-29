/**
 * React Hook for Async PDF/Excel Exports
 *
 * PHASE 2: Async Operations
 * - Handles POST to start task
 * - Polls GET endpoint for task status
 * - Downloads file when ready
 * - Provides loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export type ExportStatus = 'idle' | 'starting' | 'processing' | 'downloading' | 'success' | 'error';

export interface UseAsyncExportOptions {
  /**
   * Polling interval in milliseconds (default: 2000ms)
   */
  pollInterval?: number;

  /**
   * Maximum polling attempts before timeout (default: 60 attempts = 2 minutes)
   */
  maxAttempts?: number;

  /**
   * Callback when export starts
   */
  onStart?: () => void;

  /**
   * Callback when export completes
   */
  onSuccess?: () => void;

  /**
   * Callback when export fails
   */
  onError?: (error: string) => void;
}

export interface UseAsyncExportResult {
  /**
   * Current status of the export
   */
  status: ExportStatus;

  /**
   * Error message if status is 'error'
   */
  error: string | null;

  /**
   * Progress message (e.g., "Generating PDF...")
   */
  message: string | null;

  /**
   * Start the export process
   */
  startExport: () => Promise<void>;

  /**
   * Cancel ongoing export
   */
  cancel: () => void;

  /**
   * Reset to idle state
   */
  reset: () => void;
}

/**
 * Hook for handling async PDF/Excel exports with Celery task polling
 *
 * @example
 * ```tsx
 * const { status, startExport, error, message } = useAsyncExport({
 *   endpoint: `/api/exams/${examId}/export_pdf`,
 *   onSuccess: () => toast.success('PDF downloaded!'),
 *   onError: (err) => toast.error(err),
 * });
 *
 * return (
 *   <Button onClick={startExport} disabled={status !== 'idle'}>
 *     {status === 'processing' ? 'Generating PDF...' : 'Export PDF'}
 *   </Button>
 * );
 * ```
 */
export function useAsyncExport(
  endpoint: string,
  options: UseAsyncExportOptions = {}
): UseAsyncExportResult {
  const {
    pollInterval = 2000,
    maxAttempts = 60,
    onStart,
    onSuccess,
    onError,
  } = options;

  const [status, setStatus] = useState<ExportStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [pollAttempts, setPollAttempts] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  // Reset function
  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setMessage(null);
    setTaskId(null);
    setPollAttempts(0);
    setIsCancelled(false);
  }, []);

  // Cancel function
  const cancel = useCallback(() => {
    setIsCancelled(true);
    setStatus('idle');
    setMessage('Export cancelled');
  }, []);

  // Start export function
  const startExport = useCallback(async () => {
    try {
      setStatus('starting');
      setError(null);
      setMessage('Starting export...');
      setIsCancelled(false);
      setPollAttempts(0);

      onStart?.();

      // POST to start the task
      const response = await axios.post(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 202) {
        const { task_id, message: taskMessage } = response.data;
        setTaskId(task_id);
        setStatus('processing');
        setMessage(taskMessage || 'Processing...');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to start export';
      setError(errorMessage);
      setStatus('error');
      setMessage(null);
      onError?.(errorMessage);
    }
  }, [endpoint, onStart, onError]);

  // Polling effect
  useEffect(() => {
    if (!taskId || status !== 'processing' || isCancelled) {
      return;
    }

    const pollTaskStatus = async () => {
      try {
        // Check if max attempts reached
        if (pollAttempts >= maxAttempts) {
          throw new Error('Export timeout - please try again');
        }

        const response = await axios.get(`${endpoint}?task_id=${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob', // Important for file download
        });

        if (response.status === 200) {
          // Success - file is ready, download it
          setStatus('downloading');
          setMessage('Downloading file...');

          // Create download link
          const blob = new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          // Extract filename from Content-Disposition header
          const contentDisposition = response.headers['content-disposition'];
          const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
          const filename = filenameMatch ? filenameMatch[1] : 'export.pdf';

          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          setStatus('success');
          setMessage('Export completed successfully');
          onSuccess?.();

          // Reset after 2 seconds
          setTimeout(() => reset(), 2000);
        } else if (response.status === 202) {
          // Still processing
          setPollAttempts(prev => prev + 1);

          // Parse message if response is JSON (not blob)
          try {
            const text = await response.data.text();
            const json = JSON.parse(text);
            setMessage(json.message || 'Processing...');
          } catch {
            // Ignore parse errors
          }
        }
      } catch (err: any) {
        if (err.response?.status === 410) {
          // File expired
          const errorMessage = 'Export expired - please try again';
          setError(errorMessage);
          setStatus('error');
          onError?.(errorMessage);
        } else if (err.response?.status === 500) {
          // Task failed
          const errorMessage = 'Export failed - please contact support';
          setError(errorMessage);
          setStatus('error');
          onError?.(errorMessage);
        } else {
          // Other errors
          const errorMessage = err.message || 'Export failed';
          setError(errorMessage);
          setStatus('error');
          onError?.(errorMessage);
        }
      }
    };

    // Start polling
    const intervalId = setInterval(pollTaskStatus, pollInterval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [
    taskId,
    status,
    endpoint,
    pollInterval,
    maxAttempts,
    pollAttempts,
    isCancelled,
    onSuccess,
    onError,
    reset,
  ]);

  return {
    status,
    error,
    message,
    startExport,
    cancel,
    reset,
  };
}

/**
 * Convenience hook specifically for PDF exports
 */
export function useAsyncPdfExport(examId: string | number, options?: UseAsyncExportOptions) {
  return useAsyncExport(`/api/exams/${examId}/export_pdf`, options);
}

/**
 * Convenience hook specifically for Excel exports
 */
export function useAsyncExcelExport(examId: string | number, options?: UseAsyncExportOptions) {
  return useAsyncExport(`/api/exams/${examId}/export_excel`, options);
}
