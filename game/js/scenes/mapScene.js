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
                "health" : 3,
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
        this.load.image('back', 'assets/buttons/back.png');

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

        // build map
        this.mapJSON = this.cache.json.get('zone')["map"];
        this.buildMap(this.mapJSON);

        // add zone text
        this.zoneText = new GameText(this, {
            text : 'Zone '+this.user.zone,
            width : 16,
            height : 3,
            fontSize : 80,
            fontColor : 'red',
            fontStyle : 'bold'
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(3), this.zoneText);
        Align.centerH(this.zoneText);

        // add level text
        this.levelText = new GameText(this, {
            text : 'Level '+this.user.level,
            width : 16,
            height : 3,
            fontSize : 70,
            fontColor : 'red'
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(5), this.levelText);
        Align.centerH(this.levelText);

        // add start button
        this.startButton = new GameText(this, {
            text : 'GO',
            width : 5,
            height : 1.5,
            fontSize : 50,
            yPadding : 12,
            fontColor : 'white',
            backgroundColor: '#CC0000',
        });
        this.grid.placeAtIndex(this.grid.getFirstCellInRow(28), this.startButton); // index 510
        Align.centerH(this.startButton);
        this.startButton.setInteractive().on('pointerdown', this.launchGame.bind(this));

        // add back button
        this.backButton = new BackButton({
            scene: this,
            returnSceneName: "MenuScene",
            warning: "Going back will lose any unsaved data, are you sure?"
        });
        
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
    launchGame(){
        // create question queue (for testing only- created in new/load game)
        if (!this.user.hasOwnProperty('questionQueue')){
            let questionDeck = this.cache.json.get('zone')["questionDeck"];
            this.user.questionQueue = new QuestionQueue(questionDeck);
        }
        // increment health
        this.user.health < 3 ? this.user.health ++ : this.user.health;
        // launch game
        this.scene.start("MainGameScene", this.user);
    }
}