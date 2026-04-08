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
