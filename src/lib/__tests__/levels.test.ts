import { describe, it, expect } from 'vitest';
import { LEVELS } from '../levels.js';
import { move, parseLevel } from '../engine.js';

function applyMoves(levelIndex: number, moves: string): boolean {
  let state = parseLevel(LEVELS[levelIndex], levelIndex);
  const directionMap = {
    U: 'up',
    D: 'down',
    L: 'left',
    R: 'right',
  } as const;

  for (const step of moves) {
    state = move(state, directionMap[step as keyof typeof directionMap]);
  }

  return state.solved;
}

describe('LEVELS', () => {
  it('includes additional advanced levels', () => {
    expect(LEVELS.length).toBeGreaterThanOrEqual(10);
  });

  it('includes at least one level with five or more boxes', () => {
    const maxBoxes = Math.max(
      ...LEVELS.map(level => level.map.join('').split('').filter(ch => ch === '$' || ch === '*').length),
    );
    expect(maxBoxes).toBeGreaterThanOrEqual(5);
  });

  it('has a solvable Level 6', () => {
    expect(applyMoves(5, 'UDDDLLUURLUURRDDRRUUL')).toBe(true);
  });

  it('has a solvable Level 8', () => {
    expect(applyMoves(7, 'UULLDDRLUURRDDDUUURRDDLRDDLLUUUDLLDDR')).toBe(true);
  });
});
