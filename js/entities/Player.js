export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Hitbox ajustada para encaixar perfeitamente em blocos de 32x32
        this.width = 30;
        this.height = 32;

        // Física do Super Mario Bros (NES)
        this.vx = 0;
        this.vy = 0;
        this.accel = 0.18;         // Aceleração progressiva
        this.friction = 0.82;      // Inércia natural ao soltar os botões
        this.maxSpeed = 3.2;       // Velocidade máxima ajustada
        this.jumpForce = -12.5;    // Impulso do pulo ajustado para alcançar os canos
        this.gravity = 0.45;       // Gravidade ao subir
        this.fallGravity = 0.65;   // Gravidade mais acentuada na queda

        // Estados
        this.isGrounded = false;
        this.facing = 'right';
        this.dead = false;
        this.onFlag = false;
        this.finishedFlag = false;

        // Power-ups
        this.state = 'SMALL'; // 'SMALL', 'SUPER', 'FIRE'
        this.fireballs = [];

        // Imunidade e tempo de piscar ao tomar dano (90 frames = ~1.5 segundos)
        this.invulnerableTimer = 0;

        // Animação dos passos
        this.animFrame = 0;
        this.animTimer = 0;

        // Paleta de Cores do Mario 8-bit NES
        this.colors = {
            C: '#B53120',
            B: '#6B6D00',
            S: '#EA9E22',
            W: '#FFFFFF'
        };

        // Sprites de Pixel Art
        this.sprites = {
            idle: [
                [null, null, null, 'C', 'C', 'C', 'C', 'C', null, null, null, null],
                [null, null, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', null],
                [null, null, 'B', 'B', 'B', 'S', 'S', 'B', 'S', null, null, null],
                [null, 'B', 'S', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S', null],
                [null, 'B', 'S', 'B', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S'],
                [null, 'B', 'B', 'S', 'S', 'S', 'S', 'B', 'B', 'B', 'B', null],
                [null, null, null, 'S', 'S', 'S', 'S', 'S', 'S', 'S', null, null],
                [null, null, 'C', 'C', 'B', 'C', 'C', 'C', null, null, null, null],
                [null, 'C', 'C', 'C', 'B', 'C', 'C', 'B', 'C', 'C', 'C', null],
                ['C', 'C', 'C', 'C', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'C'],
                ['S', 'S', 'C', 'B', 'S', 'B', 'B', 'S', 'B', 'C', 'S', 'S'],
                ['S', 'S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'S', 'S', 'S'],
                ['S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'S', 'S'],
                [null, null, 'B', 'B', 'B', null, null, 'B', 'B', 'B', null, null],
                [null, 'B', 'B', 'B', null, null, null, null, 'B', 'B', 'B', null],
                [null, 'B', 'B', 'B', 'B', null, null, 'B', 'B', 'B', 'B', null]
            ],
            run1: [
                [null, null, null, 'C', 'C', 'C', 'C', 'C', null, null, null, null],
                [null, null, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', null],
                [null, null, 'B', 'B', 'B', 'S', 'S', 'B', 'S', null, null, null],
                [null, 'B', 'S', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S', null],
                [null, 'B', 'S', 'B', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S'],
                [null, 'B', 'B', 'S', 'S', 'S', 'S', 'B', 'B', 'B', 'B', null],
                [null, null, null, 'S', 'S', 'S', 'S', 'S', 'S', 'S', null, null],
                [null, null, 'C', 'C', 'B', 'C', 'C', null, null, null, null, null],
                [null, 'C', 'C', 'C', 'B', 'C', 'C', 'C', 'B', 'C', 'C', 'C'],
                ['C', 'C', 'C', 'C', 'B', 'B', 'B', 'B', 'B', 'C', 'C', 'C'],
                ['S', 'S', 'C', 'B', 'S', 'B', 'B', 'B', 'B', 'C', 'S', 'S'],
                ['S', 'S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'S', 'S', 'S'],
                ['S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'S', 'S'],
                [null, 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null],
                ['B', 'B', 'B', 'B', null, null, null, null, 'B', 'B', 'B', 'B'],
                ['B', 'B', 'B', null, null, null, null, null, null, 'B', 'B', 'B']
            ],
            run2: [
                [null, null, null, 'C', 'C', 'C', 'C', 'C', null, null, null, null],
                [null, null, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', null],
                [null, null, 'B', 'B', 'B', 'S', 'S', 'B', 'S', null, null, null],
                [null, 'B', 'S', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S', null],
                [null, 'B', 'S', 'B', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S'],
                [null, 'B', 'B', 'S', 'S', 'S', 'S', 'B', 'B', 'B', 'B', null],
                [null, null, null, 'S', 'S', 'S', 'S', 'S', 'S', 'S', null, null],
                [null, null, null, 'C', 'C', 'B', 'C', 'C', 'C', null, null, null],
                [null, null, 'C', 'C', 'C', 'B', 'C', 'C', 'B', 'C', 'C', null],
                [null, 'C', 'C', 'C', 'C', 'B', 'B', 'B', 'B', 'C', 'C', 'C'],
                [null, 'S', 'S', 'C', 'B', 'S', 'B', 'B', 'S', 'B', 'C', 'S'],
                [null, 'S', 'S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'S', 'S'],
                [null, 'S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'S'],
                [null, null, 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null],
                [null, null, 'B', 'B', 'B', null, null, 'B', 'B', 'B', null, null],
                [null, 'B', 'B', 'B', 'B', null, null, 'B', 'B', 'B', 'B', null]
            ],
            jump: [
                [null, null, null, 'C', 'C', 'C', 'C', 'C', null, null, null, null],
                [null, null, 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', null],
                [null, null, 'B', 'B', 'B', 'S', 'S', 'B', 'S', null, null, null],
                [null, 'B', 'S', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S', null],
                [null, 'B', 'S', 'B', 'B', 'S', 'S', 'S', 'B', 'S', 'S', 'S'],
                [null, 'B', 'B', 'S', 'S', 'S', 'S', 'B', 'B', 'B', 'B', null],
                [null, null, null, 'S', 'S', 'S', 'S', 'S', 'S', 'S', null, null],
                [null, null, 'C', 'C', 'B', 'C', 'C', 'C', null, null, null, null],
                [null, 'C', 'C', 'C', 'B', 'C', 'C', 'B', 'C', 'C', 'C', 'C'],
                ['C', 'C', 'C', 'C', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'C'],
                ['S', 'S', 'C', 'B', 'S', 'B', 'B', 'S', 'B', 'C', 'S', 'S'],
                ['S', 'S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'S', 'S', 'S'],
                ['S', 'S', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'S', 'S'],
                [null, 'B', 'B', 'B', 'B', null, null, 'B', 'B', 'B', 'B', null],
                ['B', 'B', 'B', 'B', null, null, null, null, 'B', 'B', 'B', 'B'],
                ['B', 'B', 'B', null, null, null, null, null, null, 'B', 'B', 'B']
            ]
        };
    }

    grow() {
        if (this.state === 'SMALL') {
            this.state = 'SUPER';
            this.y -= 16;
            this.height = 48;
        }
    }

    getFlower() {
        this.grow();
        this.state = 'FIRE';
    }

    takeDamage() {
        // Se estiver no tempo de imunidade ou morto, ignora o dano
        if (this.invulnerableTimer > 0 || this.dead) return false;

        if (this.state === 'FIRE' || this.state === 'SUPER') {
            this.state = 'SMALL';
            this.height = 32;
            this.invulnerableTimer = 90; // ~1.5s de imunidade piscando
            return false; // Não morreu!
        } else {
            this.die();
            return true; // Morreu
        }
    }

    die() {
        this.dead = true;
        this.vy = -8;
    }

    startFlagSlide() {
        this.onFlag = true;
        this.vx = 0;
        this.vy = 2;
    }

    intersects(other) {
        if (!other) return false;
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    update(input, tileMap, audio) {
        // Contagem regressiva da imunidade
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer--;
        }

        if (this.dead) {
            this.vy += this.gravity;
            this.y += this.vy;
            return;
        }

        if (this.onFlag) {
            this.y += this.vy;
            if (tileMap && this.y + this.height >= tileMap.height - 64) {
                this.y = tileMap.height - 64 - this.height;
                this.finishedFlag = true;
            }
            return;
        }

        // --- ENTRADA DE TECLAS ---
        const jumpPressed = input && (input.isDown('ArrowUp') || input.isDown('KeyW') || input.isDown(' '));
        const moveRight = input && (input.isDown('ArrowRight') || input.isDown('KeyD'));
        const moveLeft = input && (input.isDown('ArrowLeft') || input.isDown('KeyA'));

        if (moveRight) {
            this.vx += this.accel;
            if (this.vx > this.maxSpeed) this.vx = this.maxSpeed;
            this.facing = 'right';
        } else if (moveLeft) {
            this.vx -= this.accel;
            if (this.vx < -this.maxSpeed) this.vx = -this.maxSpeed;
            this.facing = 'left';
        } else {
            this.vx *= this.friction;
            if (Math.abs(this.vx) < 0.05) this.vx = 0;
        }

        // Pulo Responsivo
        if (jumpPressed && this.isGrounded) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
            if (audio && audio.playJump) audio.playJump();
        }

        // Aplicação da Gravidade
        if (this.vy < 0 && !jumpPressed) {
            this.vy += this.gravity * 1.8;
        } else if (this.vy >= 0) {
            this.vy += this.fallGravity;
        } else {
            this.vy += this.gravity;
        }

        // --- COLISÃO SÓLIDA HORIZONTAL ---
        this.x += this.vx;
        if (tileMap && typeof tileMap.checkXCollision === 'function') {
            tileMap.checkXCollision(this);
        }

        // --- COLISÃO SÓLIDA VERTICAL ---
        this.y += this.vy;
        this.isGrounded = false;

        if (tileMap && typeof tileMap.checkYCollision === 'function') {
            tileMap.checkYCollision(this);
        } else {
            const groundY = 416 - this.height;
            if (this.y >= groundY) {
                this.y = groundY;
                this.vy = 0;
                this.isGrounded = true;
            }
        }

        // --- ANIMAÇÃO DAS PERNAS ---
        if (Math.abs(this.vx) > 0.2 && this.isGrounded) {
            this.animTimer += Math.abs(this.vx) * 0.04;
            this.animFrame = Math.floor(this.animTimer) % 2;
        } else {
            this.animFrame = 0;
            this.animTimer = 0;
        }
    }

    getSpriteMatrix() {
        if (!this.isGrounded) return this.sprites.jump;
        if (Math.abs(this.vx) > 0.2) return this.animFrame === 0 ? this.sprites.run1 : this.sprites.run2;
        return this.sprites.idle;
    }

    draw(ctx, camera) {
        // Faz o Mario piscar enquanto estiver no tempo de imunidade
        if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
            return;
        }

        const matrix = this.getSpriteMatrix();
        const rows = matrix.length;
        const cols = matrix[0].length;
        const pixelW = this.width / cols;
        const pixelH = this.height / rows;

        const screenX = camera ? this.x - camera.x : this.x;
        const screenY = camera ? this.y - camera.y : this.y;

        ctx.save();

        if (this.facing === 'left') {
            ctx.translate(screenX + this.width, screenY);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(screenX, screenY);
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const colorCode = matrix[r][c];
                if (colorCode && this.colors[colorCode]) {
                    let fill = this.colors[colorCode];
                    if (this.state === 'FIRE' && colorCode === 'C') fill = this.colors.W;

                    ctx.fillStyle = fill;
                    ctx.fillRect(
                        Math.floor(c * pixelW),
                        Math.floor(r * pixelH),
                        Math.ceil(pixelW),
                        Math.ceil(pixelH)
                    );
                }
            }
        }

        ctx.restore();
    }
}