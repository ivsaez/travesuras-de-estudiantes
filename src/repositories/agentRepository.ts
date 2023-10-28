import { Agent } from "agents-flow";
import { Aspect, Likes, SexKind, OriginKind, EyeColor, HairColor, HaircutStyle, ComplexionKind, SpecieKind } from "npc-aspect";
import { RelationSet, RelationFactory, RelationKind, Familiar } from "npc-relations";
import { Happiness, Personality } from "npc-mind";
import { Alcoholic } from "../models/Alcoholic";
import { Clothed } from "../models/Clothed";
import { Concienced } from "../models/Concienced";

export class AgentRepository{
    private _elements: Agent[];

    constructor(){
        this._elements = [];

        this._elements.push(new Clothed(
            "Paco",
            new Aspect(
                SexKind.Male, 
                OriginKind.European, 
                EyeColor.Brown, 
                HairColor.White, 
                HaircutStyle.Bald, 
                ComplexionKind.Thin, 
                SpecieKind.Human, 
                175, 
                49),
            new RelationSet()
                .append("Goiko", RelationFactory.get(RelationKind.Enemy))
                .append("Susi", RelationFactory.get(RelationKind.Neutral))
                .append("Mari", RelationFactory.get(RelationKind.Neutral))
                .append("Sebas", RelationFactory.get(RelationKind.Enemy)),
            new Happiness(0),
            new Personality(50, 40, 20, 20, 10),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            [ "Profesor" ],
            false
        ));

        this._elements.push(new Alcoholic(
            "Goiko",
            new Aspect(
                SexKind.Male, 
                OriginKind.European, 
                EyeColor.Blue, 
                HairColor.Black, 
                HaircutStyle.Short, 
                ComplexionKind.Athletic, 
                SpecieKind.Human, 
                173, 
                14),
            new RelationSet()
                .append("Paco", RelationFactory.get(RelationKind.Enemy))
                .append("Susi", RelationFactory.get(RelationKind.Platonic))
                .append("Mari", RelationFactory.get(RelationKind.Neutral))
                .append("Sebas", RelationFactory.get(RelationKind.Friend)),
            new Happiness(0),
            new Personality(70, 60, 70, 80, 80),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            [ "Estudiante" ],
            false
        ));

        this._elements.push(new Concienced(
            "Susi",
            new Aspect(
                SexKind.Female, 
                OriginKind.European, 
                EyeColor.Brown, 
                HairColor.Brown, 
                HaircutStyle.StraightLong, 
                ComplexionKind.Thin, 
                SpecieKind.Human, 
                165, 
                14),
            new RelationSet()
                .append("Paco", RelationFactory.get(RelationKind.Enemy))
                .append("Goiko", RelationFactory.get(RelationKind.Best))
                .append("Mari", RelationFactory.get(RelationKind.Friend))
                .append("Sebas", RelationFactory.get(RelationKind.Friend)),
            new Happiness(0),
            new Personality(70, 60, 50, 60, 70),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            [ "Estudiante" ],
            false
        ));

        this._elements.push(new Alcoholic(
            "Mari",
            new Aspect(
                SexKind.Female, 
                OriginKind.European, 
                EyeColor.Green, 
                HairColor.Brown, 
                HaircutStyle.CurvyLong, 
                ComplexionKind.Fat, 
                SpecieKind.Human, 
                167, 
                14),
            new RelationSet()
                .append("Paco", RelationFactory.get(RelationKind.Enemy))
                .append("Goiko", RelationFactory.get(RelationKind.Friend))
                .append("Susi", RelationFactory.get(RelationKind.Friend))
                .append("Sebas", RelationFactory.get(RelationKind.Neutral)),
            new Happiness(0),
            new Personality(40, 50, 10, 40, 30),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            [ "Estudiante" ],
            true
        ));

        this._elements.push(new Alcoholic(
            "Sebas",
            new Aspect(
                SexKind.Male, 
                OriginKind.European, 
                EyeColor.Brown, 
                HairColor.Black, 
                HaircutStyle.Shaved, 
                ComplexionKind.Fat, 
                SpecieKind.Human, 
                180, 
                14),
            new RelationSet()
                .append("Paco", RelationFactory.get(RelationKind.Enemy))
                .append("Susi", RelationFactory.get(RelationKind.FuckFriend))
                .append("Mari", RelationFactory.get(RelationKind.Sexy))
                .append("Goiko", RelationFactory.get(RelationKind.Friend)),
            new Happiness(0),
            new Personality(30, 30, 80, 80, 70),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            [ "Estudiante" ],
            false
        ));

        this._elements.push(new Agent(
            "Eladio",
            new Aspect(
                SexKind.Male, 
                OriginKind.European, 
                EyeColor.Brown, 
                HairColor.Black, 
                HaircutStyle.Short, 
                ComplexionKind.Athletic, 
                SpecieKind.Human, 
                185, 
                38),
            new RelationSet()
                .append("Almudena", RelationFactory.get(RelationKind.Friend)),
            new Happiness(),
            new Personality(50, 50, 30, 50, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            [ "Policia" ],
            false
        ));

        this._elements.push(new Agent(
            "Almudena",
            new Aspect(
                SexKind.Female, 
                OriginKind.European, 
                EyeColor.Black, 
                HairColor.Black, 
                HaircutStyle.Short, 
                ComplexionKind.Thin, 
                SpecieKind.Human, 
                170, 
                33),
            new RelationSet()
                .append("Eladio", RelationFactory.get(RelationKind.Friend)),
            new Happiness(0),
            new Personality(50, 50, 60, 50, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            [ "Policia" ],
            false
        ));
    }

    get all(){
        return this._elements;
    }

    get(name: string): Agent | null{
        let filtered = this._elements.filter(x => x.Name === name);
        return filtered.length === 0 ? null : filtered[0];
    }
}