const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const alivePlayerImage = new Image();
alivePlayerImage.src = "player.png";
const deadPlayerImage = new Image();
deadPlayerImage.src = "dead.png";
let playerImage = alivePlayerImage;
const appleImage = new Image();
appleImage.src = "apple.webp";

const background = new Image();
background.src = "windows-background.png";

let lastUpdateTime = Date.now();
let deltaTime = 0;

let score = 0;
let dead = false;

class DangerousApple {
    constructor() {
        this.width = 70;
        this.height = 70;
        this.x = Math.max(0, Math.random() * canvas.width - this.width);
        this.y = 0 - this.height;
        this.speed = 500;
    }

    update() {
        this.y += this.speed * deltaTime;

        ctx.drawImage(appleImage, this.x, this.y, this.width, this.height);
    }

    isBelowScreen() {
        return this.y >= canvas.height;
    }
}

class Player {
    constructor() {
        this.width = 200;
        this.height = 200;
        this.x = (canvas.width / 2) - (this.width / 2);
        this.y = canvas.height - this.height - 40;
        this.left = false;
        this.right = false;
    }

    update() {
        const speed = 300;
        if (this.left) {
            this.x -= speed * deltaTime;
        } else if (this.right) {
            this.x += speed * deltaTime;
        }

        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width - this.width;
        }

        if (this.x <= 0) {
            this.x = 0;
        }

        ctx.save();

        ctx.translate(this.x, this.y);
        if (this.left) {
            ctx.translate(this.width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(playerImage, 0, 0, this.width, this.height);
        ctx.restore();
    }

    isColliding(apple) {
        const x = this.x + 20;
        const y = this.y + 20;
        const width = this.width - 20;
        const height = this.height - 20;

        return (
            x < apple.x + apple.width &&
            x + width > apple.x &&
            y < apple.y + apple.height &&
            y + height > apple.y
        );
    }
}

let player = new Player();
let apples = [];

function setupGame() {
    document.addEventListener("keydown", event => {
        if (event.key === "a" || event.key === "ArrowLeft") {
            player.left = true;
        } else if (event.key === "d" || event.key === "ArrowRight") {
            player.right = true;
        }
    });

    document.addEventListener("keyup", event => {
        if (event.key === "a" || event.key === "ArrowLeft") {
            player.left = false;
        } else if (event.key === "d" || event.key === "ArrowRight") {
            player.right = false;
        }
    });

    spawnApple();
}

function resetGame() {
    apples = [];
    player = new Player();
    dead = false;
    score = 0;
    playerImage = alivePlayerImage;
}

function spawnApple() {
    apples.push(new DangerousApple());

    setTimeout(spawnApple, 1000);
}

function updateGame() {
    const currentTime = Date.now();
    deltaTime = (currentTime - lastUpdateTime) / 1000;
    lastUpdateTime = currentTime;

    if (!dead) {
        score += deltaTime;
    }

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

    player.update();

    for (const apple of apples) {
        apple.update();

        if (!dead && player.isColliding(apple)) {
            //alert("YOU LOSE!");
            playerImage = deadPlayerImage;
            dead = true;

            const resetButton = document.createElement("button");
            resetButton.innerText = "Reset Game";

            document.body.append(resetButton);

            resetButton.addEventListener("click", () => {
                resetButton.remove();
                resetGame();
            });
        }
    }

    apples = apples.filter(apple => !apple.isBelowScreen());

    ctx.fillStyle = "black";
    ctx.font = "32px serif";
    ctx.fillText("Score: " + score.toFixed(0), 20, 50);

    if (dead) {
        ctx.fillStyle = "black";
        ctx.font = "64px serif";
        ctx.fillText("WASTED", canvas.width / 2 - 100, canvas.height / 2);
    }

    requestAnimationFrame(updateGame);
}

setupGame();
updateGame();