class GamePad extends UIBlock {
    constructor(config){
        super();
        this.scene = config.scene;
        this.grid = config.grid;

        // add event dispatcher
        this.emitter = EventDispatcher.getInstance();

        // add panel background
        this.back = this.scene.add.image(-60, -60, "controlBack").setOrigin(0, 0);
        Align.scaleToGameW(this.back, 1.2);
        this.add(this.back);

        // shoot button
        this.shootButton = this.scene.add.image(0, 0, 'shootButtonInactive');
        this.add(this.shootButton);
        Align.scaleToGameW(this.shootButton, 0.3);
        this.grid.placeAtIndex(10, this.shootButton);
        this.shootButton.setInteractive().on('pointerdown', this.shoot.bind(this));
        if (this.scene.user.score == 0) {
            this.deactivateShoot();
        }else{
            this.activateShoot();
        }

        // jump button
        this.jumpButton = this.scene.add.image(0, 0, 'jumpButton');
        this.add(this.jumpButton);
        Align.scaleToGameW(this.jumpButton, 0.4);
        this.grid.placeAtIndex(14.5, this.jumpButton);
        this.jumpButton.setInteractive().on('pointerdown', this.jump.bind(this));
        
        // stop control panel from scrolling with camera
        this.children.forEach(function(child) {
            child.setScrollFactor(0);
        });
    }
    jump(){
        this.emitter.emit("CONTROL_PRESSED", "JUMP");
    }
    shoot(){
        this.emitter.emit("CONTROL_PRESSED", "SHOOT_REQUEST");
    }
    activateShoot(){
        this.shootButton.active = true;
        this.shootButton.setTexture('shootButtonActive');
    }
    deactivateShoot(){
        this.shootButton.active = false;
        this.shootButton.setTexture('shootButtonInactive');
    }
}