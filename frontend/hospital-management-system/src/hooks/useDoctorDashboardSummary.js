import { useCallback, useEffect, useState } from "react";
import { getDoctorDashboardSummary } from "../services/api";

const EMPTY_DATA = {
  stats: {
    todayAppointments: 0,
    waitingPatients: 0,
    completedVisits: 0,
    upcomingAppointments: 0,
  },
  todayAppointments: [],
  scheduleBlocks: [],
  upcomingPatients: [],
  recentActivity: [],
};

export function useDoctorDashboardSummary(search = "") {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const summary = await getDoctorDashboardSummary(search);
      setData(summary);
    } catch (loadError) {
      setError(loadError.message);
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

export { EMPTY_DATA };
