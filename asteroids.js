let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let ship;
let keys = [];
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;


document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvasWidth = Math.min(1400, window.innerWidth * 0.9);
  canvasHeight = Math.min(1000, window.innerHeight * 0.9);
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ship = new Ship();

  /* i here represents the numbers of asteroids */
  for(let i = 0; i < 8; i++){
    asteroids.push(new Asteroid());
  }

  /* this part is the keys part, where he is defining what key does what */
  document.body.addEventListener("keydown", function(e){
    keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", function(e){
    keys[e.keyCode] = false;
    if(e.keyCode === 70){
      bullets.push(new Bullet(ship.angle));
    }
  });
  Render();
}

/* hes defining what the ship is going to do hes defining speed, position, where it starts and velocity*/
class Ship {
  constructor(){
    this.visible = true;
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.movingForward = false;
    this.speed = 0.1;
    this.velX = 0;
    this.velY = 0;
    this.rotateSpeed = 0.001;
    this.radius = 15;
    this.angle = 0;
    this.strokeColor = 'white';
    this.noseX = canvasWidth / 2 + 15;
    this.noseY = canvasHeight / 2;
  }
  /* will make the spaceship rotate */
  Rotate(dir){
    this.angle += this.rotateSpeed * dir;
  }
  /*it handles rotating and moving around, i thinks it manages the position of the spaceship */
  Update(){
    let radians = this.angle / Math.PI * 180;
    /*oldX + cos(radians) * distance is teh formula to find the x position*/
    /*oldY + sin(radians) * distance is teh formula to find the y position*/
    if(this.movingForward){
      this.velX += Math.cos(radians) * this.speed;
      this.velY += Math.sin(radians) * this.speed;
    }
    /*this part right here is to make the spaceship go across the screen if it goes way too far */
    if(this.x < this.radius){
      this.x = canvas.width;
    }
    if(this.x > canvas.width){
      this.x = this.radius;
    }
    if(this.y < this.radius){
      this.y = canvas.height;
    }
    if(this.y > canvas.height){
      this.y = this.radius;
    }
    this.velX *= 0.99;
    this.velY *= 0.99;

    this.x -= this.velX;
    this.y -= this.velY;
  }
  /* hes drawing the spaceship */
  Draw(){
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    let vertAngle = ((Math.PI * 2) / 3);
    let radians = this.angle / Math.PI * 180;
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseY = this.y - this.radius * Math.sin(radians);
    for(let i = 0; i < 3; i++){
      ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
    }
    ctx.closePath();
    ctx.stroke();
    
    // Desenho do fogo da nave
    if(this.movingForward) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      

      let radians = this.angle / Math.PI * 180;
      

      let flameLength = this.radius * 1.5;
      let sideOffset = this.radius * 0.5;
      

      let flameTipX = this.x + flameLength * Math.cos(radians);
      let flameTipY = this.y + flameLength * Math.sin(radians);
      

      let leftX = this.x + sideOffset * Math.cos(radians + 0.5);
      let leftY = this.y + sideOffset * Math.sin(radians + 0.5);
      
      let rightX = this.x + sideOffset * Math.cos(radians - 0.5);
      let rightY = this.y + sideOffset * Math.sin(radians - 0.5);
      
      ctx.moveTo(leftX, leftY);
      ctx.lineTo(flameTipX, flameTipY);
      ctx.lineTo(rightX, rightY);
      ctx.closePath();
      ctx.fill();
    }
    
  }
}
/* right here he created the bullets, he defined the bullets on the drawing and made it so the nose is always the place the bullets comes off, thisy thisx repressents the position of the nose of the spaceship */
class Bullet {
  constructor(angle){
    this.visible = true;
    this.x = ship.noseX;
    this.y = ship.noseY;
    this.angle = angle;
    this.height = 4;
    this.width = 4;
    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
  }
  Update(){
    let radians = this.angle / Math.PI * 180;
    this.x -= Math.cos(radians) * this.speed;
    this.y -= Math.sin(radians) * this.speed;
  }
  Draw(){
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Asteroid{
  constructor(x,y,radius,level,collisionRadius){
    this.visible = true;
    this.x = x || Math.floor(Math.random() * canvasWidth);
    this.y = y || Math.floor(Math.random() * canvasHeight);
    this.speed = 3;
    this.radius = radius || 50;
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = 'white';
    this.collisionRadius = collisionRadius || 46;
    this.level = level || 1;
  }
  Update(){
    let radians = this.angle / Math.PI * 180;
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;
    if(this.x < this.radius){
      this.x = canvas.width;
    }
    if(this.x > canvas.width){
      this.x = this.radius;
    }
    if(this.y < this.radius){
      this.y = canvas.height;
    }
    if(this.y > canvas.height){
      this.y = this.radius;
    }
  }
  Draw(){
    ctx.beginPath();
    let vertAngle = ((Math.PI * 2) / 6);
    var radians = this.angle / Math.PI * 180;
    for(let i = 0; i < 6; i++){
      ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function CircleCollisions(p1x, p1y, r1, p2x, p2y, r2){
  let radiusSum;
  let xDiff;
  let yDiff;
  radiusSum = r1 + r2;
  xDiff = p1x - p2x;
  yDiff = p1y - p2y;
  if(radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))){
    return true;
  } else{
    return false;
  }
}

function DrawLifeShips(){
  let startX = canvas.width - 20;
  let startY = 20;
  let points = [[9,9], [-9,9]];
  ctx.strokeStyle = 'white';
  for(let i = 0; i < lives; i++){
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for(let j = 0; j < points.length; j++){
      ctx.lineTo(startX + points[j][0], startY + points[j][1]);
    }
    ctx.closePath();
    ctx.stroke();
    startX -= 30;
  }
}

/* explosao*/
let explosionParticles = []; 

class ExplosionParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 3 + 1; 
    this.speed = Math.random() * 2 + 1;    
    
    this.angle = Math.random() * Math.PI * 2;
    this.life = 30; 
  }
  Update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life--; 
  }
  Draw() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function triggerExplosion(x, y) {
  for(let i = 0; i < 20; i++){
    explosionParticles.push(new ExplosionParticle(x, y));
  }
}

/* it updates all the position of the shapes on the screen, also draws them */
/* the ship.movingForward makes the ship go forward, the 87 means that the key thats going to do is is the w */
function Render(){
  ship.movingForward = (keys[87]);
  if(keys[68]){
    ship.Rotate(1);
  }
  if(keys [65]){
    ship.Rotate(-1);
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = 'white';
  ctx.font = '21px Arial'
  ctx.fillText('SCORE: ' + score.toString(), 20, 35);
  if(lives <= 0){
    ship.visible = false;
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', canvasWidth / 2 - 150, canvasHeight / 2);
  }
  DrawLifeShips();

  if(asteroids.length !== 0){
    for(let k = 0; k < asteroids.length; k++){
      if(CircleCollisions(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)){
        triggerExplosion(ship.x, ship.y);
        ship.x = canvasWidth / 2;
        ship.y = canvasHeight / 2;
        ship.velX = 0;
        ship.velY = 0;
        lives -= 1;
      }
    }
  }

  
  if(asteroids.length !== 0 && bullets.length !== 0){
loop1:
    for(let l = 0; l < asteroids.length; l++){
      for(let m = 0; m < bullets.length; m++){
        if(CircleCollisions(bullets[m].x, bullets[m].y, 3, asteroids [l].x, asteroids[l].y, asteroids[l].collisionRadius)){
          if(asteroids[l].level === 1 ){
            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
          } else if((asteroids[l].level === 2 )){
            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12));
            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12));
          }
          asteroids.splice(l,1);
          bullets.splice(m,1);
          score += 20;
          break loop1;
        }
      }
    }
  }

  if(ship.visible){
    ship.Update();
    ship.Draw();
  }

 
  if(bullets.length !== 0){
    for(let i = 0; i < bullets.length; i++){
      bullets[i].Update();
      bullets[i].Draw();
    }
  }
  if(asteroids.length !== 0){
    for(let j = 0; j < asteroids.length; j++){
      asteroids[j].Update();
      asteroids[j].Draw(j);
    }
  }


  for(let i = explosionParticles.length - 1; i >= 0; i--){
    explosionParticles[i].Update();
    explosionParticles[i].Draw();

    if(explosionParticles[i].life <= 0){
      explosionParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(Render);
}

