/**
 * Local Storage Hooks
 *
 * Custom React hooks for persistent data storage using localStorage.
 * These hooks provide a clean interface for managing application data
 * with automatic JSON serialization and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../data/constants';
import type { Resume, Job, Application } from '../types';

/**
 * Generic hook for persisting state to localStorage
 *
 * Automatically serializes/deserializes JSON and handles errors gracefully.
 * Updates are immediately persisted to localStorage.
 *
 * @template T
 * @param key - localStorage key
 * @param initialValue - Default value if nothing in storage
 * @returns State and setter tuple
 *
 * @example
 * const [todos, setTodos] = useLocalStorage<string[]>('todos', []);
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  // Get initial value from localStorage or use provided default
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Setter that persists to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
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
 * @returns Resume data and operations
 */
export interface UseResumesReturn {
  resumes: Resume[];
  setResumes: (value: Resume[] | ((prev: Resume[]) => Resume[])) => void;
  addResume: (resume: Omit<Resume, 'id'>) => Resume;
  updateResume: (id: number, updates: Partial<Resume>) => void;
  deleteResume: (id: number) => void;
  duplicateResume: (resume: Resume) => Resume;
}

export const useResumes = (): UseResumesReturn => {
  const [resumes, setResumes] = useLocalStorage<Resume[]>(STORAGE_KEYS.resumes, []);

  const addResume = useCallback(
    (resume: Omit<Resume, 'id'>): Resume => {
      const newResume: Resume = { ...resume, id: Date.now() } as Resume;
      setResumes((prev) => [...prev, newResume]);
      return newResume;
    },
    [setResumes]
  );

  const updateResume = useCallback(
    (id: number, updates: Partial<Resume>) => {
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    [setResumes]
  );

  const deleteResume = useCallback(
    (id: number) => {
      setResumes((prev) => prev.filter((r) => r.id !== id));
    },
    [setResumes]
  );

  const duplicateResume = useCallback(
    (resume: Resume): Resume => {
      const duplicate: Resume = {
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
 * @returns Job data and operations
 */
export interface UseJobsReturn {
  jobs: Job[];
  setJobs: (value: Job[] | ((prev: Job[]) => Job[])) => void;
  addJob: (job: Omit<Job, 'id' | 'activityLog'>) => Job;
  updateJob: (id: number, updates: Partial<Job>) => void;
  deleteJob: (id: number) => void;
}

export const useJobs = (): UseJobsReturn => {
  const [jobs, setJobs] = useLocalStorage<Job[]>(STORAGE_KEYS.jobs, []);

  const addJob = useCallback(
    (job: Omit<Job, 'id' | 'activityLog'>): Job => {
      const newJob: Job = {
        ...job,
        id: Date.now(),
        activityLog: [
          {
            id: Date.now(),
            action: 'created',
            date: new Date().toISOString(),
            details: 'Job created',
          },
        ],
      };
      setJobs((prev) => [...prev, newJob]);
      return newJob;
    },
    [setJobs]
  );

  const updateJob = useCallback(
    (id: number, updates: Partial<Job>) => {
      setJobs((prev) =>
        prev.map((j) => {
          if (j.id !== id) return j;

          // Add activity log entry for status changes
          const updatedJob = { ...j, ...updates };
          if (updates.status && updates.status !== j.status) {
            updatedJob.activityLog = [
              ...(j.activityLog || []),
              {
                id: Date.now(),
                action: `status_changed_to_${updates.status}`,
                date: new Date().toISOString(),
                details: `Status changed to ${updates.status}`,
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
    (id: number) => {
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
 * @returns Application data and operations
 */
export interface UseApplicationsReturn {
  applications: Application[];
  setApplications: (value: Application[] | ((prev: Application[]) => Application[])) => void;
  addApplication: (application: Omit<Application, 'id' | 'timeline'>) => Application;
  updateApplication: (id: string, updates: Partial<Application> & { statusNote?: string }) => void;
  deleteApplication: (id: string) => void;
}

export const useApplications = (): UseApplicationsReturn => {
  const [applications, setApplications] = useLocalStorage<Application[]>(
    STORAGE_KEYS.applications,
    []
  );

  const addApplication = useCallback(
    (application: Omit<Application, 'id' | 'timeline'>): Application => {
      const newApplication: Application = {
        ...application,
        id: Date.now().toString(),
        timeline: [
          {
            id: Date.now().toString(),
            status: application.status || 'applied',
            date: new Date().toISOString(),
            notes: '',
          },
        ],
      };
      setApplications((prev) => [...prev, newApplication]);
      return newApplication;
    },
    [setApplications]
  );

  const updateApplication = useCallback(
    (id: string, updates: Partial<Application> & { statusNote?: string }) => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;

          const updatedApp = { ...app, ...updates };

          // Track status changes in timeline
          if (updates.status && updates.status !== app.status) {
            updatedApp.timeline = [
              ...(app.timeline || []),
              {
                id: Date.now().toString(),
                status: updates.status,
                date: new Date().toISOString(),
                notes: updates.statusNote || '',
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
    (id: string) => {
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
