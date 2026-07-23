import type { Level } from './types.js';

/**
 * Classic Sokoban puzzle levels.
 * Symbols: ' '=floor, '#'=wall, '$'=box, '.'=target, '*'=box on target, '@'=player, '+'=player on target
 * Rows can be jagged (shorter rows are padded with spaces on the right).
 */
export const LEVELS: Level[] = [
  {
    title: 'Level 1 – Intro',
    map: [
      '#####',
      '#@$.#',
      '#####',
    ],
  },
  {
    title: 'Level 2 – Two Boxes',
    map: [
      '######',
      '#....#',
      '#$$  #',
      '#  @ #',
      '######',
    ],
  },
  {
    title: 'Level 3 – Classic',
    map: [
      '  #####',
      '  #   #',
      '  #$  #',
      '### $ ##',
      '#  . .#',
      '# #  ##',
      '#    #',
      '##@###',
    ],
  },
  {
    title: 'Level 4 – Tight Squeeze',
    map: [
      '######',
      '#@   #',
      '# $$ #',
      '# .. #',
      '#    #',
      '######',
    ],
  },
  {
    title: 'Level 5 – Warehouse',
    map: [
      '  ####',
      '###  ####',
      '#     . #',
      '# #  #  #',
      '# $ ## ##',
      '##$  @  #',
      ' #  .   #',
      ' ########',
    ],
  },
  {
    title: 'Level 6 – Maze',
    map: [
      '#######',
      '#     #',
      '# .$. #',
      '# $@$ #',
      '# .$. #',
      '#     #',
      '#######',
    ],
  },
  {
    title: 'Level 7 – Corner Push',
    map: [
      '  ####',
      '  #  ###',
      '###$   #',
      '#  $ # #',
      '# ..@  #',
      '#  ####',
      '####',
    ],
  },
  {
    title: 'Level 8 – The Cross',
    map: [
      ' ### ',
      ' # # ',
      '## ##',
      '#$.$#',
      '## ##',
      ' #@# ',
      ' ### ',
    ],
  },
];
