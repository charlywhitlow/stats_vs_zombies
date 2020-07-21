class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }
    init(data){

        // init data for testing
        if (!data.level) {
            console.log('test data added');
            data = {
                "username" : "newPlayer",
                "zone" : 1,
                "level" : 1,
                "gold" : 0,
                "score" : 0
            };  
        }

        // populate user
        this.user = data;

        // get mapJSON for current zone (temporarily hard-coded)
        this.mapJSON = {
            "levels" : {
                "1" : {
                    "x" : 3,
                    "y" : 21
                },
                "2" : {
                    "x" : 7,
                    "y" : 21
                },
                "3" : {
                    "x" : 11,
                    "y" : 21
                },
                "4" : {
                    "x" : 11,
                    "y" : 17
                },
                "5" : {
                    "x" : 7,
                    "y" : 17
                },
                "6" : {
                    "x" : 3,
                    "y" : 15
                },
                "7" : {
                    "x" : 5,
                    "y" : 13
                },
                "8" : {
                    "x" : 9,
                    "y" : 13
                },
                "9" : {
                    "x" : 11,
                    "y" : 9
                },
                "10" : {
                    "x" : 5,
                    "y" : 9
                },
            },
            "pipes" : [
                {"x":5, "y":21, "image":"pipeHorizontal"},
                {"x":9, "y":21, "image":"pipeHorizontal"},
                {"x":11, "y":19, "image":"pipeVertical"},
                {"x":9, "y":17, "image":"pipeHorizontal"},
                {"x":5, "y":17, "image":"pipeHorizontal"},
                {"x":3, "y":17, "image":"pipeTopRight"},   
                {"x":3, "y":13, "image":"pipeBottomRight"},   
                {"x":7, "y":13, "image":"pipeHorizontal"},
                {"x":3, "y":13, "image":"pipeBottomRight"},   
                {"x":11, "y":13, "image":"pipeTopLeft"},   
                {"x":11, "y":11, "image":"pipeVertical"},
                {"x":9, "y":9, "image":"pipeHorizontal"},
                {"x":7, "y":9, "image":"pipeHorizontal"},
            ]
        }
    }
    preload(){
        this.load.image('mapPanel', 'assets/game_map/map_panel.png');
        this.load.image('levelOpen', 'assets/game_map/level_open_2.png');
        this.load.image('levelComplete', 'assets/game_map/level_complete.png');
        this.load.image('levelLocked', 'assets/game_map/level_locked.png');
        this.load.image('levelBossClosed', 'assets/game_map/level_boss_closed.png');
        this.load.image('levelBossOpen', 'assets/game_map/level_boss_open.png');
        this.load.image('arrow', 'assets/game_map/arrow.png');

        this.load.image('pipeHorizontal', 'assets/game_map/pipe_horizontal.png');
        this.load.image('pipeVertical', 'assets/game_map/pipe_vertical.png');
        this.load.image('pipeTopLeft', 'assets/game_map/pipe_top_left.png');
        this.load.image('pipeTopRight', 'assets/game_map/pipe_top_right.png');
        this.load.image('pipeBottomLeft', 'assets/game_map/pipe_bottom_left.png');
        this.load.image('pipeBottomRight', 'assets/game_map/pipe_bottom_right.png');
    }
    create() {
        // create screen grid
        this.grid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // fade in
        this.cameras.main.fadeFrom(500, 0, 0, 0);

        // add map panel
        this.mapPanel = this.add.image(0, 0, 'mapPanel').setOrigin(0,0);
        Align.scaleToGameW(this.mapPanel, 0.95);
        this.grid.placeAtIndex(100, this.mapPanel);
        Align.centerH(this.mapPanel);
        Align.stretchToGameH(this.mapPanel, 0.65);

        // build map
        this.buildMap(this.mapJSON);

        // add zone text
        let zoneTextConfig = {
            xIndex : 1,
            yIndex : 1,
            xWidth : 16,
            yWidth : 3,
            fontSize : '80px',
            fontStyle : 'bold',
            color: 'red',
        };
        let zoneText = this.addText(this.grid, "Zone "+this.user.zone, zoneTextConfig);
        Align.centerH(zoneText);

        // add leve text
        let levelTextConfig = {
            xIndex : 1,
            yIndex : 3,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'red',
        };
        let levelText = this.addText(this.grid, "Level "+this.user.level, levelTextConfig);
        Align.centerH(levelText);

        // any key to start text
        let startTextConfig = {
            xIndex : 1,
            yIndex : 27,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'red',
        };
        let startText = this.addText(this.grid, "Tap anywhere to start", startTextConfig);
        Align.centerH(startText);
    }
    buildMap(mapJSON){
        for (const i in mapJSON.levels) {

            // set tile image based on level
            let level = mapJSON.levels[i];
            let image;

            // active level
            if (i == this.user.level) {
                if (i == Object.keys(mapJSON.levels).length) {
                    image = this.add.image(0, 0, 'levelBossOpen').setOrigin(0,0);
                }else{
                    image = this.add.image(0, 0, 'levelOpen').setOrigin(0,0);
                }
                // add arrow 
                let arrow = this.add.image(0, 0, 'arrow').setOrigin(0,0);
                Align.scaleToGameW(arrow, 0.1);
                this.grid.placeAt(level.x, level.y-1.7, arrow);
            }
            // complete levels
            if (i < this.user.level) {
                image = this.add.image(0, 0, 'levelComplete').setOrigin(0,0);
            }
            // future levels
            if (i > this.user.level) {
                if (i == Object.keys(mapJSON.levels).length) {
                    image = this.add.image(0, 0, 'levelBossClosed').setOrigin(0,0);
                }else{
                    image = this.add.image(0, 0, 'levelLocked').setOrigin(0,0);
                }
            }
            // scale to game and place on map
            Align.scaleToGameW(image, 0.11);
            this.grid.placeAt(level.x, level.y, image);
        }
        // add pipes
        mapJSON.pipes.forEach(i => {
            let pipe = this.add.image(0, 0, i['image']).setOrigin(0,0);
            Align.scaleToGameW(pipe, 0.11);
            this.grid.placeAt(i['x'], i['y'], pipe);
        });

        // launch game on pressing anywhere on screen
        this.input.on('pointerdown', function(){
            this.scene.start("MainGameScene", this.user);
        }, this);        
    }
    addText(grid, text, config){
        // options: xIndex, yIndex, xWidth, yWidth, xPadding, yPadding
        // fontFamily, fontSize, fontStyle, color, align, backgroundColor

        // defaults
        if (!config.xIndex) {
            config.xIndex = 1;
        }
        if (!config.yIndex) {
            config.yIndex = 1;            
        }
        if (!config.xPadding) {
            config.xPadding = 25;
        }
        if (!config.yPadding) {
            config.yPadding = 25;            
        }
        if (!config.xWidth) {
            config.xWidth = 8;
        }
        if (!config.yWidth) {
            config.yWidth = 3;
        }

        // add text
        let addText = this.make.text({
            x: config.xIndex * grid.cellWidth,
            y: config.yIndex * grid.cellHeight,
            padding: { x: config.xPadding, y: config.yPadding },
            text: text,
            style: {
                fontFamily: (config.fontFamily ? config.fontFamily : 'Arial'),
                fontSize: (config.fontSize ? config.fontSize : '70px'),
                color: (config.color ? config.color : 'black'),
                align: (config.align ? config.align : 'center'),
                fixedWidth: config.xWidth * grid.cellWidth,
                fixedHeight: config.yWidth * grid.cellHeight,
                wordWrap: {
                    width: (config.xWidth * grid.cellWidth)-(config.xPadding*2),
                },
            },
        });
        if (config.backgroundColor) {
            addText.setBackgroundColor(config.backgroundColor);
        }
        if (config.fontStyle) {
            addText.setFontStyle(config.fontStyle);
        }
        return addText;        
    }
}