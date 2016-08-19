class KeyEventUtil {
    public static pages:Object = {};
    public static focusPage:string;
    private static _constructor = (() => {
        KeyEventUtil.addEventListener('keydown');
        KeyEventUtil.addEventListener('keyup');
        KeyEventUtil.addEventListener('keypress');
    })();
    private static addEventListener(type:string):void {
        document.addEventListener(type, (evt:KeyboardEvent) => {
            if (KeyEventUtil.pages[KeyEventUtil.focusPage] &&
                KeyEventUtil.pages[KeyEventUtil.focusPage][type][evt.keyCode]) {
                var handlers = KeyEventUtil.pages[KeyEventUtil.focusPage][type][evt.keyCode];
                handlers.forEach(handler=>handler[0].call(handler[1], evt));
            }
        });
    }
    public static register(pageName:string, event:string, keyCode:number, callback:Function, _this:any):void {
        if (!KeyEventUtil.pages[pageName]) {
            KeyEventUtil.pages[pageName] = { "keyup":[], "keydown":[],"keypress":[] };
        }

        if (!KeyEventUtil.pages[pageName][event][keyCode]) {
            KeyEventUtil.pages[pageName][event][keyCode] = [[callback, _this]];
        } else {
            KeyEventUtil.pages[pageName][event][keyCode].push([callback, _this]);
        }
    }
    public static focus(pageName:string):void {
        KeyEventUtil.focusPage = pageName;
    }
}

// document.addEventListener('keydown', function(evt){
//     console.log('keydown', evt);
// });
// document.addEventListener('keyup', function(evt){
//     console.log('keyup', evt);
// });
// document.addEventListener('keypress', function(evt){
//     console.log('keypress', evt);
// });
