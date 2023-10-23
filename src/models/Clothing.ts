export class Clothing{
    private _topNaked: boolean;
    private _bottomNaked: boolean;

    constructor() {
        this._topNaked = false;
        this._bottomNaked = false;
    }

    public get topNaked(): boolean {
        return this._topNaked;
    }

    public get bottomNaked(): boolean {
        return this._bottomNaked;
    }

    public removeTop(): void {
        this._topNaked = true;
    }

    public removeBottom(): void {
        this._bottomNaked = true;
    }
}