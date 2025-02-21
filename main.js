const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function main() {

    ctx.strokeRect(400, 50, 100, 100);

    // Rita en cirkel
    ctx.beginPath();
    ctx.arc(50, 400, 50, 0, Math.PI * 2, true);
    ctx.stroke();
}

// 240hz
// 60hz

let lastTime = Date.now();
let deltaTime = 0;

// 1. lastTime = 0
// 2. lastTime = 1 (1 - 0) = 1
// 3. lastTime = 2 (2 - 1) = 1
// 4. lastTime = 3 (3 - 2) = 1

class Rectangle {
    constructor(x, y, width, height, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }

    update() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.velocityX >= 600) {
            this.velocityX = 600;
        } else if (this.velocityX <= -600) {
            this.velocityX = -600;
        }

        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Studsa i höger kant
        if (this.x + this.width >= canvas.width) {
            this.velocityX *= -1.1;
            this.x = canvas.width - this.width - 1;
        }

        // Studsa i vänster kant
        if (this.x <= 0) {
            this.velocityX *= -1.1;
            this.x = 1;
        }

        // Studsa i undre kant
        if (this.y + this.height >= canvas.height) {
            this.velocityY *= -1.1;
            this.y = canvas.height - this.height - 1;
        }

        // Studsa i övre kant
        if (this.y <= 0) {
            this.velocityY *= -1.1;
            this.y = 1;
        }
    }

    isColliding(otherRectangle) {
        return (
            this.x < otherRectangle.x + otherRectangle.width &&
            this.x + this.width > otherRectangle.x &&
            this.y < otherRectangle.y + otherRectangle.height &&
            this.y + this.height > otherRectangle.y
        );
    }
}

const rectangles = [
    new Rectangle(0, 0, 50, 50, 100, 50),
    new Rectangle(10, 60, 50, 50, 200, 20),
    new Rectangle(20, 120, 50, 50, 500, 80),
    new Rectangle(400, 0, 50, 50, 100, 50),
    new Rectangle(100, 60, 50, 50, 200, 20),
    new Rectangle(60, 120, 50, 50, 500, 80),
];

function draw() {
    const currentTime = Date.now();
    deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const rectangle of rectangles) {
        rectangle.update();
    }

    for (let i = 0; i < rectangles.length; i++) {
        const rectangle = rectangles[i];

        for (let l = i + 1; l < rectangles.length; l++) {
            const otherRectangle = rectangles[l];

            if (rectangle.isColliding(otherRectangle)) {
                rectangle.velocityX *= -1;
                rectangle.velocityY *= -1;
                otherRectangle.velocityX *= -1;
                otherRectangle.velocityY *= -1;
            }
        }
    }

    requestAnimationFrame(draw);
}

main();
draw();