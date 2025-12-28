
import { vocabulary } from './src/data/vocabulary.js';
import { MatchGame } from './src/games/match-game.js';
import { FlashcardGame } from './src/games/flashcard-game.js';

console.log('Testing imports...');
if (vocabulary.length > 0) console.log('✅ Vocabulary loaded');
else console.error('❌ Vocabulary empty');

try {
    const m = new MatchGame({ innerHTML: '' }); // Mock container
    console.log('✅ MatchGame class valid');
} catch (e) {
    console.error('❌ MatchGame error:', e);
}

try {
    const f = new FlashcardGame({ innerHTML: '' }); // Mock container
    console.log('✅ FlashcardGame class valid');
} catch (e) {
    console.error('❌ FlashcardGame error:', e);
}
