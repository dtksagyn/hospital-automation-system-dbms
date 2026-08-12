import { useEffect, useRef, useState } from 'react'
import './StatsBar.css'

const STATS = [
  { icon: 'bi-building', end: 20, suffix: '+', label: 'Departments' },
  { icon: 'bi-person-badge', end: 450, suffix: '+', label: 'Expert Doctors' },
  { icon: 'bi-heart-pulse', end: 95, suffix: '%', label: 'Patient Satisfaction' },
  { icon: 'bi-people', end: 2, suffix: 'k+', label: 'Patients Trust Us' },
]

function useInView() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, isInView]
}

function useCountUp(end, shouldStart, duration = 1600) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!shouldStart) return undefined

    let frameId
    let startTime

    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(eased * end))

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [end, shouldStart, duration])

  return value
}

function AnimatedStat({ icon, end, suffix, label, shouldStart }) {
  const count = useCountUp(end, shouldStart)

  return (
    <div className="col-6 col-lg-3">
      <div className="d-flex align-items-center gap-3">
        <span className="icon-badge flex-shrink-0" style={{ width: 56, height: 56 }}>
          <i className={`bi ${icon} fs-4`} aria-hidden="true" />
        </span>
        <div>
          <p className="fs-3 fw-bold text-ink mb-0 lh-1" aria-live="polite">
            {count}
            {suffix}
          </p>
          <p className="small text-ink-muted mb-0 mt-1">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function StatsBar() {
  const [sectionRef, isInView] = useInView()

  return (
    <section
      id="doctors"
      ref={sectionRef}
      className="container-xl"
    >
      <div className="card-elevated px-4 py-4 px-sm-5">
        <div className="row g-4">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} shouldStart={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
