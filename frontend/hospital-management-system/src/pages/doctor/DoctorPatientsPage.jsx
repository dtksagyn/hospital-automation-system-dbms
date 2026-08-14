import { useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { getDoctorPatients } from "../../services/api";

export default function DoctorPatientsPage() {
  const { searchQuery } = useOutletContext();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPatients() {
      setLoading(true);
      setError("");

      try {
        const data = await getDoctorPatients(searchQuery);
        if (!cancelled) {
          setPatients(data.patients);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
          setPatients([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPatients();

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <Spinner animation="border" className="text-brand" role="status">
          <span className="visually-hidden">Loading patients...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <section className="card-elevated p-4">
      <h2 className="h5 fw-bold text-ink mb-3">Patients</h2>

      {error && (
        <Alert variant="danger" className="py-2 small">
          {error}
        </Alert>
      )}

      {patients.length === 0 ? (
        <p className="text-ink-muted mb-0">No patients found.</p>
      ) : (
        <div className="dashboard-mobile-list">
          {patients.map((patient) => (
            <article key={patient.id} className="dashboard-mobile-item">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={patient.avatar}
                  alt=""
                  className="doctor-appointment-row__avatar"
                />
                <div>
                  <p className="fw-semibold text-ink mb-1">{patient.patientName}</p>
                  <p className="small text-ink-muted mb-0">
                    {patient.age ? `Age ${patient.age}` : "Age not provided"}
                    {patient.phone ? ` · ${patient.phone}` : ""}
                  </p>
                  <p className="small text-ink-muted mb-0">Last visit: {patient.lastVisit}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
