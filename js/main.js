// player properties
var player;
var player_hit_box;
var enemy;
var g_pos;
var e_g_pos;

// projectile properties
var bullet;
var ebullet;
var laser;

// misc properties
var lives;
var lives2;
var health_amount;
var enemy_health;

// pickup properties
var hp_box;
var hp_box_timer;
var ewalking;
var walking;
var game_over;

// sounds
var bgAudio = undefined;
let shootSound;
let hurtSound;
let laserSound;
let healthSound;

    function stopBGAudio() {
        bgAudio.pause();
        bgAudio.currentTime = 0;
    }

    function playBGAudio() {
        bgAudio.play();
    }

"use strict";

function startGame() {
    Arena.start();
    playBGAudio();

    var hp = new Image();
    hp.src = "media/health_box.png";

    // load pickups
    hp_box = new itembox(hp, -300, -300);

    // load players
    player = new sprite(gunner_sprite, 189, 187, 80, 80);
    enemy = new sprite(gunner_sprite2, 189, 187, 1000, 400);
    player_hit_box = new component(70, 187,"rgba(255,0,0,0)", 105, 80);

    // load projectiles
    g_pos = new component(5, 5,"rgba(0,255,0,0)", 228, 160);
    e_g_pos = new component(5, 5,"rgba(0,255,0,0)", 915, 480);
    bullet = new component(120, 2, "yellow", -120, -120, 0);
    ebullet = new component(120, 2, "yellow", -120, -120, 0);
    laser = new component(20, 660,"rgba(0,255,0,0.4)", 630, 30);

    // load walls
    b_wall = new component(1224, 8,"rgba(255,0,0,0)", 28, 22);
    f_wall = new component(1224, 8,"rgba(255,0,0,0)", 28, 688);
    l_wall = new component(8, 674,"rgba(255,0,0,0)", 28, 22);
    r_wall = new component(8, 674,"rgba(255,0,0,0)", 1245, 22);
    e_r_wall = new component(8, 674,"rgba(255,0,0,0)", 975, 22);
}

var Arena = {
    canvas : document.createElement("canvas"),
    start : function() {


        // load player sprites
        gunner_sprite = new Image();
        gunner_sprite.src = "media/player_1_r_with_gun.png";
        gunner_sprite_walk_1 = new Image();
        gunner_sprite_walk_1.src = "media/player_1_r_with_gun_walk_1.png";
        gunner_sprite_walk_2 = new Image();
        gunner_sprite_walk_2.src = "media/player_1_r_with_gun_walk_2.png"
        gunner_sprite_shoot = new Image();
        gunner_sprite_shoot.src = "media/player_1_r_with_gun_shoot.png";
        gunner_sprite_hurt = new Image();
        gunner_sprite_hurt.src = "media/player_1_r_with_gun_hurt.png";
        gunner_sprite_shoot_hurt = new Image();
        gunner_sprite_shoot_hurt.src = "media/player_1_r_with_gun_shoot_hurt.png";
        gunner_sprite2 = new Image();
        gunner_sprite2.src = "media/player_2_r_with_gun.png";
        gunner_sprite2_walk_1 = new Image();
        gunner_sprite2_walk_1.src = "media/player_2_l_with_gun_walk_1.png";
        gunner_sprite2_walk_2 = new Image();
        gunner_sprite2_walk_2.src = "media/player_2_l_with_gun_walk_2.png"
        gunner_sprite2_shoot = new Image();
        gunner_sprite2_shoot.src = "media/player_2_l_with_gun_shoot.png";
        player2_hurt_sprite = new Image();
        player2_hurt_sprite.src = "media/player_2_l_hurt.png";


        timer();
        health_amount = 100;
        enemy_health = 100;
        shooting = 0;
        eshooting = 0;
        hurting = 0;
        lives = 4;
        lives2 = 4;
        game_over = 0;
        walking = 0;
        ewalking = 0;
        document.getElementById("Lives").innerText = lives;
        document.getElementById("Lives2").innerText = lives2;
        document.getElementById("h8").style.display = "none";
        document.getElementById("h9").style.display = "none";
        bgAudio = document.querySelector("#bgAudio");
        bgAudio.volume = 0.50;
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.canvas.setAttribute('style', "position: absolute; left: 50%; margin-left: -650px; top: 50%; margin-top: -320px; border: 2px solid black");
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArena, 20);
        window.addEventListener('keydown', function (e) {
            Arena.keys = (Arena.keys || []);
            Arena.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            Arena.keys[e.keyCode] = (e.type == "keydown");            
        })

    // Load Sounds
    shootSound = new Howl({
	        src: ['media/bullet_fire.mp3']
});

    hurtSound = new Howl({
	        src: ['media/hurt.mp3']
});

    laserSound = new Howl({
	        src: ['media/laser.mp3']
});

    // Health
    healthSound = new Howl({
	        src: ['media/health_pickup.mp3']
});


    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// set intervals for enemy fire and item boxes
function timer() {
    hp_box_timer = setInterval(healthBox, 9000);
}


// boxes moves around constantly to avoid getting stuck on crates or holes
function healthBox() {
    // health box
    if(health_amount || enemy_health != 100){
        hp_box.x = Math.floor(Math.random() * 1270) + 1;
        hp_box.y = Math.floor(Math.random() * 710) + 1;
        }
    else if (health_amount || enemy_health == 100){
        hp_box.x = -300;
        hp_box.y = -300;
        }
}

function component(width, height, color, x, y, distance) {
        this.gamearea = Arena;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.distance = 0;
    this.update = function() {
        ctx = Arena.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
}

function sprite(img, width, height, x, y) {
        this.gamearea = Arena;
        this.width = width; 
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
        this.img = img;
    this.update = function() {
        ctx = Arena.context;
        ctx.drawImage(this.img, this.x, this.y);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }    
}

function weapon(img, width, height, x, y) {
        this.gamearea = Arena;
        this.width = width; 
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
    this.update = function() {
        ctx = Arena.context;
        ctx.drawImage(img, this.x, this.y);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }    
}

function itembox(img, x, y) {
        this.gamearea = Arena;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.update = function() {
        ctx = Arena.context;
        ctx.drawImage(img, this.x, this.y);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    
}


function playerDie()
{
    health_amount = 100;
    document.getElementById("health").value = health_amount;
    player.x = 80;
    player.y = 80;
    player_hit_box.x = 105;
    player_hit_box.y = 80;
    g_pos.x = 228;
    g_pos.y = 160;
    lives = lives - 1;
    document.getElementById("Lives").innerText = lives;    
}

function enemyDie()
{
    enemy_health = 100;
    document.getElementById("ehealth").value = enemy_health;
    enemy.x = 1000;
    enemy.y = 400;
    e_g_pos.x = 915;
    e_g_pos.y = 480;
    lives2 = lives2 - 1;
    document.getElementById("Lives2").innerText = lives2;
}

function setBoundaries(){


    // health box
    if (hp_box.x > player_hit_box.x && hp_box.x < (player_hit_box.x + 70) && hp_box.y > player_hit_box.y && hp_box.y < (player_hit_box.y + 187)) {
        health_amount = health_amount + 25;
        document.getElementById("health").value = health_amount;
        hp_box.x = hp_box.x = -300;
        healthSound.play();
    }
    if (hp_box.x > player.x && hp_box.x < (player.x + 189) && hp_box.y > player.y && hp_box.y < (player.y + 187)) {
        health_amount = health_amount + 25;
        document.getElementById("health").value = health_amount;
        hp_box.x = hp_box.x = -300;
        healthSound.play();
    }
    if (hp_box.x > enemy.x && hp_box.x < (enemy.x + 189) && hp_box.y > enemy.y && hp_box.y < (enemy.y + 187)) {
        enemy_health = enemy_health + 25;
        document.getElementById("health").value = enemy_health;
        hp_box.x = hp_box.x = -300;
        healthSound.play();
    }

    // front wall
    if (player.x < f_wall.x + f_wall.width &&
        player.x + player.width > f_wall.x &&
        player.y < f_wall.y + f_wall.height &&
        player.height + player.y > f_wall.y) {
        player.y = player.y - 4;
    }
    if (player_hit_box.x < f_wall.x + f_wall.width &&
        player_hit_box.x + player_hit_box.width > f_wall.x &&
        player_hit_box.y < f_wall.y + f_wall.height &&
        player_hit_box.height + player_hit_box.y > f_wall.y) {
        player_hit_box.y = player_hit_box.y - 4;
    }
    if (enemy.x < f_wall.x + f_wall.width &&
        enemy.x + enemy.width > f_wall.x &&
        enemy.y < f_wall.y + f_wall.height &&
        enemy.height + enemy.y > f_wall.y) {
        enemy.y = enemy.y - 4;
    }
    if (g_pos.x < f_wall.x + f_wall.width &&
        (g_pos.x + 189) + g_pos.x > f_wall.x &&
        g_pos.y < f_wall.y + f_wall.height &&
        (g_pos.y + -475) + g_pos.y > f_wall.y) {
        g_pos.y = g_pos.y - 4;
    }
    if (e_g_pos.x < f_wall.x + f_wall.width &&
        (e_g_pos.x + 189) + e_g_pos.x > f_wall.x &&
        e_g_pos.y < f_wall.y + f_wall.height &&
        (e_g_pos.y + -475) + e_g_pos.y > f_wall.y) {
        e_g_pos.y = e_g_pos.y - 4;
    }
    // back wall
    if (player.x < b_wall.x + b_wall.width &&
        player.x + player.width > b_wall.x &&
        player.y < b_wall.y + b_wall.height &&
        player.height + player.y > b_wall.y) {
        player.y = player.y + 4;
    }
    if (player_hit_box.x < b_wall.x + b_wall.width &&
        player_hit_box.x + player_hit_box.width > b_wall.x &&
        player_hit_box.y < b_wall.y + b_wall.height &&
        player_hit_box.height + player_hit_box.y > b_wall.y) {
        player_hit_box.y = player_hit_box.y + 4;
    }
    if (enemy.x < b_wall.x + b_wall.width &&
        enemy.x + enemy.width > b_wall.x &&
        enemy.y < b_wall.y + b_wall.height &&
        enemy.height + enemy.y > b_wall.y) {
        enemy.y = enemy.y + 4;
    }
    if (g_pos.x > b_wall.x && g_pos.x < (b_wall.x + 1224) && g_pos.y > b_wall.y && g_pos.y < (b_wall.y + 90)) {
        g_pos.y = g_pos.y + 4;
    }
    if (e_g_pos.x > b_wall.x && e_g_pos.x < (b_wall.x + 1224) && e_g_pos.y > b_wall.y && e_g_pos.y < (b_wall.y + 90)) {
        e_g_pos.y = e_g_pos.y + 4;
    }

    // left wall
    if (player.x < l_wall.x + l_wall.width &&
        player.x + player.width > l_wall.x &&
        player.y < l_wall.y + l_wall.height &&
        player.height + player.y > l_wall.y) {
        player.x = player.x + 4;
    }
    if (player_hit_box.x > l_wall.x && player_hit_box.x < (l_wall.x + 30) && player_hit_box.y > l_wall.y && player_hit_box.y < (l_wall.y + 674)) {
        player_hit_box.x = player_hit_box.x + 4;
    }
    if (enemy.x < l_wall.x + l_wall.width &&
        enemy.x + enemy.width > l_wall.x &&
        enemy.y < l_wall.y + l_wall.height &&
        enemy.height + enemy.y > l_wall.y) {
        enemy.x = enemy.x + 4;
    }
    if (g_pos.x > l_wall.x && g_pos.x < (l_wall.x + 153) && g_pos.y > l_wall.y && g_pos.y < (l_wall.y + 674)) {
        g_pos.x = g_pos.x + 4;
    }

    // right wall
    if (player.x < r_wall.x + r_wall.width &&
        player.x + player.width > r_wall.x &&
        player.y < r_wall.y + r_wall.height &&
        player.height + player.y > r_wall.y) {
        player.x = player.x - 4;
    }
    if (player_hit_box.x < r_wall.x + r_wall.width &&
        player_hit_box.x + player_hit_box.width > r_wall.x &&
        player_hit_box.y < r_wall.y + r_wall.height &&
        player_hit_box.height + player_hit_box.y > r_wall.y) {
        player_hit_box.x = player_hit_box.x - 4;
    }
    if (enemy.x < r_wall.x + r_wall.width &&
        enemy.x + enemy.width > r_wall.x &&
        enemy.y < r_wall.y + r_wall.height &&
        enemy.height + enemy.y > r_wall.y) {
        enemy.x = enemy.x - 4;
    }
    if (e_g_pos.x < e_r_wall.x + e_r_wall.width &&
        e_g_pos.x + e_g_pos.width > e_r_wall.x &&
        e_g_pos.y < e_r_wall.y + e_r_wall.height &&
        e_g_pos.height + e_g_pos.y > e_r_wall.y) {
        e_g_pos.x = e_g_pos.x - 4;
    }
    // Laser Death! 
    if (player.x < laser.x + laser.width &&
        player.x + player.width > laser.x &&
        player.y < laser.y + laser.height &&
        player.height + player.y > laser.y) {
        // play laser sound
        laserSound.play();
        // player dies
        playerDie();
    }
    
    if (enemy.x < laser.x + laser.width &&
        enemy.x + enemy.width > laser.x &&
        enemy.y < laser.y + laser.height &&
        enemy.height + enemy.y > laser.y) {
        // play laser sound
        laserSound.play();
        // enemy dies
        enemyDie();
    }
}

function hitDetection (){

    // enemy damage
    if (enemy.x < bullet.x + bullet.width &&
        enemy.x + player.width > bullet.x &&
        enemy.y < bullet.y + bullet.height &&
        enemy.height + enemy.y > bullet.y) {
        hurtSound.play();
        enemy_health = enemy_health - 1;
        enemy.x = enemy.x + 6;
        e_g_pos.x = e_g_pos.x + 6;
        enemy.img = player2_hurt_sprite;
    }
    else    {
            enemy.img = gunner_sprite2;
            }
        document.getElementById("ehealth").value = enemy_health;
    if (enemy_health == 0)
            {
                enemyDie();
            }
    // Game Over Player 2
    if (lives2 <= 0)
        {
            document.getElementById("h9").style.display = "block";
            document.getElementById("Lives2").innerText = "0";  
                enemy_health = 0;
                enemy.x = -300;
                enemy.y = -300;
        }


    // player damage
    if (player.x < ebullet.x + ebullet.width &&
        player.x + player.width > ebullet.x &&
        player.y < ebullet.y + ebullet.height &&
        player.height + player.y > ebullet.y) {
        hurtSound.play();
        health_amount = health_amount - 1;
        player.x = player.x - 6;
        hurting = 1;
        player_hit_box.x = player_hit_box.x - 6;
        g_pos.x = g_pos.x - 6;
        player.img = gunner_sprite_hurt;
       }
else   { 
        player.img = gunner_sprite;
        }
        document.getElementById("health").value = health_amount;
        if (health_amount == 0)
            {
                playerDie();
            }
    // Game Over Player 1
    if (lives <= 0)
        {
            document.getElementById("h8").style.display = "block";
            document.getElementById("Lives").innerText = "0";  
                health_amount = 0;
                player.x = -300;
                player.y = -300;
        }
}

function updatePositions(){
    bullet.x += 200;
    ebullet.x -= 200;
}

function updateGameArena() {
    Arena.clear();
    setBoundaries();
    updatePositions();
    hitDetection();
    player.speedX = 0;
    player.speedY = 0;
    player_hit_box.speedX = 0;
    player_hit_box.speedY = 0;
    enemy.speedX = 0;
    enemy.speedY = 0;
    bullet.speedX = 0;
    bullet.speedY = 0;
    ebullet.speedX = 0;
    ebullet.speedY = 0;
    g_pos.speedX = 0;
    g_pos.speedY = 0;
    e_g_pos.speedX = 0;
    e_g_pos.speedY = 0;


    // controls for player
    // Uses WASD for movement and space for fire
    if (Arena.keys && Arena.keys[65] && lives >= 0) {player.speedX = -4;bullet.speedX = -4;player_hit_box.speedX = -4;g_pos.speedX = -4; walking = 1;}
    if (Arena.keys && Arena.keys[68] && lives >= 0) {player.speedX = 4;bullet.speedX = 4;player_hit_box.speedX = 4;g_pos.speedX = 4;walking = 2;}
    if (Arena.keys && Arena.keys[87] && lives >= 0) {player.speedY = -4;bullet.speedY = -4;player_hit_box.speedY = -4;g_pos.speedY = -4;walking = 1;}
    if (Arena.keys && Arena.keys[83] && lives >= 0) {player.speedY = 4;bullet.speedY = 4;player_hit_box.speedY = 4;g_pos.speedY = 4;walking = 2;}
    if (Arena.keys && Arena.keys[32] && lives >= 0 && bullet.distance == 0) {bullet.y = g_pos.y; bullet.x = g_pos.x; shootSound.play(); shooting = 1;}


    if (walking == 1 && player.speedX == -4 || player.speedY == -4){
                        player.img = gunner_sprite_walk_1;
                       }
    if (walking == 2 && player.speedX == 4 || player.speedY == 4){
                        player.img = gunner_sprite_walk_2;
                       }

    if (shooting == 1){
                       player.img = gunner_sprite_shoot;
                       }

    if (bullet.x != -80000) // super unnecessary number X)
        {
            bullet.distance -= 150;
            if(bullet.distance == -900)
                {
                    bullet.distance = 0;
                    shooting = 0;
                }
        }

    // controls for foe
    // Uses numpad 8456 for movement and down arrow for fire
    if (Arena.keys && Arena.keys[100] && lives2 >= 0) {enemy.speedX = -4; ebullet.speedX = -4;e_g_pos.speedX = -4; ewalking = 1;}
    if (Arena.keys && Arena.keys[102] && lives2 >= 0) {enemy.speedX = 4; ebullet.speedX = 4;e_g_pos.speedX = 4;ewalking = 2;}
    if (Arena.keys && Arena.keys[104] && lives2 >= 0) {enemy.speedY = -4; ebullet.speedY = -4;e_g_pos.speedY = -4;ewalking = 1;}
    if (Arena.keys && Arena.keys[101] && lives2 >= 0) {enemy.speedY = 4; ebullet.speedY = 4;e_g_pos.speedY = 4;ewalking = 2;}
    if (Arena.keys && Arena.keys[40]  && lives2 >= 0 && ebullet.distance == 0) {ebullet.y = e_g_pos.y; ebullet.x = e_g_pos.x; shootSound.play();eshooting = 1;}

    if (ewalking == 1 && enemy.speedX == -4 || enemy.speedY == -4){
                        enemy.img = gunner_sprite2_walk_1;
                       }
    if (ewalking == 2 && enemy.speedX == 4 || enemy.speedY == 4){
                        enemy.img = gunner_sprite2_walk_2;
                       }

    if (eshooting == 1){
                       enemy.img = gunner_sprite2_shoot;
                       }


    if (ebullet.x != -80000) // super unnecessary number X)
        {
            ebullet.distance -= 150;
            if(ebullet.distance == -900)
                {
                    ebullet.distance = 0;
                    eshooting = 0;
                }
        }

    // update positions
    player.newPos();
    player_hit_box.newPos();
    enemy.newPos();
    bullet.newPos();
    ebullet.newPos();
    e_g_pos.newPos();
    g_pos.newPos();
    laser.newPos();
    enemy.update();
    player.update();
    player_hit_box.update();
    bullet.update();
    ebullet.update();
    laser.update();
    g_pos.update();
    e_g_pos.update();

    // Wall new positions and updates
    f_wall.newPos();
    f_wall.update();
    b_wall.newPos();
    b_wall.update();
    l_wall.newPos();
    l_wall.update();
    r_wall.newPos();
    r_wall.update();
    e_r_wall.update();
    e_r_wall.newPos();

    // itembox new position and updates
    hp_box.newPos();
    hp_box.update();
}