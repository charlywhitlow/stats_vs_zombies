class GameText
{
    static addText(scene, grid, text, config)
    {
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
        let addText = scene.make.text({
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