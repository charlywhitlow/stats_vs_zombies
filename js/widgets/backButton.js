class BackButton extends UIBlock {
    constructor(config){
        super();
        this.scene = config.scene;
        this.returnSceneName = config.returnSceneName;
        this.warning = config.warning;

        let index = 0;
        let xOrigin = 0.3;
        let yOrigin = 0.25;
        let scale = 1/9;

        // create grid
        this.grid = new AlignGrid({
            scene: this.scene,
            cols: 10,
            rows: 20,
        });

        // add back button
        this.backButton = this.scene.add.image(0, 0, "back").setOrigin(xOrigin, yOrigin);
        Align.scaleToGameH(this.backButton, scale);
        this.grid.placeAtIndex(index, this.backButton);
        this.backButton.setScrollFactor(0);

        // add to panel?
        this.add(this.backButton);

        // go back, after warning if applicable
        this.backButton.setInteractive().on('pointerdown', function () {
            let goBack = true;
            if (this.warning != null && this.warning.length > 0){
                goBack = confirm(this.warning);
            }
            if (goBack) {
                this.scene.scene.start(this.returnSceneName);
            }
        }, this);
   }
}