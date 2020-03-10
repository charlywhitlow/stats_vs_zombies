class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' })
    }
  
    preload() {
        this.load.image('introBackground', 'assets/backgrounds/introBackground.png');
        this.load.image('QR', 'assets/QRcode.png');        
    }
  
    create() {
        // add title background
        this.introBg = this.add.image(0, 0, 'introBackground').setOrigin(0,0);
        Align.scaleToGameH(this.introBg, 2);

        // page title
        this.titleText = this.make.text({
            x: 0,
            y: 50,
            padding: { x: 32, y: 16 },
            text: 'Stats Vs Zombies',
            style: {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
            },
            add: true
        });
        Align.scaleToGameW(this.titleText, .8);
        Align.centerH(this.titleText);

        // intro paragraph
        let introTextY = this.titleText.y + (this.titleText.height * this.titleText._scaleY) + 30;
        this.introText = this.make.text({
            x: 0,
            y: introTextY,
            padding: { x: 10, y: 10 },
            text: 'This game has been created as a prototype for a mobile gaming platform to teach core statistical concepts to undergraduate students.\n\nSource code and more information is available at:',
            style: {
                fontSize: '22px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
                wordWrap: { width: 340 }
            },
            add: true
        });
        Align.scaleToGameW(this.introText, .8);
        Align.centerH(this.introText);

        // github button
        let githubY = this.introText.y + (this.introText.height * this.introText._scaleY) + 10;
        this.github = this.make.text({
            x: 0,
            y: githubY,
            padding: { x: 10, y: 8 },
            text: "github",
            style: {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
                backgroundColor: 'lightgrey',
                borderRound: '15px'
            },
            add: true
        });
        Align.scaleToGameW(this.github, .18);
        Align.centerH(this.github);        
        this.github.setInteractive().on('pointerup', () => {
            window.open('https://github.com/charlywhitlow/stats_vs_zombies', '_blank');
        });

        // launch game
        let launchY = this.github.y + (this.github.height * this.github._scaleY) + 90;
        this.launchButton = this.make.text({
            x: 0,
            y: launchY,
            padding: { x: 30, y: 30 },
            text: 'Play the game',
            style: {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: 'white',
                align: 'center',
                backgroundColor: 'black',
            },
            add: true
        });
        Align.scaleToGameW(this.launchButton, .6);
        Align.centerH(this.launchButton);
        this.launchButton.setInteractive().on('pointerup', function () {
            this.launchGame();
        }, this);

        // QR code
        let qrCodeY = this.launchButton.y + (this.launchButton.height * this.launchButton._scaleY) + 30;
        this.QR = this.add.image(0, qrCodeY, 'QR').setOrigin(0, 0);
        Align.scaleToGameW(this.QR, 0.5);
        Align.centerH(this.QR);

        // share URL
        let shareY = this.QR.y + (this.QR.height * this.QR._scaleY) + 10;
        this.shareText = this.make.text({
            x: 0,
            y: shareY,
            padding: { x: 10, y: 10 },
            text: 'qrco.de/zombieStats',
            style: {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
            },
            add: true
        });
        Align.scaleToGameW(this.shareText, .4);
        Align.centerH(this.shareText);
        // this.shareText.setInteractive().on('pointerup', function () {
        //     // copy url to clipboard?
        // }, this);
    }

    launchGame(){
        // enter fullscreen
        if (!this.scale.isFullscreen){
            this.scale.startFullscreen();            
        }
        // launch title scene
        this.scene.start("TitleScene");
    }
}
