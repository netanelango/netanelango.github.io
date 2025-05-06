const canvas = document.getElementById('bubbles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('.hero').offsetHeight;
}
resizeCanvas();

window.addEventListener('resize', resizeCanvas);

class Ball {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -Math.random() * canvas.height;
       this.radius = Math.random() * 15 + 15; // entre 15 et 30px

        this.vy = 0; // vitesse verticale
        this.gravity = 0.5;
        this.bounce = 0.75; // rebond
        this.color = `rgb(226, 214, 214)`; // blanc légèrement transparent
        this.stopped = false;
    }

    update() {
        if (this.stopped) return;

        this.vy += this.gravity;
        this.y += this.vy;

        // Si touche le sol
        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -this.bounce;

            // Si l'énergie est trop faible, on arrête les rebonds
            if (Math.abs(this.vy) < 1) {
                this.vy = 0;
                this.stopped = true;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 2;
        ctx.fill();

        ctx.closePath();
    }
}

const balls = [];
for (let i = 0; i < 50; i++) {
    balls.push(new Ball());
}
const cursorCanvas = document.getElementById('cursorBall');
const cursorCtx = cursorCanvas.getContext('2d');

function resizeCursorCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
}
resizeCursorCanvas();
window.addEventListener('resize', resizeCursorCanvas);

// Position actuelle de la balle
let cursor = { x: -100, y: -100 };  // Hors de l'écran au départ
let ballPosition = { x: cursor.x, y: cursor.y };  // Position de la balle suiveuse

const latencyFactor = 0.1;  // Contrôle la vitesse de suivi

document.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

function drawCursorBall() {
    // Interpolation pour mouvement lent (suivi fluide)
    ballPosition.x += (cursor.x - ballPosition.x) * latencyFactor;
    ballPosition.y += (cursor.y - ballPosition.y) * latencyFactor;

    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    cursorCtx.beginPath();
    cursorCtx.arc(ballPosition.x, ballPosition.y, 10, 0, Math.PI * 2);
    cursorCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    cursorCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    cursorCtx.shadowBlur = 40;
    cursorCtx.fill();
    cursorCtx.closePath();

    requestAnimationFrame(drawCursorBall);
}
drawCursorBall();


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let ball of balls) {
        ball.update();
        ball.draw(ctx);
    }

    requestAnimationFrame(animate);
}

animate();
