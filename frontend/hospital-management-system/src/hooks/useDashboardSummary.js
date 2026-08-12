import { useCallback, useEffect, useState } from "react";
import { getDashboardSummary } from "../services/api";

const EMPTY_SUMMARY = {
  stats: {
    upcomingAppointments: 0,
    completedVisits: 0,
    prescriptions: 0,
    medicalRecords: 0,
  },
  upcomingAppointment: null,
  recentAppointments: [],
};

export function useDashboardSummary() {
  const [data, setData] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");

    try {
      const summary = await getDashboardSummary();
      setData(summary);
    } catch (loadError) {
      setError(loadError.message);
      setData(EMPTY_SUMMARY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
