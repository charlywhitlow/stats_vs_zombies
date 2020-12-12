class Align
{
	static scaleToGameW(obj, percent)
	{
		obj.displayWidth = game.config.width * percent;
		obj.scaleY = obj.scaleX;
	}
	static scaleToGameH(obj, percent)
	{
		obj.displayHeight = game.config.height * percent;
		obj.scaleX = obj.scaleY;
	}
	static stretchToGameH(obj, percent)
	{
		obj.displayHeight = game.config.height * percent;
	}
	static stretchToGameW(obj, percent)
	{
		obj.displayWidth = game.config.width * percent;
	}
	static centerH(obj)
	{
		obj.x = game.config.width/2 - obj.displayWidth/2;
	}
	static centerV(obj)
	{
		obj.y = game.config.height/2 - obj.displayHeight/2;
	}
	static center2(obj)
	{
		obj.x = game.config.width/2 - obj.displayWidth/2;
		obj.y = game.config.height/2 - obj.displayHeight/2;
	}
	static center(obj)
	{
		obj.x = game.config.width/2;
		obj.y = game.config.height/2;
	}
}