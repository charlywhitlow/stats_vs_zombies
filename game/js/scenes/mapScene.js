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
        this.mapPanel.setInteractive().on('pointerup', this.launchGame, this);

        // build map
        this.mapJSON = this.cache.json.get('zone')["map"];
        this.buildMap(this.mapJSON);

        // add zone text
        GameText.addText(this, this.grid, "Zone "+this.user.zone, {
            xIndex : 1,
            yIndex : 3,
            xWidth : 16,
            yWidth : 3,
            fontSize : '80px',
            fontStyle : 'bold',
            color: 'red',
        });

        // add level text
        GameText.addText(this, this.grid, "Level "+this.user.level, {
            xIndex : 1,
            yIndex : 5,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'red',
        });

        // tap map to start text
        GameText.addText(this, this.grid, "Tap map to start", {
            xIndex : 1,
            yIndex : 28,
            xWidth : 16,
            yWidth : 3,
            fontSize : '70px',
            color: 'red',            
        });

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
            console.log('create question/answer queue (TESTING ONLY)');
            let questionDeck = this.cache.json.get('zone')["questionDeck"];
            this.user.questionQueue = new QuestionQueue(questionDeck);
        }
        // increment health
        this.user.health < 3 ? this.user.health ++ : this.user.health;
        // launch game
        this.scene.start("MainGameScene", this.user);
    }
}