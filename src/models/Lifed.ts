import { Life } from "./Life";
import { Agent } from "agents-flow";
import { Aspect, Likes } from "npc-aspect";
import { RelationSet } from "npc-relations";
import { Happiness, Personality } from "npc-mind";

export interface ILifed{
    dead: boolean;
    hitSoft();
    hitHard();
    hitExtrreme();
}

export class Lifed extends Agent implements ILifed{
    private _life: Life;

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
        this._life = new Life();
    }

    public get dead(): boolean {
        return this._life.isDead;
    }

    public hitSoft(): void {
        this._life.hit(5);
    }

    public hitHard(): void {
        this._life.hit(10);
    }

    public hitExtrreme(): void {
        this._life.hit(50);
    }

    public static is(agent: Agent): agent is Lifed {
        return (<Lifed>agent).dead !== undefined;
    }

    public static to(agent: Agent): Lifed {
        return <Lifed>agent;
    }
}