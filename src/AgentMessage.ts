export default class AgentMessage{
    private _agent: string;
    private _message: string;
    private _sided: boolean;

    constructor(text:string){
        let textParts = text.split(":");

        if(textParts.length === 1){
            this._agent = null;
            this._message = text;
        }
        else{
            this._agent = textParts[0].trim();
            this._message = textParts[1].replace(" - ", "").trim();
        }

        this._sided = false;
    }

    get agent(){
        return this._agent;
    }

    get message(){
        return this._message;
    }

    get isTalking(): boolean{
        return this._agent !== null;
    }

    get sided(){
        return this._sided;
    }

    sideToRight(): void{
        this._sided = true;
    }
}