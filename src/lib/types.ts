/**
 * Sokoban game type definitions.
 */

/** Raw cell values used in level strings */
export const CELL = {
  FLOOR: ' ',
  WALL: '#',
  BOX: '$',
  TARGET: '.',
  BOX_ON_TARGET: '*',
  PLAYER: '@',
  PLAYER_ON_TARGET: '+',
} as const;

export type CellValue = (typeof CELL)[keyof typeof CELL];

/** Parsed cell kinds for rendering */
export type CellKind = 'wall' | 'floor' | 'target' | 'box' | 'box-on-target' | 'player' | 'player-on-target' | 'void';

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: CellKind[][];
  playerPos: Position;
  moves: number;
  pushes: number;
  solved: boolean;
  level: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Level {
  title: string;
  map: string[];
}
