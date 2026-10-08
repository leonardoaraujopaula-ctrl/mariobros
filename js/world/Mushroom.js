export class Mushroom {
    constructor(x, y, type = 'SUPER') {
        this.x = x;
        this.y = y - 16;
        this.width = 32;
        this.height = 32;
        this.type = type;
        this.vx = 2; // Começa indo para a direita
        this.vy = 0;
        this.gravity = 0.3;
        this.active = true;
    }

    update(tileMap) {
        if (!this.active) return;

        // Gravidade
        this.vy += this.gravity;
        if (this.vy > 8) this.vy = 8;

        // Movimento Horizontal + Bate e Volta
        this.x += this.vx;
        if (tileMap) {
            const startCol = Math.floor(this.x / tileMap.tileSize);
            const endCol = Math.floor((this.x + this.width - 1) / tileMap.tileSize);
            const startRow = Math.floor(this.y / tileMap.tileSize);
            const endRow = Math.floor((this.y + this.height - 1) / tileMap.tileSize);

            for (let r = startRow; r <= endRow; r++) {
                for (let c = startCol; c <= endCol; c++) {
                    if (tileMap.isSolid(r, c)) {
                        // Bateu em uma parede/cano na direita
                        if (this.vx > 0) {
                            this.x = c * tileMap.tileSize - this.width;
                            this.vx = -this.vx; // Inverte para a esquerda!
                        }
                        // Bateu na esquerda
                        else if (this.vx < 0) {
                            this.x = (c + 1) * tileMap.tileSize;
                            this.vx = -this.vx; // Inverte para a direita!
                        }
                    }
                }
            }
        }

        // Movimento Vertical (Colisão com o chão)
        this.y += this.vy;
        if (tileMap && typeof tileMap.checkYCollision === 'function') {
            tileMap.checkYCollision(this);
        }
    }

    intersects(player) {
        if (!this.active || !player) return false;
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    draw(ctx, camera) {
        if (!this.active) return;

        const screenX = camera ? this.x - camera.x : this.x;
        const screenY = camera ? this.y - camera.y : this.y;

        // Base / Pé do cogumelo
        ctx.fillStyle = '#fce0a8';
        ctx.fillRect(screenX + 8, screenY + 16, 16, 16);

        // Chapéu do cogumelo
        ctx.fillStyle = this.type === '1UP' ? '#00a800' : '#d82800';
        ctx.fillRect(screenX + 4, screenY + 4, 24, 14);

        // Pintas brancas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(screenX + 8, screenY + 6, 6, 6);
        ctx.fillRect(screenX + 18, screenY + 6, 6, 6);
    }
}