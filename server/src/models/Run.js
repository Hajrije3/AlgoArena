const mongoose = require('mongoose');

const runSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['pathfinding', 'sorting'],
      required: true,
    },
    algorithm: {
      type: String,
      required: true,
    },
    // Pathfinding stats
    nodesVisited: { type: Number, default: null },
    pathLength:   { type: Number, default: null },
    pathFound:    { type: Boolean, default: null },
    // Sorting stats
    comparisons: { type: Number, default: null },
    swaps:       { type: Number, default: null },
    arraySize:   { type: Number, default: null },
    // Common
    durationMs: { type: Number, required: true },
  },
  { timestamps: true }
);

runSchema.index({ type: 1, algorithm: 1 });

module.exports = mongoose.model('Run', runSchema);
