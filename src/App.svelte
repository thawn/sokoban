<script lang="ts">
  import { onMount } from 'svelte';
  import GameBoard from './lib/GameBoard.svelte';
  import { move, parseLevel } from './lib/engine.js';
  import { LEVELS } from './lib/levels.js';
  import type { Direction, GameState } from './lib/types.js';

  let currentLevelIndex = $state(0);
  let gameState = $state<GameState>(parseLevel(LEVELS[0], 0));

  function loadLevel(index: number) {
    currentLevelIndex = index;
    gameState = parseLevel(LEVELS[index], index);
  }

  function restartLevel() {
    loadLevel(currentLevelIndex);
  }

  function nextLevel() {
    if (currentLevelIndex < LEVELS.length - 1) {
      loadLevel(currentLevelIndex + 1);
    }
  }

  function prevLevel() {
    if (currentLevelIndex > 0) {
      loadLevel(currentLevelIndex - 1);
    }
  }

  const KEY_TO_DIRECTION: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
    W: 'up',
    S: 'down',
    A: 'left',
    D: 'right',
  };

  function handleKeydown(event: KeyboardEvent) {
    const dir = KEY_TO_DIRECTION[event.key];
    if (dir) {
      event.preventDefault();
      gameState = move(gameState, dir);
    } else if (event.key === 'r' || event.key === 'R') {
      restartLevel();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  // Touch / swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchEnd(event: TouchEvent) {
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    const threshold = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) gameState = move(gameState, 'right');
      else if (dx < -threshold) gameState = move(gameState, 'left');
    } else {
      if (dy > threshold) gameState = move(gameState, 'down');
      else if (dy < -threshold) gameState = move(gameState, 'up');
    }
  }

  const levelTitle = $derived(LEVELS[currentLevelIndex].title);
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<main
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
>
  <header>
    <h1>📦 Sokoban</h1>
    <p class="subtitle">Push all boxes onto the targets!</p>
  </header>

  <div class="level-nav">
    <button onclick={prevLevel} disabled={currentLevelIndex === 0}>◀ Prev</button>
    <span class="level-title">{levelTitle}</span>
    <button onclick={nextLevel} disabled={currentLevelIndex === LEVELS.length - 1}>Next ▶</button>
  </div>

  <div class="stats">
    <span>Moves: <strong>{gameState.moves}</strong></span>
    <span>Pushes: <strong>{gameState.pushes}</strong></span>
    <button class="restart-btn" onclick={restartLevel} title="Restart (R)">↺ Restart</button>
  </div>

  {#if gameState.solved}
    <div class="victory">
      🎉 Level Complete! 🎉
      {#if currentLevelIndex < LEVELS.length - 1}
        <button onclick={nextLevel}>Next Level ▶</button>
      {:else}
        <p>You've completed all levels! 🏆</p>
      {/if}
    </div>
  {/if}

  <div class="board-container">
    <GameBoard state={gameState} />
  </div>

  <div class="controls-hint">
    <strong>Controls:</strong> Arrow keys or WASD to move &nbsp;|&nbsp; R to restart &nbsp;|&nbsp; Swipe on mobile
  </div>

  <!-- On-screen D-pad for mobile -->
  <div class="dpad" aria-label="Direction pad">
    <button class="dpad-btn up" onclick={() => (gameState = move(gameState, 'up'))} aria-label="Move up">▲</button>
    <div class="dpad-row">
      <button class="dpad-btn left" onclick={() => (gameState = move(gameState, 'left'))} aria-label="Move left">◀</button>
      <button class="dpad-btn center" onclick={restartLevel} aria-label="Restart">↺</button>
      <button class="dpad-btn right" onclick={() => (gameState = move(gameState, 'right'))} aria-label="Move right">▶</button>
    </div>
    <button class="dpad-btn down" onclick={() => (gameState = move(gameState, 'down'))} aria-label="Move down">▼</button>
  </div>
</main>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    color: #f0e6d3;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 16px;
    width: 100%;
    max-width: 700px;
    min-height: 100vh;
  }

  header {
    text-align: center;
  }

  h1 {
    font-size: 2.4rem;
    letter-spacing: 2px;
    color: #f5c842;
    text-shadow: 0 2px 8px rgba(245, 200, 66, 0.4);
  }

  .subtitle {
    font-size: 0.95rem;
    color: #c0a97a;
    margin-top: 4px;
  }

  .level-nav {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .level-title {
    font-size: 1rem;
    font-weight: 600;
    color: #f5c842;
    min-width: 160px;
    text-align: center;
  }

  .stats {
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 0.95rem;
    background: rgba(255, 255, 255, 0.07);
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .stats strong {
    color: #f5c842;
  }

  .restart-btn {
    padding: 4px 12px;
    font-size: 0.85rem;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    color: #f0e6d3;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    transition: background 0.15s;
  }

  .restart-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  button {
    padding: 8px 18px;
    font-size: 0.9rem;
    cursor: pointer;
    background: #f5c842;
    color: #1a1a2e;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    transition: background 0.15s, transform 0.1s;
  }

  button:hover:not(:disabled) {
    background: #ffd966;
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .victory {
    background: linear-gradient(135deg, #2d5a27, #3d7a37);
    border: 2px solid #5cb85c;
    border-radius: 12px;
    padding: 16px 28px;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 700;
    color: #a8f0a8;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: pulse 1s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    from { box-shadow: 0 0 10px rgba(92, 184, 92, 0.3); }
    to { box-shadow: 0 0 24px rgba(92, 184, 92, 0.7); }
  }

  .board-container {
    overflow: auto;
    max-width: 100%;
  }

  .controls-hint {
    font-size: 0.78rem;
    color: #8a7a6a;
    text-align: center;
  }

  .dpad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
  }

  .dpad-row {
    display: flex;
    gap: 4px;
  }

  .dpad-btn {
    width: 52px;
    height: 52px;
    padding: 0;
    font-size: 1.2rem;
    border-radius: 8px;
    background: rgba(245, 200, 66, 0.85);
    color: #1a1a2e;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .dpad-btn.center {
    background: rgba(200, 200, 200, 0.5);
    color: #f0e6d3;
    font-size: 1rem;
  }

  .dpad-btn:hover:not(:disabled) {
    background: rgba(255, 220, 80, 0.95);
    transform: translateY(-1px);
  }
</style>
