// TypeScript file

class ErrorUtil {
    public static ERROR = {
        type:'',
        getMessage: function () {
            return `${this.type}: 123`;
        }
    };
    
    public static create(type:Object, config:Object) {
        var errObj = {};
        Object.getOwnPropertyNames(config)
            .forEach((name)=>{
                errObj[name] = config[name];
            });
        Object.getOwnPropertyNames(type)
            .forEach((name)=>{
                errObj[name] = type[name];
            });
        return errObj
    }
}