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
        this.createTitleText();
        this.createIntroText(this.titleText, 30);
        this.createLaunchButton(this.introText, 80);
        this.createShareText(this.launchButton, 100);
        this.createShareQR(this.shareText, 20);
        this.createShareURL(this.shareQR, 20);
        // this.createGithubText(this.shareURL, 50)
        // this.createGithubButton(this.githubText, 0);
    }
    createTitleText(){
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
    createIntroText(placeBelow, distance){
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
    createLaunchButton(placeBelow, distance){
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
                backgroundColor: '#d60007',
            },
            add: true
        });
        Align.scaleToGameW(this.launchButton, .6);
        Align.centerH(this.launchButton);
        this.launchButton.setInteractive().on('pointerup', function () {
            this.launchGame();
        }, this);
    }
    createShareText(placeBelow, distance){
        let shareY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.shareText = this.make.text({
            x: 0,
            y: shareY,
            padding: { x: 10, y: 10 },
            text: 'Share with your friends:',
            style: {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
            },
            add: true
        });
        Align.scaleToGameW(this.shareText, .6);
        Align.centerH(this.shareText);
    }
    createShareQR(placeBelow, distance){
        let qrCodeY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.shareQR = this.add.image(0, qrCodeY, 'QR').setOrigin(0, 0);
        Align.scaleToGameW(this.shareQR, 0.5);
        Align.centerH(this.shareQR);
    }
    createShareURL(placeBelow, distance){
        let shareY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.shareURL = this.make.text({
            x: 0,
            y: shareY,
            padding: { x: 10, y: 10 },
            text: 'users.cs.cf.ac.uk/WhitlowC/ stats_vs_zombies',
            style: {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: 'blue',
                align: 'center',
                fontStyle: 'bold',
                wordWrap: { width: 1 }
            },
            add: true
        });
        Align.scaleToGameW(this.shareURL, .85);
        Align.centerH(this.shareURL);
        this.shareURL.setInteractive().on('pointerup', () => {
            window.open('https://users.cs.cf.ac.uk/WhitlowC/stats_vs_zombies/', '_blank');
        });
    }
    createGithubText(placeBelow, distance){
        let githubTextY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.githubText = this.make.text({
            x: 0,
            y: githubTextY,
            padding: { x: 10, y: 10 },
            text: 'Source code and more information at:',
            style: {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: 'black',
                align: 'center',
            },
            add: true
        });
        Align.scaleToGameW(this.githubText, .8);
        Align.centerH(this.githubText);
    }
    createGithubButton(placeBelow, distance){
        let githubY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        this.github = this.make.text({
            x: 0,
            y: githubY,
            padding: { x: 10, y: 8 },
            text: "github.com/charlywhitlow/stats_vs_zombies",
            style: {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: 'blue',
                align: 'center',
                borderRound: '15px',
                fontStyle: 'bold'
            },
            add: true
        });
        Align.scaleToGameW(this.github, .8);
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
