export class AlcoholismLevel {
    private readonly LOW_LEVEL = 2;
    private readonly MEDIUM_LEVEL = 4;
    
    private _level: number;

    constructor(){
        this._level = 0;
    }

    increaseLevel(): void {
        this._level++;
    }

    get level(): number {
        return this._level;
    }

    get isLow(): boolean {
        return this._level < this.LOW_LEVEL;
    }

    get isMedium(): boolean {
        return this._level >= this.LOW_LEVEL && this._level < this.MEDIUM_LEVEL;
    }

    get isHigh(): boolean {
        return this._level >= this.MEDIUM_LEVEL;
    }
}
