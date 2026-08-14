import { getDoctorStatusClass } from "../../data/doctorDashboardData";

const LEGEND = [
  { label: "Available", className: "doctor-slot doctor-slot--available" },
  { label: "Booked", className: "doctor-slot doctor-slot--booked" },
  { label: "Completed", className: "doctor-slot doctor-slot--completed" },
  { label: "Cancelled", className: "doctor-slot doctor-slot--cancelled" },
  { label: "Break", className: "doctor-slot doctor-slot--break" },
];

export default function ScheduleSlotGrid({ scheduleBlocks = [] }) {
  return (
    <section className="card-elevated p-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h3 className="h5 fw-bold text-ink mb-1">Today&apos;s Schedule</h3>
          <p className="small text-ink-muted mb-0">Your availability at a glance</p>
        </div>
      </div>

      <div className="doctor-schedule-legend">
        {LEGEND.map((item) => (
          <span key={item.label} className="doctor-schedule-legend__item">
            <span className={item.className}>{item.label}</span>
          </span>
        ))}
      </div>

      {scheduleBlocks.length === 0 ? (
        <p className="text-ink-muted mb-0">No schedule blocks available for today.</p>
      ) : (
        scheduleBlocks.map((block) => (
          <div key={block.id} className="doctor-schedule-block">
            <div className="doctor-schedule-block__header">{block.label}</div>
            <div className="doctor-schedule-block__slots">
              {block.slots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  className={`${getDoctorStatusClass(slot.status)} text-nowrap`}
                  title={slot.patientName || slot.status}
                >
                  {slot.patientName ? slot.patientName.split(" ")[0] : slot.time}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
