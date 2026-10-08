export class Fireball {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.vx = direction === 'right' ? 8 : -8;
        this.vy = 4;
        this.gravity = 0.5;
        this.active = true;
    }

    update(tileMap) {
        if (!this.active) return;

        this.vy += this.gravity;
        this.x += this.vx;

        // Colisão horizontal com blocos
        const solids = tileMap.getSolidTiles();
        for (let tile of solids) {
            if (this.intersects(tile)) {
                this.active = false; // Explode ao bater na parede
                return;
            }
        }

        this.y += this.vy;
        // Colisão vertical (quicar no chão)
        for (let tile of solids) {
            if (this.intersects(tile)) {
                if (this.vy > 0) {
                    this.y = tile.y - this.height;
                    this.vy = -6; // Quica para cima
                } else if (this.vy < 0) {
                    this.active = false;
                }
            }
        }
    }

    intersects(rect) {
        return (
            this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }

    draw(ctx, camera) {
        if (!this.active) return;
        const x = this.x - camera.x;
        const y = this.y - camera.y;

        ctx.fillStyle = '#f39c12';
        ctx.beginPath();
        ctx.arc(x + 5, y + 5, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + 5, y + 5, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}