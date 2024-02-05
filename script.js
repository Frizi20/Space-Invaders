"use strict";
const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const pressedKeys = {
    ArrowRight: {
        isPressed: false,
    },
    ArrowLeft: {
        isPressed: false,
    },
    " ": {
        isPressed: false,
    },
};
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function playAudio(name) {
    const audio = new Audio(name);
    audio.play();
}
class Game {
    constructor() {
        this.msgLose = "You Lose!";
        this.msgWin = "You WIN!";
        this.image = new Image();
        this.gap = 15;
        this.position = {
            x: 50,
            y: 20,
        };
        const image = new Image();
        image.src = "./assets/heart.png";
        image.onload = () => {
            const scale = 0.08;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
        };
    }
    draw(xPos) {
        c === null || c === void 0 ? void 0 : c.drawImage(this.image, xPos, this.position.y, this.width, this.height);
    }
    drawMessage() {
        if (Game.isRunning)
            return;
        const msg = Game.status === "lose" ? "You Lose" : "You WON!";
        c.font = "5rem KulminoituvaRegular";
        c.fillStyle = "white";
        c.textAlign = "center";
        c === null || c === void 0 ? void 0 : c.fillText(msg, canvas.width / 2, canvas.height / 2);
    }
    update() {
        for (let i = 0; i < Game.lives; i++) {
            this.draw(i * (this.width + this.gap) + 20);
        }
        this.drawMessage();
    }
    static gameOver() {
        this.status = "lose";
        this.isRunning = false;
    }
    static playerHit(projectile) {
        if (Game.lastProjectile === projectile)
            return;
        if (Game.lives <= 1) {
            this.gameOver();
        }
        Game.lives--;
        Game.lastProjectile = projectile;
    }
}
Game.status = "running";
Game.lives = 3;
Game.isRunning = true;
class Projectile {
    constructor(entity) {
        this.width = 2;
        this.height = 4;
        this.radius = 4;
        this.velocity = 4;
        this.color = "red";
        this.entity = "player";
        this.position = {
            x: entity.position.x + entity.width / 2,
            y: entity.position.y - 10,
        };
        if (entity instanceof Enemy) {
            this.velocity = -2;
            this.position.y = entity.position.y + 50;
            this.color = "#fff";
            this.radius = 4;
            this.entity = "enemy";
        }
    }
    draw() {
        c === null || c === void 0 ? void 0 : c.beginPath();
        c === null || c === void 0 ? void 0 : c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c === null || c === void 0 ? void 0 : c.fill();
        c === null || c === void 0 ? void 0 : c.closePath();
        this.update();
    }
    update() {
        this.position.y -= this.velocity;
    }
    removeMeFrom(arr) {
        const index = arr.indexOf(this);
        setTimeout(() => {
            arr.splice(index, 1);
        }, 0);
    }
}
// class Particle implements ProjectileI {
// 	public width = 2;
// 	public height = 4;
// 	public radius = 4;
// 	public position: Coords;
// 	public velocity: Velocity;
// 	public color: string = "red";
// 	constructor(entity: PlayerI | Enemy) {
// 		this.position = {
// 			x: entity.position.x + entity.width / 2,
// 			y: entity.position.y - 10,
// 		};
// 		if (entity instanceof Enemy) {
// 			this.velocity = -2;
// 			this.position.y = entity.position.y + 50;
// 			this.color = "#fff";
// 			this.radius = 2;
// 		}
// 	}
// 	draw() {
// 		c?.beginPath();
// 		c?.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
// 		c!.fillStyle = this.color;
// 		c?.fill();
// 		c?.closePath();
// 		this.update();
// 	}
// 	update() {
// 		this.position.y -= this.velocity;
// 	}
// 	removeMeFrom(arr: Projectile[]) {
// 		const index = arr.indexOf(this);
// 		setTimeout(() => {
// 			arr.splice(index, 1);
// 		}, 0);
// 	}
// }
class Star {
    constructor(x, y, vy, radius) {
        this.color = "#fff";
        this.opacity = 0.1;
        this.position = {
            x: x,
            y: y,
        };
        this.velicity = {
            x: 0,
            y: vy,
        };
        this.radius = radius;
    }
    static createStars(count) {
        for (let i = 0; i < count; i++) {
            const x = random(0, canvas.width);
            const y = random(0, canvas.height) - canvas.height;
            const vy = random(1, 2);
            const r = random(1, 3);
            Star.stars.push(new Star(x, y, vy, r));
        }
    }
    static updateStars() {
        this.stars.forEach((star) => {
            star.update();
        });
    }
    draw() {
        c === null || c === void 0 ? void 0 : c.save();
        c.globalAlpha = this.opacity;
        c === null || c === void 0 ? void 0 : c.beginPath();
        c === null || c === void 0 ? void 0 : c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c === null || c === void 0 ? void 0 : c.fill();
        c === null || c === void 0 ? void 0 : c.closePath();
        c === null || c === void 0 ? void 0 : c.restore();
    }
    update() {
        this.position.y += this.velicity.y;
        this.deleteStar();
        this.draw();
    }
    deleteStar() {
        if (this.position.y > canvas.height) {
            const index = Star.stars.indexOf(this);
            Star.stars.splice(index, 1);
        }
    }
}
Star.stars = [];
class Player {
    constructor() {
        this.position = {
            x: 0,
            y: 1000,
        };
        this.width = 100;
        this.height = 100;
        this.image = new Image();
        this.projectiles = [];
        this.velocity = {
            x: 7,
            y: 0,
        };
        this.rotation = 0;
        const image = new Image();
        image.src = "./assets/spaceship.png";
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20,
            };
        };
        this.addEvents();
    }
    draw() {
        // c!.fillStyle = "#22aaff";
        // c?.fillRect(this.position.x, this.position.y, this.width, this.height);
        c === null || c === void 0 ? void 0 : c.save();
        c === null || c === void 0 ? void 0 : c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        c === null || c === void 0 ? void 0 : c.rotate(this.rotation);
        c === null || c === void 0 ? void 0 : c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        c === null || c === void 0 ? void 0 : c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c === null || c === void 0 ? void 0 : c.restore();
        if (Game.isRunning) {
            this.update();
        }
    }
    update() {
        this.rotation = 0;
        if (pressedKeys["ArrowRight"].isPressed &&
            this.position.x + this.width < canvas.width - 10) {
            this.rotation = 0.15;
            this.position.x += this.velocity.x;
        }
        if (pressedKeys["ArrowLeft"].isPressed && this.position.x > 10) {
            this.rotation = -0.15;
            this.position.x -= this.velocity.x;
        }
        if (pressedKeys[" "].isPressed) {
        }
    }
    addEvents() {
        addEventListener("keydown", (e) => {
            const { key } = e;
            if (key in pressedKeys) {
                pressedKeys[key].isPressed = true;
            }
            if (key === " ") {
                this.projectiles.push(new Projectile(this));
            }
        });
        addEventListener("keyup", (e) => {
            const { key } = e;
            if (key in pressedKeys) {
                pressedKeys[key].isPressed = false;
            }
        });
        addEventListener("touchstart", (e) => {
            const xTouch = e.changedTouches[0].clientX;
            if (xTouch < 200) {
                pressedKeys["ArrowLeft"].isPressed = true;
            }
            if (xTouch > canvas.width - 200) {
                pressedKeys["ArrowRight"].isPressed = true;
            }
        }, false);
        addEventListener("touchend", (e) => {
            pressedKeys["ArrowLeft"].isPressed = false;
            pressedKeys["ArrowRight"].isPressed = false;
        }, false);
    }
}
class Enemy {
    constructor(x, y) {
        this.height = 50;
        this.width = 50;
        this.image = new Image();
        this.position = {
            x: x,
            y: y,
        };
        this.velocity = {
            x: 3,
            y: 0,
        };
        const image = new Image();
        image.src = "./assets/invader.png";
        image.onload = () => {
            const scale = 1.3;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
        };
    }
    draw() {
        c === null || c === void 0 ? void 0 : c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update(velocity) {
        if (Game.isRunning) {
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
        this.draw();
    }
}
Enemy.enemies = [];
Enemy.enemyGap = 0;
class EnemyGrid {
    constructor(cols, rows, player) {
        this.enemies = [];
        this.projectiles = [];
        this.currDirection = "right";
        this.gridPosY = 50;
        this.gridWidth = cols * 50;
        this.position = {
            x: 0,
            y: 0,
        };
        this.velocity = {
            x: 3,
            y: 0,
        };
        this.cols = cols;
        this.rows = rows;
        EnemyGrid.player = player;
        this.placeEnemies();
    }
    static createEnemyGrid() {
        // if (EnemyGrid.enemyGrids.length > 0) return;
        EnemyGrid.enemyGrids.push(new EnemyGrid(random(5, 10), random(3, 5), this.player));
    }
    enemyShoot() {
        this.projectiles.push(new Projectile(this.enemies[random(0, this.enemies.length - 1)]));
    }
    updateGridProjectiles() {
        this.moveEnemyProjectiles();
    }
    moveEnemyProjectiles() {
        this.projectiles.forEach((projectile) => {
            if (projectile.position.y > canvas.height) {
                projectile.removeMeFrom(this.projectiles);
            }
            else {
                projectile.draw();
            }
        });
        this.checkProjectilePlayerColission();
    }
    checkProjectilePlayerColission() {
        // console.log(player);
        this.projectiles.forEach((projectile) => {
            if (projectile.position.y + projectile.radius >=
                player.position.y &&
                projectile.position.y - projectile.radius <
                    player.position.y + player.height &&
                projectile.position.x + projectile.radius > player.position.x &&
                projectile.position.x - projectile.radius <
                    player.position.x + player.width) {
                Game.playerHit(projectile);
            }
        });
    }
    placeEnemies() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                const enemy = new Enemy(i * 50, j * 50);
                this.enemies.push(enemy);
            }
        }
    }
    //update enemies grid
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if (this.position.x + this.gridWidth >= canvas.width ||
            this.position.x <= 0) {
            this.velocity.x *= -1;
            this.velocity.y += 50;
        }
    }
    displayEnemies() {
        this.update();
        this.updateGridProjectiles();
        // console.log(this.enemies[3].shoot());
        this.enemies.forEach((enemy) => {
            this.checkProjectileCollision(enemy);
            if (enemy === this.enemies.at(-1)) {
                if (enemy.position.y >= player.position.y - 50) {
                    Game.gameOver();
                }
            }
            enemy.update(this.velocity);
            // console.log(enemy.position.y > player.position.y - player.height);
        });
    }
    checkProjectileCollision(enemy) {
        for (let i = 0; i < player.projectiles.length; i++) {
            const projectile = player.projectiles[i];
            for (let j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];
                if (projectile.position.y - projectile.radius <=
                    enemy.position.y + enemy.height &&
                    projectile.position.x + projectile.radius >=
                        enemy.position.x &&
                    projectile.position.x - projectile.radius <=
                        enemy.position.x + enemy.width &&
                    projectile.position.y + projectile.radius >=
                        enemy.position.y) {
                    setTimeout(() => {
                        const invaderFound = this.enemies.find((invader) => invader === enemy);
                        const projectileFound = player.projectiles.find((prj) => prj == projectile);
                        if (invaderFound && projectileFound) {
                            this.enemies.splice(j, 1);
                            player.projectiles.splice(i, 1);
                            playAudio("assets/audio/explode.wav");
                            //change grid width
                            if (this.enemies.length > 0) {
                                const firstEnemy = this.enemies[0];
                                const lastEnemy = this.enemies[this.enemies.length - 1];
                                this.gridWidth =
                                    lastEnemy.position.x -
                                        firstEnemy.position.x +
                                        30;
                                this.position.x = firstEnemy.position.x;
                            }
                            else {
                                const gridIndex = EnemyGrid.enemyGrids.indexOf(this);
                                EnemyGrid.enemyGrids.splice(gridIndex, 1);
                            }
                        }
                    }, 0);
                }
            }
        }
    }
}
EnemyGrid.enemyGrids = [];
const game = new Game();
const player = new Player();
// const projectile = new Projectile(player);
const enemiesGrids = [];
// const enemiesGrid = new EnemyGrid(1, 1, player);
// console.log(projectile)
let nrFrames = 0;
window.Star = Star;
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "#000";
    c === null || c === void 0 ? void 0 : c.fillRect(0, 0, innerWidth, innerHeight);
    //Show player
    player.draw();
    //Show projectiles
    player.projectiles.forEach((projectile, i, arr) => {
        //clear projectiles
        if (projectile.position.y <= 0) {
            projectile.removeMeFrom(arr);
        }
        else {
            projectile.draw();
        }
    });
    EnemyGrid.enemyGrids.forEach((enemyGrid) => {
        enemyGrid.displayEnemies();
        if (nrFrames % random(100, 200) === 0 && Game.isRunning) {
            enemyGrid.enemyShoot();
        }
    });
    // create EnemyGrids
    if (nrFrames % 3000 === 0 && Game.isRunning) {
        EnemyGrid.createEnemyGrid();
    }
    if (nrFrames % 200 === 0 && Game.isRunning) {
        Star.createStars(100);
    }
    Star.updateStars();
    game.update();
    nrFrames++;
}
animate();
