// Centralized storage management with cloud sync simulation

export const STORAGE_KEYS = {
  PATIENTS: 'patients',
  MEDICAL_RECORDS: 'medicalRecords',
  USER_ROLE: 'userRole',
  IS_AUTHENTICATED: 'isAuthenticated',
  SYNC_STATUS: 'syncStatus',
  LAST_SYNC: 'lastSync'
};

export interface SyncStatus {
  status: 'synced' | 'syncing' | 'pending' | 'error';
  lastSync: string | null;
  pendingChanges: number;
}

// Simulate cloud sync
export const syncToCloud = async (): Promise<void> => {
  const syncStatus: SyncStatus = {
    status: 'syncing',
    lastSync: null,
    pendingChanges: 0
  };

  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(syncStatus));

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const completedSync: SyncStatus = {
    status: 'synced',
    lastSync: new Date().toISOString(),
    pendingChanges: 0
  };

  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(completedSync));
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
};

export const getSyncStatus = (): SyncStatus => {
  const stored = localStorage.getItem(STORAGE_KEYS.SYNC_STATUS);
  if (!stored) {
    return {
      status: 'synced',
      lastSync: localStorage.getItem(STORAGE_KEYS.LAST_SYNC),
      pendingChanges: 0
    };
  }
  return JSON.parse(stored);
};

export const markForSync = (): void => {
  const current = getSyncStatus();
  const updated: SyncStatus = {
    ...current,
    status: 'pending',
    pendingChanges: current.pendingChanges + 1
  };
  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(updated));
};

// Auto-sync on data changes
export const saveAndSync = async (key: string, data: any): Promise<void> => {
  localStorage.setItem(key, JSON.stringify(data));
  markForSync();

  // Auto-sync after a short delay
  setTimeout(() => {
    syncToCloud();
  }, 1000);
};
