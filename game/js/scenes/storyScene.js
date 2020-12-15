
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
        this.skipButton = new GameText(this, {
            text : 'Skip Intro',
            width : 5,
            height : 1.5,
            fontSize : 50,
            yPadding : 12,
            fontColor : 'black',
            backgroundColor: 'darkgrey',
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(28), this.skipButton);
        Align.centerH(this.skipButton);
        this.skipButton.setInteractive().on('pointerdown', this.launchGame.bind(this));

        // add blank text object to add to
        this.storyText = new GameText(this, {
            text : '',
            width : this.grid.cols -2,
            height : this.grid.rows,
            fontSize : 58,
            yPadding : 12,
            fontColor : '#CC0000',
            wordWrap : true, // 90
            align : 'left'
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(3.5), this.storyText);
        Align.centerH(this.storyText);

        // loop through characters in story and add to text object
        let chars = this.story.split('');
        let i = 0;
        this.time.addEvent({ delay: 250, callback: function(){
            this.time.addEvent({ delay: 20, callback: function(){
                this.storyText.setText(this.storyText.text + chars[i])
                i++;
                // replace button
                if (i==this.story.length) {
                    this.time.addEvent({ delay: 200, callback: function(){
                        this.skipButton.destroy();
                        this.addStartButton();
                    }, callbackScope: this, loop: false });        
                }
            }, callbackScope: this, loop: false, repeat: this.story.length-1 });
        }, callbackScope: this, loop: false});
    }
    addStartButton(){
        this.startButton = new GameText(this, {
            text : 'GO',
            width : 5,
            height : 1.5,
            fontSize : 50,
            yPadding : 12,
            fontColor : 'white',
            backgroundColor: '#CC0000',
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(28), this.startButton);
        Align.centerH(this.startButton);
        this.startButton.setInteractive().on('pointerdown', this.launchGame.bind(this));
    }
    launchGame(){
        this.scene.start("MapScene", this.user);
    }
}