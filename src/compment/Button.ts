class Button extends egret.Sprite {
	private borderWidth:number = 3;
	private borderRaduis:number = 30;
	private text:string;
	private clickHandler:Function;
	private border:egret.Shape;
	private background:egret.Shape;
	private label:egret.TextField;
	public constructor(width:number, height:number, text:string, clickHandler?:Function) {
		super();
		this.width = width;
		this.height = height;
		this.borderRaduis = (this.width+this.height)/20
		this.text = text;
		this.clickHandler = clickHandler;
		this.render();

		this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.click, this);
		this.render();
	}
	public setClicklistener(clickHandler:Function) {
		this.clickHandler = clickHandler;
	}
	public click(evt:egret.TouchEvent):void {
		if (this.clickHandler)
			this.clickHandler(evt);
	}

	private onTouchBegin(evt:egret.TouchEvent):void {
		this.changeBackGroudColor(0xffffff);
		this.label.textColor = 0x000000;
	}

	private onTouchEnd(evt:egret.TouchEvent):void {
		this.changeBackGroudColor(0x000000);
		this.label.textColor = 0xffffff;
	}

	private render():void {
		this.border = new egret.Shape();
		this.changeBackGroudColor(0x000000);
		this.addChild(this.border);

		this.label = new egret.TextField();
		this.label.x = this.x;
		this.label.y = this.y;
		this.label.width = this.width;
		this.label.height = this.height;
		this.label.text = this.text;
		this.label.size = 24;
		this.label.textAlign = egret.HorizontalAlign.CENTER;
		this.label.verticalAlign  = egret.VerticalAlign.MIDDLE;
		this.addChild(this.label);
	}
	
	private changeBackGroudColor(color):void {
		this.border.graphics.beginFill(0xffffff);
		this.border.graphics.drawRoundRect(
			0, 
			0, 
			this.width, 
			this.height,
			this.borderRaduis
		);
		this.border.graphics.beginFill(color);
		this.border.graphics.drawRoundRect(
			this.borderWidth,
			this.borderWidth,
			this.width-this.borderWidth*2,
			this.height-this.borderWidth*2,
			this.borderRaduis
		);
		this.border.graphics.endFill();
	}
}