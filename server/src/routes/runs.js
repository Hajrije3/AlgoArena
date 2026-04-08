const router = require('express').Router();
const { body, query, validationResult } = require('express-validator');
const Run = require('../models/Run');

// POST /api/runs
router.post(
  '/',
  [
    body('type').isIn(['pathfinding', 'sorting']).withMessage('type must be pathfinding or sorting'),
    body('algorithm').notEmpty().withMessage('algorithm is required'),
    body('durationMs').isFloat({ min: 0 }).withMessage('durationMs must be a non-negative number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type, algorithm, durationMs,
      nodesVisited, pathLength, pathFound,
      comparisons, swaps, arraySize,
    } = req.body;

    try {
      const run = await Run.create({
        type, algorithm, durationMs,
        nodesVisited: nodesVisited ?? null,
        pathLength:   pathLength   ?? null,
        pathFound:    pathFound    ?? null,
        comparisons:  comparisons  ?? null,
        swaps:        swaps        ?? null,
        arraySize:    arraySize    ?? null,
      });
      res.status(201).json(run);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/runs/recent?limit=20
router.get('/recent', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  try {
    const runs = await Run.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');
    res.json(runs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
