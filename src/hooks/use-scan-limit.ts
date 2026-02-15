import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const FREE_MONTHLY_LIMIT = 10;

export const useScanLimit = () => {
  const { user, isPremium } = useAuth();
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMonthlyCount = useCallback(async () => {
    if (!user) {
      // For guests, use localStorage
      const key = `scans_${new Date().getFullYear()}_${new Date().getMonth()}`;
      setScanCount(parseInt(localStorage.getItem(key) || "0", 10));
      setLoading(false);
      return;
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("soil_scans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if (!error && count !== null) {
      setScanCount(count);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMonthlyCount();
  }, [fetchMonthlyCount]);

  const incrementCount = useCallback(() => {
    setScanCount((prev) => prev + 1);
    if (!user) {
      const key = `scans_${new Date().getFullYear()}_${new Date().getMonth()}`;
      const current = parseInt(localStorage.getItem(key) || "0", 10);
      localStorage.setItem(key, String(current + 1));
    }
  }, [user]);

  const canScan = isPremium || scanCount < FREE_MONTHLY_LIMIT;
  const remaining = Math.max(0, FREE_MONTHLY_LIMIT - scanCount);

  return { scanCount, canScan, remaining, limit: FREE_MONTHLY_LIMIT, isPremium, loading, incrementCount };
};
