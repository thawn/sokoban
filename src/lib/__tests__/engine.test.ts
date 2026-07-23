import { describe, it, expect } from 'vitest';
import { parseLevel, move } from '../engine.js';
import type { Level } from '../types.js';

const simpleLevel: Level = {
  title: 'Test',
  map: [
    '#####',
    '#@$.#',
    '#####',
  ],
};

// Level with player on target
const playerOnTargetLevel: Level = {
  title: 'Test Player On Target',
  map: [
    '#####',
    '#+ $#',
    '# . #',
    '#####',
  ],
};

// Level with box already on target
const almostSolvedLevel: Level = {
  title: 'Almost Solved',
  map: [
    '#####',
    '#@*$#',
    '#  .#',
    '#####',
  ],
};

describe('parseLevel', () => {
  it('creates a board with correct dimensions', () => {
    const state = parseLevel(simpleLevel, 0);
    expect(state.board.length).toBe(3);
    expect(state.board[0].length).toBe(5);
  });

  it('locates the player correctly', () => {
    const state = parseLevel(simpleLevel, 0);
    expect(state.playerPos).toEqual({ row: 1, col: 1 });
  });

  it('parses walls, boxes and targets', () => {
    const state = parseLevel(simpleLevel, 0);
    expect(state.board[0][0]).toBe('wall');
    expect(state.board[1][1]).toBe('player');
    expect(state.board[1][2]).toBe('box');
    expect(state.board[1][3]).toBe('target');
    expect(state.board[1][4]).toBe('wall');
  });

  it('starts with zero moves and pushes', () => {
    const state = parseLevel(simpleLevel, 0);
    expect(state.moves).toBe(0);
    expect(state.pushes).toBe(0);
    expect(state.solved).toBe(false);
  });

  it('handles player-on-target cell', () => {
    const state = parseLevel(playerOnTargetLevel, 0);
    expect(state.board[1][1]).toBe('player-on-target');
    expect(state.playerPos).toEqual({ row: 1, col: 1 });
  });

  it('handles box-on-target cell', () => {
    const state = parseLevel(almostSolvedLevel, 0);
    expect(state.board[1][2]).toBe('box-on-target');
  });

  it('stores the level index', () => {
    const state = parseLevel(simpleLevel, 3);
    expect(state.level).toBe(3);
  });
});

describe('move', () => {
  it('moves the player into an empty floor cell', () => {
    const state = parseLevel(simpleLevel, 0);
    const next = move(state, 'right'); // move right into box — actually pushes box
    // Box is at (1,2), target at (1,3). Player moves right and pushes box onto target.
    expect(next.playerPos).toEqual({ row: 1, col: 2 });
    expect(next.board[1][2]).toBe('player');
    expect(next.board[1][3]).toBe('box-on-target');
    expect(next.moves).toBe(1);
    expect(next.pushes).toBe(1);
  });

  it('marks level solved when all boxes are on targets', () => {
    const state = parseLevel(simpleLevel, 0);
    const next = move(state, 'right');
    expect(next.solved).toBe(true);
  });

  it('does not move into walls', () => {
    const state = parseLevel(simpleLevel, 0);
    const next = move(state, 'up');
    expect(next.playerPos).toEqual(state.playerPos);
    expect(next.moves).toBe(0);
  });

  it('does not move if box cannot be pushed', () => {
    // Box at (1,2), wall at (1,4). Pushing right would put box into wall.
    const blockedLevel: Level = {
      title: 'Blocked',
      map: [
        '#####',
        '#@$##',
        '#####',
      ],
    };
    const state = parseLevel(blockedLevel, 0);
    const next = move(state, 'right');
    expect(next.playerPos).toEqual(state.playerPos);
  });

  it('does not let two boxes be pushed simultaneously', () => {
    const twoBoxLevel: Level = {
      title: 'Two Boxes',
      map: [
        '#####',
        '#@$$#',
        '#   #',
        '#####',
      ],
    };
    const state = parseLevel(twoBoxLevel, 0);
    const next = move(state, 'right');
    // Can't push because second box is blocked by another box
    expect(next.playerPos).toEqual(state.playerPos);
  });

  it('increments moves but not pushes for a normal move', () => {
    const spaceLevel: Level = {
      title: 'Space',
      map: [
        '#####',
        '# @ #',
        '# . #',
        '#####',
      ],
    };
    const state = parseLevel(spaceLevel, 0);
    const next = move(state, 'down');
    expect(next.moves).toBe(1);
    expect(next.pushes).toBe(0);
  });

  it('restores target cell when player leaves it', () => {
    const state = parseLevel(playerOnTargetLevel, 0);
    // Player is on target at (1,1). Move right → floor cell.
    const next = move(state, 'right');
    expect(next.board[1][1]).toBe('target');
    expect(next.playerPos).toEqual({ row: 1, col: 2 });
  });

  it('restores target cell when box is pushed off a target', () => {
    // box-on-target at (1,2), floor to the right at (1,3)
    const pushOffTarget: Level = {
      title: 'Push Off Target',
      map: [
        '#####',
        '#@* #',
        '#   #',
        '#####',
      ],
    };
    const state = parseLevel(pushOffTarget, 0);
    const next = move(state, 'right'); // push box off target
    // Player arrives on the vacated target → player-on-target
    expect(next.board[1][2]).toBe('player-on-target');
    expect(next.board[1][3]).toBe('box');
    // The previous player position reverts to floor
    expect(next.board[1][1]).toBe('floor');
  });

  it('does nothing after the level is solved', () => {
    const state = parseLevel(simpleLevel, 0);
    const solved = move(state, 'right'); // solve it
    expect(solved.solved).toBe(true);
    const after = move(solved, 'left');
    expect(after).toBe(solved); // same object returned
  });
});
