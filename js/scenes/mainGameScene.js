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
                "stars" : 0,
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
        console.log("welcome "+this.user.username+"!\n zone: "+this.user.zone+"\n level: "+this.user.level+
            "\n score: "+this.user.score+"\n gold: "+this.user.gold+"\n stars: "+this.user.stars);
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
        this.load.image("shootButtonActive", "assets/buttons/shoot_active.png");
        this.load.image("shootButtonInactive", "assets/buttons/shoot_inactive.png");
        this.load.image("pause", "assets/buttons/pause_icon.png");
        this.load.image("back", 'assets/buttons/back.png');
        this.load.image("play", "assets/buttons/play_icon.png");
    }
    create()
    {
        // add event dispatcher
        this.emitter = EventDispatcher.getInstance();

        // load questions for level
        this.questions = this.cache.json.get('zone')["questionDeck"];
        this.questionQueue = new QuestionQueue(this.questions);
        
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

        // create stars for shooting
        this.shootingStars = this.physics.add.group();
        this.physics.add.overlap(this.shootingStars, this.zombies, this.zombieCollisionQuizScene, null, this);

        // make collectable stars
        let starLocations = this.cache.json.get('zone')["levels"][this.user.level]['stars'];
        this.makeStars(this.blockGrid, starLocations);
                
        // make coins
        let coinLocations = this.cache.json.get('zone')["levels"][this.user.level]['coins'];
        this.makeCoins(this.blockGrid, coinLocations);

        // add level panel
        this.makeLevelPanel(9);

        // add star panel
        this.starScoreText = this.makePanelItem(2.25, "star", 1/36, 0.32, -0.4, this.user.stars, 1/20);

        // add score panel
        this.zombieScoreText = this.makePanelItem(4, "deadZombie", 1/20, 0.4, 0, this.user.score, 1/20);

        // add coin bag
        this.coinScoreText = this.makePanelItem(5.8, "bag", 1/20, 0.4, 0, this.user.gold, 1/20);
    
        // add back button
        this.backButton = new BackButton({
            scene: this,
            returnSceneName: "MapScene",
            warning: "Going back will lose any unsaved data, are you sure?"
        });

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

        // set listeners
        this.setListeners();
    }
    update()
    {
        // animate player
        if (this.player.scene != undefined) {
            if (this.player.jumping) {
                this.player.play('ninjaJump', true);
            }else if (this.player.landed) {
                this.player.setVelocityX(this.player.velocityX);
                this.player.play('ninjaRun', true);
            }else{
                this.player.play('ninjaFall', true);
            }
        }
        // animate coins
        if (this.coins.children != undefined) {
            this.coins.children.iterate(function (child){
                child.play('spin', true);
            });
        }
        // animate zombies
        if (this.zombies.children != undefined) {
            this.zombies.children.iterate(function (child){
                child.play('zombieLeft', true);
            });
        }
    }
    setListeners() {
        this.emitter.on('CONTROL_PRESSED', this.controlPressed.bind(this));
    }
    controlPressed(param) {
        switch (param) {
            case "JUMP":
                this.jump();
                break;
            case "SHOOT_REQUEST":
                this.shootStar();
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
    shootStar(){
        // shoot star if available
        if (this.gamePad.shootButton.active == true){
            let star = this.physics.add.sprite(0, 0, 'star');
            this.shootingStars.add(star);
            Align.scaleToGameW(star, 1/16);
            star.x = this.player.x + 10;
            star.y = this.player.y;
            star.setVelocityX(800);
            star.setGravityY(50);

            // decrement stars
            this.user.stars -= 1;
            this.starScoreText.setText(this.user.stars);

            // disable shoot button if new score is 0
            if (this.user.stars == 0) {
                this.gamePad.deactivateShoot();
            }

            // destroy star after delay
            this.time.addEvent({ delay: 900, callback: function(){
                star.destroy();
            }, callbackScope: this, loop: false });
        }
    }
    killZombie(zombie){
        if (zombie.active) {
            // set falling off screen
            zombie.rotation = 0.6;
            zombie.setVelocityY(300);
            zombie.active = false;

            // increment user score
            this.incrementZombieScore();

            // destroy zombie after delay
            this.time.addEvent({ delay: 1000, callback: function(){
                zombie.destroy();
            }, callbackScope: this, loop: false });
        }
    }
    incrementZombieScore(){
        this.user.score ++;
        this.zombieScoreText.setText(this.user.score);
    }
    pause(){
        this.scene.pause();
        this.scene.launch('PauseScene', this.scene);
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
    makeStars(grid, starLocations){
        this.stars = this.physics.add.group();
        starLocations.forEach(starLocation => {
            let i = this.blockGrid.getFirstCellInRow(starLocation.row) + starLocation.col;
            let star = this.physics.add.sprite(0, 0, 'star');
            this.stars.add(star);
            grid.placeAtIndex(i, star);
            Align.scaleToGameW(star, 1/15);
        });
        this.physics.add.collider(this.stars, this.platformGroup);
        this.physics.add.overlap(this.stars, this.player, this.collectStar, null, this);
    }
    collectStar(player, star){
        star.disableBody(true, true);
        this.user.stars += 1;
        this.starScoreText.setText(this.user.stars);
        this.gamePad.activateShoot();
    }
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
    makePanelItem(index, iconImage, iconScale, xOffset, yOffset, startText, textScale){
        // add icon
        let iconObj = this.add.image(0, 0, iconImage).setOrigin(xOffset, yOffset);
        Align.scaleToGameH(iconObj, iconScale);
        this.aGrid.placeAtIndex(index-0.5, iconObj);
        iconObj.setScrollFactor(0);

        // add score text
        let textObj = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 1, y: 7 },
            text: startText,
            style: {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: 'white',
                align: 'left'
            },
            add: true
        });
        textObj.setScrollFactor(0);
        Align.scaleToGameH(textObj, textScale);
        textObj.setOrigin(0, 0);
        this.aGrid.placeAtIndex(index, textObj);
        return textObj;
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
    zombieCollisionQuizScene(collidedWith, zombie){

        // handle collision if zombie hasn't been killed / bumped into
        if (zombie.collided == false && zombie.active == true) {
            if (collidedWith.texture.key == 'star') {
                collidedWith.destroy();
            }else{
                zombie.collided = true;
            }

            // get next question and launch quiz scene
            let question = this.questionQueue.dequeue();
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

            // destroy emitter instance
            this.emitter.destroy();

            // launch map scene
            this.cameras.main.on('camerafadeoutcomplete', function () {
                this.scene.start('MapScene', this.user);
            }, this);
        }, callbackScope: this, loop: false });
    }
}
