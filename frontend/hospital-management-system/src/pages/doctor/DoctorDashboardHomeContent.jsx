import { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useLocation, useOutletContext } from "react-router-dom";
import AppointmentTable from "../../components/doctor-dashboard/AppointmentTable";
import { RecentActivity } from "../../components/doctor-dashboard/ActivityItem";
import DoctorWelcomeSection from "../../components/doctor-dashboard/DoctorWelcomeSection";
import { UpcomingPatients } from "../../components/doctor-dashboard/PatientCard";
import { DoctorQuickActions } from "../../components/doctor-dashboard/QuickAction";
import ScheduleSlotGrid from "../../components/doctor-dashboard/ScheduleSlotGrid";
import StatCard from "../../components/doctor-dashboard/StatCard";
import { DOCTOR_STAT_CONFIG } from "../../data/doctorDashboardData";
import { useDoctorDashboardSummary } from "../../hooks/useDoctorDashboardSummary";

export default function DoctorDashboardHomeContent() {
  const { searchQuery, scheduleRef, onViewSchedule } = useOutletContext();
  const location = useLocation();
  const { data, loading, error, refresh } = useDoctorDashboardSummary(searchQuery);

  useEffect(() => {
    if (location.state?.scrollToSchedule) {
      scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.state, scheduleRef]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Spinner animation="border" className="text-brand" role="status">
          <span className="visually-hidden">Loading doctor dashboard...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {error && (
        <Alert variant="danger" className="py-2 small mb-0">
          {error}
        </Alert>
      )}

      <DoctorWelcomeSection onViewSchedule={onViewSchedule} />

      <div className="row g-3">
        {DOCTOR_STAT_CONFIG.map((stat) => (
          <div key={stat.key} className="col-6 col-xl-3">
            <StatCard
              icon={stat.icon}
              label={stat.label}
              value={data.stats[stat.key] ?? 0}
            />
          </div>
        ))}
      </div>

      <div className="doctor-dashboard-layout">
        <div className="doctor-dashboard-main-column">
          <AppointmentTable
            appointments={data.todayAppointments}
            onStatusChange={refresh}
          />
          <DoctorQuickActions />
          <RecentActivity activities={data.recentActivity} />
        </div>

        <div className="doctor-dashboard-side-column">
          <div ref={scheduleRef}>
            <ScheduleSlotGrid scheduleBlocks={data.scheduleBlocks} />
          </div>
          <UpcomingPatients patients={data.upcomingPatients} />
        </div>
      </div>
    </div>
  );
}
