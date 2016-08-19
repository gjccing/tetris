
class Board extends egret.Shape {
    private blockSize:number;
    private widthBlockNumber:number;
    private heightBlockNumber:number;

    private borderWidth:number = 3;
    
    private boardWidth:number;
    private boardHeight:number;
    private blockMap:Array<Array<number>>;

    constructor(widthBlockNumber:number,heightBlockNumber:number,blockSize:number, hideBoarder?:boolean){
        super();
        this.blockSize = blockSize;
        this.widthBlockNumber = widthBlockNumber;
        this.heightBlockNumber = heightBlockNumber;
        this.boardWidth = 
            this.blockSize*widthBlockNumber+
            this.borderWidth*(widthBlockNumber+1)+
            this.borderWidth*2;
        this.boardHeight = 
            this.blockSize*heightBlockNumber+
            this.borderWidth*(heightBlockNumber+1)+
            this.borderWidth*2;
        if (!hideBoarder){
            this.drawBorder();
        }
    }

    private drawBorder():void {
        this.graphics.beginFill(0xffffff);
        this.graphics.drawRect(0, 0, this.boardWidth, this.boardHeight);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(
            this.borderWidth,
            this.borderWidth,
            this.boardWidth-this.borderWidth*2, 
            this.boardHeight-this.borderWidth*2
        );
        this.graphics.endFill();
    }

    public clean():void {
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(
            this.borderWidth,
            this.borderWidth,
            this.boardWidth-this.borderWidth*2, 
            this.boardHeight-this.borderWidth*2);
    }

    public drawBoard(blockMap:Array<Array<number>>):void {
        var blockLength = this.borderWidth+this.blockSize;
        if (blockMap) {
            for (var i = 0, y = this.borderWidth*2; i < blockMap.length ; i++, y+=blockLength) {
                if (blockMap[i]) {
                    for (var j = 0, x = this.borderWidth*2; j < blockMap[i].length; j++, x+=blockLength) {
                        if (blockMap[i][j] && (!this.blockMap || !this.blockMap[i][j])) {
                            this.graphics.beginFill(0xffffff);
                            this.graphics.drawRect(x, y, this.blockSize, this.blockSize); 
                        } else if (!blockMap[i][j] && (!this.blockMap || this.blockMap[i][j])) {
                            this.graphics.beginFill(0x000000);
                            this.graphics.drawRect(x, y, this.blockSize, this.blockSize); 
                        }
                    }
                }
            }
        }
        
        this.graphics.endFill();
        this.blockMap = blockMap;
    }

    public drawShape(points:Array<Array<number>>):void {
        this.graphics.beginFill(0xffffff);
        var origin = this.borderWidth*2;
        var spacing = this.borderWidth+this.blockSize;
        points.forEach(point=>{
            this.graphics.drawRect(
                origin+spacing*point[1], 
                origin+spacing*point[0], 
                this.blockSize, 
                this.blockSize
            );
        });
    }
}