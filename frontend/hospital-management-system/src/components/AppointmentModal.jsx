import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap'
import {
  createAppointment,
  getAvailableSlots,
  getDepartments,
  getDoctorsByDepartment,
} from '../services/api'
import { filterNameInput, filterPhoneInput } from '../utils/inputConstraints'
import './AppointmentModal.css'

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  departmentId: '',
  doctorId: '',
  date: '',
  time: '',
}

export default function AppointmentModal({ show, onHide }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookingResult, setBookingResult] = useState(null)
  const [error, setError] = useState('')
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsMessage, setSlotsMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!show) return undefined

    let cancelled = false

    async function loadDepartments() {
      setLoadingDepartments(true)
      setError('')

      try {
        const data = await getDepartments()
        if (!cancelled) {
          setDepartments(data)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoadingDepartments(false)
        }
      }
    }

    loadDepartments()

    return () => {
      cancelled = true
    }
  }, [show])

  useEffect(() => {
    if (!form.departmentId) {
      setDoctors([])
      return undefined
    }

    let cancelled = false

    async function loadDoctors() {
      setLoadingDoctors(true)
      setError('')

      try {
        const data = await getDoctorsByDepartment(form.departmentId)
        if (!cancelled) {
          setDoctors(data)
        }
      } catch (loadError) {
        if (!cancelled) {
          setDoctors([])
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoadingDoctors(false)
        }
      }
    }

    loadDoctors()

    return () => {
      cancelled = true
    }
  }, [form.departmentId])

  useEffect(() => {
    if (!form.doctorId || !form.date) {
      setAvailableSlots([])
      setSlotsMessage('')
      setLoadingSlots(false)
      return undefined
    }

    let cancelled = false

    async function loadSlots() {
      setLoadingSlots(true)
      setSlotsMessage('')
      setError('')

      try {
        const data = await getAvailableSlots(form.doctorId, form.date)
        if (cancelled) return

        setAvailableSlots(data.slots)

        if (data.slots.length === 0) {
          setSlotsMessage('No available slots for this date — try another date.')
        }
      } catch (loadError) {
        if (!cancelled) {
          setAvailableSlots([])
          setSlotsMessage('')
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false)
        }
      }
    }

    loadSlots()

    return () => {
      cancelled = true
    }
  }, [form.doctorId, form.date])

  const handleChange = (event) => {
    const { name } = event.target
    let { value } = event.target

    if (name === 'fullName') {
      value = filterNameInput(value)
    }

    if (name === 'phone') {
      value = filterPhoneInput(value)
    }

    if (name === 'departmentId') {
      setForm((current) => ({
        ...current,
        departmentId: value,
        doctorId: '',
        date: '',
        time: '',
      }))
      setAvailableSlots([])
      setSlotsMessage('')
      return
    }

    if (name === 'doctorId') {
      setForm((current) => ({
        ...current,
        doctorId: value,
        date: '',
        time: '',
      }))
      setAvailableSlots([])
      setSlotsMessage('')
      return
    }

    if (name === 'date') {
      setForm((current) => ({
        ...current,
        date: value,
        time: '',
      }))
      return
    }

    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleClose = () => {
    setForm(INITIAL_FORM)
    setDoctors([])
    setAvailableSlots([])
    setBookingResult(null)
    setError('')
    setSlotsMessage('')
    onHide()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.departmentId ||
      !form.doctorId ||
      !form.date ||
      !form.time
    ) {
      setError('Please fill in all fields before submitting.')
      return
    }

    setSubmitting(true)

    try {
      const data = await createAppointment(form)
      setBookingResult(data.appointment)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const timeSelectDisabled =
    submitting || !form.doctorId || !form.date || loadingSlots || availableSlots.length === 0

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      scrollable
      fullscreen="sm-down"
      className="appointment-modal"
      contentClassName="appointment-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-ink">Book an Appointment</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {bookingResult ? (
          <div className="d-flex flex-column gap-3">
            <Alert variant="success" className="mb-0">
              Thank you, {bookingResult.firstName}. Your appointment has been booked successfully.
            </Alert>

            <div className="card-elevated p-3">
              <p className="small text-ink-muted mb-2">Appointment details</p>
              <p className="mb-1">
                <strong>Doctor:</strong> {bookingResult.doctorName}
              </p>
              <p className="mb-1">
                <strong>Department:</strong> {bookingResult.departmentName}
              </p>
              <p className="mb-1">
                <strong>Date:</strong> {bookingResult.date}
              </p>
              <p className="mb-1">
                <strong>Time:</strong> {bookingResult.time}
              </p>
              <p className="mb-0">
                <strong>Phone:</strong> {bookingResult.phone}
              </p>
            </div>

            {bookingResult.qrcode && (
              <div className="text-center">
                <img
                  src={bookingResult.qrcode}
                  alt="Appointment QR code"
                  className="appointment-modal__qr"
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="text-ink-muted small mb-4">
              Schedule your visit with one of our specialists. We will confirm your appointment
              shortly.
            </p>

            {error && (
              <Alert variant="danger" className="py-2 small">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <Form.Group controlId="fullName">
                <Form.Label className="small fw-semibold text-ink">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  inputMode="text"
                  autoComplete="name"
                  required
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.Label className="small fw-semibold text-ink">Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group controlId="departmentId">
                <Form.Label className="small fw-semibold text-ink">Department</Form.Label>
                <Form.Select
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                  required
                  disabled={submitting || loadingDepartments}
                >
                  <option value="">
                    {loadingDepartments ? 'Loading departments...' : 'Select department'}
                  </option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.departmentName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="doctorId">
                <Form.Label className="small fw-semibold text-ink">Doctor</Form.Label>
                <Form.Select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  required
                  disabled={submitting || !form.departmentId || loadingDoctors}
                >
                  <option value="">
                    {!form.departmentId
                      ? 'Select a department first'
                      : loadingDoctors
                        ? 'Loading doctors...'
                        : doctors.length === 0
                          ? 'No doctors available'
                          : 'Select doctor'}
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="date">
                <Form.Label className="small fw-semibold text-ink">Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 10)}
                  required
                  disabled={submitting || !form.doctorId}
                />
              </Form.Group>

              <Form.Group controlId="time">
                <Form.Label className="small fw-semibold text-ink d-flex align-items-center gap-2">
                  Time
                  {loadingSlots && (
                    <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                  )}
                </Form.Label>
                <Form.Select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  disabled={timeSelectDisabled}
                >
                  <option value="">
                    {!form.doctorId || !form.date
                      ? 'Select doctor and date first'
                      : loadingSlots
                        ? 'Loading available slots...'
                        : availableSlots.length === 0
                          ? 'No available slots'
                          : 'Select a time'}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Form.Select>
                {slotsMessage && (
                  <Form.Text className="text-ink-muted">{slotsMessage}</Form.Text>
                )}
              </Form.Group>

              <Button
                type="submit"
                className="btn-brand rounded-3 py-2 mt-1 d-inline-flex align-items-center justify-content-center gap-2"
                disabled={submitting || loadingDepartments || loadingDoctors || loadingSlots}
              >
                {submitting && <Spinner animation="border" size="sm" />}
                {submitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </Form>
          </>
        )}
      </Modal.Body>

      {bookingResult && (
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  )
}
