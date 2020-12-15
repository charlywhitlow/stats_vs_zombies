class GameText {

    constructor(scene, config) {

        this.config = {
            x: 0,
            y: 0,
            padding: {
                x: ( config.xPadding ? config.xPadding : 0 ),
                y: ( config.yPadding ? config.yPadding : 0 ),
            },
            text: ( config.text ? config.text : '' ),
            style: {
                fontSize: ( config.fontSize ? config.fontSize : 40 ),
                fontFamily: ( config.fontFamily ? config.fontFamily : 'Arial' ),
                color: ( config.fontColor ? config.fontColor : 'red' ),
                align: ( config.align ? config.align : 'center' ),
                fixedWidth: (config.width) ? 
                    (config.width * scene.grid.cellWidth) : (scene.grid.cols * scene.grid.cellWidth),
                fixedHeight: (config.height) ? 
                    (config.height * scene.grid.cellHeight) : (scene.grid.rows * scene.grid.cellHeight)
            },
            add: true
        };
        if (config.backgroundColor) { this.config.style.backgroundColor = config.backgroundColor };
        if (config.fontStyle) { this.config.style.fontStyle = config.fontStyle };

        if (config.wordWrap || typeof config.wordWrap === 'undefined') { 
            this.config.style.wordWrap = { width : (this.config.style.fixedWidth - (this.config.padding.x * 2)) }
        }

        // make text
        return scene.make.text(this.config);
    }
}