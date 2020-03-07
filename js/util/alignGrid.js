class AlignGrid
{
	constructor(config)
	{
		if (!config.scene){
			console.log("missing scene");
			return;
		}
		this.scene = config.scene;
		
		if (!config.rows){
			config.rows=5;
		}
		this.rows = config.rows;

		if (!config.cols){
			config.cols=5;
		}
		this.cols = config.cols;

		if (!config.height){
			config.height=game.config.height;
		}
		this.height = config.height;

		if (!config.width){
			config.width=game.config.width;
		}
		this.width = config.width;

		// cell properties
		this.cellWidth = this.width / this.cols;
		this.cellHeight = this.height / this.rows;
		this.numCells = this.rows * this.cols;
	}

	show()
	{
		this.graphics=this.scene.add.graphics();
		this.graphics.lineStyle(2,0xff0000);

		for (var i = 0; i < this.width; i+=this.cellWidth) {
			this.graphics.moveTo(i,0);
			this.graphics.lineTo(i,this.height);
		}
		for (var i = 0; i < this.height; i+=this.cellHeight) {
			this.graphics.moveTo(0,i);
			this.graphics.lineTo(this.width,i);
		}
		this.graphics.strokePath();
	}
	placeAt(xx,yy,obj)
	{
		// calc position based upon the cellwidth and cellheight
		var x2=this.cellWidth*xx+this.cellWidth/2;
		var y2=this.cellHeight*yy+this.cellHeight/2;

		obj.x=x2;
		obj.y=y2;
	}
	placeAtIndex(index,obj)
	{
		var yy=Math.floor(index/this.cols);
		var xx=index-(yy*this.cols);

		this.placeAt(xx,yy,obj);
	}
	showNumbers()
	{
		this.show();
		var count=0;
		for (var i = 0; i < this.rows; i++) {
			for(var j=0;j<this.cols;j++){
				var numText=this.scene.add.text(0,0,count,{color:'#ff0000'});
				numText.setOrigin(0.5,0.5);
				this.placeAtIndex(count,numText);
				count++;
			}
		}
	}
	getFirstCellInRow(rowNum){
		return (rowNum * this.cols);
	}
}