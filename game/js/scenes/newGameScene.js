class NewGameScene extends Phaser.Scene {
    constructor() {
        super('NewGameScene');
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
        this.load.image('back', 'assets/buttons/back.png');
        this.load.html('usernameForm', 'assets/html/usernameForm.html');
        this.load.json('zone', 'assets/data/zone1.json');
    }
    create() {
        // add title background
        this.bg = this.add.image(0, 0, 'menuBackground').setOrigin(0,0);
        Align.scaleToGameW(this.bg, 1);
        Align.stretchToGameH(this.bg, 1);

        // create box grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // create user title
        this.nameText = new GameText(this, {
            text : 'Enter a name:',
            width : 16,
            height : 3,
            fontSize : 70,
            fontColor : 'white'
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(8), this.nameText);
        Align.centerH(this.nameText);

        // add html form
        this.form = this.add.dom(0, 0).createFromCache('usernameForm');
        let index = this.grid.getFirstCellInRow(14);
        this.grid.placeAtIndex(index, this.form);
        Align.centerH(this.form);
        
        // handle form input
        this.form.addListener('click');
        this.form.on('click', function (event) {
            if (event.target.name === 'goButton'){
                let scene = this.scene;
                let inputUsername = this.getChildByName('username').value.trim();
                if (inputUsername !== ''){
                    // check if username already taken
                    $.ajax({
                        type: 'POST',
                        url: '/check-username',
                        data : { "username": inputUsername },
                        success: function () {
                            scene.launchNewGame(inputUsername);
                        },
                        error: function (xhr) {                                                        
                            window.alert('Username taken, please try again');
                        }
                    });
                }else{
                    window.alert('Please enter a username to continue');
                }
            }
        });

        // add back button
        this.backButton = new BackButton({
            scene: this,
            returnSceneName: "MenuScene",
            warning: null
        });

        // fade in
        this.cameras.main.fadeFrom(100, 0, 0, 0);
    }
    launchNewGame(username){
        // create new player and launch game
        let user = {
            "username" : username,
            "zone" : 1,
            "level" : 1,
            "health" : 3,
            "gold" : 0,
            "score" : 0
        };
        let questionDeck = this.cache.json.get('zone')["questionDeck"];
        user.questionQueue = new QuestionQueue(questionDeck);
        this.scene.start("StoryScene", user);
    }
}