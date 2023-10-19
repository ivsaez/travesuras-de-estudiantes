export class AlcoholismLevel {
    private readonly LOW_LEVEL = 2;
    private readonly MEDIUM_LEVEL = 4;
    
    private level: number;

    constructor(){
        this.level = 0;
    }

    public increaseLevel(): void {
        this.level++;
    }

    public get isLow(): boolean {
        return this.level < this.LOW_LEVEL;
    }

    public get isMedium(): boolean {
        return this.level >= this.LOW_LEVEL && this.level < this.MEDIUM_LEVEL;
    }

    public get isHigh(): boolean {
        return this.level >= this.MEDIUM_LEVEL;
    }
}
