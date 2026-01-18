import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface OfflineScan {
  id: string;
  session_id: string;
  scan_type: string;
  scan_category: string;
  language: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  soil_type: string | null;
  ph_level: number | null;
  nitrogen_level: string | null;
  phosphorus_level: string | null;
  potassium_level: string | null;
  organic_matter_percentage: number | null;
  moisture_percentage: number | null;
  confidence_score: number | null;
  precision_level: string | null;
  analysis_summary: string | null;
  recommendations: string[] | null;
  insights: Json | null;
  crop_type: string | null;
  plot_name: string | null;
  created_at: string;
  synced: boolean;
}

const OFFLINE_SCANS_KEY = 'datakhet_offline_scans';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingScans, setPendingScans] = useState<OfflineScan[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load pending scans from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(OFFLINE_SCANS_KEY);
    if (stored) {
      try {
        const scans = JSON.parse(stored) as OfflineScan[];
        setPendingScans(scans.filter(s => !s.synced));
      } catch (e) {
        console.error('Failed to parse offline scans:', e);
      }
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('इंटरनेट कनेक्ट हुआ', {
        description: 'ऑफलाइन स्कैन अपलोड हो रहे हैं...',
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('ऑफलाइन मोड', {
        description: 'स्कैन लोकल में सेव होंगे',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingScans.length > 0) {
      syncPendingScans();
    }
  }, [isOnline, pendingScans.length]);

  // Save scan locally
  const saveScanLocally = useCallback((scan: Omit<OfflineScan, 'id' | 'synced' | 'created_at'>) => {
    const newScan: OfflineScan = {
      ...scan,
      id: crypto.randomUUID(),
      synced: false,
      created_at: new Date().toISOString(),
    };

    const stored = localStorage.getItem(OFFLINE_SCANS_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [...existing, newScan];
    
    localStorage.setItem(OFFLINE_SCANS_KEY, JSON.stringify(updated));
    setPendingScans(prev => [...prev, newScan]);

    toast.info('ऑफलाइन सेव', {
      description: 'स्कैन लोकल में सेव हुआ',
    });

    return newScan;
  }, []);

  // Sync pending scans to Supabase
  const syncPendingScans = useCallback(async () => {
    if (isSyncing || !isOnline || pendingScans.length === 0) return;

    setIsSyncing(true);
    const stored = localStorage.getItem(OFFLINE_SCANS_KEY);
    const allScans: OfflineScan[] = stored ? JSON.parse(stored) : [];
    const unsynced = allScans.filter(s => !s.synced);

    let syncedCount = 0;

    for (const scan of unsynced) {
      try {
        const scanData = {
          session_id: scan.session_id,
          scan_type: scan.scan_type,
          scan_category: scan.scan_category,
          language: scan.language,
          latitude: scan.latitude,
          longitude: scan.longitude,
          image_url: scan.image_url,
          soil_type: scan.soil_type,
          ph_level: scan.ph_level,
          nitrogen_level: scan.nitrogen_level,
          phosphorus_level: scan.phosphorus_level,
          potassium_level: scan.potassium_level,
          organic_matter_percentage: scan.organic_matter_percentage,
          moisture_percentage: scan.moisture_percentage,
          confidence_score: scan.confidence_score,
          precision_level: scan.precision_level,
          analysis_summary: scan.analysis_summary,
          recommendations: scan.recommendations,
          insights: scan.insights,
          crop_type: scan.crop_type,
          plot_name: scan.plot_name,
        };
        const { error } = await supabase.from('soil_scans').insert([scanData]);

        if (!error) {
          scan.synced = true;
          syncedCount++;
        }
      } catch (e) {
        console.error('Failed to sync scan:', e);
      }
    }

    // Update localStorage
    localStorage.setItem(OFFLINE_SCANS_KEY, JSON.stringify(allScans));
    setPendingScans(allScans.filter(s => !s.synced));

    if (syncedCount > 0) {
      toast.success(`${syncedCount} स्कैन अपलोड हुए`, {
        description: 'ऑफलाइन डेटा सिंक हो गया',
      });
    }

    setIsSyncing(false);
  }, [isSyncing, isOnline, pendingScans]);

  // Get all local scans (synced + unsynced)
  const getLocalScans = useCallback(() => {
    const stored = localStorage.getItem(OFFLINE_SCANS_KEY);
    return stored ? JSON.parse(stored) as OfflineScan[] : [];
  }, []);

  // Clear synced scans from localStorage
  const clearSyncedScans = useCallback(() => {
    const stored = localStorage.getItem(OFFLINE_SCANS_KEY);
    if (stored) {
      const scans = JSON.parse(stored) as OfflineScan[];
      const unsynced = scans.filter(s => !s.synced);
      localStorage.setItem(OFFLINE_SCANS_KEY, JSON.stringify(unsynced));
    }
  }, []);

  return {
    isOnline,
    pendingScans,
    isSyncing,
    pendingScanCount: pendingScans.length,
    saveScanLocally,
    syncPendingScans,
    getLocalScans,
    clearSyncedScans,
  };
};
