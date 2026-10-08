import { Game } from './Game.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const game = new Game(canvas);

    // Garante que o jogo inicia
    game.start();

    const enableAudio = () => {
        if (game.audio && game.audio.init) {
            game.audio.init();
        }
        window.removeEventListener('keydown', enableAudio);
        window.removeEventListener('click', enableAudio);
    };

    window.addEventListener('keydown', enableAudio);
    window.addEventListener('click', enableAudio);
});