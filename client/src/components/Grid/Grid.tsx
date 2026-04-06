import { useRef, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { store } from '@/app/store';
import {
  toggleWall,
  toggleWeight,
  setStartNode,
  setEndNode,
} from '@/features/pathfinding/pathfindingSlice';
import NodeCell from './NodeCell';

type DragMode =
  | 'wall-add' | 'wall-remove'
  | 'weight-add' | 'weight-remove'
  | 'move-start' | 'move-end'
  | null;

function getCellCoords(e: React.MouseEvent): { row: number; col: number } | null {
  const target = e.target as HTMLElement;
  const row = parseInt(target.dataset.row ?? '');
  const col = parseInt(target.dataset.col ?? '');
  if (isNaN(row) || isNaN(col)) return null;
  return { row, col };
}

export default function Grid() {
  const dispatch  = useAppDispatch();
  const grid      = useSelector((s: RootState) => s.pathfinding.grid);
  const isRunning = useSelector((s: RootState) => s.pathfinding.isRunning);

  const isDragging    = useRef(false);
  const dragMode      = useRef<DragMode>(null);
  const lastProcessed = useRef<string | null>(null);

  useEffect(() => {
    const release = () => {
      isDragging.current    = false;
      dragMode.current      = null;
      lastProcessed.current = null;
    };
    window.addEventListener('mouseup', release);
    return () => window.removeEventListener('mouseup', release);
  }, []);

  function handleMouseDown(e: React.MouseEvent) {
    if (isRunning) return;
    e.preventDefault();

    const cell = getCellCoords(e);
    if (!cell) return;

    const { row, col } = cell;
    const node = grid[row][col];

    isDragging.current    = true;
    lastProcessed.current = `${row}-${col}`;

    if (node.type === 'start') {
      dragMode.current = 'move-start';
      return;
    }
    if (node.type === 'end') {
      dragMode.current = 'move-end';
      return;
    }

    const { drawMode } = store.getState().pathfinding;

    if (drawMode === 'weight') {
      dragMode.current = node.type === 'weight' ? 'weight-remove' : 'weight-add';
      dispatch(toggleWeight({ row, col }));
    } else {
      dragMode.current = node.type === 'wall' ? 'wall-remove' : 'wall-add';
      dispatch(toggleWall({ row, col }));
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || isRunning) return;

    const cell = getCellCoords(e);
    if (!cell) return;

    const { row, col } = cell;
    const key = `${row}-${col}`;
    if (key === lastProcessed.current) return;
    lastProcessed.current = key;

    const mode        = dragMode.current;
    const currentType = store.getState().pathfinding.grid[row][col].type;

    const isBlank = currentType === 'empty' || currentType === 'visited' || currentType === 'path';

    if (mode === 'wall-add' && isBlank) {
      dispatch(toggleWall({ row, col }));
    } else if (mode === 'wall-remove' && currentType === 'wall') {
      dispatch(toggleWall({ row, col }));
    } else if (mode === 'weight-add' && isBlank) {
      dispatch(toggleWeight({ row, col }));
    } else if (mode === 'weight-remove' && currentType === 'weight') {
      dispatch(toggleWeight({ row, col }));
    } else if (mode === 'move-start' && currentType !== 'end' && currentType !== 'wall') {
      dispatch(setStartNode({ row, col }));
    } else if (mode === 'move-end' && currentType !== 'start' && currentType !== 'wall') {
      dispatch(setEndNode({ row, col }));
    }
  }

  return (
    <div
      className="border border-gray-800 select-none cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="flex">
          {row.map((node) => (
            <NodeCell key={`${node.row}-${node.col}`} node={node} />
          ))}
        </div>
      ))}
    </div>
  );
}
