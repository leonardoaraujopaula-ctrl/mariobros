export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.vx = -1;
        this.vy = 0;
        this.isGrounded = false;
        this.alive = true;
        this.dead = false;
        this.squished = false;
        this.squishTimer = 0;

        this.animFrame = 0;
        this.animTimer = 0;

        this.colors = {
            B: '#A84000', // Marrom
            S: '#F8D870', // Bege/Pele
            K: '#000000'  // Preto
        };

        this.sprites = {
            walk1: [
                [null, null, null, null, null, 'B', 'B', 'B', 'B', null, null, null, null, null, null, null],
                [null, null, null, null, 'B', 'B', 'B', 'B', 'B', 'B', null, null, null, null, null, null],
                [null, null, null, 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null, null, null, null, null],
                [null, null, 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null, null, null, null],
                [null, 'B', 'B', 'B', 'S', 'S', 'B', 'B', 'S', 'S', 'B', 'B', 'B', null, null, null],
                [null, 'B', 'B', 'S', 'S', 'K', 'S', 'S', 'K', 'S', 'S', 'B', 'B', null, null, null],
                ['B', 'B', 'B', 'S', 'S', 'K', 'S', 'S', 'K', 'S', 'S', 'B', 'B', 'B', null, null],
                ['B', 'B', 'B', 'B', 'S', 'S', 'S', 'S', 'S', 'S', 'B', 'B', 'B', 'B', null, null],
                ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null, null],
                [null, 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null, null, null],
                [null, null, 'K', 'K', 'K', 'B', 'B', 'B', 'B', 'K', 'K', 'K', null, null, null, null],
                [null, 'K', 'K', 'K', 'K', 'K', 'B', 'B', 'K', 'K', 'K', 'K', 'K', null, null, null],
                ['K', 'K', 'K', 'K', 'K', 'K', null, null, 'K', 'K', 'K', 'K', 'K', 'K', null, null],
                ['K', 'K', 'K', 'K', 'K', null, null, null, null, 'K', 'K', 'K', 'K', 'K', null, null]
            ],
            squished: [
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
                [null, null, null, 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null, null, null, null, null],
                [null, 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null, null, null],
                ['B', 'B', 'S', 'S', 'K', 'S', 'S', 'K', 'S', 'S', 'B', 'B', 'B', 'B', null, null],
                ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', null, null],
                ['K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', null, null],
                ['K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', 'K', null, null]
            ]
        };
    }

    squish() {
        if (this.squished) return;
        this.squished = true;
        this.vx = 0;
        this.vy = 0;
    }

    stomp() {
        this.squish();
    }

    die() {
        this.alive = false;
        this.dead = true;
    }

    intersects(other) {
        if (this.squished || this.dead || !this.alive || !other) return false;
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    update(tileMap) {
        if (this.dead || !this.alive) return;

        if (this.squished) {
            this.squishTimer++;
            // Após 20 frames (~0.3s), ele morre e SOME completamente do jogo
            if (this.squishTimer > 20) {
                this.dead = true;
                this.alive = false;
            }
            return;
        }

        this.vy += 0.5;

        this.x += this.vx;
        if (tileMap && typeof tileMap.checkXCollision === 'function') {
            const oldVx = this.vx;
            tileMap.checkXCollision(this);
            if (this.vx === 0) this.vx = -oldVx;
        }

        this.y += this.vy;
        if (tileMap && typeof tileMap.checkYCollision === 'function') {
            tileMap.checkYCollision(this);
        }

        this.animTimer += 0.1;
        this.animFrame = Math.floor(this.animTimer) % 2;
    }

    draw(ctx, camera) {
        if (this.dead || !this.alive) return;

        const screenX = camera ? this.x - camera.x : this.x;
        const screenY = camera ? this.y - camera.y : this.y;
        const matrix = this.squished ? this.sprites.squished : this.sprites.walk1;

        const rows = matrix.length;
        const cols = matrix[0].length;
        const pixelW = this.width / cols;
        const pixelH = this.height / rows;

        ctx.save();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const colorCode = matrix[r][c];
                if (colorCode && this.colors[colorCode]) {
                    ctx.fillStyle = this.colors[colorCode];
                    ctx.fillRect(
                        Math.floor(screenX + c * pixelW),
                        Math.floor(screenY + r * pixelH),
                        Math.ceil(pixelW),
                        Math.ceil(pixelH)
                    );
                }
            }
        }
        ctx.restore();
    }
}