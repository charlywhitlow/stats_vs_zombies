class MenuButton extends GameText {

    constructor(scene, text) {

        let config = {
            width : 10,
            height: 2.5,
            xPadding : 25,
            yPadding : 25,
            text : text,
            fontSize: '70px',
            fontFamily: 'Arial',
            fontColor: 'black',
            align: 'center',
            backgroundColor : 'lightgrey',
            wordWrap : true,
            add: true
        }

        super(scene, config);
    }
}