class HealthBar {
    constructor(scene){
        this.scene = scene;
        this.x = 0;
        this.y = 40;
        this.width = 70;
        this.height = 30;
        let index = 6.2;

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
        let lightGrey = 0xDDDDDD;
        let darkGrey = 0x414141;
        let white = 0xffffff;
        let red = 0xA32828;
        let green = 0x30982F; 
        let orange = 0xD98200;

        // bar background
        this.bar.fillStyle(darkGrey);
        this.bar.fillRect(this.x, this.y, this.width, this.height);
        let littleCircle = new Phaser.Geom.Circle(this.x+this.width, this.y +(this.height/2), this.height/2);
        this.bar.fillCircleShape(littleCircle);

        // update health
        if (this.scene.user.health == 3){
            this.bar.fillStyle(green);
            this.bar.fillRect(this.x, this.y, this.width, this.height);

            // little circle green
            let littleCircle = new Phaser.Geom.Circle(this.x+this.width, this.y +(this.height/2), this.height/2);
            this.bar.fillCircleShape(littleCircle);
        }
        if (this.scene.user.health == 2){
            this.bar.fillStyle(orange);
            this.bar.fillRect(this.x, this.y, this.width*2/3, this.height);
        }
        if (this.scene.user.health == 1){
            this.bar.fillStyle(red);
            this.bar.fillRect(this.x, this.y, this.width*1/3, this.height);
        }

        // big circle
        let bigCircle = new Phaser.Geom.Circle(this.x, this.y +(this.height/2), this.height-5);
        this.bar.fillCircleShape(bigCircle);

        // draw cross
        this.bar.fillStyle(lightGrey);
        this.bar.fillRect(this.x-(this.height/5), this.y, this.height/3, this.height);
        this.bar.fillRect(this.x-(this.height/2), this.y+(this.height/3), this.height,   this.height/3);
    }
}