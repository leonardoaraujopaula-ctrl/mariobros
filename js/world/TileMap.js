export class TileMap {
    constructor(tileSize = 32, game = null) {
        this.tileSize = tileSize;
        this.game = game;
        this.map = [];
        this.cols = 0;
        this.rows = 0;
        this.width = 0;
        this.height = 0;
        this.bgColor = '#5c94fc';
    }

    loadLevel(levelNumber) {
        this.rows = 15;
        this.cols = 210;
        this.width = this.cols * this.tileSize;
        this.height = this.rows * this.tileSize;

        this.map = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

        // Chão principal (Linhas 13 e 14) com ABISMOS
        for (let r = 13; r < 15; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((c >= 69 && c <= 71) || (c >= 86 && c <= 88) || (c >= 153 && c <= 155)) {
                    this.map[r][c] = 0;
                } else {
                    this.map[r][c] = 1;
                }
            }
        }

        if (levelNumber === 1) {
            // ÁREA INICIAL
            this.map[9][16] = 2;  // ?
            this.map[9][20] = 3;  // Tijolo
            this.map[9][21] = 2;  // ? (Cogumelo)
            this.map[9][22] = 3;
            this.map[9][23] = 2;
            this.map[9][24] = 3;
            this.map[5][22] = 2;  // ? suspenso

            // Canos Iniciais
            this.createPipe(28, 2);
            this.createPipe(38, 3);
            this.createPipe(46, 4);
            this.createPipe(57, 4);

            // SEÇÃO INTERMEDIÁRIA
            this.map[9][64] = 3;
            this.map[9][65] = 2;
            this.map[9][66] = 3;

            // Placa de blocos sobre o abismo
            for (let c = 77; c <= 84; c++) this.map[9][c] = 3;
            this.map[5][80] = 2;

            // BLOCOS ADICIONAIS/OBSTÁCULOS EXTRAS
            this.map[9][94] = 3;
            this.map[9][95] = 2;
            this.map[9][96] = 3;
            this.map[5][100] = 3;
            this.map[5][101] = 2;
            this.map[5][102] = 3;

            // PIRÂMIDES DE BLOCOS
            this.createStair(120, 4, true);
            this.createStair(125, 4, false);

            this.createStair(138, 4, true);
            this.createStair(143, 4, false);

            // Mais Canos e Blocos pós-pirâmide
            this.createPipe(163, 2);
            this.map[9][170] = 3;
            this.map[9][171] = 2;
            this.map[9][172] = 3;
            this.map[5][171] = 2;

            // Pirâmide Final
            this.createStair(182, 8, true);

            // Mastro da Bandeira na Coluna 198
            this.map[12][198] = 1;
            for (let r = 3; r < 12; r++) {
                this.map[r][198] = 5;
            }
            this.map[2][198] = 8;

            // Castelo Final
            this.createCastle(202);
        }
    }

    createPipe(col, height) {
        for (let i = 0; i < height; i++) {
            this.map[13 - 1 - i][col] = 4;
        }
    }

    createStair(startCol, height, ascending = true) {
        for (let h = 1; h <= height; h++) {
            const col = ascending ? (startCol + h - 1) : (startCol + height - h);
            for (let r = 13 - h; r < 13; r++) {
                this.map[r][col] = 1;
            }
        }
    }

    createCastle(startCol) {
        for (let r = 8; r < 13; r++) {
            for (let c = startCol; c < startCol + 5; c++) {
                this.map[r][c] = 9;
            }
        }
        this.map[7][startCol] = 9;
        this.map[7][startCol + 2] = 9;
        this.map[7][startCol + 4] = 9;

        this.map[11][startCol + 2] = 10;
        this.map[12][startCol + 2] = 10;
    }

    getSolidTiles() {
        const solidTiles = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.isSolid(r, c)) {
                    solidTiles.push({
                        x: c * this.tileSize,
                        y: r * this.tileSize,
                        width: this.tileSize,
                        height: this.tileSize
                    });
                }
            }
        }
        return solidTiles;
    }

    checkCoinCollect(player) {
        if (!player) return;

        const startCol = Math.floor(player.x / this.tileSize);
        const endCol = Math.floor((player.x + player.width) / this.tileSize);
        const startRow = Math.floor(player.y / this.tileSize);
        const endRow = Math.floor((player.y + player.height) / this.tileSize);

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (this.map[r][c] === 7) {
                        this.map[r][c] = 0;
                        if (this.game) {
                            this.game.coins = (this.game.coins || 0) + 1;
                            this.game.score = (this.game.score || 0) + 200;
                        }
                    }
                }
            }
        }
    }

    isSolid(r, c) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return false;
        const tile = this.map[r][c];
        return tile === 1 || tile === 2 || tile === 3 || tile === 4 || tile === 6 || tile === 9;
    }

    checkXCollision(entity) {
        if (!entity) return;
        const startRow = Math.floor(entity.y / this.tileSize);
        const endRow = Math.floor((entity.y + entity.height - 1) / this.tileSize);

        if (entity.vx > 0) {
            const col = Math.floor((entity.x + entity.width) / this.tileSize);
            for (let r = startRow; r <= endRow; r++) {
                if (this.isSolid(r, col)) {
                    entity.x = col * this.tileSize - entity.width;
                    entity.vx = 0;
                    break;
                }
            }
        } else if (entity.vx < 0) {
            const col = Math.floor(entity.x / this.tileSize);
            for (let r = startRow; r <= endRow; r++) {
                if (this.isSolid(r, col)) {
                    entity.x = (col + 1) * this.tileSize;
                    entity.vx = 0;
                    break;
                }
            }
        }
    }

    checkYCollision(entity) {
        if (!entity) return;
        const startCol = Math.floor(entity.x / this.tileSize);
        const endCol = Math.floor((entity.x + entity.width - 1) / this.tileSize);

        if (entity.vy > 0) {
            const row = Math.floor((entity.y + entity.height) / this.tileSize);
            for (let c = startCol; c <= endCol; c++) {
                if (this.isSolid(row, c)) {
                    entity.y = row * this.tileSize - entity.height;
                    entity.vy = 0;
                    entity.isGrounded = true;
                    break;
                }
            }
        } else if (entity.vy < 0) {
            const row = Math.floor(entity.y / this.tileSize);
            for (let c = startCol; c <= endCol; c++) {
                if (this.isSolid(row, c)) {
                    entity.y = (row + 1) * this.tileSize;
                    entity.vy = 0;
                    this.hitBlock(row, c, entity);
                    break;
                }
            }
        }
    }

    hitBlock(row, col, player) {
        const tile = this.map[row][col];
        if (tile === 2) {
            this.map[row][col] = 6;
            if (this.game) {
                if (col === 21 && typeof this.game.spawnMushroom === 'function') {
                    this.game.spawnMushroom(col * this.tileSize, (row - 1) * this.tileSize);
                } else if (typeof this.game.spawnFloatingCoin === 'function') {
                    this.game.spawnFloatingCoin(col * this.tileSize, (row - 1) * this.tileSize);
                    this.game.score = (this.game.score || 0) + 200;
                    this.game.coins = (this.game.coins || 0) + 1;
                }
            }
        } else if (tile === 3) {
            if (player && player.state !== 'SMALL') {
                this.map[row][col] = 0;
            }
        }
    }

    drawClouds(ctx, camera) {
        ctx.fillStyle = '#ffffff';
        const clouds = [
            { x: 100, y: 80, w: 90, h: 30 },
            { x: 450, y: 60, w: 120, h: 35 },
            { x: 900, y: 90, w: 100, h: 30 },
            { x: 1400, y: 70, w: 110, h: 35 },
            { x: 2000, y: 80, w: 130, h: 35 },
            { x: 2700, y: 60, w: 100, h: 30 },
            { x: 3500, y: 90, w: 120, h: 35 },
            { x: 4200, y: 70, w: 110, h: 35 },
            { x: 5000, y: 80, w: 130, h: 35 }
        ];

        clouds.forEach(c => {
            const screenX = c.x - camera.x * 0.5;
            if (screenX + c.w > 0 && screenX < camera.width) {
                ctx.beginPath();
                ctx.roundRect(screenX, c.y, c.w, c.h, 15);
                ctx.fill();
            }
        });
    }

    draw(ctx, camera) {
        this.drawClouds(ctx, camera);

        const startCol = Math.max(0, Math.floor(camera.x / this.tileSize));
        const endCol = Math.min(this.cols, Math.ceil((camera.x + camera.width) / this.tileSize));

        for (let r = 0; r < this.rows; r++) {
            for (let c = startCol; c < endCol; c++) {
                const tile = this.map[r][c];
                const x = c * this.tileSize - camera.x;
                const y = r * this.tileSize - camera.y;

                if (tile === 1) { // Chão
                    ctx.fillStyle = '#c84c0c';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 2) { // Bloco '?'
                    ctx.fillStyle = '#fcb42c';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000000';
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 18px monospace';
                    ctx.fillText('?', x + 10, y + 22);
                } else if (tile === 3) { // Tijolo
                    ctx.fillStyle = '#b84418';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000000';
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 4) { // Cano Verde
                    const isTop = (r === 0 || this.map[r - 1][c] !== 4);
                    if (isTop) {
                        ctx.fillStyle = '#00a800';
                        ctx.fillRect(x - 2, y, this.tileSize + 4, this.tileSize);
                        ctx.fillStyle = '#a8e4a8';
                        ctx.fillRect(x, y, 4, this.tileSize);
                        ctx.strokeStyle = '#000000';
                        ctx.strokeRect(x - 2, y, this.tileSize + 4, this.tileSize);
                    } else {
                        ctx.fillStyle = '#00a800';
                        ctx.fillRect(x, y, this.tileSize, this.tileSize);
                        ctx.fillStyle = '#a8e4a8';
                        ctx.fillRect(x + 4, y, 4, this.tileSize);
                        ctx.strokeStyle = '#000000';
                        ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                    }
                } else if (tile === 5) { // Mastro
                    ctx.fillStyle = '#00a800';
                    ctx.fillRect(x + 12, y, 8, this.tileSize);
                    ctx.fillStyle = '#a8e4a8';
                    ctx.fillRect(x + 14, y, 2, this.tileSize);

                    if (r === 3) {
                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.moveTo(x + 12, y);
                        ctx.lineTo(x - 20, y + 12);
                        ctx.lineTo(x + 12, y + 24);
                        ctx.closePath();
                        ctx.fill();
                        ctx.strokeStyle = '#000000';
                        ctx.stroke();

                        ctx.fillStyle = '#00a800';
                        ctx.fillRect(x - 6, y + 9, 6, 6);
                    }
                } else if (tile === 6) { // Bloco Usado
                    ctx.fillStyle = '#804000';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000000';
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 7) { // Moeda no Ar
                    ctx.fillStyle = '#fce02c';
                    ctx.beginPath();
                    ctx.arc(x + 16, y + 16, 8, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === 8) { // Topo do Mastro
                    ctx.fillStyle = '#00a800';
                    ctx.beginPath();
                    ctx.arc(x + 16, y + 16, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#a8e4a8';
                    ctx.beginPath();
                    ctx.arc(x + 13, y + 13, 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === 9) { // Castelo Tijolo Marrom
                    ctx.fillStyle = '#b84418';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);

                    ctx.fillStyle = '#000000';
                    ctx.fillRect(x, y + 16, this.tileSize, 1);
                    ctx.fillRect(x + 16, y, 1, 16);
                    ctx.fillRect(x + 8, y + 16, 1, 16);
                } else if (tile === 10) { // Porta do Castelo
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                }
            }
        }
    }
}