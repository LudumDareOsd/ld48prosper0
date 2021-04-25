import minerAnimImg from './assets/miner.png';
import edgeImg from './assets/edge.png';
import lavaImg from './assets/lava.png';
import bkgImg from './assets/tile_background.png';

class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super("GameScene");
    }

    preload ()
    {
        this.load.image("edge", edgeImg);
        this.load.image("lava", lavaImg);
        this.load.spritesheet('miner', minerAnimImg, { frameWidth: 25, frameHeight: 50 });
        this.load.image('bkg', bkgImg);

        this.musicGame = this.sound.add('gameaudio', { loop: true, volume: 0.4 });
        this.sndshortmusic = this.sound.add('shortaudio', { loop: false, volume: 0.6 });
        this.snddeath = this.sound.add('deathaudio', { loop: false, volume: 0.9 });
        this.snddeathfalling = this.sound.add('deathfallingaudio', { loop: false, volume: 0.9 });
    }
      
    create ()
    {
        gameOver = false;
        firstMove = true;
        score = 0;
        cnt = 0;
        level = 1;
        edgeSpeed = 190;

        this.musicGame.stop();
        this.musicGame.play();
        this.musicGame.setRate(1);

        this.mainGround = this.add.tileSprite(375, 667, 750, 1334, "bkg");

        this.edgeGroup = this.physics.add.group();
        this.lavaGroup = this.physics.add.group({
            defaultKey: 'lava',
            defaultFrame: 0,
            maxSize: 10,
            enable: false
          });
        this.lavaGroup.createMultiple({
            key: this.lavaGroup.defaultKey,
            frame: this.lavaGroup.defaultFrame,
            frameQuantity: 0.5 * this.lavaGroup.maxSize,
            active: false,
            visible: false
          });

        let firstedge = this.edgeGroup.create(this.game.config.width / 2, this.game.config.height * (1/10), "edge");
        firstedge.setImmovable(true);

        for(let i = 0; i < 10; i ++) {
            let edge = this.edgeGroup.create(0, 0, "edge");
            edge.setImmovable(true);
            this.positionEdge(edge);
        }

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('miner', { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'miner',  frame: 0 }]
        });

        this.minerjoe = this.physics.add.sprite(this.game.config.width / 2, 0, "miner").setSize(25,50).play('idle');
        this.minerjoe.body.gravity.y = gameGravity;

        this.input.on("pointerdown", this.moveMinerJoe, this);
        this.input.on("pointerup", this.stopMinerJoe, this);

        var aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        var sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        var leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        var rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        aKey.on('down', this.moveMinerJoeKey, this);
        sKey.on('down', this.moveMinerJoeKey, this);
        leftKey.on('down', this.moveMinerJoeKey, this);
        rightKey.on('down', this.moveMinerJoeKey, this);
        aKey.on('up', this.stopMinerJoe, this);
        sKey.on('up', this.stopMinerJoe, this);
        leftKey.on('up', this.stopMinerJoe, this);
        rightKey.on('up', this.stopMinerJoe, this);

        //this.registry.set('lives', 3);
        this.registry.set('level', level);
        let oldHi = localStorage.getItem('ld48hiscore');
        this.hi = 0;
        if(oldHi !== null)
            this.hi = oldHi;

        this.text = this.add.text(10, 10, '', { font: '20px Courier', fill: '#00ff00' });
        this.text.visible = false;
        var add = this.add;
        var that = this;
        WebFont.load({
            google: {
                families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
            },
            active: function ()
            {
                that.text = add.text(10, 10, 'Level', { fontFamily: 'Finger Paint', fontSize: 24, color: '#56ffff' });
                that.text.setText([
                    'Level: 1',
                    'Hi-Score: ' + localStorage.getItem('ld48hiscore'),
                    'Score: 0'
                ]);
            }
        });

        this.setTextHud(level, this.hi, score);

        firstMove = true;
    }

    setTextHud(levelin, hiin, scorein) {
        this.text.setText([
            'Level: ' + levelin,
            'Hi-Score: ' + hiin,
            'Score: ' + scorein + ' meters'
        ]);
    }

    update()
    {
        cnt++;

        if(cnt % 10 == 0 && !firstMove && !gameOver) {
            score++;

            if(score % 50 == 0) {
                level++;
                edgeSpeed = edgeSpeed + (10*level);
                this.edgeGroup.setVelocityY(-edgeSpeed);
                this.lavaGroup.setVelocityY(-edgeSpeed);
                this.musicGame.setRate(1*(1+(level/100)));
            }

            this.setTextHud(level, this.hi, score);
        }

        if(gameOver == true) {
            this.musicGame.stop();

            this.lavaGroup.clear(true, true);

            var red = Phaser.Math.Between(50, 255);
            var green = Phaser.Math.Between(50, 255);
            var blue = Phaser.Math.Between(50, 255);

            this.registry.set('score', score);
            this.registry.set('level', level)
            let oldHi = localStorage.getItem('ld48hiscore');
            if(oldHi === null || oldHi < score)
                localStorage.setItem('ld48hiscore', score);

            this.cameras.main.fade(1000, red, green, blue);

            var that = this;

            this.time.delayedCall(1000, function () {
                that.musicGame.stop();
                this.game.sound.stopAll();
                this.scene.start('GameOverScene');
              }, [], this);
        }

        this.physics.world.collide(this.edgeGroup, this.minerjoe);

        this.physics.world.wrap(this.minerjoe, 25);

        this.physics.world.overlap(this.minerjoe, this.lavaGroup, function(){
            this.snddeath.play();
            gameOver = true;
            this.minerjoe.body.velocity.x =  20;
            this.minerjoe.body.velocity.y = -1800;
            this.minerjoe.body.gravity.y = 10000;
            this.minerjoe.setVelocityY(-1200);
            this.minerjoe.setVelocityX(-1200);
            this.minerjoe.angle = -45;
        }, null, this);

        this.lavaGroup.getChildren().forEach(function(lava){
            if(lava.getBounds().bottom < 0){
                lava.disableBody( 
                    true, // Deactivate sprite (active=false)
                    true  // Hide sprite (visible=false)
                  );
            }
        }, this);

        this.edgeGroup.getChildren().forEach(function(edge) {
            if(edge.getBounds().bottom < 0) {
                this.positionEdge(edge);
            }
        }, this);

        if(this.minerjoe.y > this.game.config.height || this.minerjoe.y < 0) {
            this.snddeathfalling.play();
            gameOver = true;
            lives = 0;
        }

        if(!firstMove && !gameOver)
            this.mainGround.tilePositionY += 3;
    }

    handleCollision(minerJoe, lava) {
        
            if (minerJoe.x < lava.getBounds().left) {
                minerJoe.setVelocityY(-1200);
                minerJoe.setVelocityX(-1200);
                minerJoe.angle = -45;
            }
            if (minerJoe.x > lava.getBounds().right) {
                minerJoe.setVelocityY(-1200);
                minerJoe.setVelocityX(1200);
                minerJoe.angle = 45;
            }
            if (minerJoe.y > lava.getBounds().top) {
                minerJoe.setVelocityY(-1200);
                minerJoe.setVelocityX(1200);
                minerJoe.angle = 45;
            }
    }

    randomValue(a) {
        return Phaser.Math.Between(a[0], a[1]);
    }

    moveMinerJoe(e) {

        if(gameOver == true)
            return;

        var leftOrRight = ((e.x > this.game.config.width / 2) ? 1 : -1);
        this.minerjoe.setVelocityX(minerJoeSpeed * leftOrRight);
        this.minerjoe.play('walk', true);
        this.minerjoe.flipX = leftOrRight == -1 ? true : false;

        if(firstMove) {
            firstMove = false;
            this.edgeGroup.setVelocityY(-edgeSpeed);
        }
    }

    moveMinerJoeKey(key, e) {

        if(gameOver == true)
            return;

        var leftOrRight = key.keyCode == 65 || key.keyCode == 37 ? -1 : 1;
        this.minerjoe.setVelocityX(minerJoeSpeed * leftOrRight);
        this.minerjoe.play('walk', true);
        this.minerjoe.flipX = leftOrRight == -1 ? true : false;

        if(firstMove) {
            firstMove = false;
            this.edgeGroup.setVelocityY(-edgeSpeed);
        }
    }

    stopMinerJoe() {
        this.minerjoe.setVelocityX(0);
        this.minerjoe.play('idle');
    }

    getLowestEdge() {
        let lowestEdge = 0;
        this.edgeGroup.getChildren().forEach(function(edge) {
            lowestEdge = Math.max(lowestEdge, edge.y);
        });
        return lowestEdge;
    }

    positionEdge(edge) {

        edge.y = this.getLowestEdge() + this.randomValue(vDistanceEdge);
        edge.x = this.game.config.width / 2 + this.randomValue(hDistanceEdge) * Phaser.Math.RND.sign();
        edge.displayWidth = this.randomValue(edgeLength);

        var thelava = this.lavaGroup.get();

        if (!thelava) {
            //console.log('No free lava in pool');
        } else {
            if(firstMove === false && !gameOver) {
                let chanceCreate = 0;
                let createLava = level > 1 && Phaser.Math.RND.between(0, 100) < level*10;

                if(createLava)
                {
                    thelava.enableBody(
                        true, // Reset body and game object, at (x, y)
                        edge.x - edge.displayWidth/2 + 20,
                        edge.y - 26,
                        true, // Activate sprite
                        true  // Show sprite
                        );
                                    
                    thelava.setVelocityY(-edgeSpeed);
                    thelava.setOrigin(0.5, 0);
                }
            }
        }
    }
}

export default GameScene;

let lives = 1;
var gameOver = false;
var firstMove = true;
var score = 0;
var cnt = 0;
var level = 1;
var edgeSpeed = 190;
var gameGravity = 1200;
var minerJoeSpeed = 300;
var vDistanceEdge =  [150, 300];
var hDistanceEdge = [0, 250];
var edgeLength = [50, 150];