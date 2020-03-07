class SceneMain extends Phaser.Scene {
    
    constructor() {
        super('SceneMain');
    }

    init(data){
        console.log(data);
    }

    preload()
    {
        this.load.image('background', 'assets/backgrounds/pixelCity_padded.png');
        this.load.image('ground', 'assets/tiles/brickGrey.png');
        this.load.spritesheet('dude', 'assets/sprites/dude.png', {frameWidth: 32, frameHeight: 48});
        this.load.image('star', 'assets/sprites/star.png');

        this.load.image("controlBack", "assets/buttons/controlBack.png");
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

        // add game pad
        this.gamePad = new GamePad({
            scene: this,
            grid: this.aGrid
        });
        this.aGrid.placeAtIndex(108, this.gamePad);
        
        // add pause button
        this.pauseButton = new PauseButton({
            scene: this,
            grid: this.aGrid
        });
        this.aGrid.placeAtIndex(0, this.pauseButton);
        
        // make floor
        let floorStart = this.blockGrid.getFirstCellInRow(10);
        let floorEnd = this.blockGrid.getFirstCellInRow(12)-1;
        this.makeFloor(floorStart, floorEnd, 'ground');

        // make player (index, gravity, bounce, velocity)
        this.makePlayer(1, 500, 0.2, 300);

        // add player animations
        this.makePlayerAnims();

        // add stars
        // var starLocations = [37, 40, 25, 56];
        // this.makeStars(starLocations);
        
        // camera
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
        // start player running on landing
        if (this.player.landed) {
            this.player.setVelocityX(this.player.velocityX);
            this.player.play('right', true);
        }
        else{
            this.player.play('turn', true);
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
            case "SHOOT":
                this.shoot();
                break;
            case "PAUSE":
                this.pause();
                break;
        }
    }
    jump(){
        this.player.setVelocityY(-500);
    }
    shoot(){
        console.log('shoot');
    }
    pause(){
        this.scene.pause();
        this.scene.launch('pauseScene', this.scene);
    }

    placeBlock(i, key) {
        let block = this.physics.add.sprite(0, 0, key);
        this.brickGroup.add(block);
        this.blockGrid.placeAtIndex(i, block);
        Align.scaleToGameW(block, 1/9);
        this.brickGroup.add(block);
        block.setImmovable();
        
    }
    makeFloor(from, to, key) {
        this.brickGroup = this.physics.add.group();
        for (var i = from; i < to + 1; i++) {
            this.placeBlock(i, key);
        }
    }
    makePlayer(i, gravity=200, bounce=0.15, velocityX=200){
        this.player = this.physics.add.sprite(0, 0, 'dude');
        this.blockGrid.placeAtIndex(i, this.player);
        Align.scaleToGameW(this.player, 1/9);
        this.player.setBounce(bounce);
        this.player.setGravityY(gravity);
        this.player.velocityX = velocityX;
        this.physics.add.collider(this.player, this.brickGroup, this.startRunningOnLanding, null, this);
    }
    makePlayerAnims(){
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start:0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start:5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });
    }
    startRunningOnLanding(){
        // set landed variable on first collision
        if(!this.landed){
            this.landed = true;
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
    }
    makeStars(starLocations){
        this.stars = this.physics.add.group();
        starLocations.forEach(i => {
            let star = this.physics.add.sprite(0, 0, 'star');
            this.stars.add(star);
            this.aGrid.placeAtIndex(i, star);
            Align.scaleToGameW(star, 1/15);    
        });
        this.stars.children.iterate(function (child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
            child.setCollideWorldBounds(true);
            child.setGravityY(300);
        });
        this.physics.add.collider(this.stars, this.brickGroup);
        this.physics.add.overlap(this.stars, this.player, this.collectStar, null, this);
    }
    collectStar(player, star){
        star.disableBody(true, true);
        console.log("star collected!");
    }

}
