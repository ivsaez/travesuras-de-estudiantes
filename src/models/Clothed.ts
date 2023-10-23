import { Agent } from "agents-flow";
import { Clothing } from "./Clothing";
import { Aspect, Likes } from "npc-aspect";
import { RelationSet } from "npc-relations";
import { Happiness, Personality } from "npc-mind";
import { Lifed } from "./Lifed";

export interface IClothed{
    clothing: Clothing;
}

export class Clothed extends Lifed implements IClothed {
    private _clothing: Clothing;

    constructor(
        name: string, 
        aspect: Aspect, 
        relations: RelationSet, 
        happiness: Happiness, 
        personality: Personality, 
        likes: Likes, 
        characteristics: string[], 
        human: boolean) {
        super(name, aspect, relations, happiness, personality, likes, characteristics, human);
        this._clothing = new Clothing();
    }

    public get clothing(): Clothing {
        return this._clothing;
    }

    public static is(agent: Agent): agent is Clothed {
        return (<Clothed>agent).clothing !== undefined;
    }

    public static to(agent: Agent): Clothed {
        return <Clothed>agent;
    }
}