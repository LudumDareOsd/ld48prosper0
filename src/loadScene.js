import logoImg from './assets/logo.png';
import titleImg from './assets/title.png';
import gameoverImg from './assets/gameover.png';
import sndMusic1 from './assets/music1.mp3';
import sndMusic2 from './assets/music2.mp3';
import sndMusic3 from './assets/music3.mp3';
import sndShortBeat from './assets/shortbeat.mp3';
import sndDeath from './assets/death.mp3';
import sndFallingDeath from './assets/fallingdeath.mp3';

class LoadScene extends Phaser.Scene
{
    constructor ()
    {
        super("LoadScene");
    }

    preload ()
    {
        this.load.image('logo', logoImg);
        this.load.image('title', titleImg);
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image('gameover', gameoverImg);

        this.load.audio('titleaudio', sndMusic1, null);
        this.load.audio('gameaudio', sndMusic2, null);
        this.load.audio('gameoveraudio', sndMusic3, null);
        this.load.audio('shortaudio', sndShortBeat, null);
        this.load.audio('deathaudio', sndDeath, null);
        this.load.audio('deathfallingaudio', sndFallingDeath, null);
    }
      
    create () 
    {
        this.add.text(150, 800, 'LOADING...', { font: '20px Courier', fill: '#00ff00' });

        const logo = this.add.image(400, 150, 'logo');
      
        this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });

        this.scene.start('TitleScene');
    }

    update()
    {
    }
}

export default LoadScene;