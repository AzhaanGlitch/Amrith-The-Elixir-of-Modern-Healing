import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  // References
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // Report details
  testId: {
    type: String,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  departmentName: String,

  // AI Analysis Results
  aiAnalysis: {
    prediction: String,
    confidence: Number,
    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
    },
    details: mongoose.Schema.Types.Mixed,
    modelVersion: String,
    processedAt: Date,
  },

  // Doctor's review
  doctorReview: {
    reviewed: { type: Boolean, default: false },
    reviewedAt: Date,
    diagnosis: String,
    recommendations: String,
    prescription: String,
    followUpDate: Date,
    severity: {
      type: String,
      enum: ['normal', 'mild', 'moderate', 'severe', 'critical', ''],
      default: '',
    },
  },

  // Files
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    type: String,
  }],

  status: {
    type: String,
    enum: ['processing', 'ai-complete', 'doctor-reviewed', 'finalized'],
    default: 'processing',
  },
}, {
  timestamps: true,
});

reportSchema.index({ patient: 1, createdAt: -1 });
reportSchema.index({ doctor: 1, status: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
