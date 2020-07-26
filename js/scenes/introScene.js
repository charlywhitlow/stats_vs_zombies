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
        this.titleText = this.createText(0, 50, "Stats Vs Zombies", .8, {
            paddingX : 32,
            paddingY : 16,
            fontSize : '64px',
            fontFamily : 'Arial',
            color : 'black',
            align : 'center'
        });

        this.introText = this.createTextBelow(this.titleText, 10, .85,
            'This game was created as part of a final year university project to teach statistical concepts in a fun and accessible way.', {
                paddingX : 10,
                paddingY : 10,
                fontSize : '20px',
                fontFamily : 'Arial',
                color : 'black',
                align : 'center',
                wordWrap : 340
            }
        );

        this.chromeText = this.createTextBelow(this.introText, 0, .85,
            'This project is a work in progress and currently works best in Chrome.', {
                paddingX : 10,
                paddingY : 10,
                fontSize : '20px',
                fontFamily : 'Arial',
                color : 'black',
                align : 'center',
                wordWrap : 340
            }
        );
    
        this.launchButton = this.createButton(this.chromeText, 20, 0.6, 'Play the game',
            {
                paddingX : 25,
                paddingY : 25,
                fontSize : '64px',
                fontFamily : 'Arial',
                color : 'white',
                align : 'center',
                backgroundColor : "#d60007"
            }
        );
        this.launchButton.setInteractive().on('pointerup', function () {
            this.launchGame();
        }, this);

        this.shareText = this.createTextBelow(this.launchButton, 20, .6,
            'Share with your friends:', {
                paddingX : 10,
                paddingY : 10,
                fontSize : '20px',
                fontFamily : 'Arial',
                color : 'black',
                align : 'center',
                wordWrap : 340
            }
        );

        this.qrImage = this.createImage(this.shareText, 0, 'QR', 0.4);

        this.shareURL = this.createTextBelow(this.qrImage, 10, .8,
            'users.cs.cf.ac.uk/WhitlowC/ stats_vs_zombies', {
                paddingX : 10,
                paddingY : 10,
                fontSize : '20px',
                fontFamily : 'Arial',
                color : 'red',
                align : 'center',
                fontStyle: 'bold',
                wordWrap : 1
            }
        );
        this.shareURL.setInteractive().on('pointerup', () => {
            window.open('https://users.cs.cf.ac.uk/WhitlowC/stats_vs_zombies/', '_blank');
        });

        this.githubText = this.createTextBelow(this.shareURL, 10, .5,
            'Source code available at:', {
                paddingX : 10,
                paddingY : 10,
                fontSize : '20px',
                fontFamily : 'Arial',
                color : 'black',
                align : 'center',
                wordWrap : 340
            }
        );

        this.githubLink = this.createTextBelow(this.githubText, 0, .85,
            'github.com/charlywhitlow/stats_vs_zombies', {
                paddingX : 10,
                paddingY : 0,
                fontSize : '20px',
                fontFamily : 'Arial',
                fontStyle: 'bold',
                color : 'red',
                align : 'center',
                wordWrap : 340
            }
        );
        this.githubLink.setInteractive().on('pointerup', () => {
            window.open('https://github.com/charlywhitlow/stats_vs_zombies', '_blank');
        });
    }
    createText(x, y, text, scale, style){
        let textObj = this.make.text({
            x: x,
            y: y,
            padding: { x: style.paddingX, y: style.paddingY },
            text: text,
            style: {
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle : (style.fontStyle) ? style.fontStyle : 'normal',
                color: style.color,
                align: style.align,
            },
            add: true
        });
        Align.scaleToGameW(textObj, scale);
        Align.centerH(textObj);
        return textObj;
    }
    createTextBelow(placeBelow, distance, scale, text, style){
        let textY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        let textObj = this.make.text({
            x: 0,
            y: textY,
            padding: { x: style.paddingX, y: style.paddingY },
            text: text,
            style: {
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                color: style.color,
                align: style.align,
                wordWrap: { width: style.wordWrap }
            },
            add: true
        });
        Align.scaleToGameW(textObj, scale);
        Align.centerH(textObj);
        return textObj;
    }
    createButton(placeBelow, distance, scale, text, style){
        let launchY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        let button = this.make.text({
            x: 0,
            y: launchY,
            padding: { x: style.paddingX, y: style.paddingY },
            text: text,
            style: {
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                color: style.color,
                align: style.align,
                backgroundColor: style.backgroundColor,
            },
            add: true
        });
        Align.scaleToGameW(button, scale);
        Align.centerH(button);
        return button;
    }
    createImage(placeBelow, distance, image, scale){
        let imageY = placeBelow.y + (placeBelow.height * placeBelow._scaleY) + distance;
        let imageObj = this.add.image(0, imageY, image).setOrigin(0, 0);
        Align.scaleToGameW(imageObj, scale);
        Align.centerH(imageObj);
        return imageObj;
    }
    launchGame(){
        // // enter fullscreen
        // if (!this.scale.isFullscreen){
        //     this.scale.startFullscreen();            
        // }
        // launch title scene
        this.scene.start("TitleScene");
    }   
}
