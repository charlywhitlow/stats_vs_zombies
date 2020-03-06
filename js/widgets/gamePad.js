class GamePad extends UIBlock {
    constructor(config){
        super();
        this.scene = config.scene;
        this.grid = config.grid;

        // add event dispatcher
        this.emitter = EventDispatcher.getInstance();

        // add background
        this.back = this.scene.add.image(-60, -60, "controlBack").setOrigin(0, 0);
        Align.scaleToGameW(this.back, 1.2);
        this.add(this.back);

        // shoot button
        this.shootButton = this.scene.add.image(0, 0, 'shootButton');
        Align.scaleToGameW(this.shootButton, 0.3);
        this.grid.placeAtIndex(10, this.shootButton);

        // jump button
        this.jumpButton = this.scene.add.image(0, 0, 'jumpButton');
        Align.scaleToGameW(this.jumpButton, 0.4);
        this.grid.placeAtIndex(14.5, this.jumpButton);
        
        // add actions to buttons
        this.shootButton.setInteractive();
        this.jumpButton.setInteractive();
        this.shootButton.on('pointerdown', this.shoot.bind(this));
        this.jumpButton.on('pointerdown', this.jump.bind(this));

        // add buttons to panel
        this.add(this.shootButton);
        this.add(this.jumpButton);

        // stop control panel from scrolling with camera
        this.children.forEach(function(child) {
            child.setScrollFactor(0);
        });
    }

    // button events
    jump(){
        this.emitter.emit("CONTROL_PRESSED", "JUMP");
    }
    shoot(){
        this.emitter.emit("CONTROL_PRESSED", "SHOOT");
    }
}