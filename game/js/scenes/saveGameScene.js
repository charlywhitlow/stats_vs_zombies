class SaveGameScene extends Phaser.Scene {
    constructor() {
        super('SaveGameScene');
    }
    init(data){
        console.log('SaveGameScene');
        console.log(data);
        this.user = {
            "username" : data.username,
            "zone" : data.zone,
            "level" : data.level,
            "health" : data.health,
            "gold" : data.gold,
            "score" : data.score,
            "questionQueue" : data.questionQueue,
            "userAnswers" : data.userAnswers
        };
    }
    preload(){
        this.load.image('menuBackground', 'assets/backgrounds/titleBackground.png');
        this.load.image('back', 'assets/buttons/back.png');
        this.load.html('userForm', 'assets/html/signupForm.html');
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
        let nameText = GameText.addText(this, this.grid, "Create an account:", {
            xIndex : 1,
            yIndex : 8,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'white',
        });
        Align.centerH(nameText);

        // add html form
        this.form = this.add.dom(0, 0).createFromCache('userForm');
        let index = this.grid.getFirstCellInRow(17);
        this.grid.placeAtIndex(index, this.form);
        Align.centerH(this.form);
        let usernameInput = this.form.getChildByID('username');
        usernameInput.value = this.user.username;
        
        // handle form input
        this.form.addListener('click');
        this.form.on('click', function (event) {
            if (event.target.name === 'goButton'){
                let scene = this.scene;
                let inputUsername = this.getChildByName('username').value.trim();
                let inputEmail = this.getChildByName('email').value.trim();
                let inputPassword = this.getChildByName('password').value.trim();

                if (inputEmail !== '' && inputPassword !== '' && inputUsername !== ''){

                    // create new user
                    $.ajax({
                        type: 'POST',
                        url: '/signup',
                        data : { 
                            "username": inputUsername,
                            "email": inputEmail,
                            "password": inputPassword
                        },
                        success: function () {
                            console.log('new user created')

                            scene.user.username = inputUsername;
                            $.ajax({
                                type: 'POST',
                                url: '/save-game',
                                data : scene.user,
                                success: function () {
                                    console.log('game data saved')
                                    // scene.launchNewGame(scene.user);
                                    scene.scene.start("MapScene", scene.user);
                                },
                            });
                        },
                        error: function (xhr) {                                                        
                            window.alert('Please try again');
                        }
                    });

                }else{
                    window.alert('Please complete all fields');
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
}