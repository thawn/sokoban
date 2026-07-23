import { CELL, type CellKind, type CellValue, type Direction, type GameState, type Level, type Position } from './types.js';

/** Parse a raw level map into a 2-D board of CellKind values and locate the player. */
export function parseLevel(level: Level, levelIndex: number): GameState {
  // Determine board dimensions
  const rows = level.map.length;
  const cols = level.map.reduce((max, row) => Math.max(max, row.length), 0);

  let playerPos: Position = { row: 0, col: 0 };
  const board: CellKind[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: CellKind[] = [];
    for (let c = 0; c < cols; c++) {
      const ch = (level.map[r][c] ?? ' ') as CellValue;
      const kind = cellValueToKind(ch);
      if (kind === 'player' || kind === 'player-on-target') {
        playerPos = { row: r, col: c };
      }
      row.push(kind);
    }
    board.push(row);
  }

  return {
    board,
    playerPos,
    moves: 0,
    pushes: 0,
    solved: false,
    level: levelIndex,
  };
}

function cellValueToKind(ch: CellValue): CellKind {
  switch (ch) {
    case CELL.WALL: return 'wall';
    case CELL.TARGET: return 'target';
    case CELL.BOX: return 'box';
    case CELL.BOX_ON_TARGET: return 'box-on-target';
    case CELL.PLAYER: return 'player';
    case CELL.PLAYER_ON_TARGET: return 'player-on-target';
    case CELL.FLOOR: return 'floor';
    default: return 'void';
  }
}

const DELTA: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

/** Attempt to move the player in a direction. Returns a new state or the same state if invalid. */
export function move(state: GameState, direction: Direction): GameState {
  if (state.solved) return state;

  const delta = DELTA[direction];
  const { playerPos, board } = state;

  const nextPos: Position = { row: playerPos.row + delta.row, col: playerPos.col + delta.col };

  if (!inBounds(board, nextPos)) return state;

  const nextCell = board[nextPos.row][nextPos.col];

  // Can't move into a wall or void
  if (nextCell === 'wall' || nextCell === 'void') return state;

  let newBoard = copyBoard(board);
  let pushes = state.pushes;

  // If the next cell contains a box, try to push it
  if (nextCell === 'box' || nextCell === 'box-on-target') {
    const boxDest: Position = { row: nextPos.row + delta.row, col: nextPos.col + delta.col };

    if (!inBounds(board, boxDest)) return state;

    const boxDestCell = board[boxDest.row][boxDest.col];
    if (boxDestCell === 'wall' || boxDestCell === 'void' || boxDestCell === 'box' || boxDestCell === 'box-on-target') {
      return state; // Can't push box
    }

    // Move box to destination
    const boxLeavesTarget = nextCell === 'box-on-target';
    const boxArrivesOnTarget = boxDestCell === 'target';

    newBoard[boxDest.row][boxDest.col] = boxArrivesOnTarget ? 'box-on-target' : 'box';
    newBoard[nextPos.row][nextPos.col] = boxLeavesTarget ? 'target' : 'floor';
    pushes += 1;
  }

  // Move player
  const playerIsOnTarget = newBoard[playerPos.row][playerPos.col] === 'player-on-target' ||
    board[playerPos.row][playerPos.col] === 'player-on-target';
  newBoard[playerPos.row][playerPos.col] = playerIsOnTarget ? 'target' : 'floor';

  const playerArrivesOnTarget = newBoard[nextPos.row][nextPos.col] === 'target';
  newBoard[nextPos.row][nextPos.col] = playerArrivesOnTarget ? 'player-on-target' : 'player';

  const solved = isSolved(newBoard);

  return {
    board: newBoard,
    playerPos: nextPos,
    moves: state.moves + 1,
    pushes,
    solved,
    level: state.level,
  };
}

function inBounds(board: CellKind[][], pos: Position): boolean {
  return pos.row >= 0 && pos.row < board.length && pos.col >= 0 && pos.col < board[0].length;
}

function copyBoard(board: CellKind[][]): CellKind[][] {
  return board.map(row => [...row]);
}

function isSolved(board: CellKind[][]): boolean {
  // Solved when there are no unsettled boxes (all boxes are on targets)
  for (const row of board) {
    for (const cell of row) {
      if (cell === 'box') return false;
    }
  }
  return true;
}
