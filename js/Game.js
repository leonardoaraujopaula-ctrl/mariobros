import { InputHandler } from './InputHandler.js';
import { Camera } from './Camera.js';
import { TileMap } from './world/TileMap.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';
import { Koopa } from './entities/Koopa.js';
import { PiranhaPlant } from './entities/PiranhaPlant.js';
import { Mushroom } from './world/Mushroom.js';
import { FireFlower } from './world/FireFlower.js';
import { AudioSystem } from './world/AudioSystem.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.ctx.imageSmoothingEnabled = false;

        this.audio = new AudioSystem();
        this.input = new InputHandler();
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        this.gameState = 'MENU';
        this.lives = 3;
        this.score = 0;
        this.coins = 0;
        this.time = 400;
        this.timerInterval = null;

        this.currentLevel = 1;
        this.tileMap = null;
        this.player = null;
        this.enemies = [];
        this.mushrooms = [];
        this.fireFlowers = [];
        this.floatingCoins = [];

        this.flagCompleted = false;
        this.deathDelay = 0;
    }

    start() {
        this.loop();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.time = 400;
        this.timerInterval = setInterval(() => {
            if (this.gameState === 'PLAYING') {
                this.time--;
                if (this.time <= 0) this.killPlayer();
            }
        }, 1000);
    }

    spawnMushroom(x, y, type = 'SUPER') {
        this.mushrooms.push(new Mushroom(x, y, type));
    }

    spawnFireFlower(x, y) {
        this.fireFlowers.push(new FireFlower(x, y));
    }

    spawnFloatingCoin(x, y) {
        this.floatingCoins.push({
            x: x,
            y: y,
            vy: -3.5,
            life: 45,
            active: true
        });
    }

    loadLevel(levelNumber) {
        this.currentLevel = levelNumber;
        this.tileMap = new TileMap(32, this);
        this.tileMap.loadLevel(this.currentLevel);

        if (this.camera) {
            this.camera.x = 0;
            this.camera.y = 0;
        }

        this.player = new Player(64, 200);
        this.flagCompleted = false;
        this.deathDelay = 0;
        this.floatingCoins = [];

        if (levelNumber === 1) {
            // Posicionamento ajustado para não spawnar dentro das pirâmides ou blocos
            this.enemies = [
                new Enemy(700, 380),
                new Enemy(900, 380),
                new Enemy(1050, 380),
                new PiranhaPlant(38 * 32, 10 * 32),  // Cano col 38
                new Enemy(1300, 380),
                new Enemy(1420, 380),
                new Koopa(1550, 360),
                new PiranhaPlant(46 * 32, 9 * 32),   // Cano col 46
                new PiranhaPlant(57 * 32, 9 * 32),   // Cano col 57
                new Enemy(2000, 380),
                new Enemy(2150, 380),
                new Koopa(2350, 360),
                new Enemy(2600, 380),
                new Enemy(2800, 380),
                new Enemy(3000, 380),
                new Enemy(3300, 380),                // Reposicionado para fora da escada
                new Enemy(3600, 380),
                new Koopa(3750, 360),
                new Enemy(4100, 380),
                new Enemy(4300, 380),
                new Enemy(4800, 380),
                new PiranhaPlant(163 * 32, 11 * 32), // Cano col 163
                new Enemy(5300, 380),
                new Enemy(5450, 380)
            ];
        } else if (levelNumber === 2) {
            this.enemies = [
                new Koopa(350, 360),
                new Enemy(500, 380),
                new PiranhaPlant(640, 352),
                new Enemy(720, 380),
                new Enemy(900, 380),
                new PiranhaPlant(896, 320),
                new Koopa(1200, 360),
                new Koopa(1400, 360),
                new Enemy(1600, 380)
            ];
        } else if (levelNumber === 3) {
            this.enemies = [
                new Enemy(300, 380),
                new Koopa(500, 360),
                new Enemy(750, 380),
                new Koopa(1000, 360),
                new Enemy(1250, 380),
                new Koopa(1500, 360),
                new Enemy(1700, 380)
            ];
        }

        this.mushrooms = [];
        this.fireFlowers = [];
        this.startTimer();
        this.gameState = 'PLAYING';
    }

    checkLevelComplete() {
        if (!this.player || !this.tileMap || this.player.onFlag || this.flagCompleted || this.player.dead) return;

        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;

        const col = Math.floor(playerCenterX / this.tileMap.tileSize);
        const row = Math.floor(playerCenterY / this.tileMap.tileSize);

        let foundFlag = false;
        for (let r = row - 2; r <= row + 2; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (this.tileMap.map[r] && this.tileMap.map[r][c] === 5) {
                    foundFlag = true;
                    break;
                }
            }
            if (foundFlag) break;
        }

        if (foundFlag) {
            if (typeof this.player.startFlagSlide === 'function') {
                this.player.startFlagSlide();
            }
            this.score += this.time * 10;
            this.gameState = 'FLAG';
            if (this.audio && this.audio.playFlag) this.audio.playFlag();
        }
    }

    killPlayer() {
        if (this.player && !this.player.dead) {
            this.player.die();
            if (this.audio && this.audio.playDie) this.audio.playDie();
            this.deathDelay = 90;
        }
    }

    playerDie() {
        this.lives--;
        if (this.lives <= 0) {
            if (this.timerInterval) clearInterval(this.timerInterval);
            this.gameState = 'GAMEOVER';
        } else {
            this.loadLevel(this.currentLevel);
        }
    }

    resetGame() {
        this.lives = 3;
        this.score = 0;
        this.coins = 0;
        this.gameState = 'MENU';
        this.flagCompleted = false;
        this.deathDelay = 0;
    }

    handlePlayerDamage() {
        if (!this.player || this.player.dead) return;
        if (this.player.invulnerableTimer > 0) return;

        if (typeof this.player.takeDamage === 'function') {
            const isDead = this.player.takeDamage();
            if (isDead) {
                this.killPlayer();
            }
        } else {
            this.killPlayer();
        }
    }

    update() {
        if (this.gameState === 'MENU') {
            if (this.input.isDown('Enter') || this.input.isDown(' ')) this.loadLevel(1);
        }
        else if (this.gameState === 'GAMEOVER' || this.gameState === 'VICTORY') {
            if (this.input.isDown('Enter') || this.input.isDown(' ')) this.resetGame();
        }
        else if (this.gameState === 'FLAG') {
            if (this.player) {
                this.player.update(this.input, this.tileMap, this.audio);

                if (this.player.finishedFlag && !this.flagCompleted) {
                    this.flagCompleted = true;
                    this.player.vx = 2;
                    this.player.facing = 'right';

                    setTimeout(() => {
                        if (this.currentLevel < 3) {
                            this.loadLevel(this.currentLevel + 1);
                        } else {
                            if (this.timerInterval) clearInterval(this.timerInterval);
                            this.gameState = 'VICTORY';
                        }
                    }, 1200);
                }

                if (this.flagCompleted && this.player.finishedFlag) {
                    this.player.x += 1.5;
                }
            }
        }
        else if (this.gameState === 'PLAYING') {
            if (this.player && this.player.dead) {
                this.player.update(this.input, this.tileMap, this.audio);
                this.deathDelay--;
                if (this.deathDelay <= 0) {
                    this.playerDie();
                }
                return;
            }

            if (this.player) this.player.update(this.input, this.tileMap, this.audio);
            if (this.tileMap && this.player) this.tileMap.checkCoinCollect(this.player);
            if (this.camera && this.player && this.tileMap) this.camera.update(this.player, this.tileMap.width);

            this.checkLevelComplete();

            this.mushrooms.forEach(shroom => {
                if (shroom.active) {
                    shroom.update(this.tileMap);
                    if (this.player.intersects(shroom)) {
                        shroom.active = false;
                        if (shroom.type === 'SUPER') {
                            this.player.grow();
                            this.score += 1000;
                            if (this.audio && this.audio.playPowerUp) this.audio.playPowerUp();
                        } else if (shroom.type === '1UP') {
                            this.lives += 1;
                            if (this.audio && this.audio.playPowerUp) this.audio.playPowerUp();
                        }
                    }
                }
            });

            this.fireFlowers.forEach(flower => {
                if (flower.active) {
                    flower.update();
                    if (this.player.intersects(flower)) {
                        flower.active = false;
                        this.player.getFlower();
                        this.score += 1000;
                        if (this.audio && this.audio.playPowerUp) this.audio.playPowerUp();
                    }
                }
            });

            this.floatingCoins.forEach(coin => {
                if (!coin.active) return;
                coin.y += coin.vy;
                coin.vy += 0.18;
                coin.life--;
                if (coin.life <= 0) coin.active = false;
            });
            this.floatingCoins = this.floatingCoins.filter(c => c.active);

            this.enemies.forEach(enemy => {
                if (!enemy || enemy.dead || (typeof enemy.alive !== 'undefined' && !enemy.alive)) return;

                if (enemy instanceof PiranhaPlant) {
                    enemy.update(this.player);
                } else {
                    enemy.update(this.tileMap);
                }

                if (this.player.fireballs) {
                    this.player.fireballs.forEach(f => {
                        if (f.active && f.intersects(enemy)) {
                            f.active = false;
                            if (typeof enemy.die === 'function') enemy.die();
                            else enemy.alive = false;
                            this.score += 200;
                            if (this.audio && this.audio.playStomp) this.audio.playStomp();
                        }
                    });
                }

                const hasCollision = typeof enemy.intersects === 'function'
                    ? enemy.intersects(this.player)
                    : this.player.intersects(enemy);

                if (hasCollision) {
                    if (enemy instanceof PiranhaPlant || enemy.constructor.name === 'PiranhaPlant') {
                        this.handlePlayerDamage();
                    } else {
                        const isStomping = this.player.vy > 0 &&
                            (this.player.y + this.player.height - this.player.vy) <= (enemy.y + (enemy.height || 32) * 0.6);

                        if (isStomping) {
                            if (enemy instanceof Koopa) {
                                enemy.stomp();
                                this.player.vy = -8.5;
                                this.score += 100;
                                if (this.audio && this.audio.playStomp) this.audio.playStomp();
                            } else if (enemy instanceof Enemy) {
                                enemy.stomp();
                                this.player.vy = -8.5;
                                this.score += 100;
                                if (this.audio && this.audio.playStomp) this.audio.playStomp();
                            }
                        } else {
                            if (enemy instanceof Koopa && (enemy.state === 'SHELL' || enemy.isShell) && enemy.vx === 0) {
                                if (typeof enemy.kick === 'function') enemy.kick(this.player.facing);
                                else enemy.vx = this.player.facing === 'right' ? 8 : -8;
                            } else {
                                this.handlePlayerDamage();
                            }
                        }
                    }
                }

                if (enemy instanceof Koopa && (enemy.state === 'SLIDING' || (enemy.isShell && enemy.vx !== 0))) {
                    this.enemies.forEach(other => {
                        if (other !== enemy && !other.dead && enemy.intersects(other)) {
                            if (typeof other.die === 'function') other.die();
                            else other.alive = false;
                            this.score += 200;
                        }
                    });
                }
            });

            this.enemies = this.enemies.filter(e => !e.dead && (typeof e.alive === 'undefined' || e.alive));

            if (this.player && this.player.y > this.canvas.height + 100) {
                this.killPlayer();
            }
        }
    }

    render() {
        if (this.gameState === 'MENU') {
            this.ctx.fillStyle = '#5c94fc';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 28px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('SUPER MARIO BROS', this.canvas.width / 2, 180);
            this.ctx.font = 'bold 14px monospace';
            this.ctx.fillText('PRESSIONE ENTER PARA JOGAR', this.canvas.width / 2, 280);
        }
        else if (this.gameState === 'GAMEOVER') {
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.font = 'bold 32px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, 220);
        }
        else if (this.gameState === 'VICTORY') {
            this.ctx.fillStyle = '#2ecc71';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 32px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('VOCÊ VENCEU O JOGO!', this.canvas.width / 2, 200);
            this.ctx.font = 'bold 16px monospace';
            this.ctx.fillText(`PONTUAÇÃO FINAL: ${this.score}`, this.canvas.width / 2, 250);
            this.ctx.fillText('PRESSIONE ENTER PARA REINICIAR', this.canvas.width / 2, 300);
        }
        else if (this.gameState === 'PLAYING' || this.gameState === 'FLAG') {
            this.ctx.fillStyle = this.tileMap ? this.tileMap.bgColor : '#5c94fc';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.tileMap) this.tileMap.draw(this.ctx, this.camera);
            if (this.mushrooms) this.mushrooms.forEach(s => s.draw(this.ctx, this.camera));
            if (this.fireFlowers) this.fireFlowers.forEach(f => f.draw(this.ctx, this.camera));
            if (this.enemies) this.enemies.forEach(e => e.draw(this.ctx, this.camera));
            if (this.player) this.player.draw(this.ctx, this.camera);

            this.floatingCoins.forEach(coin => {
                if (!coin.active) return;
                const x = coin.x - this.camera.x;
                const y = coin.y - this.camera.y;

                this.ctx.fillStyle = '#f8b800';
                this.ctx.beginPath();
                this.ctx.ellipse(x + 8, y + 8, 6, 9, 0, 0, Math.PI * 2);
                this.ctx.fill();

                this.ctx.fillStyle = '#fff8b0';
                this.ctx.beginPath();
                this.ctx.ellipse(x + 6, y + 5, 2, 3, 0, 0, Math.PI * 2);
                this.ctx.fill();
            });

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 14px monospace';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('MARIO', 20, 25);
            this.ctx.fillText(String(this.score).padStart(6, '0'), 20, 42);
            this.ctx.fillText(`🪙 x${String(this.coins).padStart(2, '0')}`, 160, 42);
            this.ctx.fillText('MUNDO', 290, 25);
            this.ctx.fillText(`1-${this.currentLevel}`, 300, 42);
            this.ctx.fillText('TEMPO', 410, 25);
            this.ctx.fillText(String(this.time).padStart(3, '0'), 420, 42);
            this.ctx.fillText(`VIDAS x${this.lives}`, 530, 42);
        }
    }

    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }
}