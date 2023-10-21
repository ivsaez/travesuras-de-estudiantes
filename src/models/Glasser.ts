export interface IGlasser{
    glass: Glass;
}

export class Glass{
    private _shots: number;

    constructor(){
        this._shots = 0;
    }

    fill(): void {
        this._shots = 2;
    }

    drink(): boolean {
        if(this._shots === 0)
            return false;
        
        this._shots--;
        return true;
    }

    get shots(): number {
        return this._shots;
    }

    isEmpty(): boolean {
        return this._shots === 0;
    }
}