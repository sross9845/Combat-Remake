
//load game
var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'my-game', { preload: preload, create: create, update: update});

//Global Variables
var land;
var timeText;
const timeLimit = 120; // timeLimit for countdown in seconds
var timeOver = false; // set to false at start
var shadow;
var tank;
var tank2;
var spaceKey;
var enterKey;
var currentSpeed = 0;
var currentSpeed2 = 0;
var bullets;
var score1 = 0;
var score2 = 0;
var map;
var layer;
var time;
var timeLeft;

//Loading anything needed for preload of application
function preload () {
    game.load.crossOrigin = 'anonymous';
    game.load.image('tank', 'https://i.imgur.com/Pjatpuk.png');
    game.load.image('tank2', 'https://i.imgur.com/NbcoPec.png');
    game.load.image('bullet', 'https://i.imgur.com/ERkIBeJ.png');
    game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilesets.png');  
}
//Creation of sprites and game world
function create () {
    //Adding Game Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Generating Map/TileSet
    map = game.add.tilemap('map'); 
    map.addTilesetImage('tilesets', 'tiles');  // set tileset name
    layer = map.createLayer('ground');  // set layer name
    layer.resizeWorld();
    map.setCollision(4, true, layer);
    
    //Adding in Text to top and Win Game
    timeText = game.add.text(666, 20, '', { fontSize: '20px', fill: '#ffffff' });
    timeText.fixedToCamera = true;
    
    winGameText = game.add.text((game.world.centerX-200), 270, '', { fontSize: '60px', fill: '#ffffff' });
    
    scoreOneText = game.add.text(222, 20, '', { fontSize: '20px', fill: '#ffffff' });

    scoreTwoText = game.add.text(444, 20, '', { fontSize: '20px', fill: '#ffffff' });

    //  Resize our game world 
    game.world.setBounds(0,0, 1000, 600);

    // Base of our Red Tank
    tank = game.add.sprite(910, 300, 'tank');
    tank.scale.setTo(0.25,0.25);
    tank.anchor.setTo(0.5, 0.5);
    tank.angle = 180;

    //Adding physics and collision to Red Tank
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.collideWorldBounds = true;

    //  The base of our Blue Tank
    tank2 = game.add.sprite(90, 300, 'tank2');
    tank2.scale.setTo(0.25,0.25);
    tank2.anchor.setTo(0.5, 0.5);

    //Adding physics and collision to Blue Tank
    game.physics.enable(tank2, Phaser.Physics.ARCADE);
    tank2.body.collideWorldBounds = true;
    //Add Weapon for Red Tank
    weapon = game.add.weapon(1, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 200;
    //Weapon fire at angle of tank
    weapon.trackSprite(tank, 0, 0, true);

    //Add Weapon for Blue Tank
    weapon2 = game.add.weapon(1, 'bullet');
    weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the blue bullet is fired
    weapon2.bulletSpeed = 200;
    //Weapon fire at angle of tank
    weapon2.trackSprite(tank2, 0, 0, true);


     //Getting the Keyboard keys mapped that need to be mapped
    cursors = game.input.keyboard.createCursorKeys();
    rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

}

//Things to constantle check for
function update () {
    //Collision detection check
    game.physics.arcade.collide(tank, layer);
    game.physics.arcade.collide(weapon.bullets, layer, bulletCollide);
    game.physics.arcade.collide(weapon2.bullets, layer, bulletCollide);
    game.physics.arcade.collide(tank2, layer);
    //Time over Check / Win Check
    if (timeOver == false){ displayTimeRemaining();
    }else if (score1 > score2){
        winGameText.text = "Blue Tank Wins"
        endGame();
        } else if (score2 > score1){
            winGameText.text = "Red Tank Wins"
            endGame()
        } else {
            winGameText.text = "Tie Game!"
            endGame();
        }
    //Scores
    scoreOneText.text = "Blue Tank: " + score1;
    scoreTwoText.text = "Red Tank: " + score2;

    //Kill Function / Bullet Collision with tanks
    game.physics.arcade.overlap(tank, weapon2.bullets, enemyHit, null, this);
    game.physics.arcade.overlap(tank2, weapon.bullets, enemyHit2, null, this);
    
    //Movement 
    if (cursors.left.isDown)
    {
        tank.angle -= .75;
    }
    if (leftKey.isDown)
    {
        tank2.angle -= .75;

    }

    if (cursors.right.isDown)
    {
        tank.angle += .75;
    }
    if (rightKey.isDown)
    {
        tank2.angle += .75;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 60;
    }
    if (upKey.isDown)
    {

        currentSpeed2 = 60;
    }
    //Set some "drag" so it is alittle harder to stop
    if (currentSpeed2 > 0)
    {
        currentSpeed2 -= .5;
    }

    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= .5;
        }
    }
    //Set actual velocity of tanks
    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }
    if (currentSpeed2 > 0)
    {
        game.physics.arcade.velocityFromRotation(tank2.rotation, currentSpeed2, tank2.body.velocity);
    }



    //Firing functions
    if (spaceKey.isDown)
    {
        //  Boom!
        weapon2.fire();
    }
    if (enterKey.isDown)
    {
        //  Boom!
        weapon.fire();
    }
}

//What to do when tanks are hit | Tanks are killed and spawn randomly
function enemyHit(tank, weapon2) {
    tank.kill();
    weapon2.kill();
    tank.reset(game.world.randomX,game.world.randomY);
    score1++
}

function enemyHit2(tank2, weapon) {
    weapon.kill();
    tank2.kill();
    tank2.reset(game.world.randomX,game.world.randomY);
    score2++
}
//Time Remaining Function
function displayTimeRemaining() {
    time = Math.floor(game.time.totalElapsedSeconds() );
    timeLeft = timeLimit - time;

    // detect when countdown is over
    if (timeLeft <= 0) {
        timeLeft = 0;
        timeOver = true;
    }
    //display minutes and seconds
    var min = Math.floor(timeLeft / 60);
    var sec = timeLeft % 60;

    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }
    timeText.text = 'Time Left ' + min + ':' + sec;
}
//Bullet collision with layer
function bulletCollide (bullet, layer) {
    bullet.kill();
}


//End game function
function endGame(){
    tank.kill()
    tank2.kill()
}
