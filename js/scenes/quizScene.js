class QuizScene extends Phaser.Scene {
    constructor() {
        super('QuizScene');
    }
    init(data){
        if (data.scene) {
            this.returnScene = data.scene;
            this.queue = this.returnScene.scene.user.questionQueue;
            this.question = data.question.question;
            this.userAnswer = data.question.answer;
            this.zombie = data.zombie;
        }else{
            // testing- q1 text only
            // this.returnScene = this.scene.get('MainGameScene');
            // this.question = {};
            // this.question.text = '____ is a measure of average variability around the mean, in squared units';
            // this.question.type = 'textOnly';
            // this.question.imageFile = '';
            // this.question.answers = {
            //     "0" : {
            //         "text" : "Variance",
            //         "correct" : "true" 
            //     },
            //     "1" : {
            //         "text" : "Standard deviation",
            //         "correct" : "false" 
            //     },
            //     "2" : {
            //         "text" : "Range",
            //         "correct" : "false" 
            //     },
            //     "3" : {
            //         "text" : "Interquartile range",
            //         "correct" : "false" 
            //     }
            // };

            // testing- q3 text + image
            this.returnScene = this.scene.get('MainGameScene');
            this.question = {};
            this.question.questiontext = 'This graph is a:';
            this.question.type = 'image';
            this.question.imageFile = 'assets/questionImages/Level1/3_boxplot.png';
            this.question.answers = {
                "0" : {
                    "text" : "Box plot",
                    "correct" : "true" 
                },
                "1" : {
                    "text" : "Histogram",
                    "correct" : "false" 
                },
                "2" : {
                    "text" : "Scatterplot",
                    "correct" : "false" 
                },
                "3" : {
                    "text" : "Stem and Leaf Plot",
                    "correct" : "false" 
                }
            };

        }
    }
    preload(){
        if (this.question.imageFile != '') {
            this.load.image('questionImage', this.question.imageFile);            
        }
    }
    create() {
        // create box grid
        this.boxGrid = new AlignGrid({
            scene: this,
            rows: 32,
            cols: 18,
        });

        // draw popup rectangle
        this.y = 5;
        this.box = this.boxGrid.drawBox(1, this.y, 16, 24, 0xFFFFFF);

        // add question text
        this.makeQuestionText({
            type: this.question.type,
            text: this.question.text,
            image: this.question.imageFile,
        });

        // add answer buttons
        this.makeAnswerButtons();
    }
    makeQuestionText(config){

        // set button padding
        if (!config.xPadding) {
            config.xPadding = 25;
        };
        if (!config.yPadding) {
            config.yPadding = 25;
        };
        
        // text only layout
        if (config.type == "textOnly") {
            config.xIndex = 2;
            config.yIndex = this.y + 3;
            config.xWidth = 14;
            config.yWidth = 11;
        }
        // image and text layout
        if (config.type == "image") {
            config.xIndex = 2;
            config.yIndex = this.y + 12;
            config.xWidth = 14;
            config.yWidth = 3;

            // add image
            let image = this.add.image(0, 0, 'questionImage').setOrigin(0, 0);
            Align.scaleToGameH(image, .30);
            this.boxGrid.placeAtIndex(110, image);
            Align.centerH(image);
        }

        // add question text
        this.questionText = this.make.text({
            x: config.xIndex * this.boxGrid.cellWidth,
            y: config.yIndex * this.boxGrid.cellHeight,
            padding: { x: config.xPadding, y: config.yPadding },
            text: config.text,
            style: {
                fontFamily: 'Arial',
                fontSize: '70px',
                // backgroundColor: 'lightgrey',
                color: 'black',
                stroke: 'black',
                align: 'center',
                boundsAlignV: 'middle',
                fixedWidth: config.xWidth * this.boxGrid.cellWidth,
                fixedHeight: config.yWidth * this.boxGrid.cellHeight,
                wordWrap: {
                    width: (config.xWidth * this.boxGrid.cellWidth)-(config.xPadding*2),
                },
            },
        });
        
    }
    makeAnswerButtons(){
        // add answer buttons (multiple choice a,b,c,d, randomise order)
        let answerOrder = this.shuffleArray([0, 1, 2, 3]);
        this.a = this.makeAnswerButton({
            text: 'a) '+this.question.answers[answerOrder[0]].text,
            xIndex: 2,
            yIndex: this.y+15,
            xWidth: 6.5,
            yWidth: 3.5,
            correct: this.question.answers[answerOrder[0]].correct
        });
        this.b = this.makeAnswerButton({
            text: 'b) '+this.question.answers[answerOrder[1]].text,
            xIndex: 9.5,
            yIndex: this.y+15,
            xWidth: 6.5,
            yWidth: 3.5,
            correct: this.question.answers[answerOrder[1]].correct
        });
        this.c = this.makeAnswerButton({
            text: 'c) '+this.question.answers[answerOrder[2]].text,
            xIndex: 2,
            yIndex: this.y+19.5,
            xWidth: 6.5,
            yWidth: 3.5,
            correct: this.question.answers[answerOrder[2]].correct
        });
        this.d = this.makeAnswerButton({
            text: 'd) '+this.question.answers[answerOrder[3]].text,
            xIndex: 9.5,
            yIndex: this.y+19.5,
            xWidth: 6.5,
            yWidth: 3.5,
            correct: this.question.answers[answerOrder[3]].correct
        });
    }
    makeAnswerButton(config){
        // set button padding
        if (!config.xPadding) {
            config.xPadding = 25;
        };
        if (!config.yPadding) {
            config.yPadding = 25;
        };

        // create button
        let answerButton = this.make.text({
            x: config.xIndex * this.boxGrid.cellWidth,
            y: config.yIndex * this.boxGrid.cellHeight,
            padding: { x: config.xPadding, y: config.yPadding },
            text: config.text,
            style: {
                fontFamily: 'Arial',
                fontSize: '40px',
                backgroundColor: 'lightgrey',
                color: 'black',
                stroke: 'black',
                align: 'left',
                fixedWidth: config.xWidth * this.boxGrid.cellWidth,
                fixedHeight: config.yWidth * this.boxGrid.cellHeight,
                wordWrap: {
                    width: (config.xWidth * this.boxGrid.cellWidth)-(config.xPadding*2),
                },
            }
        });

        // set correct answer
        if (config.correct == 'true' == true) {
            this.correctAnswerButton = answerButton;
        }
        // bind answer function
        if (config.correct == 'true') {
            answerButton.setInteractive().on('pointerdown', function () {                
                answerButton.setBackgroundColor('green');
                this.correctAnswer();
            }, this);
        }else{
            answerButton.setInteractive().on('pointerdown', function () {                
                answerButton.setBackgroundColor('red');
                this.correctAnswerButton.setBackgroundColor('green');
                this.wrongAnswer();
            }, this);
        }
    }
    correctAnswer(){
        // update answer
        this.userAnswer[0]++;
        this.userAnswer[1]++;

        // re-add to end of question queue
        this.queue.enqueue(this.question, this.userAnswer);

        // kill zombie
        this.zombie.collided = true;
        this.returnScene.scene.killZombie(this.zombie);

        // return to scene after short delay
        this.time.delayedCall(600, this.returnToScene.bind(this), [], this);
    }
    wrongAnswer(){
        // update answer
        this.userAnswer[0]++;

        // re-add to middle of question queue
        this.queue.enqueue(this.question, this.userAnswer, this.queue.middle);

        // update health
        this.returnScene.scene.user.health--;
        this.returnScene.scene.healthBar.draw();

        // return to scene / game over after delay
        if (this.returnScene.scene.user.health == 0){
            this.time.delayedCall(1200, this.gameOver.bind(this), [], this);
        }else{
            this.time.delayedCall(1200, this.returnToScene.bind(this), [], this);
        }
    }
    returnToScene(){
        this.scene.stop(this.scene.key);
        this.scene.resume(this.returnScene.key);
    }
    gameOver(){
        this.scene.stop(this.scene.key);
        this.returnScene.scene.gameOver();
    }
    shuffleArray(array) {
        // shuffle input array
        // source: https://www.w3resource.com/javascript-exercises/javascript-array-exercise-17.php
        let ctr = array.length, temp, index;

        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = array[ctr];
            array[ctr] = array[index];
            array[index] = temp;
        }
        return array;
    }
}
