class GameView extends egret.Sprite{
	private board:Board;
	private nextLabel:egret.TextField;
	private nextBoard:Board;
	private holdLabel:egret.TextField;
	private holdBoard:Board;
	private level:egret.TextField;
	private score:egret.TextField;
	private line:egret.TextField;
	public pauseBtn:Button;
	// private resetBtn:Button;
	public exitBtn:Button;
	public constructor() {
		super();
		this.addEventListener(egret.Event.ENTER_FRAME, (evt)=>{
			if (this.x) this.x = 0;
			if (this.y) this.y = 0;
			if (this.width !== this.stage.width) this.width = this.stage.width;
			if (this.height !== this.stage.height) this.height = this.stage.height;
		}, this);

		this.board = new Board(10,20,30);
		this.nextLabel = new egret.TextField();
		this.nextBoard = new Board(4,4,30);
		this.holdLabel = new egret.TextField();
		this.holdBoard = new Board(4,4,30);
		this.level = new egret.TextField();
		this.score = new egret.TextField();
		this.line = new egret.TextField();
		this.pauseBtn = new Button(180,60, '[P]ause');
		// this.resetBtn = new Button(180,60, '[R]estart');
		this.exitBtn = new Button(180,60, '[E]xit');

		this.addChild(this.board);
		this.addChild(this.nextLabel);
		this.addChild(this.nextBoard);
		this.addChild(this.holdLabel);
		this.addChild(this.holdBoard);
		this.addChild(this.level);
		this.addChild(this.score);
		this.addChild(this.line);
		this.addChild(this.pauseBtn);
		// this.addChild(this.resetBtn);
		this.addChild(this.exitBtn);

		this.layout();
	}

	private layout():void {
		this.board.x = 15;
		this.board.y = 15;

		var slideX = this.board.width + 15*2;
		var slideY = 15;

		this.nextLabel.text = 'Next';
		this.nextLabel.x = slideX;
		this.nextLabel.y = slideY;
		
		slideY=slideY+30;

		this.nextBoard.x = slideX+15*2;
		this.nextBoard.y = slideY;

		slideY=slideY+30*4+7*3+15;

		this.holdLabel.text = 'Hold';
		this.holdLabel.x = slideX;
		this.holdLabel.y = slideY;

		slideY=slideY+30;

		this.holdBoard.x = slideX+15*2;
		this.holdBoard.y = slideY;

		slideY=slideY+30*4+7*3+15;

		this.level.text = 'Level: '+0;
		this.level.x = slideX+15;
		this.level.y = slideY;
		
		slideY=slideY+30+15;
		
		this.score.text = 'Score: '+0;
		this.score.x = slideX+15;
		this.score.y = slideY;
		
		slideY=slideY+30+15;

		this.line.text = 'Line: '+0;
		this.line.x = slideX+15;
		this.line.y = slideY;

		slideY=slideY+30+15;
		
		this.pauseBtn.x = slideX+15;
		this.pauseBtn.y = slideY;

		// slideY=slideY+60+10;

		// this.resetBtn.x = slideX+15;
		// this.resetBtn.y = slideY;

		slideY=slideY+60+10;

		this.exitBtn.x = slideX+15;
		this.exitBtn.y = slideY;
	}

	public setBoard(newVal:Array<Array<number>>):void{
		this.board.drawBoard(newVal);
	}

	public setNextBoard(newVal:Shape):void{
		this.nextBoard.clean();
		if (newVal) this.nextBoard.drawShape(newVal.points);
	}

	public setHoldBoard(newVal:Shape):void{
		this.holdBoard.clean();
		if (newVal) this.holdBoard.drawShape(newVal.points);
	}

	public setLevel(newVal:number):void{
		this.level.text = 'Level: '+ newVal;
	}

	public setScore(newVal:number):void{
		this.score.text = 'Score: '+ newVal;
	}

	public setLine(newVal:number):void{
		this.line.text = 'Line: '+ newVal;
	}
}