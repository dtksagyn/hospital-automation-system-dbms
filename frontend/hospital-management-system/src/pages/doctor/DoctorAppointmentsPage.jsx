import { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import AppointmentTable from "../../components/doctor-dashboard/AppointmentTable";
import { getDoctorAppointments } from "../../services/api";

export default function DoctorAppointmentsPage() {
  const { searchQuery } = useOutletContext();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAppointments() {
      setLoading(true);
      setError("");

      try {
        const data = await getDoctorAppointments({ search: searchQuery });
        if (!cancelled) {
          setAppointments(data.appointments);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
          setAppointments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Spinner animation="border" className="text-brand" role="status">
          <span className="visually-hidden">Loading appointments...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      {error && (
        <Alert variant="danger" className="py-2 small mb-0">
          {error}
        </Alert>
      )}
      <AppointmentTable appointments={appointments} />
    </div>
  );
}
