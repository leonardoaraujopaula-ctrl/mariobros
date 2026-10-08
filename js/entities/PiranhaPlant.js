export class PiranhaPlant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pipeTopY = y;       // Posição exata do topo do cano
        this.maxHeight = 32;     // Altura máxima do corpo da planta fora do cano
        this.width = 32;
        this.height = 32;

        this.alive = true;
        this.dead = false;

        this.state = 'HIDDEN';
        this.timer = 0;
        this.speed = 0.5;        // Subida/descida suave e cadenciada do NES
        this.currentOffset = 0;  // Quantos pixels a planta saiu do cano (0 a 32)

        this.animTimer = 0;
        this.openMouth = false;

        // Paleta de Cores do NES
        this.colors = {
            G: '#00A800', // Verde dos lábios e folhas
            O: '#FC9838', // Laranja interno da boca
            W: '#FFFFFF', // Dentes/espinhos brancos
            D: '#005000'  // Verde escuro das sombras
        };

        // Matrizes Féis da Piranha Plant do Mario 1 (NES)
        this.sprites = {
            open: [
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, 'G', 'G', 'W', 'W', 'G', 'G', 'W', 'W', 'G', 'G', null],
                ['G', 'G', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'W', 'G', 'G'],
                ['G', 'G', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'G', 'G'],
                ['G', 'G', 'G', 'O', 'O', 'O', 'O', 'O', 'O', 'G', 'G', 'G'],
                [null, 'G', 'G', 'G', 'O', 'O', 'O', 'O', 'G', 'G', 'G', null],
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, null, null, 'D', 'G', 'G', 'G', 'G', 'D', null, null, null],
                [null, null, null, null, 'G', 'G', 'G', 'G', null, null, null, null],
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, 'G', 'G', 'G', 'D', 'D', 'D', 'D', 'G', 'G', 'G', null],
                ['G', 'G', 'G', null, 'G', 'G', 'G', 'G', null, 'G', 'G', 'G'],
                [null, null, null, null, 'G', 'G', 'G', 'G', null, null, null, null],
                [null, null, null, null, 'G', 'G', 'G', 'G', null, null, null, null]
            ],
            closed: [
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, 'G', 'G', 'G', 'G', 'W', 'W', 'G', 'G', 'G', 'G', null],
                ['G', 'G', 'O', 'G', 'G', 'G', 'G', 'G', 'G', 'O', 'G', 'G'],
                ['G', 'G', 'O', 'O', 'G', 'G', 'G', 'G', 'O', 'O', 'G', 'G'],
                ['G', 'G', 'G', 'O', 'O', 'O', 'O', 'O', 'O', 'G', 'G', 'G'],
                [null, 'G', 'G', 'G', 'O', 'O', 'O', 'O', 'G', 'G', 'G', null],
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, null, null, 'D', 'G', 'G', 'G', 'G', 'D', null, null, null],
                [null, null, null, null, 'G', 'G', 'G', 'G', null, null, null, null],
                [null, null, 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', null, null],
                [null, 'G', 'G', 'G', 'D', 'D', 'D', 'D', 'G', 'G', 'G', null],
                ['G', 'G', 'G', null, 'G', 'G', 'G', 'G', null, 'G', 'G', 'G'],
                [null, null, null, null, 'G', 'G', 'G', 'G', null, null, null, null],
                [null, null, null, null, 'G', 'G', 'G', 'G', null, null, null, null]
            ]
        };
    }

    die() {
        this.alive = false;
        this.dead = true;
    }

    intersects(player) {
        if (!player || this.dead || !this.alive || this.currentOffset <= 2) return false;

        const currentY = this.pipeTopY - this.currentOffset;
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            currentY < player.y + player.height &&
            currentY + this.height > player.y
        );
    }

    update(player) {
        if (this.dead || !this.alive) return;

        this.animTimer += 0.08;
        this.openMouth = Math.floor(this.animTimer) % 2 === 0;

        const playerDistance = player ? Math.abs((player.x + player.width / 2) - (this.x + this.width / 2)) : 999;

        switch (this.state) {
            case 'HIDDEN':
                this.currentOffset = 0;
                this.timer++;
                // Só sobe do cano se o Mario estiver a mais de 48px de distância
                if (this.timer > 110 && playerDistance > 48) {
                    this.state = 'RISING';
                    this.timer = 0;
                }
                break;

            case 'RISING':
                this.currentOffset += this.speed;
                if (this.currentOffset >= this.maxHeight) {
                    this.currentOffset = this.maxHeight;
                    this.state = 'WAIT_TOP';
                    this.timer = 0;
                }
                break;

            case 'WAIT_TOP':
                this.timer++;
                if (this.timer > 85) {
                    this.state = 'RETRACTING';
                    this.timer = 0;
                }
                break;

            case 'RETRACTING':
                this.currentOffset -= this.speed;
                if (this.currentOffset <= 0) {
                    this.currentOffset = 0;
                    this.state = 'HIDDEN';
                    this.timer = 0;
                }
                break;
        }

        this.y = this.pipeTopY - this.currentOffset;
    }

    draw(ctx, camera) {
        if (this.dead || !this.alive || this.currentOffset <= 0) return;

        const screenX = camera ? this.x - camera.x : this.x;
        const screenY = camera ? this.y - camera.y : this.y;
        const clipTopY = camera ? this.pipeTopY - camera.y : this.pipeTopY;

        const matrix = this.openMouth ? this.sprites.open : this.sprites.closed;
        const rows = matrix.length;
        const cols = matrix[0].length;
        const pixelW = this.width / cols;
        const pixelH = this.height / rows;

        ctx.save();

        // MÁSCARA/RECORTE: Recorta tudo que estiver abaixo do topo do cano
        // garantindo que a planta NUNCA apareça voando fora do cano
        ctx.beginPath();
        ctx.rect(screenX - 10, clipTopY - 40, this.width + 20, 40);
        ctx.clip();

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