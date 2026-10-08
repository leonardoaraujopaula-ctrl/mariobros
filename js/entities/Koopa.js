export class Koopa {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.vx = -1;
        this.vy = 0;
        this.isGrounded = false;
        this.alive = true;
        this.dead = false;

        this.state = 'WALKING'; // Estados: WALKING, SHELL, SLIDING
        this.isShell = false;

        this.colors = {
            G: '#00A800', // Verde
            S: '#F8D870', // Pele
            W: '#FFFFFF', // Branco
            K: '#000000'  // Preto
        };

        this.sprites = {
            walk: [
                [null, null, null, null, null, 'G', 'G', 'G', 'G', null, null, null, null],
                [null, null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null, null],
                [null, null, null, 'S', 'S', 'K', 'S', 'S', 'K', 'S', null, null, null],
                [null, null, null, 'S', 'S', 'S', 'S', 'S', 'S', 'S', null, null, null],
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, 'G', 'G', 'W', 'W', 'G', 'G', 'W', 'W', 'G', 'G', null],
                ['G', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'G', 'G'],
                ['G', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'G', 'G'],
                [null, 'G', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'G', 'G', null],
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, null, 'S', 'S', 'S', null, null, 'S', 'S', 'S', null, null],
                [null, 'S', 'S', 'S', 'S', null, null, 'S', 'S', 'S', 'S', null]
            ],
            shell: [
                [null, null, null, 'G', 'G', 'G', 'G', 'G', 'G', null, null, null],
                [null, null, 'G', 'G', 'W', 'W', 'G', 'G', 'W', 'W', 'G', null],
                [null, 'G', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'G'],
                ['G', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'G'],
                ['G', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'G'],
                [null, 'G', 'G', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'G'],
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null]
            ]
        };
    }

    stomp() {
        if (this.state === 'WALKING') {
            this.state = 'SHELL';
            this.isShell = true;
            this.height = 32;
            this.y += 16;
            this.vx = 0;
        } else if (this.state === 'SHELL') {
            this.state = 'SLIDING';
            this.vx = 8;
        } else if (this.state === 'SLIDING') {
            this.state = 'SHELL';
            this.vx = 0;
        }
    }

    kick(facingDirection) {
        this.state = 'SLIDING';
        this.isShell = true;
        this.vx = facingDirection === 'right' ? 8 : -8;
    }

    die() {
        this.alive = false;
        this.dead = true;
    }

    intersects(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    update(tileMap) {
        if (this.dead || !this.alive) return;

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
    }

    draw(ctx, camera) {
        if (this.dead || !this.alive) return;

        const screenX = camera ? this.x - camera.x : this.x;
        const screenY = camera ? this.y - camera.y : this.y;
        const matrix = this.isShell ? this.sprites.shell : this.sprites.walk;

        const rows = matrix.length;
        const cols = matrix[0].length;
        const pixelW = this.width / cols;
        const pixelH = this.height / rows;

        ctx.save();
        if (this.vx < 0 && !this.isShell) {
            ctx.translate(screenX + this.width, screenY);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(screenX, screenY);
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const colorCode = matrix[r][c];
                if (colorCode && this.colors[colorCode]) {
                    ctx.fillStyle = this.colors[colorCode];
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