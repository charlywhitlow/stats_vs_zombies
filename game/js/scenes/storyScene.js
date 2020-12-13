
class StoryScene extends Phaser.Scene {
    constructor() {
        super('StoryScene');
    }
    init(data){

        // init data for testing
        if (!data.level) {
            console.log('test data added');
            data = {
                "username" : "newPlayer",
                "zone" : 1,
                "level" : 1,
                "health" : 3,
                "gold" : 0,
                "score" : 0
            };  
        }
        // populate user
        this.user = data;

        // game story
        this.story = 
            "Greetings "+this.user.username+"\n\n"+
            "The world is in the grips of a zombie pandemic, and it needs your help.\n\n"+
            "The aim of the game is to beat zombies and save the world... with stats!\n\n"+
            "You can shoot zombies with stats, or defeat them in hand-to-hand combat by giving a correct answer.\n\n"+
            "Collect coins to buy clues to tough questions.\n\n"+
            "Good luck!"
    }
    preload(){
        this.load.image("back", 'assets/buttons/back.png');   
    }
    create() {
        // fade in
        this.cameras.main.fadeFrom(500, 0, 0, 0);

        // create screen grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // add back button
        this.backButton = new BackButton({
            scene: this,
            returnSceneName: "MenuScene",
            warning: null
        });

        // add skip button
        this.skipButton = GameText.addText(this, this.grid, "Skip Intro", {
            xWidth : 5,
            yWidth : 1.5,
            xPadding: 4,
            yPadding: 8,
            fontSize : '48px',
            backgroundColor: 'darkgrey',
            color: 'black',
        });
        this.grid.placeAtIndex(510, this.skipButton);
        this.skipButton.setInteractive().on('pointerdown', this.launchGame.bind(this));

        // add text object to add to
        this.text = GameText.addText(this, this.grid, "", {
            xIndex : 1,
            yIndex : 3.4,
            xWidth : this.grid.cols -2,
            yWidth : this.grid.rows,
            fontSize : '56px',
            color: '#CC0000',
            wordWrap: 90,
            align: 'left'
        });

        // loop through characters in story and add to text object
        let chars = this.story.split('');
        let i = 0;
        this.time.addEvent({ delay: 250, callback: function(){
            this.time.addEvent({ delay: 20, callback: function(){
                this.text.setText(this.text.text + chars[i])
                i++;
                if (i==this.story.length) {
                    // add start button
                    this.time.addEvent({ delay: 200, callback: function(){
                        this.skipButton.destroy();
                        this.addStartButton();
                    }, callbackScope: this, loop: false });        
                }
            }, callbackScope: this, loop: false, repeat: this.story.length-1 });
        }, callbackScope: this, loop: false});
    }
    addStartButton(){
        this.startButton = GameText.addText(this, this.grid, "GO", {
            xIndex : 0,
            yIndex : 0,
            xWidth : 4.2,
            yWidth : 2.1,
            backgroundColor: '#CC0000',
            fontSize : '54px',
            color: 'white',
        });
        this.startButton.setInteractive().on('pointerdown', this.launchGame.bind(this));
        this.grid.placeAtIndex(510, this.startButton);
        Align.centerH(this.startButton);
    }
    launchGame(){
        this.scene.start("MapScene", this.user);
    }
}