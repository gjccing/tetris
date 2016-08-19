class Dialog extends egret.Sprite {
	public isShow:boolean;
	private target:egret.DisplayObject;
	private background:egret.Shape;
	private body:egret.Sprite;
	private blurFilter:egret.BlurFilter;
	private animateInterval:Array<number> = [300, 400];
	private event = {
		show:[],
		hide:[]
	};
	public constructor(target:egret.DisplayObject) {
		super();
		this.target = target;
		this.target.parent.addChild(this);
		this.alpha = 0;
		this.x = -Infinity;
		this.y = -Infinity;
		this.touchEnabled = true;
		this.background = new egret.Shape();
		super.addChild(this.background);
		this.body = new egret.Sprite();
		super.addChild(this.body);
	}

	public show(callback?:Function):void {
		this.alpha = 0;
		this.x = 0;
		this.y = 0;
		this.isShow = true;
		this.parent.setChildIndex(this, this.parent.$children.length-1);
		Dialog.coverStage(this);
		Dialog.coverStage(this.background);
		Dialog.coverStage(this.body);
		this.fillBackground();
		// 動畫
		this.tweenBlur(this.animateInterval[0], 0, 5);
		egret.Tween.get(this).to({alpha: 1}, this.animateInterval[1], egret.Ease.circIn)
			.call(()=>{
				this.event.show.forEach(handler=>handler.call(this));
				if (callback) callback();
				
				// var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
				// var colorMatrix = [
				// 	1,0,0,0,-200,
				// 	0,1,0,0,-200,
				// 	0,0,1,0,-200,
				// 	0,0,0,1,0
				// ];
				// this.target.filters.push(colorFlilter);
				// this.target.filters = this.target.filters;
			});
		
	}

	public hide(callback?:Function):void {
		this.alpha = 1;
		egret.Tween.get(this).to({alpha: 0}, this.animateInterval[0], egret.Ease.circIn);
		this.tweenBlur(this.animateInterval[1], 10, 0, ()=>{
			this.alpha = 0;
			this.x = -Infinity;
			this.y = -Infinity;
			this.isShow = false;
			this.event.hide.forEach(handler=>handler.call(this));
			if (callback) callback();
		});
	}

	public addEventListener(event:string, handler:Function) {
		this.event[event].push(handler);
	}

	public addChild(child:egret.DisplayObject) {
		return this.body.addChild(child);
	}

	private fillBackground():void {
		this.background.alpha = 0;
		this.background.graphics.beginFill(0x000000);
		this.background.graphics.drawRect(0,0,this.background.width,this.background.height);
		this.background.graphics.endFill();
	}
	
	private static coverStage(coverObj:egret.DisplayObject) {
		
		coverObj.x = 0;
		coverObj.y = 0;
		coverObj.width = coverObj.stage.stageWidth;
		coverObj.height = coverObj.stage.stageHeight;
	}

	private tweenBlur(time:number, from:number, to:number, complete?:Function):void {
		if (this.blurFilter && this.target.filters) {
			var index = this.target.filters.indexOf(this.blurFilter);
			if (index != -1) {
				this.target.filters.splice(index,1);
			}
		}
		
		this.blurFilter = new egret.BlurFilter(from, from);
		if (this.target.filters) {
			this.target.filters.push(this.blurFilter);
		} else {
			this.target.filters = [this.blurFilter];
		}

		var diff = Math.max(from, to) - Math.min(from, to);
		var slice = to>from?1:-1;
		var timer:egret.Timer = new egret.Timer(time/diff,diff);
		timer.addEventListener(egret.TimerEvent.TIMER, ()=>{
			this.blurFilter.blurX+=slice;
			this.blurFilter.blurY+=slice;
			this.target.filters = this.target.filters;
		}, this);
		timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, ()=>{
			this.blurFilter.blurX = to;
			this.blurFilter.blurY = to;
			this.target.filters = this.target.filters;
			if (complete) {
				complete();
			}
		}, this);
		timer.start();
	}
}