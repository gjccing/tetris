class Controller {
	private model:Model;
	private clock:number = 20;
	private timer:egret.Timer;
	private disappear:egret.Timer;
	public constructor(model:Model) {
		this.model = model;
        this.model.watch('activeShape', this.mapActiveShapeToBoard, this);
		this.model.watch('isEnd', (newVal) =>{ if (newVal) this.end(); }, this);
	}

	private mapActiveShapeToBoard(newVal:Shape, oldVal:Shape) {
		var newBoard = this.model.board.map(line=>line.slice(0));
		if (newVal) {
			// 清除舊的圖案
			if (oldVal) oldVal.points.forEach(point=>{newBoard[point[0]][point[1]] = 0});
			// 檢查是否超過邊界
			var isOverBorder = newVal.points.some(point=>
				point[0] >= this.model.boardHeight ||
				point[1] >= this.model.boardWidth ||
				point[0] < 0 ||
				point[1] < 0
			);
			if (isOverBorder) return false;
			// 檢查新圖案是否壓到方塊
			var isCoverBlock = newVal.points.some(point=>
				Boolean(newBoard[point[0]][point[1]])
			);
			if (isCoverBlock) return false;
			// 繪製新圖形
			newVal.points.forEach(point=>{newBoard[point[0]][point[1]] = 1});
			this.model.setBoard(newBoard);
		}

		return true;
	}

	private initTimer():void {
		this.timer = new egret.Timer(20,0);
        this.timer.addEventListener(egret.TimerEvent.TIMER,(evt)=>{
			this.clock+=(this.model.level+1);
			if (this.clock>=20) {
				if (this.model.activeShape) {
					if (this.isLanding()) {
						this.model.setActiveShape(null);
						this.deleteFullLine();
					} else {
						this.moveActiveShapeDown();
					}
				} else {
					this.insertActiveShape(this.model.nextShape || Shape.getRandomShape(), true);
				}

				this.clock = 0;
			}
		},this);
	}
	private deleteFullLine() {
		if (this.model.board.some(line=>line.every(rec=>rec===1))) {
			var oldBoard = this.model.board;
			var disappearBoard = this.model.board.map(line=>
				line.every(rec=>rec===1)?[0,0,0,0,0,0,0,0,0,0]:line);
			this.timer.stop();
			this.disappear = new egret.Timer(40,6);
			this.disappear.addEventListener(egret.TimerEvent.TIMER, (evt)=>{
				if (evt.target.currentCount%2) {
					this.model.setBoard(disappearBoard);
				} else {
					this.model.setBoard(oldBoard);
				}
			}, this);
			this.disappear.addEventListener(egret.TimerEvent.TIMER_COMPLETE, (evt)=>{
				var newBoard = oldBoard.filter(line=>!line.every(rec=>rec===1));
				this.addScoreByLine(20-newBoard.length);
				for (var i = newBoard.length; i < 20 ; i++) {
					newBoard.unshift([0,0,0,0,0,0,0,0,0,0]);
				}

				this.model.setBoard(newBoard);
				this.timer.start();
			}, this);
			this.disappear.start();
		}
	}
	private isLanding():boolean {
		return this.model.activeShape.points.reduce((bottomLine, point)=>{
				if (bottomLine[point[1]] === undefined || bottomLine[point[1]] < point[0]) {
					bottomLine[point[1]] = point[0];
				}
				
				return bottomLine;
			}, [])
			.map((x,y) =>[x,y])
			.some(point=>
				point[0]+1 >= this.model.boardHeight ||
				this.model.board[point[0]+1][point[1]] == 1
			);
	}
	public reset():void {
		this.model.setBoard(Shape.createZeroMatrix(10,20));
		this.model.setActiveShape(null);
		this.model.setNextShape(null);
		this.model.setHoldShape(null);
		this.model.setScore(0);
		this.model.setLevel(1);
		this.model.setLine(0);
		this.model.setIsEnd(false);
		this.initTimer();
	}
	
	public start():void {
		this.timer.start();
	}

	public stop():void {
		this.timer.stop();
	}
	
	public end():void {
		this.timer.stop();
		if (this.disappear) 
			this.disappear.stop();
		if (this.model.score > this.model.highestScore) 
			this.model.setHighestScore(this.model.score);
		this.model.setLastScore(this.model.score);
	}

    public moveActiveShapeDown():void {
		if (this.model.activeShape)
        	this.model.setActiveShape(this.model.activeShape.moveBy(1, 0));
    }

    public moveActiveShapeLeft():void {
		if (this.model.activeShape)
        	this.model.setActiveShape(this.model.activeShape.moveBy(0, -1));
    }

    public moveActiveShapeRight():void {
		if (this.model.activeShape)
        	this.model.setActiveShape(this.model.activeShape.moveBy(0, 1));
    }

    public rotateActiveShape():void {
		if (this.model.activeShape)
        	this.model.setActiveShape(this.model.activeShape.rotate());
    }

	public switcheActiveShape():void {
		if (this.model.activeShape && !this.model.wasSwitch) {
			var activeShape = this.model.activeShape;
			var holdShape = this.model.holdShape; 
			this.model.setHoldShape(Shape.getClassShape(activeShape.type));
			if (holdShape) {
				this.insertActiveShape(Shape.getClassShape(holdShape.type), false);
			} else {
				this.insertActiveShape(this.model.nextShape, true);
			}

			this.model.wasSwitch = true;
		}
	}

	private insertActiveShape(nextShape:Shape, formNext:boolean):void {
		var width = nextShape.points.reduce((map, point)=>{
				map[point[1]] = 1;
				return map;
			}, [])
			.reduce(res=>res+1, 0); 
		nextShape = nextShape.moveBy(0, Math.floor((10-width)/2))
		var isActive = this.model.setActiveShape(nextShape);
		if (!isActive) {
			var newBoard = this.model.board.map(line=>line.slice(0));
			nextShape.points.forEach(point=>{newBoard[point[0]][point[1]] = 1});
			this.model.setBoard(newBoard);
			this.model.setIsEnd(true);
			this.timer.stop();
		} else if (formNext) {
			this.model.setNextShape(Shape.getRandomShape());
			this.model.wasSwitch = false;
		}
	}

	public landing():void {
		if (this.model.activeShape) {
			var bottomline = this.model.activeShape.points.reduce((bottomLine, point)=>{
					if (bottomLine[point[1]] === undefined || bottomLine[point[1]] < point[0]) {
						bottomLine[point[1]] = point[0];
					}
					
					return bottomLine;
				}, [])
				.map((x,y) =>[x,y]);
			var x = 1;
			while(!bottomline.some(point=>
				point[0]+x >= this.model.boardHeight ||
				this.model.board[point[0]+x][point[1]] == 1
			)) {
				x++;
			}

			this.model.setActiveShape(this.model.activeShape.moveBy(x-1, 0));
			this.clock = Infinity;
		}
	}

    public addScoreByLine(line:number):void {
		this.model.setLine(this.model.line+line);
		this.model.setScore(this.model.score+line*(1+line)*50);
		this.model.setLevel(Math.floor(Math.sqrt((this.model.line+1)/10)));
    }
}