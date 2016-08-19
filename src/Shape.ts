class Shape {
    private static shapes:Array<Shape> = [
        new Shape(0,[[0,0],[0,1],[0,2],[0,3]],[0.5,1.5]),
        new Shape(1,[[0,0],[0,1],[0,2],[1,0]],[0,1]),
        new Shape(2,[[0,0],[0,1],[0,2],[1,2]],[0,1]),
        new Shape(3,[[0,0],[0,1],[1,1],[1,2]],[1,1]),
        new Shape(4,[[1,0],[1,1],[0,1],[0,2]],[1,1]),
        new Shape(5,[[0,0],[0,1],[1,0],[1,1]],[0.5,0.5]),
        new Shape(6,[[0,1],[1,0],[1,1],[1,2]],[1,1])
    ];

    public static getRandomShape():Shape{
        var randomIdx = Math.floor(Math.random()*Shape.shapes.length);
        return Shape.shapes[randomIdx];
    }

    public static getClassShape(index:number):Shape{
        return Shape.shapes[index];
    }

    public static copy(points:Array<Array<number>>):Array<Array<number>>{
        return points.map(line=>line.slice(0));
    }

    public static createZeroMatrix(width:number, height:number = width):Array<Array<number>>{
        var tmp = new Array(height);
        for (var i = 0 ; i < height; i++) {
            tmp[i] = new Array(width);
            for (var j = 0 ; j < width; j++) {
                tmp[i][j] = 0;
            }
        } 
        
        return tmp;
    }
    
    private _type:number;
    private _points:Array<Array<number>>;
    private _center:Array<number>;

    public constructor(type:number, points:Array<Array<number>>, center:Array<number>, moveBy?:Array<number>) {
        this._type = type;
        this._points = Shape.copy(points);
        this._center = center.slice(0);
        if (moveBy !== undefined) {
            this._points = this._points.map(point=>[
                point[0]+moveBy[0],
                point[1]+moveBy[1]
            ]);
            this._center = [
                this._center[0]+moveBy[0],
                this._center[1]+moveBy[1]
            ];
        }
    }

    public get points ():Array<Array<number>>{
        return Shape.copy(this._points);
    }

    public get type ():number{
        return this._type;
    }

    public moveBy(x:number, y:number):Shape {
        return new Shape(
            this._type,
            this._points.map(point=>[point[0]+x, point[1]+y]),
            [this._center[0]+x, this._center[1]+y]
        );
    }

    public rotate():Shape {
        var matrix = [[0,-1],[1,0]];
        var newpoints = this._points.map(point=>[
            point[0]-this._center[0],
            point[1]-this._center[1]
        ]).map(point=>[
            point[0]*matrix[0][0]+point[1]*matrix[1][0],
            point[0]*matrix[0][1]+point[1]*matrix[1][1]
        ]).map(point=>[
            point[0]+this._center[0],
            point[1]+this._center[1]
        ]);
        return new Shape(
            this._type,
            newpoints,
            this._center
        );
    }
}