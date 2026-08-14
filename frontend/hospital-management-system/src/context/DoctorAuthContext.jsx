import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentDoctor,
  loginDoctor,
  logoutDoctor,
} from "../services/api";

const DoctorAuthContext = createContext(null);

export function DoctorAuthProvider({ children }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshDoctor = useCallback(async () => {
    try {
      const data = await getCurrentDoctor();
      setDoctor(data.doctor);
      return data.doctor;
    } catch {
      setDoctor(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDoctor();
  }, [refreshDoctor]);

  const login = useCallback(async (payload) => {
    await loginDoctor(payload);
    const authenticatedDoctor = await refreshDoctor();

    if (!authenticatedDoctor) {
      throw new Error(
        "Login succeeded but session could not be established. Please try again.",
      );
    }

    return authenticatedDoctor;
  }, [refreshDoctor]);

  const logout = useCallback(async () => {
    try {
      await logoutDoctor();
    } finally {
      setDoctor(null);
      setLoading(false);
    }
  }, []);

  const authStatus = loading
    ? "loading"
    : doctor
      ? "authenticated"
      : "unauthenticated";

  const value = useMemo(
    () => ({
      doctor,
      loading,
      authStatus,
      isAuthenticated: authStatus === "authenticated",
      setDoctor,
      refreshDoctor,
      login,
      logout,
    }),
    [doctor, loading, authStatus, refreshDoctor, login, logout],
  );

  return (
    <DoctorAuthContext.Provider value={value}>{children}</DoctorAuthContext.Provider>
  );
}

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);

  if (!context) {
    throw new Error("useDoctorAuth must be used within a DoctorAuthProvider");
  }

  return context;
}
