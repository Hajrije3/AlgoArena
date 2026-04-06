import React from 'react';
import type { GridNode, NodeType } from '@/features/pathfinding/types';

const TYPE_CLASS: Record<NodeType, string> = {
  empty:   'bg-gray-900',
  wall:    'bg-gray-500 node-wall',
  weight:  'bg-amber-500 node-wall',
  start:   'bg-emerald-400',
  end:     'bg-rose-400',
  visited: 'bg-violet-600 node-visited',
  path:    'bg-yellow-300 node-path',
};

interface Props {
  node: GridNode;
}

const NodeCell = React.memo(
  ({ node }: Props) => (
    <div
      data-row={node.row}
      data-col={node.col}
      className={`w-5 h-5 border border-gray-800/50 ${TYPE_CLASS[node.type]}`}
    />
  ),
  (prev, next) => prev.node.type === next.node.type,
);

NodeCell.displayName = 'NodeCell';
export default NodeCell;
