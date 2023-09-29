import { Agent } from "agents-flow";
import { Aspect, Likes, SexKind, OriginKind, EyeColor, HairColor, HaircutStyle, ComplexionKind, SpecieKind } from "npc-aspect";
import { RelationSet, RelationFactory, RelationKind, Familiar } from "npc-relations";
import { Happiness, Personality } from "npc-mind";

export class AgentRepository{
    private _elements: Agent[];

    constructor(){
        this._elements = [];

        this._elements.push(new Agent(
            "Anselmo",
            new Aspect(SexKind.Male, OriginKind.European, EyeColor.Brown, HairColor.White, HaircutStyle.Short, ComplexionKind.Skinny, 173, 92),
            new RelationSet()
                .append("Fructuoso", RelationFactory.get(RelationKind.Neutral))
                .append("Jacinta", RelationFactory.get(RelationKind.Friend))
                .append("Raquel", RelationFactory.get(RelationKind.FuckFriend))
                .append("Maria", RelationFactory.get(RelationKind.FuckFriend))
                .append("Antonio", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro", RelationFactory.get(RelationKind.Sexy)),
            new Happiness(0),
            new Personality(60, 40, 50, 50, 60),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            [ "Republicano", "Residente", "Fumador" ],
            false
        ));

        this._elements.push(new Agent(
            "Fructuoso",
            new Aspect(SexKind.Male, OriginKind.European, EyeColor.Black, HairColor.White, HaircutStyle.Short, ComplexionKind.Fat, 168, 92),
            new RelationSet()
                .append("Anselmo", RelationFactory.get(RelationKind.Neutral))
                .append("Jacinta", RelationFactory.get(RelationKind.Friend))
                .append("Raquel", RelationFactory.get(RelationKind.FuckFriend))
                .append("Maria", RelationFactory.get(RelationKind.FuckFriend))
                .append("Antonio", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro", RelationFactory.get(RelationKind.Sexy)),
            new Happiness(),
            new Personality(70, 60, 80, 70, 70),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            [ "Nacional", "Residente", "Impedido", "Salido" ],
            false
        ));

        this._elements.push(new Agent(
            "Jacinta",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Green, HairColor.White, HaircutStyle.StraightLong, ComplexionKind.Skinny, 158, 80),
            new RelationSet()
                .append("Fructuoso", RelationFactory.get(RelationKind.Friend))
                .append("Anselmo", RelationFactory.get(RelationKind.Friend))
                .append("Raquel", RelationFactory.get(RelationKind.Friend))
                .append("Maria", RelationFactory.get(RelationKind.Friend))
                .append("Antonio", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro", RelationFactory.get(RelationKind.Neutral)),
            new Happiness(),
            new Personality(90, 30, 20, 30, 90),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            [ "Residente", "Impedido" ],
            true
        ));

        this._elements.push(new Agent(
            "Raquel",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Brown, HairColor.Blond, HaircutStyle.Short, ComplexionKind.Fat, 178, 58),
            new RelationSet()
                .append("Fructuoso", RelationFactory.get(RelationKind.Friend))
                .append("Jacinta", RelationFactory.get(RelationKind.Friend))
                .append("Anselmo", RelationFactory.get(RelationKind.Friend))
                .append("Maria", RelationFactory.get(RelationKind.Friend))
                .append("Antonio", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro", RelationFactory.get(RelationKind.Friend)),
            new Happiness(70),
            new Personality(70, 70, 20, 50, 40),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            [ "Auxiliar" ],
            false
        ));

        this._elements.push(new Agent(
            "Maria",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Black, HairColor.Black, HaircutStyle.CurvyLong, ComplexionKind.Thin, 165, 45),
            new RelationSet()
                .append("Fructuoso", RelationFactory.get(RelationKind.Friend))
                .append("Jacinta", RelationFactory.get(RelationKind.Friend))
                .append("Raquel", RelationFactory.get(RelationKind.Friend))
                .append("Anselmo", RelationFactory.get(RelationKind.Friend))
                .append("Antonio", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro", RelationFactory.get(RelationKind.Friend)),
            new Happiness(30),
            new Personality(70, 90, 40, 70, 50),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            [ "Auxiliar" ],
            false
        ));

        this._elements.push(new Agent(
            "Antonio",
            new Aspect(SexKind.Male, OriginKind.European, EyeColor.Blue, HairColor.White, HaircutStyle.Bald, ComplexionKind.Skinny, 170, 82),
            new RelationSet()
                .append("Fructuoso", RelationFactory.get(RelationKind.Neutral))
                .append("Jacinta", RelationFactory.get(RelationKind.Neutral))
                .append("Raquel", RelationFactory.get(RelationKind.Neutral))
                .append("Maria", RelationFactory.get(RelationKind.Neutral))
                .append("Anselmo", RelationFactory.get(RelationKind.Neutral))
                .append("Socorro", RelationFactory.get(RelationKind.Friend, Familiar.SonOrDaughter)),
            new Happiness(),
            new Personality(40, 30, 20, 20, 20),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Female),
            [ "Residente", "Demente" ],
            false
        ));

        this._elements.push(new Agent(
            "Socorro",
            new Aspect(SexKind.Female, OriginKind.European, EyeColor.Blue, HairColor.Red, HaircutStyle.CurvyLong, ComplexionKind.Thin, 160, 55),
            new RelationSet()
                .append("Fructuoso", RelationFactory.get(RelationKind.Neutral))
                .append("Jacinta", RelationFactory.get(RelationKind.Neutral))
                .append("Raquel", RelationFactory.get(RelationKind.Friend))
                .append("Maria", RelationFactory.get(RelationKind.Friend))
                .append("Antonio", RelationFactory.get(RelationKind.Friend, Familiar.Parent))
                .append("Anselmo", RelationFactory.get(RelationKind.Neutral)),
            new Happiness(),
            new Personality(70, 50, 20, 70, 20),
            Likes.likesSpecieAndSex(SpecieKind.Human, SexKind.Male),
            [],
            false
        ));

        // NEW CHALLENGERS -----------------------------------------------

        this._elements.push(new Agent(
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
            [ /*"Republicano", "Residente", "Fumador"*/ ],
            false
        ));

        this._elements.push(new Agent(
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
            [ /*"Republicano", "Residente", "Fumador"*/ ],
            false
        ));

        this._elements.push(new Agent(
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
            [ /*"Republicano", "Residente", "Fumador"*/ ],
            false
        ));

        this._elements.push(new Agent(
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
            [ /*"Republicano", "Residente", "Fumador"*/ ],
            false
        ));

        this._elements.push(new Agent(
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
            [ /*"Republicano", "Residente", "Fumador"*/ ],
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