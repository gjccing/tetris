
class Main extends egret.DisplayObjectContainer {
    private static blockLength:number = 30;
    private loadingView:LoadingUI;
    private model:Model;
    private controller:Controller;

    private gameView:GameView;
    private startDialog:Dialog;
    private pauseDialog:Dialog;
    private restartDialog:Dialog;
    private exitDialog:Dialog;
    
    public constructor() {
        super();
        this.model = new Model();
        this.controller = new Controller(this.model);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        this.createGameScene();
    }
    
    private createGameScene():void {
        this.initBackgroud(this.stage.stageWidth, this.stage.stageHeight);
        this.initStartDialog();
        this.initPauseDialog();
        this.initExitDialog();
        this.startDialog.show();
        this.initGameView();
    }

    private initBackgroud(stageW, stageH):void {
        var bg = new egret.Shape();
        bg.graphics.beginFill(0x000000);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        this.addChild(bg);
    }
    
    private initGameView():void {
        this.gameView = new GameView();
        this.addChild(this.gameView);
        this.model.watch('board',this.gameView.setBoard, this.gameView);
        this.model.watch('nextShape',this.gameView.setNextBoard, this.gameView);
        this.model.watch('holdShape',this.gameView.setHoldBoard, this.gameView);
        this.model.watch('score',this.gameView.setScore, this.gameView);
        this.model.watch('level',this.gameView.setLevel, this.gameView);
        this.model.watch('line',this.gameView.setLine, this.gameView);
        this.model.watch('isEnd',(newVal)=>{ if (newVal) this.startDialog.show(); }, this);
        KeyEventUtil.register('GameView', 'keydown', 65, this.controller.moveActiveShapeLeft, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 37, this.controller.moveActiveShapeLeft, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 68, this.controller.moveActiveShapeRight, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 39, this.controller.moveActiveShapeRight, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 87, this.controller.rotateActiveShape, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 38, this.controller.rotateActiveShape, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 83, this.controller.moveActiveShapeDown, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 40, this.controller.moveActiveShapeDown, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 16, this.controller.switcheActiveShape, this.controller);
        KeyEventUtil.register('GameView', 'keydown', 32, this.controller.landing, this);
        var pause = ()=>{
            KeyEventUtil.focus('');
            this.controller.stop();
            this.pauseDialog.show();
        };
        this.gameView.pauseBtn.setClicklistener(pause);
        KeyEventUtil.register('GameView', 'keyup', 80, pause, this);
        var exit = ()=>{
            KeyEventUtil.focus('');
            this.controller.stop();
            this.exitDialog.show();
        };
        this.gameView.exitBtn.setClicklistener(exit);
        KeyEventUtil.register('GameView', 'keyup', 69, exit, this);
    }
    
    private initStartDialog():void {
        this.startDialog = new Dialog(this);

        var tmpY = 150;

        var gameTitle = new egret.TextField();
		gameTitle.text = 'Tetris';
        gameTitle.x = 0;
        gameTitle.y = tmpY;
        gameTitle.width = this.stage.stageWidth;
        gameTitle.size = 100;
		gameTitle.textAlign = egret.HorizontalAlign.CENTER;
		gameTitle.verticalAlign  = egret.VerticalAlign.MIDDLE;
        this.startDialog.addChild(gameTitle);
        
        tmpY = tmpY+100+100;

        var startBtn = new Button(180,60,'[S]tart');
        startBtn.x = (this.stage.stageWidth-180)/2;
        startBtn.y = tmpY;
        this.startDialog.addChild(startBtn);

        tmpY = tmpY+60+50;
        
        var highestScore = new egret.TextField();
        highestScore.text = 'Highest Score: ' + this.model.highestScore;
        highestScore.x = 0;
        highestScore.y = tmpY;
        highestScore.width = this.stage.stageWidth;
		highestScore.textAlign = egret.HorizontalAlign.CENTER;
		highestScore.verticalAlign  = egret.VerticalAlign.MIDDLE;
        highestScore.bold = true;
        this.startDialog.addChild(highestScore);

        tmpY = tmpY+30+30;

        var lastScore = new egret.TextField();
        lastScore.text = 'Last Score: ' + this.model.lastScore;
        lastScore.x = 0;
        lastScore.y = tmpY;
        lastScore.width = this.stage.stageWidth;
		lastScore.textAlign = egret.HorizontalAlign.CENTER;
		lastScore.verticalAlign  = egret.VerticalAlign.MIDDLE;
        lastScore.bold = true;
        this.startDialog.addChild(lastScore);

        var start = ()=>{
            KeyEventUtil.focus('');
            this.controller.reset();
            this.startDialog.hide();
        };
        startBtn.setClicklistener(start);
        KeyEventUtil.register('StartDialog', 'keydown', 83, start, this);
        this.startDialog.addEventListener('show', ()=>{
            KeyEventUtil.focus('StartDialog');
        });
        this.startDialog.addEventListener('hide', ()=>{
            KeyEventUtil.focus('GameView');
            this.controller.start();
        });
        this.model.watch('highestScore',(newVal)=>{
            highestScore.text='Highest Score: '+newVal;}, this);
        this.model.watch('lastScore',(newVal)=>{
            lastScore.text='Last Score: '+newVal;}, this);
    }
    
    private initPauseDialog():void {
        this.pauseDialog = new Dialog(this);

        var tmpY = 150;

        var pauseTitle = new egret.TextField();
		pauseTitle.text = 'Pause';
        pauseTitle.x = 0;
        pauseTitle.y = tmpY;
        pauseTitle.width = this.stage.stageWidth;
        pauseTitle.size = 100;
		pauseTitle.textAlign = egret.HorizontalAlign.CENTER;
		pauseTitle.verticalAlign  = egret.VerticalAlign.MIDDLE;
        this.pauseDialog.addChild(pauseTitle);
        
        tmpY = tmpY+100+100;

        var resumeBtn = new Button(180,60,'[R]esume');
        resumeBtn.x = (this.stage.stageWidth-180*2-10)/2;
        resumeBtn.y = tmpY;
        this.pauseDialog.addChild(resumeBtn);

        var resume = ()=>{
            KeyEventUtil.focus('');
            this.pauseDialog.hide(()=>{
                KeyEventUtil.focus('GameView');
                this.controller.start();
            });
        };
        resumeBtn.setClicklistener(resume);
        KeyEventUtil.register('PauseDialog', 'keyup', 27, resume, this);
        KeyEventUtil.register('PauseDialog', 'keyup', 82, resume, this);

        var endBtn = new Button(180,60,'[E]xit');
        endBtn.x = resumeBtn.x+180+10;
        endBtn.y = tmpY;
        this.pauseDialog.addChild(endBtn);

        var end = ()=>{
            KeyEventUtil.focus('');
            this.pauseDialog.hide(()=>{
                KeyEventUtil.focus('StartDialog');
                this.startDialog.show();
            });
        };
        endBtn.setClicklistener(end);
        KeyEventUtil.register('PauseDialog', 'keyup', 69, end, this);

        this.pauseDialog.addEventListener('show', ()=>{
            KeyEventUtil.focus('PauseDialog');
        });
    }
    
    private initExitDialog():void {
        this.exitDialog = new Dialog(this);

        var tmpY = 150;

        var exitTitle = new egret.TextField();
		exitTitle.text = 'Exit';
        exitTitle.x = 0;
        exitTitle.y = tmpY;
        exitTitle.width = this.stage.stageWidth;
        exitTitle.size = 100;
		exitTitle.textAlign = egret.HorizontalAlign.CENTER;
		exitTitle.verticalAlign  = egret.VerticalAlign.MIDDLE;
        this.exitDialog.addChild(exitTitle);
        
        tmpY = tmpY+100+100;

        var endBtn = new Button(180,60,'[Y]es');
        endBtn.x = (this.stage.stageWidth-180*2-10)/2;
        endBtn.y = tmpY;
        this.exitDialog.addChild(endBtn);

        var end = ()=>{
            KeyEventUtil.focus('');
            this.exitDialog.hide(()=>{
                KeyEventUtil.focus('StartDialog');
                this.startDialog.show();
            });
        };
        endBtn.setClicklistener(end);
        KeyEventUtil.register('ExitDialog', 'keyup', 89, end, this);

        var resumeBtn = new Button(180,60,'[N]o');
        resumeBtn.x = endBtn.x+180+10;
        resumeBtn.y = tmpY;
        this.exitDialog.addChild(resumeBtn);

        var resume = ()=>{
            KeyEventUtil.focus('');
            this.exitDialog.hide(()=>{
                KeyEventUtil.focus('GameView');
                this.controller.start();
            });
        };
        resumeBtn.setClicklistener(resume);
        KeyEventUtil.register('ExitDialog', 'keyup', 27, resume, this);
        KeyEventUtil.register('ExitDialog', 'keyup', 78, resume, this);

        this.exitDialog.addEventListener('show', ()=>{
            KeyEventUtil.focus('ExitDialog');
        });
    }
}


