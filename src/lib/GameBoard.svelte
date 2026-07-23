<script lang="ts">
  import Cell from './Cell.svelte';
  import type { GameState } from '../lib/types.js';

  interface Props {
    state: GameState;
  }

  const { state }: Props = $props();
</script>

<div class="board" style="grid-template-columns: repeat({state.board[0]?.length ?? 1}, 48px);">
  {#each state.board as row, r}
    {#each row as cell, c}
      <Cell kind={cell} />
    {/each}
  {/each}
</div>

<style>
  .board {
    display: grid;
    gap: 2px;
    padding: 8px;
    background-color: #b89a5a;
    border-radius: 8px;
    border: 3px solid #8b6914;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    width: fit-content;
    margin: 0 auto;
  }
</style>
