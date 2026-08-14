import { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import ScheduleSlotGrid from "../../components/doctor-dashboard/ScheduleSlotGrid";
import { getDoctorSchedule } from "../../services/api";

export default function DoctorSchedulePage() {
  const [scheduleBlocks, setScheduleBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSchedule() {
      setLoading(true);
      setError("");

      try {
        const data = await getDoctorSchedule();
        if (!cancelled) {
          setScheduleBlocks(data.scheduleBlocks);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
          setScheduleBlocks([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSchedule();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Spinner animation="border" className="text-brand" role="status">
          <span className="visually-hidden">Loading schedule...</span>
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
      <ScheduleSlotGrid scheduleBlocks={scheduleBlocks} />
    </div>
  );
}
