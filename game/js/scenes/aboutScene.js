class AboutScene extends Phaser.Scene {
    constructor() {
        super('AboutScene');
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
        this.load.image('back', 'assets/buttons/back.png');
    }
    create() {
        // add title background
        this.bg = this.add.image(0, 0, 'menuBackground').setOrigin(0,0);
        Align.scaleToGameW(this.bg, 1);
        Align.scaleToGameH(this.bg, 1);
        
        // create screen grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // about title text
        this.aboutTitle = new GameText(this, {
            text : 'About',
            width : 16,
            height : 30,
            fontSize : 70,
            fontColor : 'white'
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(4), this.aboutTitle);
        Align.centerH(this.aboutTitle);

        // about paragraph text
        this.aboutText = new GameText(this, {
            text : 
                "This mobile web app was created as part of a final year university project aimed at teaching core statistical concepts in a fun and accesible way.\n\n"+
                "The focus so far has been on developing the game structure.\n\n"+
                "If you have any feedback or would like to get involved with creating content for the game, please get in touch:\n"+
                "stats_vs_zombies@gmail.com\n\n"+
                "You can read more about the project including source code at:\n\n"+
                "github.com/charlywhitlow/\nstats_vs_zombies",
            width : 16,
            height : 28,
            fontSize : 50,
            fontColor : 'white',
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(7), this.aboutText);
        Align.centerH(this.aboutText);

        // add back button
        this.backButton = new BackButton({
            scene: this,
            returnSceneName: "MenuScene",
            warning: null
        });

        // fade in
        this.cameras.main.fadeFrom(100, 0, 0, 0);
    }
}