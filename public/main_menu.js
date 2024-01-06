const classic_btn = document.querySelector('#play-classic');
const chill_btn = document.querySelector('#play-chill');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const getRandom = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

let circles = [];
let colors = ['#711DB0', '#C21292', '#EF4040', '#FFA732'];

let speed = 1;

let mouse = {
    x: undefined,
    y: undefined
}

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    ctx.fill();
}

function Circle() {
    this.radius = getRandom(30, 40);
    this.x = getRandom(this.radius, canvas.width-this.radius);
    this.y = getRandom(this.radius, canvas.height-this.radius);
    this.color = colors[getRandom(0, colors.length-1)];
    this.dx = speed*((this.radius/10)*(Math.random()-0.5));
    this.dy = speed*((this.radius/10)*(Math.random()-0.5));

    this.draw = function() {
        drawCircle(this.x, this.y, this.radius, this.color);
    }

    this.bounce = function() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    this.follow = function() {
        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if (this.radius < 50) {
                this.radius += 1;
            }
        } else if (this.radius > 2) {
            this.radius -= 1;
        }
    }

    this.update = function() {
        this.bounce();
        this.follow();
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

function createCircles() {
    let circles = [];
    for (let i = 0; i < 2000; i++) {
        circles.push(new Circle());
    }
    return circles;
}

function animate(now) {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update());
}

function pageLoad() {
    setCanvasSize();
    circles = createCircles();
    animate(circles);
}

window.addEventListener('resize', setCanvasSize);
window.addEventListener('load', pageLoad);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

classic_btn.addEventListener('click', () => {
    window.location.href = '/classic/classic.html';
});

chill_btn.addEventListener('click', () => {
    window.location.href = '/chill/chill.html';
});
