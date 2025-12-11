/**
 * Local Storage Hooks
 *
 * Custom React hooks for persistent data storage using localStorage.
 * These hooks provide a clean interface for managing application data
 * with automatic JSON serialization and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../data/constants';

/**
 * Generic hook for persisting state to localStorage
 *
 * Automatically serializes/deserializes JSON and handles errors gracefully.
 * Updates are immediately persisted to localStorage.
 *
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - Default value if nothing in storage
 * @returns {[T, (value: T | ((prev: T) => T)) => void]} State and setter tuple
 *
 * @example
 * const [todos, setTodos] = useLocalStorage('todos', []);
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided default
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Setter that persists to localStorage
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function (like useState)
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * Hook for managing resumes in localStorage
 *
 * @returns {Object} Resume data and operations
 * @property {Array} resumes - Array of resume objects
 * @property {Function} addResume - Add a new resume
 * @property {Function} updateResume - Update existing resume
 * @property {Function} deleteResume - Delete a resume by ID
 * @property {Function} duplicateResume - Create a copy of a resume
 */
export const useResumes = () => {
  const [resumes, setResumes] = useLocalStorage(STORAGE_KEYS.resumes, []);

  const addResume = useCallback(
    (resume) => {
      const newResume = { ...resume, id: Date.now() };
      setResumes((prev) => [...prev, newResume]);
      return newResume;
    },
    [setResumes]
  );

  const updateResume = useCallback(
    (id, updates) => {
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    [setResumes]
  );

  const deleteResume = useCallback(
    (id) => {
      setResumes((prev) => prev.filter((r) => r.id !== id));
    },
    [setResumes]
  );

  const duplicateResume = useCallback(
    (resume) => {
      const duplicate = {
        ...resume,
        id: Date.now(),
        title: `${resume.title} (Copy)`,
      };
      setResumes((prev) => [...prev, duplicate]);
      return duplicate;
    },
    [setResumes]
  );

  return {
    resumes,
    setResumes,
    addResume,
    updateResume,
    deleteResume,
    duplicateResume,
  };
};

/**
 * Hook for managing jobs in localStorage
 *
 * @returns {Object} Job data and operations
 * @property {Array} jobs - Array of job objects
 * @property {Function} addJob - Add a new job
 * @property {Function} updateJob - Update existing job
 * @property {Function} deleteJob - Delete a job by ID
 */
export const useJobs = () => {
  const [jobs, setJobs] = useLocalStorage(STORAGE_KEYS.jobs, []);

  const addJob = useCallback(
    (job) => {
      const newJob = {
        ...job,
        id: Date.now(),
        activityLog: [
          {
            action: 'created',
            date: new Date().toISOString(),
          },
        ],
      };
      setJobs((prev) => [...prev, newJob]);
      return newJob;
    },
    [setJobs]
  );

  const updateJob = useCallback(
    (id, updates) => {
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id !== id) return j;

          // Add activity log entry for status changes
          const updatedJob = { ...j, ...updates };
          if (updates.status && updates.status !== j.status) {
            updatedJob.activityLog = [
              ...(j.activityLog || []),
              {
                action: `status_changed_to_${updates.status}`,
                date: new Date().toISOString(),
              },
            ];
          }
          return updatedJob;
        })
      );
    },
    [setJobs]
  );

  const deleteJob = useCallback(
    (id) => {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    },
    [setJobs]
  );

  return {
    jobs,
    setJobs,
    addJob,
    updateJob,
    deleteJob,
  };
};

/**
 * Hook for managing applications in localStorage
 *
 * @returns {Object} Application data and operations
 */
export const useApplications = () => {
  const [applications, setApplications] = useLocalStorage(
    STORAGE_KEYS.applications,
    []
  );

  const addApplication = useCallback(
    (application) => {
      const newApplication = {
        ...application,
        id: Date.now(),
        statusHistory: [
          {
            status: application.status || 'applied',
            date: new Date().toISOString(),
          },
        ],
      };
      setApplications((prev) => [...prev, newApplication]);
      return newApplication;
    },
    [setApplications]
  );

  const updateApplication = useCallback(
    (id, updates) => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;

          const updatedApp = { ...app, ...updates };

          // Track status changes in history
          if (updates.status && updates.status !== app.status) {
            updatedApp.statusHistory = [
              ...(app.statusHistory || []),
              {
                status: updates.status,
                date: new Date().toISOString(),
                note: updates.statusNote || '',
              },
            ];
          }

          return updatedApp;
        })
      );
    },
    [setApplications]
  );

  const deleteApplication = useCallback(
    (id) => {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    },
    [setApplications]
  );

  return {
    applications,
    setApplications,
    addApplication,
    updateApplication,
    deleteApplication,
  };
};

export default useLocalStorage;
