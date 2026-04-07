export interface PathfindingRunPayload {
  type: 'pathfinding';
  algorithm: string;
  durationMs: number;
  nodesVisited: number;
  pathLength: number;
  pathFound: boolean;
}

export interface SortingRunPayload {
  type: 'sorting';
  algorithm: string;
  durationMs: number;
  comparisons: number;
  swaps: number;
  arraySize: number;
}

export type SaveRunPayload = PathfindingRunPayload | SortingRunPayload;

export interface Run {
  _id: string;
  type: 'pathfinding' | 'sorting';
  algorithm: string;
  durationMs: number;
  nodesVisited?: number;
  pathLength?: number;
  pathFound?: boolean;
  comparisons?: number;
  swaps?: number;
  arraySize?: number;
  createdAt: string;
}

export async function getRecentRuns(limit = 20): Promise<Run[]> {
  const res = await fetch(`/api/runs/recent?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch recent runs');
  return res.json();
}

export async function getLeaderboard(
  type: 'pathfinding' | 'sorting',
  algorithm: string,
  limit = 10
): Promise<Run[]> {
  const res = await fetch(`/api/runs/leaderboard?type=${type}&algorithm=${algorithm}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
}

export async function saveRun(payload: SaveRunPayload): Promise<void> {
  try {
    await fetch('/api/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // non-critical — silently ignore network errors
  }
}
