export class Sprite {
    constructor({ imageSrc, frameWidth, frameHeight, frameBuffer = 6 }) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.isLoaded = false;

        this.image.onload = () => {
            this.isLoaded = true;
        };

        this.frameWidth = frameWidth;   // Largura de cada quadro na imagem
        this.frameHeight = frameHeight; // Altura de cada quadro na imagem

        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.frameBuffer = frameBuffer; // Controla a velocidade da animação
    }

    // Desenha uma imagem estática ou o quadro atual
    draw(ctx, x, y, flipX = false) {
        if (!this.isLoaded) return;

        ctx.save();

        if (flipX) {
            // Inverte a imagem horizontalmente se o personagem mudar de lado
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                -x - this.frameWidth, y,
                this.frameWidth, this.frameHeight
            );
        } else {
            ctx.drawImage(
                this.image,
                this.currentFrame * this.frameWidth, 0,
                this.frameWidth, this.frameHeight,
                x, y,
                this.frameWidth, this.frameHeight
            );
        }

        ctx.restore();
    }

    // Atualiza a animação
    updateAnimation(maxFrames) {
        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < maxFrames - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }
}