export class FireFlower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.active = true;
        this.animTimer = 0;
    }

    update() {
        this.animTimer++;
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

        // Pétalas animadas (piscar de cores)
        const colors = ['#e74c3c', '#f39c12', '#ffffff'];
        const currentColor = colors[Math.floor(this.animTimer / 8) % colors.length];

        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(x + 15, y + 12, 12, 0, Math.PI * 2);
        ctx.fill();

        // Centro da Flor
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(x + 15, y + 12, 5, 0, Math.PI * 2);
        ctx.fill();

        // Caule e Folhas
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(x + 13, y + 20, 4, 10);
        ctx.fillRect(x + 7, y + 22, 16, 4);
    }
}