const canvas = document.querySelector('canvas');
const name = document.querySelector('#name');
const scoreText = document.querySelector('#score');
const livesText = document.querySelector('#lives');
const levelText = document.querySelector('#level');
const timeText = document.querySelector('#time');
const cursor = document.querySelector('#cursor');
const ctx = canvas.getContext('2d');

const getRandom = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

let circles = [];
let colors = ['#711DB0', '#C21292', '#EF4040', '#FFA732'];

let running = true;

let t = [];
let time = 0;
let score = 0;
let lives = 10;
let level = 1;
let player_color = colors[getRandom(0, colors.length-1)];
name.style.color = player_color;
name.style.textShadow = `0 0 10px ${player_color}`;
cursor.style.backgroundColor = player_color;
cursor.style.boxShadow = `0 0 10px ${player_color},0 0 20px ${player_color},0 0 30px ${player_color},0 0 40px ${player_color}`;
levelText.innerHTML = `Level: ${level}`;
livesText.innerHTML = `Lives: ${lives}`;
scoreText.innerHTML = `Score: ${score}`;
timeText.innerHTML = `Time: ${Math.floor(time)} | FPS: 0`;
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

function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function Circle() {
     this.radius = getRandom(30, 40);
     this.x = getRandom(this.radius, canvas.width-this.radius);
     this.y = getRandom(this.radius, canvas.height-this.radius);
     this.color = colors[getRandom(0, colors.length-1)];
     this.dx = speed*((this.radius/10)*(Math.random()-0.5));
     this.dy = speed*((this.radius/10)*(Math.random()-0.5));

     this.clicked = function() {
            if (this.radius === 50) {
                if (this.color === player_color) {
                    score += 1;
                    scoreText.innerHTML = `Score: ${score}`;
                    circles.splice(circles.indexOf(this), 1);
                    if (score === 10) {
                        level += 1;
                        if(speed<1.5){speed += 0.01;}
                        if(level<10){lives = 10-level+1;}else{lives = 1;}
                        score = 0;
                        circles = createCircles();
                        scoreText.innerHTML = `Score: ${score}`;
                        livesText.innerHTML = `Lives: ${lives}`;
                        levelText.innerHTML = `Level: ${level}`;
                    }
                } else {
                    lives -= 1;
                    livesText.innerHTML = `Lives: ${lives}`;
                    if (lives === 0) {
                        running = false;
                        name.innerHTML = `Game Over!`;
                        setTimeout(() => {window.location.reload();}, 2000);
                    } else {circles.splice(circles.indexOf(this), 1);}
                }
            }
     }

     this.draw = function() {
            drawCircle(this.x, this.y, this.radius, this.color);
            //drawLine(this.x, this.y, canvas.width/2, canvas.height/2, this.color);
            //drawLine(this.x, this.y, mouse.x, mouse.y, this.color);
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
    for (let i = 0; i < 100; i++) {
        circles.push(new Circle());
    }
    return circles;
}

function manageTime(now) {
    t.unshift(now);
    if (t.length > 10) {
        let t0 = t.pop();
        let fps = Math.floor(1000 * 10 / (now - t0));
        if(fps>0){time+=1/fps;}
        timeText.innerHTML = `Time: ${Math.floor(time)} | FPS: ${fps}`;
    }
}

function animate(now) {
    if(!running){return;}
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update());
    manageTime(now);
    requestAnimationFrame(animate);
}

function pageLoad() {
  setCanvasSize();
  circles = createCircles();
  animate(circles);
}

window.addEventListener('resize', setCanvasSize);
window.addEventListener('load', pageLoad);
window.addEventListener('mousemove', (e) => {
    if(!running){return;}
    mouse.x = e.x;
    mouse.y = e.y;
    cursor.style.left = `${mouse.x}px`;
    cursor.style.top = `${mouse.y}px`;
});
window.addEventListener('mouseout', () => {
    if(!running){return;}
    mouse.x = undefined;
    mouse.y = undefined;
    cursor.style.left = '-100px';
    cursor.style.top = '-100px';
});
window.addEventListener('mousedown', () => {
    if(!running){return;}
    circles.forEach(circle => {circle.clicked();});
});
