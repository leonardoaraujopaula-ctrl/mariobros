export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
    }

    update(target, mapWidth) {
        // Centraliza a câmera no jogador
        this.x = target.x - this.width / 3;

        // Impede que a câmera volte para a esquerda (como no Mario NES) ou saia dos limites
        if (this.x < 0) this.x = 0;
        if (this.x > mapWidth - this.width) {
            this.x = mapWidth - this.width;
        }
    }
}