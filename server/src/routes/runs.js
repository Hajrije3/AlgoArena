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

// GET /api/runs/leaderboard?type=pathfinding&algorithm=bfs&limit=10
router.get(
  '/leaderboard',
  [
    query('type').isIn(['pathfinding', 'sorting']).withMessage('type must be pathfinding or sorting'),
    query('algorithm').notEmpty().withMessage('algorithm is required'),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, algorithm, limit = 10 } = req.query;

    try {
      const sortField =
        type === 'pathfinding'
          ? { nodesVisited: 1, pathLength: 1 }
          : { comparisons: 1, swaps: 1 };

      const filter =
        type === 'pathfinding'
          ? { type, algorithm, pathFound: true, nodesVisited: { $ne: null } }
          : { type, algorithm, comparisons: { $ne: null } };

      const runs = await Run.find(filter)
        .sort(sortField)
        .limit(parseInt(limit))
        .select('-__v');

      res.json(runs);
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
