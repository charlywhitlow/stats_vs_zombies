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
    }
    preload(){
        this.load.json('zone', 'assets/data/zone'+this.user.zone+'.json');
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

        // add map panel
        this.mapPanel = this.add.image(0, 0, 'mapPanel').setOrigin(0,0);
        Align.scaleToGameW(this.mapPanel, 0.9);
        this.grid.placeAtIndex(135, this.mapPanel);
        Align.centerH(this.mapPanel);
        Align.stretchToGameH(this.mapPanel, 0.62);
        this.mapPanel.setInteractive().on('pointerup', function () {
            this.scene.start("MainGameScene", this.user);
        }, this);

        // build map
        this.mapJSON = this.cache.json.get('zone')["map"];
        this.buildMap(this.mapJSON);

        // add zone text
        let zoneText = this.addText(this.grid, "Zone "+this.user.zone, {
            xIndex : 1,
            yIndex : 3,
            xWidth : 16,
            yWidth : 3,
            fontSize : '80px',
            fontStyle : 'bold',
            color: 'red',
        });
        Align.centerH(zoneText);

        // add level text
        let levelText = this.addText(this.grid, "Level "+this.user.level, {
            xIndex : 1,
            yIndex : 5,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'red',
        });
        Align.centerH(levelText);

        // tap map to start text
        let startText = this.addText(this.grid, "Tap map to start", {
            xIndex : 1,
            yIndex : 28,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'red',            
        });
        Align.centerH(startText);

        // add back button
        let backButton = this.addText(this.grid, "< Back", {
            xIndex : 13,
            yIndex : 1,
            xWidth : 4,
            yWidth : 1.8,
            fontSize : '42px',
            color: 'white',
            backgroundColor: 'grey',
        });
        backButton.setInteractive().on('pointerup', function () {
            console.log('back to menu')
            this.scene.start("MenuScene");
        }, this);

        // fade in
        this.cameras.main.fadeFrom(500, 0, 0, 0);

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