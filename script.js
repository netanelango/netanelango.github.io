// Sélectionne le canvas et son contexte de dessin
const canvas = document.getElementById('bubbles');
const ctx = canvas.getContext('2d');

// Sélectionne le bouton du menu burger et la liste de liens de navigation
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

// Toggle de la classe 'active' sur les liens de navigation au clic sur le bouton burger
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fonction pour redimensionner le canvas en fonction de la taille de la fenêtre
function resizeCanvas() {
    canvas.width = window.innerWidth;  // largeur du canvas
    canvas.height = document.querySelector('.hero').offsetHeight;  // hauteur basée sur la section '.hero'
}
resizeCanvas(); // Initialisation du canvas

// Redimensionne le canvas lorsqu'on change la taille de la fenêtre
window.addEventListener('resize', resizeCanvas);

// Classe représentant une balle (bulle)
class Ball {
    constructor() {
        this.reset(); // Initialisation de la balle
    }

    // Méthode pour réinitialiser les propriétés de la balle
    reset() {
        this.x = Math.random() * canvas.width; // Position aléatoire en X
        this.y = -Math.random() * canvas.height; // Position initiale en Y au-dessus du canvas
        this.radius = Math.random() * 15 + 15; // Rayon entre 15px et 30px
        this.vy = 0; // Vitesse verticale initiale
        this.gravity = 0.5; // Gravité
        this.bounce = 0.75; // Facteur de rebond
        this.color = `rgb(226, 214, 214)`; // Couleur de la balle (blanc transparent)
        this.stopped = false; // Indique si la balle est arrêtée
    }

    // Méthode pour mettre à jour la position et la vitesse de la balle
    update() {
        if (this.stopped) return;  // Ne met pas à jour si la balle est arrêtée

        this.vy += this.gravity;  // Applique la gravité
        this.y += this.vy;  // Mise à jour de la position en Y

        // Si la balle touche le sol
        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;  // Positionne la balle sur le sol
            this.vy *= -this.bounce;  // Applique le rebond

            // Si l'énergie est trop faible, on arrête les rebonds
            if (Math.abs(this.vy) < 1) {
                this.vy = 0;
                this.stopped = true; // La balle est arrêtée
            }
        }
    }

    // Méthode pour dessiner la balle
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);  // Dessine un cercle
        ctx.fillStyle = this.color;  // Applique la couleur de la balle

        // Applique une ombre pour un effet lumineux
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 2;
        ctx.fill();  // Remplir le cercle

        ctx.closePath();
    }
}

// Création d'un tableau de 50 balles
const balls = [];
for (let i = 0; i < 50; i++) {
    balls.push(new Ball());  // Ajoute chaque balle dans le tableau
}

// Sélectionne et prépare un autre canvas pour le curseur
const cursorCanvas = document.getElementById('cursorBall');
const cursorCtx = cursorCanvas.getContext('2d');

// Fonction pour redimensionner le canvas du curseur
function resizeCursorCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
}
resizeCursorCanvas();  // Initialisation du canvas du curseur
window.addEventListener('resize', resizeCursorCanvas);  // Redimensionne lors du changement de taille de la fenêtre

// Position initiale du curseur (hors écran)
let cursor = { x: -100, y: -100 };
let ballPosition = { x: cursor.x, y: cursor.y };  // Position de la balle qui suit le curseur

const latencyFactor = 0.1;  // Contrôle la vitesse de suivi de la balle

// Écouteur d'événements pour mettre à jour la position du curseur
document.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

// Fonction pour dessiner la balle qui suit le curseur
function drawCursorBall() {
    // Interpolation pour un mouvement fluide du curseur
    ballPosition.x += (cursor.x - ballPosition.x) * latencyFactor;
    ballPosition.y += (cursor.y - ballPosition.y) * latencyFactor;

    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);  // Efface l'écran avant de redessiner

    // Dessine la balle du curseur
    cursorCtx.beginPath();
    cursorCtx.arc(ballPosition.x, ballPosition.y, 10, 0, Math.PI * 2);  // Dessine un cercle
    cursorCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';  // Applique une couleur semi-transparente
    cursorCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    cursorCtx.shadowBlur = 40;  // Applique une ombre floue
    cursorCtx.fill();
    cursorCtx.closePath();

    requestAnimationFrame(drawCursorBall);  // Redemande un dessin pour l'animation
}
drawCursorBall();  // Lance l'animation de la balle du curseur

// Fonction d'animation des balles
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Efface le canvas

    // Met à jour et dessine chaque balle
    for (let ball of balls) {
        ball.update();
        ball.draw(ctx);
    }

    requestAnimationFrame(animate);  // Redemande une animation
}
animate();  // Démarre l'animation des balles

// Sélectionne les étapes de la formation pour l'animation au scroll
const steps = document.querySelectorAll('.formation-step');

// IntersectionObserver pour observer l'apparition des étapes
const obsFormation = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');  // Ajoute la classe 'visible' quand l'étape est visible
            }, index * 400);  // Décalage pour un effet progressif
            observer.unobserve(entry.target);  // Arrête l'observation de cette étape
        }
    });
}, { threshold: 0.2 });  // 20% de visibilité pour déclencher l'effet

// Observe chaque étape de formation
steps.forEach(step => obsFormation.observe(step));

// Fonction pour faire défiler un carousel
function scrollCarousel(direction) {
    const track = document.getElementById("carouselTrack");
    const scrollAmount = 400;  // Distance à faire défiler
    track.scrollBy({
      left: direction * scrollAmount,  // Défilement à gauche ou à droite
      behavior: "smooth"  // Défilement fluide
    });
}

// Événements pour ouvrir et fermer des modals (fenêtres modales)
document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = document.getElementById(this.dataset.modal);
        modal.style.display = 'flex';  // Affiche le modal
    });
});

document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';  // Ferme le modal
    });
});

// Ferme les modals si on clique en dehors
window.addEventListener('click', function(e) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) modal.style.display = 'none';  // Ferme si on clique en dehors
    });
});
