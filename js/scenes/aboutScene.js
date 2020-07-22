class AboutScene extends Phaser.Scene {
    constructor() {
        super('AboutScene');
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
    }
    create() {
        // create screen grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // add title background
        this.bg = this.add.image(0, 0, 'menuBackground').setOrigin(0,0);
        Align.scaleToGameW(this.bg, 1);
        Align.scaleToGameH(this.bg, 1);
        
        // about
        let aboutTextConfig = {
            xIndex : 1,
            yIndex : 4,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'white',
        };
        let aboutText = this.addText(this.grid, "About", aboutTextConfig);
        Align.centerH(aboutText);

        // p1
        let p1TextConfig = {
            xIndex : 1,
            yIndex : 7,
            xWidth : 16,
            yWidth : 6,
            fontSize : '50px',
            color: 'white',
        };
        let p1 = this.addText(this.grid, "This web app is a prototype for a mobile gaming platform to teach core statistical concepts in an accesible way, created as part of a final year university project.", p1TextConfig);
        Align.centerH(p1);
        
        // add back button
        let backButton = this.addText(this.grid, "< Back", {
            xIndex : 13,
            yIndex : 1,
            xWidth : 4,
            yWidth : 1.8,
            fontSize : '42px',
            color: 'white',
            backgroundColor: 'grey',
        });
        // Align.centerH(backButton);
        backButton.setInteractive().on('pointerup', function () {
            console.log('back to menu')
            this.scene.start("MenuScene");
        }, this);


        // this.createTitleText();
        // this.createIntroText(this.titleText, 30);
        // this.createLaunchButton(this.introText, 80);
        // this.createShareText(this.launchButton, 100);
        // this.createShareQR(this.shareText, 20);
        // this.createShareURL(this.shareQR, 20);
        // this.createGithubText(this.shareURL, 50)
        // this.createGithubButton(this.githubText, 0);


        // fade in
        this.cameras.main.fadeFrom(100, 0, 0, 0);

    }
    // createLaunchButton(placeBelow, distance){
    //     let launchY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
    //     this.launchButton = this.make.text({
    //         x: 0,
    //         y: launchY,
    //         padding: { x: 30, y: 30 },
    //         text: 'Play the game',
    //         style: {
    //             fontSize: '64px',
    //             fontFamily: 'Arial',
    //             color: 'white',
    //             align: 'center',
    //             backgroundColor: '#d60007',
    //         },
    //         add: true
    //     });
    //     Align.scaleToGameW(this.launchButton, .6);
    //     Align.centerH(this.launchButton);
    //     this.launchButton.setInteractive().on('pointerup', function () {
    //         this.launchGame();
    //     }, this);
    // }

    // createTitleText(){
    //     this.titleText = this.make.text({
    //         x: 0,
    //         y: 50,
    //         padding: { x: 32, y: 16 },
    //         text: 'Stats Vs Zombies',
    //         style: {
    //             fontSize: '64px',
    //             fontFamily: 'Arial',
    //             color: 'black',
    //             align: 'center',
    //         },
    //         add: true
    //     });
    //     Align.scaleToGameW(this.titleText, .8);
    //     Align.centerH(this.titleText);
    // }
    // createIntroText(placeBelow, distance){
    //     let introTextY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
    //     this.introText = this.make.text({
    //         x: 0,
    //         y: introTextY,
    //         padding: { x: 10, y: 10 },
    //         text: 'This game is a prototype for a mobile gaming platform to teach core statistical concepts to undergraduate students.',
    //         style: {
    //             fontSize: '22px',
    //             fontFamily: 'Arial',
    //             color: 'black',
    //             align: 'center',
    //             wordWrap: { width: 340 }
    //         },
    //         add: true
    //     });
    //     Align.scaleToGameW(this.introText, .8);
    //     Align.centerH(this.introText);
    // }
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


    addText(grid, text, config){
        // options: xIndex, yIndex, xWidth, yWidth, xPadding, yPadding
        // fontFamily, fontSize, fontStyle, color, align, backgroundColor

        // defaults
        if (!config.xIndex) {
            config.xIndex = 1;
        }
        if (!config.yIndex) {
            config.yIndex = 1;            
        }
        if (!config.xPadding) {
            config.xPadding = 25;
        }
        if (!config.yPadding) {
            config.yPadding = 25;            
        }
        if (!config.xWidth) {
            config.xWidth = 8;
        }
        if (!config.yWidth) {
            config.yWidth = 3;
        }

        // add text
        let addText = this.make.text({
            x: config.xIndex * grid.cellWidth,
            y: config.yIndex * grid.cellHeight,
            padding: { x: config.xPadding, y: config.yPadding },
            text: text,
            style: {
                fontFamily: (config.fontFamily ? config.fontFamily : 'Arial'),
                fontSize: (config.fontSize ? config.fontSize : '70px'),
                color: (config.color ? config.color : 'black'),
                align: (config.align ? config.align : 'center'),
                fixedWidth: config.xWidth * grid.cellWidth,
                fixedHeight: config.yWidth * grid.cellHeight,
                wordWrap: {
                    width: (config.xWidth * grid.cellWidth)-(config.xPadding*2),
                },
            },
        });
        if (config.backgroundColor) {
            addText.setBackgroundColor(config.backgroundColor);
        }
        if (config.fontStyle) {
            addText.setFontStyle(config.fontStyle);
        }
        return addText;        
    }
}