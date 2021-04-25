import Phaser from 'phaser';

import LoadScene from './LoadScene';
import GameScene from './GameScene';
import GameOverScene from './GameOverScene';
import TitleScene from './TitleScene';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "thegame",
        width: 750,
        height: 1334
    },
    physics: {
        default: "arcade"
    },
    //width: 800,
    //height: 600,
    scene: [
        LoadScene,
        GameScene,
        GameOverScene,
        TitleScene
    ]
};

const game = new Phaser.Game(config);
