/**
 * Data Service - Handles data export, import, versioning, and migrations
 */

const CURRENT_DATA_VERSION = 1;
const DATA_VERSION_KEY = 'app_data_version';
const FIRST_LAUNCH_KEY = 'app_first_launch_shown';

// All localStorage keys used by the app
const DATA_KEYS = [
  'app_resumes',
  'app_jobs',
  'app_applications',
  'app_user_profile',
  'app_analytics',
  'app_gamification',
];

/**
 * Export all user data as a JSON object
 */
export const exportAllData = () => {
  const exportData = {
    version: CURRENT_DATA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {},
  };

  DATA_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        exportData.data[key] = JSON.parse(value);
      } catch {
        exportData.data[key] = value;
      }
    }
  });

  return exportData;
};

/**
 * Download data as a JSON file
 */
export const downloadDataAsFile = () => {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `recluta-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
};

/**
 * Validate import data structure
 */
export const validateImportData = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    errors.push('Invalid file format: not a valid JSON object');
    return { valid: false, errors };
  }

  if (!data.version) {
    errors.push('Missing data version');
  }

  if (!data.data || typeof data.data !== 'object') {
    errors.push('Missing or invalid data section');
    return { valid: false, errors };
  }

  // Check for at least some recognized data
  const hasRecognizedData = DATA_KEYS.some((key) => key in data.data);
  if (!hasRecognizedData) {
    errors.push('No recognized data found in file');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: data.version !== CURRENT_DATA_VERSION
      ? [`Data version mismatch: file is v${data.version}, current is v${CURRENT_DATA_VERSION}`]
      : [],
  };
};

/**
 * Import data from a JSON object
 * @param {Object} importData - The data to import
 * @param {boolean} merge - If true, merge with existing data; if false, replace
 */
export const importData = (importData, merge = false) => {
  const validation = validateImportData(importData);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  // Migrate data if needed
  const migratedData = migrateData(importData);

  // Import each data key
  Object.entries(migratedData.data).forEach(([key, value]) => {
    if (DATA_KEYS.includes(key)) {
      if (merge && Array.isArray(value)) {
        // Merge arrays by combining and deduplicating by id
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const merged = [...existing];

        value.forEach((item) => {
          const existingIndex = merged.findIndex((e) => e.id === item.id);
          if (existingIndex === -1) {
            merged.push(item);
          }
        });

        localStorage.setItem(key, JSON.stringify(merged));
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  });

  // Update data version
  localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));

  return {
    success: true,
    warnings: validation.warnings,
    imported: Object.keys(migratedData.data).filter((k) => DATA_KEYS.includes(k)),
  };
};

/**
 * Read and parse a JSON file
 */
export const readJsonFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Migrate data from older versions to current version
 */
export const migrateData = (data) => {
  let migratedData = { ...data };
  let currentVersion = data.version || 0;

  // Migration v0 -> v1: Add isQuickProfile flag to resumes
  if (currentVersion < 1) {
    if (migratedData.data.app_resumes) {
      migratedData.data.app_resumes = migratedData.data.app_resumes.map((resume) => ({
        ...resume,
        isQuickProfile: resume.isQuickProfile || false,
      }));
    }
    currentVersion = 1;
  }

  // Add future migrations here as needed
  // if (currentVersion < 2) { ... }

  migratedData.version = currentVersion;
  return migratedData;
};

/**
 * Check and update data version, running migrations if needed
 */
export const checkAndMigrateLocalData = () => {
  const storedVersion = parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0', 10);

  if (storedVersion < CURRENT_DATA_VERSION) {
    // Build a pseudo-import object from current localStorage
    const currentData = {
      version: storedVersion,
      data: {},
    };

    DATA_KEYS.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          currentData.data[key] = JSON.parse(value);
        } catch {
          currentData.data[key] = value;
        }
      }
    });

    // Run migrations
    const migratedData = migrateData(currentData);

    // Save migrated data back
    Object.entries(migratedData.data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    // Update version
    localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));

    return {
      migrated: true,
      fromVersion: storedVersion,
      toVersion: CURRENT_DATA_VERSION,
    };
  }

  return { migrated: false };
};

/**
 * Check if this is the first launch (first-launch warning not shown)
 */
export const isFirstLaunch = () => {
  return !localStorage.getItem(FIRST_LAUNCH_KEY);
};

/**
 * Mark first launch warning as shown
 */
export const markFirstLaunchShown = () => {
  localStorage.setItem(FIRST_LAUNCH_KEY, 'true');
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = () => {
  let totalSize = 0;
  const breakdown = {};

  DATA_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      const size = new Blob([value]).size;
      breakdown[key] = size;
      totalSize += size;
    }
  });

  return {
    totalBytes: totalSize,
    totalKB: (totalSize / 1024).toFixed(2),
    totalMB: (totalSize / (1024 * 1024)).toFixed(4),
    breakdown,
    itemCounts: {
      resumes: JSON.parse(localStorage.getItem('app_resumes') || '[]').length,
      jobs: JSON.parse(localStorage.getItem('app_jobs') || '[]').length,
      applications: JSON.parse(localStorage.getItem('app_applications') || '[]').length,
    },
  };
};

/**
 * Clear all app data (with confirmation)
 */
export const clearAllData = () => {
  DATA_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem(DATA_VERSION_KEY);
  // Keep first launch flag so warning doesn't show again
};

export default {
  exportAllData,
  downloadDataAsFile,
  importData,
  readJsonFile,
  validateImportData,
  checkAndMigrateLocalData,
  isFirstLaunch,
  markFirstLaunchShown,
  getStorageStats,
  clearAllData,
};
