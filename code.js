

var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'my-game', { preload: preload, create: create, update: update});

function preload () {
    game.load.crossOrigin = 'anonymous';
    game.load.atlas('tank', 'http://examples.phaser.io/assets/games/tanks/tanks.png', 'http://examples.phaser.io/assets/games/tanks/tanks.json');
    game.load.atlas('tank2', 'http://examples.phaser.io/assets/games/tanks/tanks.png', 'http://examples.phaser.io/assets/games/tanks/tanks.json');
    game.load.image('bullet', 'http://examples.phaser.io/assets/games/tanks/bullet.png');
    
}

var land;

var shadow;
var tank;
var tank2;
var turret;
var spaceKey;
var enterKey;
var currentSpeed = 0;
var currentSpeed2 = 0;
var bullets;
function create () {
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    //  Resize our game world 
    game.world.setBounds(0,0, 1000, 600);

    //  The base of our tank
    tank2 = game.add.sprite(300, 100, 'tank2', 'tank1');
    tank2.anchor.setTo(0.5, 0.5);
    tank2.animations.add('move', ['tank1', 'tank2', 'tank3', 
     'tank4', 'tank5', 'tank6'], 20, true);

    tank = game.add.sprite(100, 300, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(50, 50);
    tank.body.collideWorldBounds = true;
    tank.health = 1;

    game.physics.enable(tank2, Phaser.Physics.ARCADE);
    tank2.body.drag.set(0.2);
    tank2.body.maxVelocity.setTo(50, 50);
    tank2.body.collideWorldBounds = true;
    tank2.health = 1;

    //  Finally on-top of the tank body
    turret = game.add.sprite(0, 0, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);

    turret2 = game.add.sprite(0, 0, 'tank2', 'turret');
    turret2.anchor.setTo(0.3, 0.5);
    
    weapon2 = game.add.weapon(1, 'bullet');

    weapon2.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon2.bulletSpeed = 100;

    weapon2.fireRate = 2000;

    weapon2.trackSprite(turret2, 0, 0, true);
    
    weapon = game.add.weapon(1, 'bullet');

    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 100;

    weapon.fireRate = 2000;

    weapon.trackSprite(turret, 0, 0, true);

    // tank.bringToTop();
    // tank2.bringToTop();
    // turret.bringToTop();
    // turret2.bringToTop();


    cursors = game.input.keyboard.createCursorKeys();
    rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);

    game.physics.arcade.overlap(tank, weapon, enemyHit, null, this);
    game.physics.arcade.overlap(tank2, weapon2, enemyHit2, null, this);

}


function update () {
    if (cursors.left.isDown)
    {
        tank.angle -= .75;
        turret.angle -= .75;
    }
    if (leftKey.isDown)
    {
        tank2.angle -= .75;
        turret2.angle -= .75;

    }

    if (cursors.right.isDown)
    {
        tank.angle += .75;
        turret.angle += .75;
    }
    if (rightKey.isDown)
    {
        tank2.angle += .75;
        turret2.angle += .75;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 50;
    }
    if (upKey.isDown)
    {
        
        currentSpeed2 = 50;
    }
    if (currentSpeed2 > 0)
    {
        currentSpeed2 -= 2;
    }

    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 2;
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }
    if (currentSpeed2 > 0)
    {
        game.physics.arcade.velocityFromRotation(tank2.rotation, currentSpeed2, tank2.body.velocity);
    }


    //  Position all the parts and align rotations
    turret.x = tank.x;
    turret.y = tank.y;
    turret2.x = tank2.x;
    turret2.y = tank2.y;


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

function enemyHit(tank, weapon2) {
    tank.kill();
    weapon2.kill();
    console.log("Enemy hit");
}
function enemyHit2(tank2, weapon) {
    weapon.kill();
    tank2.kill();
    console.log("Enemy hit");
}