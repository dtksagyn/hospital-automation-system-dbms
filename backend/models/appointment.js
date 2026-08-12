const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    ssn: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    phone: { type: String, trim: true },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });
appointmentSchema.index({ date: 1 });

appointmentSchema.virtual('appointmentId').get(function () {
  return this._id.toString();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
