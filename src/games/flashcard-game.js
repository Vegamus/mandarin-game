import { vocabulary } from '../data/vocabulary.js';

export class FlashcardGame {
  constructor(containerElement, config = {}) {
    this.container = containerElement;
    this.level = config.level || 1;
    this.onGameEnd = config.onGameEnd || (() => { });

    this.deck = [];
    this.currentIndex = 0;
    this.isFlipped = false;
  }

  start() {
    this.deck = vocabulary.filter(v => v.level === this.level);
    this.currentIndex = 0;
    this.isFlipped = false;
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    if (this.deck.length === 0) {
      this.container.innerHTML = '<p>No words available.</p>';
      return;
    }

    const cardData = this.deck[this.currentIndex];

    const wrapper = document.createElement('div');
    wrapper.className = 'flashcard-wrapper';

    wrapper.innerHTML = `
      <div class="flashcard-container">
        <div class="flashcard ${this.isFlipped ? 'flipped' : ''}">
          <div class="flashcard-front">
            <div class="hanzi-large">${cardData.hanzi}</div>
            <div class="tap-hint">(Tap to flip)</div>
          </div>
          <div class="flashcard-back">
            <div class="pinyin-large">${cardData.pinyin}</div>
            <div class="meaning-large">${cardData.meaning}</div>
          </div>
        </div>
      </div>
      
      <div class="controls-bar">
        <button id="prev-btn" class="btn-primary" ${this.currentIndex === 0 ? 'disabled' : ''}>← Prev</button>
        <span class="counter">${this.currentIndex + 1} / ${this.deck.length}</span>
        <button id="next-btn" class="btn-primary" ${this.currentIndex === this.deck.length - 1 ? 'disabled' : ''}>Next →</button>
      </div>

      <div class="fuel-gauge-container">
        <div class="fuel-bar" style="width: ${(this.currentIndex + 1) / this.deck.length * 100}%"></div>
      </div>

      <button id="exit-btn" class="secondary-btn" style="margin-top:2rem;">Abort Mission</button>
    `;

    this.container.appendChild(wrapper);

    // Event Listeners
    const cardEl = wrapper.querySelector('.flashcard');
    cardEl.addEventListener('click', () => {
      this.isFlipped = !this.isFlipped;
      this.render(); // Re-render to update class. Simpler than manual class toggle for this state management style.
    });

    wrapper.querySelector('#prev-btn').addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.isFlipped = false;
        this.render();
      }
    });

    wrapper.querySelector('#next-btn').addEventListener('click', () => {
      if (this.currentIndex < this.deck.length - 1) {
        this.currentIndex++;
        this.isFlipped = false;
        this.render();
      }
    });

    wrapper.querySelector('#exit-btn').addEventListener('click', () => {
      this.onGameEnd();
    });
  }
}
