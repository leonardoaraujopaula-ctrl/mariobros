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
        this.cols = 220; // Extensão de 220 colunas
        this.width = this.cols * this.tileSize;
        this.height = this.rows * this.tileSize;

        this.map = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

        if (levelNumber === 1) {
            this.bgColor = '#5c94fc'; // Azul Claro Tradicional

            // Chão com abismos/buracos
            for (let r = 13; r < 15; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if ((c >= 69 && c <= 71) || (c >= 86 && c <= 88) || (c >= 115 && c <= 117) || (c >= 153 && c <= 155)) {
                        this.map[r][c] = 0;
                    } else {
                        this.map[r][c] = 1;
                    }
                }
            }

            // ÁREA INICIAL DE BLOCOS E TIJOLOS
            this.map[9][16] = 2;  // ?
            this.map[9][20] = 3;  // Tijolo
            this.map[9][21] = 2;  // ? (Cogumelo)
            this.map[9][22] = 3;
            this.map[9][23] = 2;
            this.map[9][24] = 3;
            this.map[5][22] = 2;  // ? no alto

            // Canos Iniciais
            this.createPipe(28, 2);
            this.createPipe(38, 3);
            this.createPipe(46, 4);
            this.createPipe(57, 4);

            // SEÇÃO 2: Plataformas de tijolos e moedas
            this.map[9][64] = 3;
            this.map[9][65] = 2;
            this.map[9][66] = 3;

            for (let c = 75; c <= 84; c++) {
                this.map[9][c] = (c % 2 === 0) ? 2 : 3;
                if (c >= 78 && c <= 81) this.map[5][c] = 3;
            }
            this.map[5][80] = 2;

            // Moedas sobre abismos
            this.map[8][70] = 7;
            this.map[8][87] = 7;
            this.map[8][116] = 7;

            // SEÇÃO 3: Mais blocos '?' e estruturas elevadas
            for (let c = 92; c <= 98; c++) this.map[9][c] = 3;
            this.map[9][95] = 2;
            this.map[5][94] = 3;
            this.map[5][95] = 2;
            this.map[5][96] = 3;

            // Canos intermediários
            this.createPipe(105, 3);
            this.createPipe(112, 2);

            // Pirâmides de blocos
            this.createStair(120, 4, true);
            this.createStair(125, 4, false);

            // Mais blocos e pirâmides antes do final
            for (let c = 132; c <= 136; c++) this.map[9][c] = 3;
            this.map[9][134] = 2;

            this.createStair(140, 4, true);
            this.createStair(145, 4, false);

            // Canos finais
            this.createPipe(163, 2);
            this.createPipe(172, 3);

            this.map[9][178] = 3;
            this.map[9][179] = 2;
            this.map[9][180] = 3;
            this.map[5][179] = 2;

            // Pirâmide para acessar a bandeira
            this.createStair(188, 8, true);

            // Mastro da Bandeira
            this.map[12][202] = 1;
            for (let r = 3; r < 12; r++) {
                this.map[r][202] = 5;
            }
            this.map[2][202] = 8;

            // Castelo Final
            this.createCastle(206);

        } else if (levelNumber === 2) {
            this.bgColor = '#000000'; // Preto Subterrâneo NES

            for (let c = 0; c < 195; c++) {
                this.map[0][c] = 1;
            }

            for (let r = 13; r < 15; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if ((c >= 30 && c <= 32) || (c >= 62 && c <= 64) || (c >= 105 && c <= 107) || (c >= 145 && c <= 147)) {
                        this.map[r][c] = 0;
                    } else {
                        this.map[r][c] = 1;
                    }
                }
            }

            this.createPipe(18, 2);
            this.createPipe(26, 3);
            this.createPipe(42, 4);
            this.createPipe(56, 3);
            this.createPipe(78, 2);
            this.createPipe(92, 4);
            this.createPipe(118, 3);
            this.createPipe(135, 2);
            this.createPipe(160, 4);

            this.map[9][10] = 2;
            this.map[9][11] = 3;
            this.map[9][12] = 2;
            this.map[9][13] = 3;

            for (let c = 34; c <= 40; c++) {
                this.map[9][c] = (c % 2 === 0) ? 2 : 3;
                this.map[5][c] = 3;
            }

            this.map[8][30] = 7; this.map[8][31] = 7; this.map[8][32] = 7;
            this.map[8][62] = 7; this.map[8][63] = 7; this.map[8][64] = 7;
            this.map[8][105] = 7; this.map[8][106] = 7;

            this.createStair(48, 4, true);
            this.createStair(52, 4, false);

            for (let c = 68; c <= 75; c++) {
                this.map[9][c] = 3;
                if (c === 71 || c === 73) this.map[9][c] = 2;
            }

            for (let c = 82; c <= 88; c++) this.map[5][c] = 3;
            this.map[5][85] = 2;

            this.createStair(98, 5, true);
            this.createStair(108, 5, false);

            for (let c = 122; c <= 130; c++) {
                this.map[9][c] = (c % 2 === 0) ? 3 : 2;
            }
            for (let c = 148; c <= 155; c++) {
                this.map[9][c] = 3;
                this.map[5][c] = 3;
            }

            this.createStair(170, 8, true);

            this.map[12][192] = 1;
            for (let r = 3; r < 12; r++) {
                this.map[r][192] = 5;
            }
            this.map[2][192] = 8;

            this.createCastle(197);

        } else if (levelNumber === 3) {
            this.bgColor = '#182C61'; // Céu Noturno / Azul Escuro Nível 3

            for (let r = 13; r < 15; r++) {
                for (let c = 0; c < this.cols; c++) {
                    if ((c >= 18 && c <= 22) || (c >= 45 && c <= 50) || (c >= 78 && c <= 84) ||
                        (c >= 110 && c <= 116) || (c >= 142 && c <= 148) || (c >= 175 && c <= 180)) {
                        this.map[r][c] = 0;
                    } else {
                        this.map[r][c] = 1;
                    }
                }
            }

            for (let c = 10; c <= 16; c++) this.map[9][c] = 3;
            this.map[9][13] = 2;
            this.map[5][13] = 2;

            for (let c = 19; c <= 21; c++) this.map[8][c] = 3;
            this.map[8][20] = 2;

            for (let c = 26; c <= 35; c++) {
                this.map[9][c] = (c % 2 === 0) ? 3 : 2;
                if (c >= 29 && c <= 32) this.map[5][c] = 3;
            }

            this.map[7][46] = 7; this.map[7][47] = 7; this.map[7][48] = 7; this.map[7][49] = 7;
            for (let c = 46; c <= 49; c++) this.map[9][c] = 3;

            this.createPipe(38, 3);
            this.createPipe(56, 4);

            this.createStair(60, 5, true);
            this.createStair(68, 5, false);

            for (let c = 74; c <= 76; c++) this.map[6][c] = 3;
            this.map[6][75] = 2;

            for (let c = 79; c <= 83; c++) this.map[7][c] = 3;
            this.map[7][81] = 2;

            this.createPipe(90, 2);
            this.createPipe(100, 4);

            for (let c = 111; c <= 115; c++) this.map[8][c] = 3;
            this.map[8][113] = 2;

            for (let c = 120; c <= 132; c++) {
                this.map[9][c] = 3;
                if (c === 123 || c === 126 || c === 129) this.map[9][c] = 2;
                if (c >= 124 && c <= 128) this.map[5][c] = 3;
            }

            this.createPipe(138, 3);

            for (let c = 143; c <= 147; c++) this.map[8][c] = 3;
            this.map[8][145] = 2;

            this.createStair(155, 4, true);
            this.createStair(162, 4, false);

            this.createPipe(170, 2);

            for (let c = 176; c <= 179; c++) this.map[8][c] = 3;

            this.createStair(186, 8, true);

            this.map[12][200] = 1;
            for (let r = 3; r < 12; r++) {
                this.map[r][200] = 5;
            }
            this.map[2][200] = 8;

            this.createCastle(205);
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
                if ((col === 21 || col === 80 || col === 126) && typeof this.game.spawnMushroom === 'function') {
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
        if (this.bgColor === '#000000') return; // Sem nuvens no subterrâneo

        // Sempre branco sólido e contorno preto sólido para não criar sobreposição transparente
        const cloudColor = '#ffffff';
        const outlineColor = '#000000';

        const clouds = [
            { x: 120, y: 70, scale: 1 },
            { x: 500, y: 50, scale: 1.2 },
            { x: 920, y: 80, scale: 1 },
            { x: 1400, y: 60, scale: 1.3 },
            { x: 2000, y: 75, scale: 1 },
            { x: 2600, y: 55, scale: 1.2 },
            { x: 3300, y: 80, scale: 1 },
            { x: 4100, y: 65, scale: 1.3 },
            { x: 5000, y: 70, scale: 1.1 }
        ];

        clouds.forEach(cloud => {
            const screenX = cloud.x - camera.x * 0.4; // Efeito Parallax
            if (screenX + 100 * cloud.scale > 0 && screenX < camera.width) {
                const s = cloud.scale;

                ctx.save();
                ctx.translate(screenX, cloud.y);

                // Círculos arredondados perfeitos
                const circles = [
                    { x: 20 * s, y: 20 * s, r: 16 * s },
                    { x: 40 * s, y: 14 * s, r: 20 * s },
                    { x: 62 * s, y: 18 * s, r: 16 * s },
                    { x: 40 * s, y: 24 * s, r: 16 * s }
                ];

                // 1. Contorno Preto Externo
                ctx.fillStyle = outlineColor;
                circles.forEach(c => {
                    ctx.beginPath();
                    ctx.arc(c.x, c.y, c.r + 2, 0, Math.PI * 2);
                    ctx.fill();
                });

                // 2. Preenchimento Branco Interno
                ctx.fillStyle = cloudColor;
                circles.forEach(c => {
                    ctx.beginPath();
                    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
                    ctx.fill();
                });

                // 3. Preenchimento de base
                ctx.fillRect(10 * s, 26 * s, 60 * s, 10 * s);

                ctx.restore();
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
                    ctx.fillStyle = (this.bgColor === '#000000') ? '#008080' : '#c84c0c';
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
                    ctx.fillStyle = (this.bgColor === '#000000') ? '#008080' : '#b84418';
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
                } else if (tile === 9) { // Castelo
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