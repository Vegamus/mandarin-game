import './style.css';
import { MatchGame } from './games/match-game.js';
import { FlashcardGame } from './games/flashcard-game.js';

class GameHub {
  constructor(container) {
    this.container = container;
    this.currentLevel = 1;
    this.currentGame = null;
  }

  init() {
    this.renderMenu();
  }

  renderMenu() {
    this.container.innerHTML = `
      <div class="dashboard-panel">
        <h1>🚀 Mission Control</h1>
        <p class="subtitle">Mandarin Learning Protocol Initialized</p>
        
        <div class="level-selector">
          <label>Warp Drive Level:</label>
          <select id="level-select">
            <option value="1" ${this.currentLevel === 1 ? 'selected' : ''}>Sector 1: Basics</option>
            <option value="2" ${this.currentLevel === 2 ? 'selected' : ''}>Sector 2: Nature</option>
          </select>
        </div>

        <div class="game-options">
          <div class="game-card" id="play-match">
            <h3>🧩 Gravity Grid</h3>
            <p>Match tiles to stabilize the core.</p>
          </div>
          <div class="game-card" id="play-flashcards">
            <h3>📝 Data Analyzer</h3>
            <p>Review planetary vocabulary logs.</p>
          </div>
        </div>
      </div>
    `;

    // Listeners
    document.getElementById('level-select').addEventListener('change', (e) => {
      this.currentLevel = parseInt(e.target.value);
    });

    document.getElementById('play-match').addEventListener('click', () => {
      this.startGame('match');
    });

    document.getElementById('play-flashcards').addEventListener('click', () => {
      this.startGame('flashcards');
    });
  }

  startGame(type) {
    this.container.innerHTML = ''; // a simplistic clear.
    // Ideally we create a sub-container or pass the whole container

    const config = {
      level: this.currentLevel,
      onGameEnd: () => this.renderMenu()
    };

    if (type === 'match') {
      this.currentGame = new MatchGame(this.container, config);
    } else if (type === 'flashcards') {
      this.currentGame = new FlashcardGame(this.container, config);
    }

    if (this.currentGame) {
      this.currentGame.start();
    }
  }
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML += `<div style="color: red; padding: 1rem; border: 1px solid red; margin-top: 1rem;">
      <h3>Error Occurred</h3>
      <p>${msg}</p>
      <p>Line: ${lineNo}</p>
    </div>`;
  }
  return false;
};

const appEl = document.querySelector('#app');
if (!appEl) {
  document.body.innerHTML = '<h1 style="color:red">Fatal: #app missing</h1>';
} else {
  try {
    const app = new GameHub(appEl);
    app.init();
  } catch (e) {
    appEl.innerHTML = `<h2 style="color:red">Init Error: ${e.message}</h2>`;
    console.error(e);
  }
}
