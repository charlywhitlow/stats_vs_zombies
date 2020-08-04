class HealthBar {
    constructor(scene){
        this.scene = scene;
        this.x = 16;
        this.y = -4;
        this.width = 80;
        this.height = 30;
        this.border = 4;
        let index = 28;

        // create grid
        this.grid = new AlignGrid({
            scene: this.scene,
            cols: 10,
            rows: 20,
        });

        this.bar = new Phaser.GameObjects.Graphics(this.scene);
        this.scene.add.existing(this.bar);

        this.draw();
        this.grid.placeAtIndex(index, this.bar);
        this.bar.setScrollFactor(0);
    }
    draw(){
        this.bar.clear();
        let black = 0x000000;
        let grey = 0x666666;
        let lightGrey = 0x9D9D9D;
        let darkGrey = 0x414141;
        let white = 0xffffff;
        let red = 0xff0000;
        let green = 0x47C90E; 
        let orange = 0xFFA500;

        //  bar border
        this.bar.fillStyle(grey);
        this.bar.fillRect(this.x-(this.border/2), this.y-(this.border/2), this.width+this.border, this.height+this.border);

        // bar background
        this.bar.fillStyle(darkGrey);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        // update colour
        if (this.scene.user.health == 3){
            this.bar.fillStyle(green);
            this.bar.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.scene.user.health == 2){
            this.bar.fillStyle(orange);
            this.bar.fillRect(this.x, this.y, this.width*2/3, this.height);
        }
        if (this.scene.user.health == 1){
            this.bar.fillStyle(red);
            this.bar.fillRect(this.x, this.y, this.width*1/3, this.height);
        }
    }
}