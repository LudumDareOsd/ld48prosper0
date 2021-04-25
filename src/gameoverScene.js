class GameOverScene extends Phaser.Scene
{
    constructor ()
    {
        super("GameOverScene");
    }

    preload ()
    {
        this.musicGameover = this.sound.add('gameoveraudio', { loop: true, volume: 0.4 });
    }
      
    create () 
    {
        const logo = this.add.image(400, 150, 'gameover');
        this.musicGameover.play();

        var add = this.add;
        var input = this.input;
        var registry = this.registry;
        var txt;
        WebFont.load({
            google: {
                families: [ 'Freckle Face', 'Finger Paint', 'Nosifer' ]
            },
            active: function ()
            {
                var text = add.text(240, 700, 'Level', { fontFamily: 'Finger Paint', fontSize: 40, color: '#56ffff' });
                text.setText([
                    'Level: ' + registry.get('level'),
                    'Score: ' + registry.get('score'),
                    'Nuggets: ' + registry.get('nuggets'),
                    'Hi-Score: ' + localStorage.getItem('ld48hiscore')
                ]);
                txt = add.text(210, 1100, 'SPACE or CLICK', { fontFamily: 'Finger Paint', fontSize: 40, color: '#00ff00' });
            }
        });
      
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

        var spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKey.on('down', this.handleRestart, this);
        this.input.on("pointerdown", this.handleRestart, this);

        /*var text = this.add.text(10, 10, '', { font: '20px Courier', fill: '#00ff00' });
        text.setText([
            'Level: ' + this.registry.get('level'),
            'Score: ' + this.registry.get('score'),
            'Hi-Score: ' + localStorage.getItem('ld48hiscore')
        ]);*/
    }

    handleRestart(key, e) {

        this.musicGameover.stop();
        this.game.sound.stopAll();
        this.time.delayedCall(250, function () {
            this.scene.start('TitleScene');
          }, [], this);
        
    }

    update()
    {
    }
}

export default GameOverScene;