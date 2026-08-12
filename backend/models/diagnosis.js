const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema(
  {
    description: { type: String, default: '' },
    medication: { type: String, required: true },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

diagnosisSchema.virtual('diagnosisId').get(function () {
  return this._id.toString();
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
