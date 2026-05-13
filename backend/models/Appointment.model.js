import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  // Patient who booked
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Assigned doctor (optional — can be assigned later)
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // Test / Disease information
  testId: {
    type: String,
    required: [true, 'Test ID is required'],
  },
  testName: {
    type: String,
    required: true,
  },
  departmentName: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    enum: ['IMAGE', 'TABULAR', 'HYBRID'],
    required: true,
  },

  // Patient's submitted data
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  uploadedFiles: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
  }],

  // AI Triage Result
  triageResult: {
    score: { type: Number, default: null },
    risk: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical', null], default: null },
    message: { type: String, default: '' },
    mlModelUsed: { type: String, default: '' },
    processedAt: Date,
  },

  // Scheduling
  scheduledDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  scheduledTime: {
    type: String,
    required: [true, 'Appointment time is required'],
  },
  collectionType: {
    type: String,
    enum: ['home', 'lab'],
    default: 'lab',
  },
  address: String,

  // Patient info (for family member bookings)
  patientFor: {
    type: String,
    enum: ['self', 'family'],
    default: 'self',
  },
  familyMember: {
    name: String,
    age: Number,
    gender: String,
    relation: String,
  },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },

  notes: String,
}, {
  timestamps: true,
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ doctor: 1, scheduledDate: 1 });
appointmentSchema.index({ scheduledDate: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
