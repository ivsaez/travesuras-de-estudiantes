import { Agent } from "agents-flow";
import { Aspect, Likes } from "npc-aspect";
import { RelationSet } from "npc-relations";
import { Happiness, Personality } from "npc-mind";
import { Concience } from "./Concience";
import { Alcoholic } from "./Alcoholic";

export interface IConcienced{
    concience: Concience;
}

export class Concienced extends Alcoholic implements IConcienced{
    private _concience: Concience;

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
        this._concience = new Concience();
    }
    
    get concience(): Concience{
        return this._concience;
    }

    public static is(agent: Agent): agent is Concienced {
        return (<Concienced>agent).concience !== undefined;
    }

    public static to(agent: Agent): Concienced {
        return <Concienced>agent;
    }
}