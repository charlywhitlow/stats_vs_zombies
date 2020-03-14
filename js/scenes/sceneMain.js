class SceneMain extends Phaser.Scene {
    
    constructor() {
        super('SceneMain');
    }

    init(data){
        // console.log(data);
    }

    preload()
    {
        this.load.image('background', 'assets/backgrounds/pixelCity_padded.png');
        this.load.image('ground', 'assets/tiles/brickGrey.png');
        
        this.load.multiatlas('zombie', 'assets/sprites/ZombieWalk.json', 'assets/sprites');
        this.load.multiatlas('ninja', 'assets/sprites/NinjaGirl.json', 'assets/sprites');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.spritesheet('coin', 'assets/sprites/coin.png', {frameWidth: (127/8), frameHeight: 16});
        this.load.image('bag', 'assets/sprites/bag.png');

        this.load.image("controlBack", "assets/backgrounds/metal.png");
        this.load.image("jumpButton", "assets/buttons/jump.bmp");
        this.load.image("shootButton", "assets/buttons/shoot.bmp");
        this.load.image("pause", "assets/buttons/pause_icon.png");
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
        
        // row start indexes
        let row5 = this.blockGrid.getFirstCellInRow(5);
        let row6 = this.blockGrid.getFirstCellInRow(6);
        let row7 = this.blockGrid.getFirstCellInRow(7);
        let row8 = this.blockGrid.getFirstCellInRow(8);
        let row9 = this.blockGrid.getFirstCellInRow(9);
        let row10 = this.blockGrid.getFirstCellInRow(10);
        let row11 = this.blockGrid.getFirstCellInRow(11);

        // make floor (need gap of min 2 blocks to fall through, row = 46 blocks)
        let floorLocations = [
            [row10, row10+6],
            [row11, row11+6],

            [row10+10, row10+14],
            [row11+10, row11+14],

            [row10+17, row10+21],
            [row11+17, row11+21],

            [row8+23, row8+25],

            [row10+28, row10+35],
            [row11+28, row11+35],

            [row10+38, row10+45],
            [row11+38, row11+45],
        ];
        this.makeGround(floorLocations);

        // make game floor to handle when player falls of screen
        let from = this.blockGrid.getFirstCellInRow(this.blockGrid.rows-3);
        let to = from + this.blockGrid.cols-1;
        this.makeGameFloor(from, to);

        // make player (index, gravity, bounce, velocity)
        this.makePlayer(1, 800, 0.2, 300);

        // make zombies
        let zombieLocations = [426, 452]
        this.makeZombies(this.blockGrid, zombieLocations);

        // add stars
        // var starLocations = [5, 10, 11, 12, 13, 18, 19, 20, 30, 32, 36, 42];
        // var starLocations = [55];
        // this.makeStars(this.blockGrid, starLocations);

        // make coins
        var coinLocations = [
            row9+5, 
            row8+10, row7+11, row7+12, row7+13, row8+14, 
            row9+18, row9+19, row9+20, 
            row6+24, row6+25, row5+26, row6+27, 
            row9+30, row9+31, row9+32, 
            row7+36, row6+37,
            row6+42, row6+43,
        ];
        this.makeCoins(this.blockGrid, coinLocations);

        // add coin bag
        this.makeCoinBag();

        // add pause button
        this.pauseButton = new PauseButton({
            scene: this,
            grid: this.aGrid
        });
        this.aGrid.placeAtIndex(0, this.pauseButton);

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
    shoot(){
        console.log('shoot');
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
    makeGround(floorLocations){
        this.brickGroup = this.physics.add.group();
        floorLocations.forEach(floorBlock => {
            for (var i = floorBlock[0]; i < floorBlock[1] + 1; i++) {
                this.placeBlock(i, 'ground', this.brickGroup);
            }
        });
    }
    makeGameFloor(from, to){
        this.gameFloor = this.physics.add.group();
        for (var i = from; i < to + 1; i++) {
            this.placeBlock(i, 'ground', this.gameFloor);
        }
    }
    makePlayer(i, gravity=200, bounce=0.15, velocityX=200){
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
        this.physics.add.collider(this.player, this.brickGroup, this.playerLanding, null, this);
        this.physics.add.collider(this.player, this.gameFloor, this.gameOver, null, this);
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
        starLocations.forEach(i => {
            let star = this.physics.add.sprite(0, 0, 'star');
            this.stars.add(star);
            grid.placeAtIndex(i, star);
            Align.scaleToGameW(star, 1/15);    
        });
        this.stars.children.iterate(function (child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
            child.setGravityY(300);
        });
        this.physics.add.collider(this.stars, this.brickGroup);
        this.physics.add.overlap(this.stars, this.player, this.collectStar, null, this);
    }
    collectStar(player, star){
        star.disableBody(true, true);
        console.log("star collected!");
    }
    makeCoins(grid, coinLocations){

        // make coins and add
        this.coins = this.physics.add.group();
        coinLocations.forEach(i => {
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
        this.coinScore += 1;
        this.coinScoreText.setText(this.coinScore);    
    }
    makeCoinBag(){
        // add coin bag
        this.bag = this.add.image(0, 0, "bag").setOrigin(0.4, 0);
        Align.scaleToGameH(this.bag, 1/20);
        this.aGrid.placeAtIndex(6.5, this.bag);
        this.bag.setScrollFactor(0);

        // coin score
        this.coinScore = 0;
        this.coinScoreText = this.make.text({
            x: 0,
            y: 0,
            padding: { x: 1, y: 4 },
            text: this.coinScore,
            style: {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: 'white',
                align: 'center'
            },
            add: true
        });
        this.coinScoreText.setScrollFactor(0);
        Align.scaleToGameW(this.coinScoreText, 1/22);
        this.coinScoreText.setOrigin(-0.5, 0);
        this.aGrid.placeAtIndex(7, this.coinScoreText);        
    }
    makeZombies(grid, zombieLocations){
        this.zombies = this.physics.add.group();
        zombieLocations.forEach(i => {
            let zombie = this.physics.add.sprite(0, 0, 'zombie').setOrigin(0.55);
            zombie.body.setSize(zombie.width-200, zombie.height-200, true); // shrink bounding box
            zombie.collided = false;            
            this.zombies.add(zombie);
            Align.scaleToGameW(zombie, 1/9);
            grid.placeAtIndex(i, zombie);
        });

        // zombie animations
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

        // collision
        this.physics.add.overlap(this.zombies, this.player, this.zombieCollision, null, this);
    }
    zombieCollision(player, zombie){
        if (zombie.collided == false) {
            zombie.collided = true;

            // launch quiz scene
            this.scene.pause();
            this.scene.launch('QuizScene', this.scene);
        }
    }
    gameOver(){
        // pause and launch game over scene
        this.scene.pause();
        this.scene.launch('GameOverScene', this.scene);
    }
}
