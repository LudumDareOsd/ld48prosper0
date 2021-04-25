class TitleScene extends Phaser.Scene
{
    constructor ()
    {
        super("TitleScene");
    }

    preload ()
    {
        this.musicTitle = this.sound.add('titleaudio', { loop: true });
    }
      
    create () 
    {
        this.add.image(0, 0, 'title').setOrigin(0, 0);
        this.musicTitle.play();
        
        var add = this.add;
        var input = this.input;
        var txt;
        WebFont.load({
            google: {
                families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
            },
            active: function ()
            {
                txt = add.text(130, 1200, 'SPACE or CLICK to Play', { fontFamily: 'Finger Paint', fontSize: 40, color: '#00ff00' });
            }
        });

        var spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKey.on('down', this.handleRestart, this);
        this.input.on("pointerdown", this.handleRestart, this);
    }

    handleRestart(key, e) {
        this.musicTitle.stop();
        this.game.sound.stopAll();

        this.time.delayedCall(250, function () {
            this.scene.start('GameScene');
          }, [], this);
    }

    silenceall() {
        this.game.sound.stopAll();
    }

    update()
    {
    }
}

export default TitleScene;