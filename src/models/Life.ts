export class Life{
    private _life: number;

    constructor(){
        this._life = 100;
    }

    get isDead(): boolean{
        return this._life <= 0;
    }

    hit(amount: number): void {
        if(amount <= 0) return;
        this._life -= amount;
    }
}