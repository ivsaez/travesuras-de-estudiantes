export class Concience{
    private _level: number;

    constructor(){
        this._level = 0;
    }

    get isNeutral(): boolean{
        return this._level === 0;
    }

    get isGood(): boolean{
        return this._level > 0;
    }

    get isBad(): boolean{
        return this._level < 0;
    }

    increse(): void{
        this._level++;
    }

    decrese(): void{
        this._level--;
    }
}