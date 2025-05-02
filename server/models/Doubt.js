const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    postedBy: { 
      type: String, 
      required: true 
    },
    category: {
      type: String,
      enum: ['Supplementary Queries', 'Re-evaluation Doubts', 'Classrooms', 'Library Books'],
      default: 'Supplementary Queries'
    }
  },
  { timestamps: true }
);

const Doubt = mongoose.model('Doubt', doubtSchema);
module.exports = Doubt;
