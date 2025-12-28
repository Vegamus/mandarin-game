import { vocabulary } from '../data/vocabulary.js';

export class MatchGame {
    constructor(containerElement, config = {}) {
        this.container = containerElement;
        this.level = config.level || 1;
        this.onGameEnd = config.onGameEnd || (() => { });

        this.cards = [];
        this.flippedCards = [];
        this.matchesFound = 0;
        this.totalPairs = 0;
        this.isLocked = false;
    }

    start() {
        this.matchesFound = 0;
        this.flippedCards = [];
        this.isLocked = false;

        // Filter vocabulary by level
        const levelVocab = vocabulary.filter(v => v.level === this.level);

        // Fallback if no words found for level
        if (levelVocab.length === 0) {
            this.container.innerHTML = `<p>No words found for level ${this.level}</p>`;
            return;
        }

        // Prepare cards: 2 per vocab
        const deck = [];
        levelVocab.forEach(item => {
            // Card Type 1: Hanzi
            deck.push({
                id: item.id,
                content: `<span class="hanzi-text">${item.hanzi}</span>`,
                type: 'hanzi'
            });
            // Card Type 2: Meaning/Pinyin
            deck.push({
                id: item.id,
                content: `<div class="pinyin-text">${item.pinyin}</div><div class="meaning-text">${item.meaning}</div>`,
                type: 'meaning'
            });
        });

        this.totalPairs = deck.length / 2;
        this.cards = this.shuffle(deck);
        this.render();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    render() {
        this.container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'game-grid';

        this.cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            // Initial state is unflipped (showing back), logic handles flip class

            const front = document.createElement('div');
            front.className = 'card-front';
            front.innerHTML = card.content;

            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = '?';

            cardEl.appendChild(front);
            cardEl.appendChild(back);

            cardEl.addEventListener('click', () => this.handleCardClick(index));
            grid.appendChild(cardEl);
        });

        this.container.appendChild(grid);
    }

    handleCardClick(index) {
        if (this.isLocked) return;
        const cardEl = this.container.querySelectorAll('.card')[index];

        // Ignore if already flipped or matched
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        // Flip
        cardEl.classList.add('flipped');
        this.flippedCards.push({ index, id: this.cards[index].id, el: cardEl });

        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        this.isLocked = true;
        const [c1, c2] = this.flippedCards;

        if (c1.id === c2.id) {
            // Match!
            setTimeout(() => {
                c1.el.classList.add('matched');
                c2.el.classList.add('matched');
                this.matchesFound++;
                this.flippedCards = [];
                this.isLocked = false;

                if (this.matchesFound === this.totalPairs) {
                    setTimeout(() => this.showWin(), 300);
                }
            }, 600);

        } else {
            // No match
            setTimeout(() => {
                c1.el.classList.remove('flipped');
                c2.el.classList.remove('flipped');
                this.flippedCards = [];
                this.isLocked = false;
            }, 1000);
        }
    }

    showWin() {
        const winMsg = document.createElement('div');
        winMsg.className = 'win-message';
        winMsg.innerHTML = `
        <h2>🎉 Level ${this.level} Complete! 🎉</h2>
        <p>You matched all words!</p>
        <button id="menu-btn" class="btn-primary" style="margin-top: 1rem;">Back to Menu</button>
    `;
        this.container.appendChild(winMsg);

        winMsg.querySelector('#menu-btn').addEventListener('click', () => {
            this.onGameEnd();
        });
    }
}
