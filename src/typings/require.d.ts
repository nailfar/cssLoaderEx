
declare interface NodeRequire  {
    (modules:string[]|string,callback?:Function) : any;
    context(directory: string, useSubdirectories: boolean, regExp: RegExp) : any;
    ensure(dependencies: string[], callback: Function, ...chunkName: String[]) : any
}

declare var require : NodeRequire;

