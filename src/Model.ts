// TypeScript file
// x-height
// y-width
class Model {
    private _board:Array<Array<number>>;
    private _boardWidth:number = 10;
    private _boardHeight:number = 20;
    private _activeShape:Shape;
    private _nextShape:Shape;
    private _holdShape:Shape;
    private _score:number;
    private _lastScore:number;
    private _highestScore:number;
    private _level:number;
    private _line:number;
    private _callbackMap:Object;
    private _isEnd:boolean = false;
    public wasSwitch:boolean = false;

    public constructor() {
        this.initial();
    }

    public initial() {
        this._board = Shape.createZeroMatrix(this._boardWidth, this._boardHeight);
        this._activeShape = null;
        this._nextShape = null;
        this._holdShape = null;
        this._score = 0;
        this._lastScore = Number(localStorage.getItem('lastScore')||0);
        this._highestScore = Number(localStorage.getItem('highestScore')||0);
        this._level = 0;
        this._line = 0;
        this._callbackMap = {};
    }

    public get board():Array<Array<number>> {
        return this._board;
    }
    public get boardWidth():number {
        return this._boardWidth;
    }
    public get boardHeight():number {
        return this._boardHeight;
    }
    public get activeShape():Shape {
        return this._activeShape;
    }
    public get nextShape():Shape {
        return this._nextShape;
    }
    public get holdShape():Shape {
        return this._holdShape;
    }
    public get score():number {
        return this._score;
    }
    public get lastScore():number {
        return this._lastScore;
    }
    public get highestScore():number {
        return this._highestScore;
    }
    public get level():number {
        return this._level;
    }
    public get line():number {
        return this._line;
    }
    public get isEnd():boolean {
        return this._isEnd;
    }
    
    public setBoard(val:Array<Array<number>>):boolean {
        return this.setByPropertyName('board', val);
    }
    public setActiveShape(val:Shape):boolean {
        return this.setByPropertyName('activeShape', val);
    }
    public setNextShape(val:Shape):boolean {
        return this.setByPropertyName('nextShape', val);
    }
    public setHoldShape(val:Shape):boolean {
        return this.setByPropertyName('holdShape', val);
    }
    public setScore(val:number):boolean {
        return this.setByPropertyName('score', val);
    }
    public setLastScore(val:number):boolean {
        var res = this.setByPropertyName('lastScore', val);
        if (res) {
            localStorage.setItem('lastScore', this._lastScore+'');
        }

        return res;
    }
    public setHighestScore(val:number):boolean {
        var res = this.setByPropertyName('highestScore', val);
        if (res) {
            localStorage.setItem('highestScore', this._highestScore+'');
        }

        return res;
    }
    public setLevel(val:number):boolean {
        return this.setByPropertyName('level', val);
    }
    public setLine(val:number):boolean {
        return this.setByPropertyName('line', val);
    }
    public setIsEnd(val:boolean):boolean {
        return this.setByPropertyName('isEnd', val);
    }

    private triggerStack:Array<string> = [];
    private triggerCallbacks(propertyName:string, newVal, oldVal) {
        if (this.triggerStack.indexOf(propertyName) != -1) {
            throw 'circle error';
        } else if (this._callbackMap[propertyName]) {
            this.triggerStack.push(propertyName);
            var allpass = this._callbackMap[propertyName].every(callbackPair=>{
                var callbackResult = callbackPair[0].call(callbackPair[1], newVal, oldVal);
                return callbackResult || callbackResult === undefined;
            });
            this.triggerStack.pop();
            return allpass;
        }
    }

    private setByPropertyName(name, val):boolean {
        if (this.triggerCallbacks(name, val, this['_'+name])) {
            this['_'+name] = val;
            return true;
        } else {
            return false;
        }
    }
    
    public watch(propertyName:string, callback:Function, thisObj) {
        if (this.hasOwnProperty('_'+propertyName)) {
            if (this._callbackMap[propertyName]) {
                this._callbackMap[propertyName].push([callback,thisObj]);
            } else {
                this._callbackMap[propertyName] = [[callback,thisObj]];
            }
        } else {
            throw 'property is not defined!';
        }
    }

    public reset(propertyName:string):boolean {
        return this.triggerCallbacks(propertyName, this['_'+propertyName], this['_'+propertyName]);
    }
}