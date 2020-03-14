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

        // add page elements
        this.titleText();
        this.introText(this.titleText, 30);
        this.launchButton(this.introText, 60);
        this.shareQR(this.launchButton, 60);
        this.shareURL(this.shareQR, 10);
        this.githubText(this.shareText, 50)
        this.githubButton(this.githubText, 10);
    }
    titleText(){
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
    }
    introText(placeBelow, distance){
        let introTextY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.introText = this.make.text({
            x: 0,
            y: introTextY,
            padding: { x: 10, y: 10 },
            text: 'This game is a prototype for a mobile gaming platform to teach core statistical concepts to undergraduate students.',
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
    }
    launchButton(placeBelow, distance){
        let launchY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
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
    }
    shareQR(placeBelow, distance){
        let qrCodeY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.shareQR = this.add.image(0, qrCodeY, 'QR').setOrigin(0, 0);
        Align.scaleToGameW(this.shareQR, 0.5);
        Align.centerH(this.shareQR);        
    }
    shareURL(placeBelow, distance){
        let shareY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
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
    }
    githubText(placeBelow, distance){
        let githubTextY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.githubText = this.make.text({
            x: 0,
            y: githubTextY,
            padding: { x: 10, y: 10 },
            text: 'Source code and more information available at:',
            style: {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
                wordWrap: { width: 350 }
            },
            add: true
        });
        Align.scaleToGameW(this.githubText, .5);
        Align.centerH(this.githubText);        
    }
    githubButton(placeBelow, distance){
        let githubY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
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
