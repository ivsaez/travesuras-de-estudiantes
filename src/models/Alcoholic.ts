import { Agent } from "agents-flow";
import { AlcoholismLevel } from "./AlcoholismLevel";
import { Aspect, Likes } from "npc-aspect";
import { RelationSet } from "npc-relations";
import { Happiness, Personality } from "npc-mind";

export interface IAlcoholic {
    alcoholism: AlcoholismLevel;
}

export class Alcoholic extends Agent implements IAlcoholic {
    private _alcoholism: AlcoholismLevel;

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
        this._alcoholism = new AlcoholismLevel();
    }

    public get alcoholism(): AlcoholismLevel {
        return this._alcoholism;
    }

    public static is(agent: Agent): agent is Alcoholic {
        return (<Alcoholic>agent).alcoholism !== undefined;
    }

    public static to(agent: Agent): Alcoholic {
        return <Alcoholic>agent;
    }
}