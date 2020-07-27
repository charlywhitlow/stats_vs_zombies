class MainGameScene extends Phaser.Scene {
    constructor() {
        super('MainGameScene');
    }
    init(data){
        // add data if not set (for testing)
        if (!data.username) {
            console.log('testing data added');
            data = {
                "username" : "newPlayer",
                "zone" : 1,
                "level" : 1,
                "gold" : 0,
                "score" : 0
            }                
        }
        // set user data
        if (!this.restarted) {
            this.user = data;
            this.initialData = Object.assign({}, this.user);
        }else{
            this.user = Object.assign({}, this.initialData);
        }
        console.log("welcome "+this.user.username+"!\nzone: "+this.user.zone+"\nlevel: "+this.user.level+"\nscore: "+this.user.score+"\nstarting gold: "+this.user.gold);
    }
    preload()
    {
        this.load.image('background', 'assets/backgrounds/pixelCity_padded.png');
        this.load.image('ground', 'assets/tiles/brickGrey.png');
        this.load.json('zone', 'assets/data/zone'+this.user.zone+'.json');

        this.load.multiatlas('zombie', 'assets/sprites/ZombieWalk.json', 'assets/sprites');
        this.load.multiatlas('ninja', 'assets/sprites/NinjaGirl.json', 'assets/sprites');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.image('deadZombie', 'assets/sprites/DeadZombie.png');
        this.load.spritesheet('coin', 'assets/sprites/coin.png', {frameWidth: (127/8), frameHeight: 16});
        this.load.image('bag', 'assets/sprites/bag.png');
        this.load.image('invisible', 'assets/sprites/invisible.png');

        this.load.image("controlBack", "assets/backgrounds/metal.png");
        this.load.image("jumpButton", "assets/buttons/jump.bmp");
        this.load.image("shootButton", "assets/buttons/shoot.bmp");
        this.load.image("pause", "assets/buttons/pause_icon.png");
        this.load.image("back", 'assets/buttons/back_grey.png');
        this.load.image("play", "assets/buttons/play_icon.png");
    }
    create()
    {
        // add event dispatcher
        this.emitter = EventDispatcher.getInstance();

        // add background
        this.bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        Align.scaleToGameH(this.bg, 1);

        // set up align grid for visible screen (16:9 screen ratio)
        this.aGrid = new AlignGrid({
            scene: this,
            rows: 16,
            cols: 9
        });

        // set up block grid for level canvas
        this.blockGrid = new AlignGrid({
            scene: this,
            rows: 16,
            cols: Math.round(this.bg.displayWidth/this.aGrid.cellWidth),
            height: this.bg.displayHeight,
            width: this.bg.displayWidth
        });
       
        // make platforms
        let platformLocations = this.cache.json.get('zone')["levels"][this.user.level]['platforms'];
        this.makePlatforms(platformLocations);

        // make game floor to handle when player falls of screen
        let from = this.blockGrid.getFirstCellInRow(this.blockGrid.rows-3);
        let to = from + this.blockGrid.cols-1;
        this.makeGameFloor(from, to);

        // make game end
        this.gameEndX = this.cache.json.get('zone')["levels"][this.user.level]['gameEnd'];
        this.makeGameEnd(this.gameEndX);

        // make player (index, gravity, bounce, velocity)
        this.makePlayer(1, 800, 0.2, 300);

        // make zombies
        let zombieLocations = this.cache.json.get('zone')["levels"][this.user.level]['zombies'];
        this.makeZombies(this.blockGrid, zombieLocations);

        // add stars
        // var starLocations = [5, 10, 11, 12, 13, 18, 19, 20, 30, 32, 36, 42];
        // var starLocations = [55];
        // this.makeStars(this.blockGrid, starLocations);
        this.createStarsGroup();

        // make coins
        let coinLocations = this.cache.json.get('zone')["levels"][this.user.level]['coins'];
        this.makeCoins(this.blockGrid, coinLocations);

        // add level panel
        this.makeLevelPanel(9);

        // add score panel
        this.makeScorePanel(4);

        // add coin bag
        this.makeCoinBag(5.8);

        // add back button
        this.makeBackButtonWithWarning(0.1, 0.4, 0.3);

        // add pause button
        this.pauseButton = new PauseButton({
            scene: this,
            grid: this.aGrid
        });

        // add game pad
        this.gamePad = new GamePad({
            scene: this,
            grid: this.aGrid
        });
        this.aGrid.placeAtIndex(108, this.gamePad);

        // camera
        this.cameras.main.fadeFrom(500, 0, 0, 0);
        this.cameras.main.setBounds(0, 0, this.bg.dispayWidth, 0);
        this.cameras.main.startFollow(this.player);

        // debugging
        // window.scene = this;
        // this.blockGrid.showNumbers(); // for debugging
        // this.aGrid.showNumbers(); // for debugging

        // load questions for level
        this.questions = this.cache.json.get('zone')["questionDeck"];
        this.questionQueue = new QuestionQueue(this.questions);
        // this.questionQueue.printQueue();

        // let playerReponses = {};
        // this.questionKeys.forEach(key => {
        //     // console.log(key);
        //     playerReponses[key] = {
        //         'shown' : 0,
        //         'correct' : 0,
        //         'wrong' : 0,
        //         'order' : []
        //     };
        // });
        // console.log(playerReponses);
        // this.player.data.set('playerResponses', playerReponses);
       
        // console.log(this.events);
        // this.events.on('transitionstart', function(fromScene, duration){ 
        //     console.log('resumed from:');
        //     console.log(fromScene);
        // });

        // set listeners
        this.setListeners();
    }
    update()
    {
        // animate player
        if (this.player.jumping) {
            this.player.play('ninjaJump', true);            
        }else if (this.player.landed) {
            this.player.setVelocityX(this.player.velocityX);
            this.player.play('ninjaRun', true);
        }else{
            this.player.play('ninjaFall', true);
        }

        // animate coins
        this.coins.children.iterate(function (child){
            child.play('spin', true);
        });

        // animate zombies
        this.zombies.children.iterate(function (child){
            child.play('zombieLeft', true);
        });
    }

    setListeners() {
        this.emitter.on('CONTROL_PRESSED', this.controlPressed.bind(this));
    }
    controlPressed(param) {
        switch (param) {
            case "JUMP":
                this.jump();
                break;
            case "SHOOT":
                this.shoot();
                break;
            case "PAUSE":
                this.pause();
                break;
        }
    }
    jump(){
        // jump from ground
        if (this.player.body.touching.down) {
            this.player.jump = 1;
            this.player.setVelocityY(-500);
            this.player.jumping = true;
        }
        // double jump
        else if (this.player.jump == 1){
            this.player.setVelocityY(-500);
            this.player.jump = 0;
        }
    }
    createStarsGroup(){
        this.stars = this.physics.add.group();
        this.physics.add.overlap(this.stars, this.zombies, this.killZombie, null, this.zombies);
    }
    shoot(){
        // shoot star
        let star = this.physics.add.sprite(0, 0, 'star');
        this.stars.add(star);
        Align.scaleToGameW(star, 1/15);
        star.x = this.player.x + 10;
        star.y = this.player.y;
        star.setVelocityX(800);
        star.setGravityY(50);

        // destroy star after delay
        this.time.addEvent({ delay: 900, callback: function(){
            star.destroy();
        }, callbackScope: this, loop: false });

    }
    killZombie(star, zombie){

        // remove star and set zombie falling off screen
        star.destroy();
        if (zombie.active) {
            zombie.rotation = 0.6;
            zombie.setVelocityY(300);
            zombie.active = false;

            // increment score
            this.scene.user.score ++;
            this.scene.zombieScoreText.setText(this.scene.user.score);

            // destroy zombie after delay
            this.scene.time.addEvent({ delay: 1000, callback: function(){
                zombie.destroy();
            }, callbackScope: this, loop: false });
        }
    }
    pause(){
        this.scene.pause();
        this.scene.launch('pauseScene', this.scene);
    }
    placeBlock(i, key, group) {
        let block = this.physics.add.sprite(0, 0, key);
        group.add(block);
        this.blockGrid.placeAtIndex(i, block);
        Align.scaleToGameW(block, 1/9);
        block.setImmovable();
    }
    makePlatforms(platformLocations){
        this.platformGroup = this.physics.add.group();
        platformLocations.forEach(platformBlock => {
            let from = this.blockGrid.getFirstCellInRow(platformBlock.from.row) + platformBlock.from.col;
            let to = this.blockGrid.getFirstCellInRow(platformBlock.to.row) + platformBlock.to.col;
            for (var i = from; i < to + 1; i++) {
                this.placeBlock(i, 'ground', this.platformGroup);
            }
        });
    }
    makeGameFloor(from, to){
        this.gameFloor = this.physics.add.group();
        for (var i = from; i < to + 1; i++) {
            this.placeBlock(i, 'invisible', this.gameFloor);
        }
    }
    makeGameEnd(xIndex){
        this.gameEnd = this.physics.add.group();
        for (let i = 0; i < this.blockGrid.rows; i++) {
            this.placeBlock(i * this.blockGrid.cols + xIndex, 'invisible', this.gameEnd);
        }
    }
    makePlayer(i, gravity=200, bounce=0.15, velocityX=200){
        // create player sprite
        this.player = this.physics.add.sprite(0, 0, 'ninja');
        this.player.body.setSize(this.player.width-100, this.player.height-100, true); // shrink bounding box
        this.player.angle = -10;
        this.blockGrid.placeAtIndex(i, this.player);
        Align.scaleToGameW(this.player, 1/9);
        this.player.setBounce(bounce);
        this.player.setGravityY(gravity);
        this.player.velocityX = velocityX;
        this.makePlayerAnims();

        // collisions
        this.physics.add.collider(this.player, this.platformGroup, this.playerLanding, null, this);
        this.physics.add.collider(this.player, this.gameFloor, this.gameOver, null, this);
        this.physics.add.overlap(this.player, this.gameEnd, this.levelComplete, null, this);
    }
    makePlayerAnims(){
        this.anims.create({
            key: 'ninjaRun',
            frames: [
                { key: 'ninja', frame: 'Run__000.png'},
                { key: 'ninja', frame: 'Run__001.png'},
                // { key: 'ninja', frame: 'Run__002.png'},
                { key: 'ninja', frame: 'Run__003.png'},
                { key: 'ninja', frame: 'Run__004.png'},
                { key: 'ninja', frame: 'Run__005.png'},
                { key: 'ninja', frame: 'Run__006.png'},
                { key: 'ninja', frame: 'Run__007.png'},
                { key: 'ninja', frame: 'Run__008.png'},
                { key: 'ninja', frame: 'Run__009.png'},
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'ninjaJump',
            frames: [
                { key: 'ninja', frame: 'Jump__000.png'},
                { key: 'ninja', frame: 'Jump__001.png'},
                { key: 'ninja', frame: 'Jump__002.png'},
                { key: 'ninja', frame: 'Jump__003.png'},
                { key: 'ninja', frame: 'Jump__004.png'},
                { key: 'ninja', frame: 'Jump__005.png'},
                { key: 'ninja', frame: 'Jump__006.png'},
                // { key: 'ninja', frame: 'Jump__007.png'},
                { key: 'ninja', frame: 'Jump__008.png'},
                { key: 'ninja', frame: 'Jump__009.png'},
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'ninjaFall',
            frames: [
                { key: 'ninja', frame: 'Jump__002.png'},
            ],
            frameRate: 8,
            repeat: -1
        });
    }
    playerLanding(){
        // set landed variable on first collision
        if(!this.player.landed){
            this.player.landed = true;
            this.n = 1;
        }
        // switch off bounce after first bounce
        if (this.player.body.touching.down && this.n < 2) {
            this.n++;
            if (this.n == 2) {
                this.player.setBounce(0);
            }
        }
        // landing after jump
        if (this.player.jumping) {
            this.player.jumping = false;
        }
    }
    // makeStars(grid, starLocations){
    //     this.stars = this.physics.add.group();
    //     starLocations.forEach(i => {
    //         let star = this.physics.add.sprite(0, 0, 'star');
    //         this.stars.add(star);
    //         grid.placeAtIndex(i, star);
    //         Align.scaleToGameW(star, 1/15);    
    //     });
    //     this.stars.children.iterate(function (child){
    //         child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
    //         child.setGravityY(300);
    //     });
    //     this.physics.add.collider(this.stars, this.platformGroup);
    //     this.physics.add.overlap(this.stars, this.player, this.collectStar, null, this);
    // }
    // collectStar(player, star){
    //     star.disableBody(true, true);
    //     console.log("star collected!");
    // }
    makeCoins(grid, coinLocations){
        // make coins and add
        this.coins = this.physics.add.group();
        coinLocations.forEach(coinLocation => {
            let i = this.blockGrid.getFirstCellInRow(coinLocation.row) + coinLocation.col;
            let coin = this.physics.add.sprite(0, 0, 'coin');
            this.coins.add(coin);
            Align.scaleToGameW(coin, 1/14);
            grid.placeAtIndex(i, coin);
        });

        // coin spin animation
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', { start:0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        // collect coin
        this.physics.add.overlap(this.coins, this.player, this.collectCoin, null, this);        
    }
    collectCoin(player, coin){
        coin.disableBody(true, true);
        this.user.gold += 1;
        this.coinScoreText.setText(this.user.gold);
    }
    makeCoinBag(index){
        // add coin bag
        this.bag = this.add.image(0, 0, "bag").setOrigin(0.4, 0);
        Align.scaleToGameH(this.bag, 1/20);
        this.aGrid.placeAtIndex(index-0.5, this.bag);
        this.bag.setScrollFactor(0);

        // update coin score
        this.coinScoreText = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 1, y: 7 },
            text: this.user.gold,
            style: {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: 'white',
                align: 'left'
            },
            add: true
        });
        this.coinScoreText.setScrollFactor(0);
        Align.scaleToGameH(this.coinScoreText, 1/20);
        this.coinScoreText.setOrigin(0, 0);
        this.aGrid.placeAtIndex(index, this.coinScoreText);        
    }
    makeLevelPanel(index){
        this.levelText = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 0, y: 6 },
            text: "Level "+this.user.level,
            style: {
                fontSize: '18px',
                fontFamily: 'Arial',
                // fontStyle: 'italic',
                color: 'white',
                align: 'center'
            },
            add: true
        });
        this.levelText.setScrollFactor(0);
        Align.scaleToGameH(this.levelText, 1/25);
        this.levelText.setOrigin(0.22, 0);
        this.aGrid.placeAtIndex(index, this.levelText);        
    }

    makeScorePanel(index){
        this.deadZombie = this.add.image(0, 0, "deadZombie").setOrigin(0.4, 0);
        Align.scaleToGameH(this.deadZombie, 1/20);
        this.aGrid.placeAtIndex(index-0.5, this.deadZombie);
        this.deadZombie.setScrollFactor(0);

        // update zombie score
        this.zombieScoreText = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 1, y: 7 },
            text: this.user.score,
            style: {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: 'white',
                align: 'center'
            },
            add: true
        });
        this.zombieScoreText.setScrollFactor(0);
        Align.scaleToGameH(this.zombieScoreText, 1/20);
        this.zombieScoreText.setOrigin(0, 0);
        this.aGrid.placeAtIndex(index, this.zombieScoreText);        
    }
    makeBackButtonWithWarning(index, xOrigin, yOrigin){
        this.backButton = this.add.image(0, 0, "back").setOrigin(xOrigin, yOrigin);
        Align.scaleToGameH(this.backButton, 1/10);
        this.aGrid.placeAtIndex(index, this.backButton);
        this.backButton.setScrollFactor(0);

        // go back, after warning
        this.backButton.setInteractive().on('pointerdown', function () {
            let goBack = confirm("Going back will lose any unsaved data, are you sure you want to continue?")
            if (goBack) {
                this.scene.start("MenuScene");
            }
        }, this);
    }
    makeZombies(grid, zombieLocations){
        // add zombies group and add zombie at each location 
        this.zombies = this.physics.add.group();
        zombieLocations.forEach(zombieLocation => {
            let i = this.blockGrid.getFirstCellInRow(zombieLocation.row) + zombieLocation.col;
            let zombie = this.physics.add.sprite(0, 0, 'zombie').setOrigin(0.55);
            zombie.body.setSize(zombie.width-200, zombie.height-200, true); // shrink bounding box
            zombie.collided = false;            
            this.zombies.add(zombie);
            Align.scaleToGameW(zombie, 1/9);
            grid.placeAtIndex(i, zombie);
        });

        // animate zombies
        this.zombieAnimations();

        // collision
        this.physics.add.overlap(this.zombies, this.player, this.zombieCollisionQuizScene, null, this);
    }
    zombieAnimations(){
        this.anims.create({
            key: 'zombieLeft',
            frames: [
                { key: 'zombie', frame: 'Left1.png'},
                { key: 'zombie', frame: 'Left2.png'},
                { key: 'zombie', frame: 'Left3.png'},
                { key: 'zombie', frame: 'Left4.png'},
                { key: 'zombie', frame: 'Left5.png'},
                { key: 'zombie', frame: 'Left6.png'},
                { key: 'zombie', frame: 'Left7.png'},
                { key: 'zombie', frame: 'Left8.png'},
                { key: 'zombie', frame: 'Left9.png'},
            ],
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'zombieRight',
            frames: [
                { key: 'zombie', frame: 'Right1.png'},
                { key: 'zombie', frame: 'Right2.png'},
                { key: 'zombie', frame: 'Right3.png'},
                { key: 'zombie', frame: 'Right4.png'},
                { key: 'zombie', frame: 'Right5.png'},
                { key: 'zombie', frame: 'Right6.png'},
                { key: 'zombie', frame: 'Right7.png'},
                { key: 'zombie', frame: 'Right8.png'},
                { key: 'zombie', frame: 'Right10.png'},
            ],
            frameRate: 8,
            repeat: -1
        });
        
    }
    zombieCollisionQuizScene(player, zombie){

        // handle collision once, if zombie hasn't been shot
        if (zombie.collided == false && zombie.active == true) {
            zombie.collided = true;

            // get next question
            let question = this.questionQueue.dequeue();

            // launch quiz scene
            this.scene.pause();
            this.scene.launch('QuizScene', {scene: this.scene, question: question, zombie: zombie});
        }
    }
    gameOver(){
        // pause and launch game over scene
        this.restarted = true; // to indicate user should be reset to initial values
        this.scene.pause();
        this.scene.launch('GameOverScene', this.scene);
    }
    levelComplete(){
        console.log('level complete!')
        this.restarted = false; // to carry user values to next level

        // remove game end and stop following character
        this.gameEnd.children.entries.forEach(element => {
            element.disableBody();
        });
        this.cameras.main.stopFollow();

        // add level complete text
        this.levelCompleteText = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 32, y: 16 },
            text: 'Level Complete',
            style: {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: 'red',
                align: 'center',
            },
            add: true
        });
        Align.scaleToGameW(this.levelCompleteText, .8);
        let endCell = (3*this.blockGrid.cols) + this.gameEndX - (this.aGrid.cols/2);
        this.blockGrid.placeAtIndex(endCell, this.levelCompleteText);

        // short wait then switch back to map scene
        this.time.addEvent({ delay: 1500, callback: function(){

            // fade out to black
            this.cameras.main.fade(800, 0, 0, 0);
            this.user.level ++;          

            // launch map scene
            this.cameras.main.on('camerafadeoutcomplete', function () {
                this.scene.start('MapScene', this.user);
            }, this);
        }, callbackScope: this, loop: false });
    }
}
