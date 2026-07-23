<script lang="ts">
  import type { CellKind } from '../lib/types.js';

  interface Props {
    kind: CellKind;
  }

  const { kind }: Props = $props();

  // Map each cell kind to an emoji/icon for display
  const ICONS: Record<CellKind, string> = {
    wall: '',
    floor: '',
    void: '',
    target: '',
    box: '📦',
    'box-on-target': '✅',
    player: '🧑',
    'player-on-target': '😊',
  };

  const icon = $derived(ICONS[kind]);
</script>

<div class="cell {kind}" role="img" aria-label={kind}>
  {#if icon}
    <span class="icon">{icon}</span>
  {/if}
</div>

<style>
  .cell {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    line-height: 1;
    box-sizing: border-box;
    border-radius: 3px;
  }

  .wall {
    background-color: #555;
    border: 2px solid #333;
  }

  .floor {
    background-color: #e8d5a3;
    border: 1px solid #d4b97a;
  }

  .void {
    background-color: transparent;
  }

  .target {
    background-color: #e8d5a3;
    border: 1px solid #d4b97a;
    position: relative;
  }

  .target::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 3px solid #e05c2a;
    background: transparent;
  }

  .box {
    background-color: #c8a95a;
    border: 2px solid #8b6914;
    border-radius: 6px;
  }

  .box-on-target {
    background-color: #7cb87c;
    border: 2px solid #3a8a3a;
    border-radius: 6px;
  }

  .player {
    background-color: #e8d5a3;
    border: 1px solid #d4b97a;
  }

  .player-on-target {
    background-color: #e8d5a3;
    border: 1px solid #d4b97a;
    position: relative;
  }

  .player-on-target::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 3px solid #e05c2a;
    background: transparent;
  }

  .icon {
    position: relative;
    z-index: 1;
  }
</style>
