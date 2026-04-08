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

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function saveRun(payload: SaveRunPayload): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // non-critical — silently ignore network errors
  }
}
