import { Goomba } from '../entities/Goomba.js';
import { Koopa } from '../entities/Koopa.js';
import { Mushroom } from '../entities/Mushroom.js';
import { FireFlower } from '../entities/FireFlower.js';

export class Level1 {
    constructor() {
        this.tileSize = 32;
        // Mapa estendido (180 colunas x 15 linhas)
        this.cols = 180;
        this.rows = 15;
        this.width = this.cols * this.tileSize;
        this.height = this.rows * this.tileSize;

        this.tiles = [];
        this.questionBlocks = [];
        this.mushrooms = [];
        this.flowers = [];
        this.enemies = [];

        // Posição da bandeira de fim de fase
        this.flagX = (this.cols - 12) * this.tileSize;

        this.initMap();
        this.initEnemies();
    }

    initMap() {
        // Inicializa a matriz com zeros (espaço vazio)
        for (let r = 0; r < this.rows; r++) {
            this.tiles[r] = new Array(this.cols).fill(0);
        }

        // 1. Chão com abismos (Pits)
        for (let c = 0; c < this.cols; c++) {
            // Abismos localizados em colunas estratégicas
            if ((c >= 68 && c <= 71) || (c >= 112 && c <= 115) || (c >= 148 && c <= 150)) {
                continue; // Vazio (abismo)
            }
            this.tiles[13][c] = 1;
            this.tiles[14][c] = 1;
        }

        // 2. Canos com alturas variáveis
        this.createPipe(22, 11, 2);
        this.createPipe(34, 10, 3);
        this.createPipe(46, 9, 4);
        this.createPipe(57, 10, 3);

        // 3. Blocos de Interrogação (?) e Tijolos (Seção Inicial)
        this.tiles[9][16] = 2; // ? com Cogumelo
        this.tiles[9][20] = 3; // Tijolo
        this.tiles[9][21] = 2; // ?
        this.tiles[9][22] = 3; // Tijolo
        this.tiles[9][23] = 2; // ?
        this.tiles[9][24] = 3; // Tijolo
        this.tiles[5][22] = 2; // ? suspenso

        // 4. Ponte e Estrutura de Tijolos Flutuantes
        for (let c = 75; c <= 86; c++) {
            this.tiles[9][c] = 3; // Linha de tijolos
        }
        this.tiles[9][78] = 2; // ? com Flor no meio da ponte
        this.tiles[5][80] = 2; // ? flutuante alto

        // 5. Plataforma sobre o segundo abismo
        this.tiles[9][111] = 3;
        this.tiles[9][112] = 3;
        this.tiles[9][113] = 3;
        this.tiles[9][114] = 3;

        // 6. Pirâmides de Escada (Obstáculo clássico do NES)
        this.createStairs(90, 4);   // Pirâmide subindo/descendo
        this.createStairs(125, 5);  // Pirâmide grande antes do abismo final

        // 7. Pirâmide Final até a Bandeira
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j <= i; j++) {
                this.tiles[12 - j][158 + i] = 4; // Bloco rígido de escada
            }
        }

        // Mastro e Bandeira
        for (let r = 3; r <= 12; r++) {
            this.tiles[r][168] = 5; // Mastro da bandeira
        }
        this.tiles[3][167] = 6;     // Topo do mastro/bandeira

        // Mapeamento dos blocos de interrogação interativos
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.tiles[r][c] === 2) {
                    // Define o item secreto de cada bloco
                    let item = 'COIN';
                    if ((r === 9 && c === 16) || (r === 5 && c === 22)) item = 'MUSHROOM';
                    if (r === 9 && c === 78) item = 'FLOWER';

                    this.questionBlocks.push({
                        x: c * this.tileSize,
                        y: r * this.tileSize,
                        row: r,
                        col: c,
                        hit: false,
                        item: item
                    });
                }
            }
        }
    }

    createPipe(col, startRow, height) {
        for (let h = 0; h < height; h++) {
            const r = startRow + h;
            this.tiles[r][col] = 7;     // Lado esquerdo do cano
            this.tiles[r][col + 1] = 8; // Lado direito do cano
        }
    }

    createStairs(startCol, height) {
        // Escada subindo
        for (let i = 0; i < height; i++) {
            for (let j = 0; j <= i; j++) {
                this.tiles[12 - j][startCol + i] = 4;
            }
        }
        // Escada descendo
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < height - i; j++) {
                this.tiles[12 - j][startCol + height + i] = 4;
            }
        }
    }

    initEnemies() {
        this.enemies = [
            // Início
            new Goomba(26 * this.tileSize, 12 * this.tileSize),

            // Entre os Canos
            new Goomba(38 * this.tileSize, 12 * this.tileSize),
            new Goomba(41 * this.tileSize, 12 * this.tileSize),
            new Koopa(50 * this.tileSize, 12 * this.tileSize),

            // Patrulhando a Ponte de Tijolos e o Chão
            new Goomba(77 * this.tileSize, 12 * this.tileSize),
            new Goomba(81 * this.tileSize, 12 * this.tileSize),
            new Goomba(84 * this.tileSize, 8 * this.tileSize), // Goomba em cima da ponte
            new Koopa(88 * this.tileSize, 12 * this.tileSize),

            // Entre as Pirâmides de Escada
            new Goomba(102 * this.tileSize, 12 * this.tileSize),
            new Goomba(105 * this.tileSize, 12 * this.tileSize),
            new Koopa(120 * this.tileSize, 12 * this.tileSize),

            // Área Final e Escadarias da Bandeira
            new Goomba(138 * this.tileSize, 12 * this.tileSize),
            new Goomba(141 * this.tileSize, 12 * this.tileSize),
            new Goomba(144 * this.tileSize, 12 * this.tileSize),
            new Koopa(152 * this.tileSize, 12 * this.tileSize)
        ];
    }

    checkXCollision(entity) {
        const leftTile = Math.floor(entity.x / this.tileSize);
        const rightTile = Math.floor((entity.x + entity.width - 1) / this.tileSize);
        const topTile = Math.floor(entity.y / this.tileSize);
        const bottomTile = Math.floor((entity.y + entity.height - 1) / this.tileSize);

        for (let r = topTile; r <= bottomTile; r++) {
            for (let c = leftTile; c <= rightTile; c++) {
                if (this.isSolid(r, c)) {
                    if (entity.vx > 0) {
                        entity.x = c * this.tileSize - entity.width;
                        entity.vx = 0;
                    } else if (entity.vx < 0) {
                        entity.x = (c + 1) * this.tileSize;
                        entity.vx = 0;
                    }
                }
            }
        }
    }

    checkYCollision(entity) {
        const leftTile = Math.floor(entity.x / this.tileSize);
        const rightTile = Math.floor((entity.x + entity.width - 1) / this.tileSize);
        const topTile = Math.floor(entity.y / this.tileSize);
        const bottomTile = Math.floor((entity.y + entity.height - 1) / this.tileSize);

        for (let r = topTile; r <= bottomTile; r++) {
            for (let c = leftTile; c <= rightTile; c++) {
                if (this.isSolid(r, c)) {
                    if (entity.vy > 0) { // Caindo
                        entity.y = r * this.tileSize - entity.height;
                        entity.vy = 0;
                        entity.isGrounded = true;
                    } else if (entity.vy < 0) { // Batendo a cabeça (Subindo)
                        entity.y = (r + 1) * this.tileSize;
                        entity.vy = 0;
                        this.hitBlock(r, c, entity);
                    }
                }
            }
        }
    }

    hitBlock(r, c, player) {
        // Reação ao bater em blocos de Interrogação (?)
        if (this.tiles[r][c] === 2) {
            const block = this.questionBlocks.find(b => b.row === r && b.col === c);
            if (block && !block.hit) {
                block.hit = true;
                this.tiles[r][c] = 9; // Vira bloco sem uso / cinza

                if (block.item === 'MUSHROOM') {
                    this.mushrooms.push(new Mushroom(block.x, block.y - 32));
                } else if (block.item === 'FLOWER') {
                    this.flowers.push(new FireFlower(block.x, block.y - 32));
                }
            }
        }
    }

    isSolid(r, c) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return false;
        const tile = this.tiles[r][c];
        // Todos os blocos sólidos (Chão, ?, Tijolo, Escada, Canos, Bloco Usado)
        return tile === 1 || tile === 2 || tile === 3 || tile === 4 || tile === 7 || tile === 8 || tile === 9;
    }

    update(player, audio) {
        // Atualiza Cogumelos e Flores ativas
        this.mushrooms.forEach(m => m.update(this));
        this.flowers.forEach(f => f.update(this));

        // Atualiza Inimigos
        this.enemies.forEach(e => {
            if (typeof e.update === 'function') {
                e.update(this);
            }
        });
    }

    draw(ctx, camera) {
        const startCol = Math.max(0, Math.floor(camera.x / this.tileSize));
        const endCol = Math.min(this.cols, Math.ceil((camera.x + camera.width) / this.tileSize) + 1);

        for (let r = 0; r < this.rows; r++) {
            for (let c = startCol; c < endCol; c++) {
                const tile = this.tiles[r][c];
                const x = c * this.tileSize - camera.x;
                const y = r * this.tileSize - camera.y;

                if (tile === 1) { // Chão
                    ctx.fillStyle = '#D86800';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000';
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 2) { // Bloco ?
                    ctx.fillStyle = '#FC9838';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.fillStyle = '#000';
                    ctx.font = 'bold 20px monospace';
                    ctx.fillText('?', x + 9, y + 24);
                } else if (tile === 3) { // Tijolo
                    ctx.fillStyle = '#B84418';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000';
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 4) { // Escada / Pirâmide
                    ctx.fillStyle = '#008088';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 7 || tile === 8) { // Canos
                    ctx.fillStyle = '#00A800';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                    ctx.strokeStyle = '#000';
                    ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 9) { // Bloco de ? Usado
                    ctx.fillStyle = '#808080';
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 5) { // Mastro da Bandeira
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(x + 12, y, 8, this.tileSize);
                } else if (tile === 6) { // Topo da Bandeira
                    ctx.fillStyle = '#00A800';
                    ctx.beginPath();
                    ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Desenha Itens e Inimigos na tela
        this.mushrooms.forEach(m => m.draw(ctx, camera));
        this.flowers.forEach(f => f.draw(ctx, camera));
        this.enemies.forEach(e => {
            if (typeof e.draw === 'function') {
                e.draw(ctx, camera);
            }
        });
    }
}