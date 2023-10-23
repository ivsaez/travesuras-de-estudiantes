import { 
    IInteraction, 
    Interaction, 
    Phrase, 
    RolesDescriptor, 
    Timing 
} from "agents-flow";
import { TruthTable, Sentence } from "first-order-logic";
import { SexKind } from "npc-aspect";
import { Effect, EffectComponent, EffectKind, EffectStrength } from "npc-emotional";
import { randomFromList, check } from "role-methods";
import { Alcoholic } from "../models/Alcoholic";
import { Clothed } from "../models/Clothed";
import { Lifed } from "../models/Lifed";

export class InteractionRepository{
    private _elements: IInteraction[];

    constructor(){
        this._elements = [];

        this._elements.push(new Interaction(
            "MirarEncapuchado",
            "Mirar al encapuchado",
            new RolesDescriptor("Mirador"),
            [
                new Phrase("Mirador")
                    .withAlternative(roles => "[Mirador] mira con una mezcla de dudas y temor al pobre hombre atado con una bolsa en la cabeza.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Mirador")).name === "Limbo" 
                && roles.get("Mirador").IsActive
                && Alcoholic.is(roles.get("Mirador"))
                && roles.get("Mirador").Name === "Mari"
                && roles.get("Mirador").Characteristics.is("Estudiante")
                && roles.get("Mirador").Aspect.sex === SexKind.Female,
                (roles, map) => {
                    map.move(roles.get("Mirador"), map.getLocation("Sotano"));
                    return TruthTable.empty;
                }
        ));

        this._elements.push(new Interaction(
            "Espera",
            "Espera con nervios",
            new RolesDescriptor("Esperador"),
            [
                new Phrase("Esperador")
                    .withAlternative(roles => randomFromList([
                        "[Esperador] se pregunta por qué no ha llegado aún todo el mundo.",
                        "Que aún falte gente inquieta a [Esperador]."
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Esperador")).name === "Sotano" 
                && map.getLocation("Sotano").agents.length < 5
                && roles.get("Esperador").IsActive
                && roles.get("Esperador").Characteristics.is("Estudiante"),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "LlegaSolo",
            "Alguien llega solo",
            new RolesDescriptor("Llegador", [ "Otro" ]),
            [
                new Phrase("Llegador")
                    .withAlternative(roles => "La puerta del sótano se abre. [Llegador] entra cargado con una mochila."),
                new Phrase("Llegador", "Otro")
                    .withAlternative(roles => "[Llegador] mira de reojo al hombre de la bolsa en la cabeza y luego a [Otro]."),
                new Phrase("Otro")
                    .withAlternative(roles => "[Otro] le devuelve la mirada.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Llegador")).name === "Limbo"
                && map.getUbication(roles.get("Otro")).name === "Sotano"
                && roles.get("Llegador").IsActive
                && roles.get("Llegador").Characteristics.is("Estudiante")
                && roles.get("Llegador").Name === "Sebas"
                && roles.get("Otro").IsActive
                && roles.get("Otro").Characteristics.is("Estudiante"),
            (roles, map) => {
                map.move(roles.get("Llegador"), map.getLocation("Sotano"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "LlegaPareja",
            "Llega la pareja",
            new RolesDescriptor("Llegador", [ "Llegadora" ]),
            [
                new Phrase("Llegador")
                    .withAlternative(roles => "[Llegador] y [Llegadora] abren la puerta del sótano y entran hablando entre murmullos."),
                new Phrase("Llegadora")
                    .withAlternative(roles => "[Llegadora] mira con cara de asco al hombre atado a la silla con la bolsa en la cabeza."),
                new Phrase("Llegador", "Llegadora")
                    .withAlternative(roles => "[Llegador] abraza a [Llegadora] por detrás y le da un beso en la mejilla. Luego mira nervioso a los demás.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => map.getUbication(roles.get("Llegador")).name === "Limbo"
                && roles.get("Llegador").IsActive
                && roles.get("Llegador").Aspect.sex === SexKind.Male
                && roles.get("Llegador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Llegadora")).name === "Limbo"
                && roles.get("Llegadora").IsActive
                && roles.get("Llegadora").Aspect.sex === SexKind.Female
                && roles.get("Llegadora").Characteristics.is("Estudiante")
                && map.getLocation("Sotano").agents.some(a => a.Name === "Mari")
                && postconditions.exists(Sentence.build("Pareja", roles.get("Llegador").Individual.name, roles.get("Llegadora").Individual.name, true)),
            (roles, map) => {
                map.move(roles.get("Llegador"), map.getLocation("Sotano"));
                map.move(roles.get("Llegadora"), map.getLocation("Sotano"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "SaludoHombres",
            "[Saludador] saluda [Saludado]",
            new RolesDescriptor("Saludador", [ "Saludado" ]),
            [
                new Phrase("Saludador", "Saludado")
                    .withAlternative(roles => 
                        roles.get("Saludador").Aspect.sex === SexKind.Male && roles.get("Saludado").Aspect.sex === SexKind.Male
                            ? "[Saludador] y [Saludado] se dan un abrazo golpeándose muy fuerte las espaldas."
                            : roles.get("Saludador").Aspect.sex === SexKind.Female && roles.get("Saludado").Aspect.sex === SexKind.Female
                                ? "[Saludador] y [Saludado] se dan un afectuoso abrazo."
                                : randomFromList([
                                    "[Saludador] se acerca a [Saludado] y se dan dos besos para saludarse.",
                                    "[Saludador] y [Saludado] se dan dos besos en la mejilla.",
                                    "[Saludador] le da dos besos a [Saludado]."
                                ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Saludador")).name === "Sotano"
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado"))
                && roles.get("Saludado").Characteristics.is("Estudiante")
                && roles.get("Saludador").Characteristics.is("Estudiante")
                && roles.get("Saludado").IsActive
                && roles.get("Saludador").IsActive
                && !postconditions.exists(Sentence.build("Pareja", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true))
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "DejaBotellas",
            "[Dejador] saca unas botellas de la mochila",
            new RolesDescriptor("Dejador", [ "Miradora" ]),
            [
                new Phrase("Dejador")
                    .withAlternative(roles => "[Dejador] se va a un rincón, abre la mochila y saca una botella de Xibeca, otra de Malibú y otra de Dyc."),
                new Phrase("Miradora")
                    .withAlternative(roles => "[Miradora] mira la combinación horrorizada.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Dejador")).name === "Sotano"
                && map.getUbication(roles.get("Miradora")).name === "Sotano"
                && roles.get("Dejador").IsActive
                && roles.get("Miradora").IsActive
                && roles.get("Miradora").Characteristics.is("Estudiante")
                && roles.get("Miradora").Aspect.sex === SexKind.Female
                && roles.get("Dejador").Name === "Sebas"
                && !postconditions.exists(Sentence.build("Botellas")),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Botellas"))
        ));

        this._elements.push(new Interaction(
            "EmbolsadoAyuda",
            "El hombre de la bolsa en la cabeza pide ayuda",
            new RolesDescriptor("Embolsado"),
            [
                new Phrase("Embolsado")
                    .withAlternative(roles => randomFromList([
                        "[Embolsado]: ¿Hay alguien ahí?",
                        "[Embolsado]: ¿Alguien puede oirme?",
                        "[Embolsado]: Que alguien me ayude por favor.",
                        "[Embolsado]: Que alguien me quite esto de la cabeza, me falta el aire."
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Embolsado").IsActive
                && map.getLocation("Sotano").agents.length >= 2
                && map.getLocation("Sotano").agents.length < 5
                && !postconditions.exists(Sentence.build("Desenmascarado", roles.get("Embolsado").Individual.name))
                && roles.get("Embolsado").Characteristics.is("Profesor"),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "PreguntaQueHacemos",
            "Pregunta qué hacer",
            new RolesDescriptor("Preguntador", [ "Preguntado" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(roles => randomFromList([
                        "[Preguntador]: Bueno, ¿y ahora qué hacemos?",
                        "[Preguntador]: ¿Qué se supone que hacemos ahora?",
                        "[Preguntador]: ¿Alguna idea de qué hacer con este?"
                    ])),
                new Phrase("Preguntado")
                    .withAlternative(roles => randomFromList([
                        "[Preguntado] se encoge de hombros.",
                        "[Preguntado] mira para el suelo y no responde nada."
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getLocation("Sotano").agents.length === 5
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntado").IsActive
                && roles.get("Preguntador").Aspect.sex === SexKind.Female
                && roles.get("Preguntado").Aspect.sex === SexKind.Female
                && roles.get("Preguntador").Characteristics.is("Estudiante")
                && roles.get("Preguntado").Characteristics.is("Estudiante")
                && !postconditions.exists(Sentence.build("Desenmascarado"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Preguntador").Individual.name, roles.get("Preguntado").Individual.name, true)),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "FlipaSituacion",
            "Flipa con la situación",
            new RolesDescriptor("Flipador"),
            [
                new Phrase("Flipador")
                    .withAlternative(roles => randomFromList([
                        "[Flipador]: Buah, no me puedo creer que tengamos a este pavo así.",
                        "[Flipador]: Estoy flipando, no me creo que estemos haciendo esto.",
                        "[Flipador]: ¿Estamos haciendo esto? Flipo. No me lo puedo creer."
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getLocation("Sotano").agents.length === 5
                && roles.get("Flipador").IsActive
                && roles.get("Flipador").Aspect.sex === SexKind.Male
                && roles.get("Flipador").Characteristics.is("Estudiante")
                && !postconditions.exists(Sentence.build("Desenmascarado")),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "PideSilencio",
            "Pedir hablar más bajo",
            new RolesDescriptor("Pedidor", ["Contestador"]),
            [
                new Phrase("Pedidor")
                    .withAlternative(roles => randomFromList([
                        "[Pedidor]: Hablad más bajo.",
                        "[Pedidor]: Pssssst. Cuidado al hablar.",
                        "[Pedidor]: Pssssst. No hagáis ruido."
                    ])),
                new Phrase("Contestador")
                    .withAlternative(roles => randomFromList([
                        "[Contestador]: Tranqui. No pasa nada.",
                        "[Contestador]: No te rayes. Da igual.",
                        "[Contestador]: No se entera de nada. No te preocupes."
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getLocation("Sotano").agents.length === 5
                && roles.get("Pedidor").IsActive
                && roles.get("Pedidor").Aspect.sex === SexKind.Female
                && roles.get("Pedidor").Characteristics.is("Estudiante")
                && roles.get("Contestador").IsActive
                && roles.get("Contestador").Aspect.sex === SexKind.Male
                && roles.get("Contestador").Characteristics.is("Estudiante")
                && !postconditions.exists(Sentence.build("Desenmascarado", "Paco"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Pedidor").Individual.name, roles.get("Contestador").Individual.name, true)),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "EmbolsadoSuplica",
            "El hombre de la bolsa en la cabeza suplica",
            new RolesDescriptor("Embolsado"),
            [
                new Phrase("Embolsado")
                    .withAlternative(roles => randomFromList([
                        "[Embolsado]: Por favor, no me hagan daño.",
                        "[Embolsado]: Lo suplico, no me hagan daño.",
                        "[Embolsado]: Piedad, por favor."
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Embolsado").IsActive
                && map.getLocation("Sotano").agents.length === 5
                && !postconditions.exists(Sentence.build("Desenmascarado", roles.get("Embolsado").Individual.name))
                && roles.get("Embolsado").Characteristics.is("Profesor"),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "QuitarBolsa",
            "[Quitador] quita la bolsa de la cabeza del hombre atado",
            new RolesDescriptor("Quitador", [ "Acojonado", "Bolser" ]),
            [
                new Phrase("Quitador")
                    .withAlternative(roles => "[Quitador]: ¡A tomar por culo! ¡Le quito ya la puta bolsa!"),
                new Phrase("Acojonado")
                    .withAlternative(roles => "[Acojonado]: ¿Pero qué coño haces? ¡Nos va a reconocer!"),
                new Phrase("Quitador", "Acojonado")
                    .withAlternative(roles => 
                        "[Quitador]: ¡A qué hemos venido joder! ¿Te vas a rajar ahora [Acojonado]?",
                        roles => new Effect("Acojonado", [ 
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) 
                        ]))
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getLocation("Sotano").agents.length === 5
                && roles.get("Quitador").IsActive
                && roles.get("Quitador").Characteristics.is("Estudiante")
                && roles.get("Quitador").Aspect.sex === SexKind.Male
                && roles.get("Acojonado").IsActive
                && roles.get("Acojonado").Characteristics.is("Estudiante")
                && roles.get("Acojonado").Aspect.sex === SexKind.Female
                && roles.get("Bolser").IsActive
                && roles.get("Bolser").Characteristics.is("Profesor")
                && postconditions.elements.filter(x => x.function.name === "Saludo").length >= 5
                && !postconditions.exists(Sentence.build("Desenmascarado", roles.get("Bolser").Individual.name)),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("Desenmascarado", roles.get("Bolser").Individual.name))
        ));

        this._elements.push(new Interaction(
            "ProfesorUbica",
            "El profesor mira a su alrededor y se ubica",
            new RolesDescriptor("Ubicado"),
            [
                new Phrase("Ubicado")
                    .withAlternative(roles => "[Ubicado]: ¿Dónde coño estoy?"),
                new Phrase("Ubicado")
                    .withAlternative(roles => "[Ubicado]: Hostia puta... así que habéis sido vosotros...",
                    roles => new Effect(null, [ 
                        EffectComponent.negative(EffectKind.Friend, EffectStrength.Low),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) 
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                roles.get("Ubicado").IsActive
                && postconditions.exists(Sentence.build("Desenmascarado", roles.get("Ubicado").Individual.name))
                && roles.get("Ubicado").Characteristics.is("Profesor"),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("Ubicado"))
        ));

        this._elements.push(new Interaction(
            "FantasearHostia",
            "[Hostiador] fantasea con golpear al profesor",
            new RolesDescriptor("Hostiador"),
            [
                new Phrase("Hostiador")
                    .withAlternative(roles => randomFromList([
                        "[Hostiador]: Ahora le podría dar una buena hostia a este tío.",
                        "[Hostiador]: Podríamos darle una paliza sin problema.",
                        "[Hostiador]: Como me gustaría soltarle una buena hostia.",
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                roles.get("Hostiador").IsActive
                && postconditions.exists(Sentence.build("Ubicado"))
                && roles.get("Hostiador").Characteristics.is("Estudiante")
                && roles.get("Hostiador").Aspect.sex === SexKind.Male,
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "ReconocimientoAlumno",
            "[Reconocedor] reconoce a [Reconocido]",
            new RolesDescriptor("Reconocedor", [ "Reconocido" ]),
            [
                new Phrase("Reconocedor", "Reconocido")
                    .withAlternative(roles => {
                        if(roles.get("Reconocido").Name === "Mari")
                            return "[Reconocedor]: Y tú Maria, ¿qué haces enredada con estos? Acabas de tirar por la borda tu futuro.";

                        if(roles.get("Reconocido").Name === "Sebas")
                            return "[Reconocedor]: Mira quien tenemos aquí, Sebastián Requena. No me sorprende en absoluto que estés aquí sabiendo las pocas luces que tienes.";

                        if(roles.get("Reconocido").Name === "Goiko")
                            return "[Reconocedor]: Ignacio Goikoechea, no podías faltar en una cafrada como ésta. Viendo lo que te rodea no me extrañaría que fuera idea tuya.";

                        if(roles.get("Reconocido").Name === "Susi")
                            return "[Reconocedor]: Mira quien hay aquí, Susana Sarabia. Supongo que arrastrándote detrás de Goikoechea, no sabes hacer otra cosa.";
                    },
                    roles => new Effect("Reconocido", [ 
                        EffectComponent.negative(EffectKind.Friend, EffectStrength.Low),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) 
                    ])),
                new Phrase("Reconocido")
                    .withAlternative(roles => {
                        if(roles.get("Reconocido").Name === "Mari")
                            return "[Reconocido]: No sé de qué futuro me hablas.";

                        if(roles.get("Reconocido").Name === "Sebas")
                            return "[Reconocido]: ¡Voy a callarte esa puta bocaza!";

                        if(roles.get("Reconocido").Name === "Goiko")
                            return "[Reconocido]: La única idea que tengo es darte una hostia, carcamal.";

                        if(roles.get("Reconocido").Name === "Susi")
                            return "[Reconocido]: Que puto asco me das.";
                    }),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                postconditions.exists(Sentence.build("Ubicado"))
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Reconocedor").Individual.name, roles.get("Reconocido").Individual.name, true))
                && roles.get("Reconocedor").IsActive
                && roles.get("Reconocedor").Characteristics.is("Profesor")
                && roles.get("Reconocido").IsActive
                && roles.get("Reconocido").Characteristics.is("Estudiante"),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("Saludo", roles.get("Reconocedor").Individual.name, roles.get("Reconocido").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "SebasCopa",
            "[Servidor] le sirve una copa a [Servido]",
            new RolesDescriptor("Servidor", [ "Servido" ]),
            [
                new Phrase("Servidor", "Servido")
                    .withAlternative(roles => {
                        const bebidas = [ "Xibeca", "Malibú", "Dyc" ]; 
                        const bebida1 = randomFromList(bebidas);
                        const bebida2 = randomFromList(bebidas.filter(x => x !== bebida1));
                        return `[Servidor] prepara una copa mezclando ${bebida1} y ${bebida2} y se la sirve a [Servido].`;
                    }),
                new Phrase("Servido")
                    .withAlternative(
                        roles => "[Servido] acepta el brebaje.", 
                        roles => Effect.null(), 
                        roles => {
                            Alcoholic.to(roles.get("Servido")).glass.fill();
                            return Sentence.build("Nothing");
                        })
                    .withAlternative(roles => "[Servido] declina el ofrecimiento."),
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                postconditions.exists(Sentence.build("Ubicado"))
                && roles.get("Servidor").IsActive
                && roles.get("Servidor").Characteristics.is("Estudiante")
                && roles.get("Servidor").Name === "Sebas"
                && roles.get("Servido").IsActive
                && roles.get("Servido").Characteristics.is("Estudiante")
                && Alcoholic.is(roles.get("Servido"))
                && Alcoholic.to(roles.get("Servido")).glass.isEmpty()
                && postconditions.exists(Sentence.build("Botellas"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Servidor").Individual.name, roles.get("Servido").Individual.name, true)),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "SebasTajado",
            "[Servidor] se sirve una copa",
            new RolesDescriptor("Servidor"),
            [
                new Phrase("Servidor")
                    .withAlternative(roles => "[Servidor] se sirve una copa mezclando Xibeca, Dyc y Malibú.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                postconditions.exists(Sentence.build("Ubicado"))
                && roles.get("Servidor").IsActive
                && roles.get("Servidor").Characteristics.is("Estudiante")
                && roles.get("Servidor").Name === "Sebas"
                && Alcoholic.is(roles.get("Servidor"))
                && Alcoholic.to(roles.get("Servidor")).glass.isEmpty()
                && postconditions.exists(Sentence.build("Botellas")),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "BeberTrago",
            "[Bebedor] bebe un trago de su vaso",
            new RolesDescriptor("Bebedor"),
            [
                new Phrase("Bebedor")
                    .withAlternative(roles => {
                        const drinked = Alcoholic.to(roles.get("Bebedor")).glass.drink();
                        if(drinked)
                            Alcoholic.to(roles.get("Bebedor")).alcoholism.increaseLevel();

                        const emptied = Alcoholic.to(roles.get("Bebedor")).glass.isEmpty();
                        return drinked
                            ? emptied
                                ? "[Bebedor] apura de un trago lo que queda en el vaso."
                                : "[Bebedor] se bebe un trago de su vaso."
                            : "[Bebedor] intenta beber pero su vaso está vacío.";
                    }),
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                postconditions.exists(Sentence.build("Ubicado"))
                && roles.get("Bebedor").IsActive
                && roles.get("Bebedor").Characteristics.is("Estudiante")
                && Alcoholic.is(roles.get("Bebedor"))
                && !Alcoholic.to(roles.get("Bebedor")).glass.isEmpty(),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "InsultoProfesor",
            "[Insultador] insulta al profesor",
            new RolesDescriptor("Insultador", [ "Insultado" ]),
            [
                new Phrase("Insultador")
                    .withAlternative(roles => roles.get("Insultador").Aspect.sex === SexKind.Male
                        ? randomFromList([
                            "[Insultador]: Viejo hijo de puta.",
                            "[Insultador]: Me cago en tu cara, carcamal.",
                            "[Insultador]: Te voy a matar y me voy a mear en tu tumba.",
                            "[Insultador]: Paco, me cago en tu reputísima madre.",
                            "[Insultador]: Cornudo de mierda.",
                        ])
                        : randomFromList([
                            "[Insultador]: Seguro que eres un pichafloja.",
                            "[Insultador]: Que puto asco das viejales.",
                            "[Insultador]: No eres más que un puto viejo verde salido.",
                            "[Insultador]: Baboso de mierda.",
                            "[Insultador]: A los cerdos como tu os tendrían que cortar la polla.",
                        ]),
                    roles => new Effect("Insultado", [ 
                        EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                    ])),
                new Phrase("Insultado")
                    .withAlternative(roles => randomFromList([
                        "[Insultado]: No insulta el que quiere, sino el que puede.",
                        "[Insultado]: Aprende a insultar.",
                        "[Insultado]: ¿Eso es lo mejor que se te ocurre?",
                        "[Insultado]: Seguro que llevas un buen rato pensando para elaborar una frase tan complicada.",
                        "[Insultado]: Voy a intentar ponerme a tu nivel. Rebota rebota y en tu culo explota.",
                        "[Insultado]: Necesitas urgentemente un diccionario.",
                    ])),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                postconditions.exists(Sentence.build("Ubicado"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Insultador").Individual.name, roles.get("Insultado").Individual.name, true))
                && roles.get("Insultado").IsActive
                && roles.get("Insultado").Characteristics.is("Profesor")
                && roles.get("Insultador").IsActive
                && roles.get("Insultador").Characteristics.is("Estudiante"),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "AmenazaAlumno",
            "[Amenazador] amenaza a [Amenazado]",
            new RolesDescriptor("Amenazador", [ "Amenazado" ]),
            [
                new Phrase("Amenazador", "Amenazado")
                    .withAlternative(roles => {
                        if(roles.get("Amenazado").Name === "Mari")
                            return "[Amenazador]: Después de esto se te acabó todo Maria. Irás al reformatorio. Olvídate de estudios o de llegar a nada en la vida.";

                        if(roles.get("Amenazado").Name === "Sebas")
                            return "[Amenazador]: Sebastián, siempre has sido el más tonto de mis alumnos. Solo te faltaba esto para colocarte la corona.";

                        if(roles.get("Amenazado").Name === "Goiko")
                            return "[Amenazador]: Ignacio eres la misma chusma que tu padre, y terminarás igual que él. En la cárcel.";

                        if(roles.get("Amenazado").Name === "Susi")
                            return "[Amenazador]: Susana, para lo único que tienes talento es para ser la furcia de algún chulo. Como tu madre y como tu hermana.";
                    },
                    roles => new Effect("Amenazado", [ 
                        EffectComponent.negative(EffectKind.Friend, EffectStrength.Low),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) 
                    ])),
                new Phrase("Amenazado")
                    .withAlternative(roles => {
                        if(roles.get("Amenazado").Name === "Mari")
                            return "[Amenazado]: Con la edad que tenemos somos inimputables.";

                        if(roles.get("Amenazado").Name === "Sebas")
                            return "[Amenazado]: Seré todo lo tonto que quieras, pero el que está encerrado y atado en una silla eres tú.";

                        if(roles.get("Amenazado").Name === "Goiko")
                            return "[Amenazado]: Mi padre era otro viejo hijo de puta igual que tú. Te pareces más a él que yo.";

                        if(roles.get("Amenazado").Name === "Susi")
                            return "[Amenazado]: Probablemente mi madre ande con chulos. Con quien seguro que no andará nunca es con un perdedo como tú.";
                    }),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                postconditions.exists(Sentence.build("Ubicado"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Amenazador").Individual.name, roles.get("Amenazado").Individual.name, true))
                && !postconditions.exists(Sentence.build("Amenaza", roles.get("Amenazador").Individual.name, roles.get("Amenazado").Individual.name, true))
                && roles.get("Amenazador").IsActive
                && roles.get("Amenazador").Characteristics.is("Profesor")
                && roles.get("Amenazado").IsActive
                && roles.get("Amenazado").Characteristics.is("Estudiante")
                && !postconditions.exists(Sentence.build("PrimeraHostia")),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("Amenaza", roles.get("Amenazador").Individual.name, roles.get("Amenazado").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "ManipulaAlumno",
            "[Manipulador] manipula a [Manipulado]",
            new RolesDescriptor("Manipulador", [ "Manipulado", "Convencedor" ]),
            [
                new Phrase("Manipulador", "Manipulado")
                    .withAlternative(roles => {
                        if(roles.get("Manipulado").Name === "Mari")
                            return "[Manipulador]: Si no fuera por mi tus padres ya te habrían forzado a dejar de estudiar Maria. ¿Así es como me lo pagas?";

                        if(roles.get("Manipulado").Name === "Sebas")
                            return "[Manipulador]: Y pensar que te perdoné una expulsión y te evité otra paliza de tu padre. Tendría que haberte jodido Sebastián, esa es la única lección que entendéis los idiotas.";

                        if(roles.get("Manipulado").Name === "Goiko")
                            return "[Manipulador]: Venga Ignacio, hazles un favor a tus amigos y ordénales que paren esta tontería. No les jodas la vida. Tú eres el auténtico responsable de sus destinos.";

                        if(roles.get("Manipulado").Name === "Susi")
                            return "[Manipulador]: Venga Susana, llévate a Ignacio fuera y hazle lo que sea que le hagas para convencerle de que abandone esta idea estúpida. Aún puedes evitar que os jodáis la vida a lo tonto.";
                    }),
                new Phrase("Manipulado")
                    .withAlternative(roles => {
                        if(roles.get("Manipulado").Name === "Mari")
                            return "[Manipulado]: Yo te agradecí lo de mis padres, pero es que...";

                        if(roles.get("Manipulado").Name === "Sebas")
                            return "[Manipulado]: Bueno vale, me ahorré una paliza pero...";

                        if(roles.get("Manipulado").Name === "Goiko")
                            return "[Manipulado]: Esto no es sólo cosa mia joder. ¿Verdad?";

                        if(roles.get("Manipulado").Name === "Susi")
                            return "[Manipulado]: Esto va a salir bien, sino Goiko no lo haría...";
                    }),
                new Phrase("Convencedor", "Manipulado")
                    .withAlternative(roles => {
                        if(roles.get("Manipulado").Name === "Mari")
                            return "[Convencedor]: No dudes [Manipulado]. Recuerda que te obligó a espiar a tus compañeros y a contarle nuestras miserias. Te utilizó.";

                        if(roles.get("Manipulado").Name === "Sebas")
                            return "[Convencedor]: Por una paliza que te ahorró te provocó otras diez. No escuches a este cabronazo [Manipulado].";

                        if(roles.get("Manipulado").Name === "Goiko")
                            return "[Convencedor]: Siempre ha querido destruirte porque tiene envidia de ti [Manipulado]. Tienes todo lo que él nunca tendrá.";

                        if(roles.get("Manipulado").Name === "Susi")
                            return "[Convencedor]: Te acusa de zorra pero fue él el que te frotó el paquete en el viaje de fin de curso. Es un puto cerdo [Manipulado].";
                    },
                    roles => new Effect("Manipulado", [ 
                        EffectComponent.positive(EffectKind.Friend, EffectStrength.Medium),
                        EffectComponent.positive(EffectKind.Happiness, EffectStrength.Low) 
                    ])),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                postconditions.exists(Sentence.build("Ubicado"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Manipulador").Individual.name, roles.get("Manipulado").Individual.name, true))
                && !postconditions.exists(Sentence.build("Manipula", roles.get("Manipulador").Individual.name, roles.get("Manipulado").Individual.name, true))
                && roles.get("Manipulador").IsActive
                && roles.get("Manipulador").Characteristics.is("Profesor")
                && roles.get("Manipulado").IsActive
                && roles.get("Manipulado").Characteristics.is("Estudiante")
                && roles.get("Convencedor").IsActive
                && roles.get("Convencedor").Characteristics.is("Estudiante")
                && !postconditions.exists(Sentence.build("PrimeraHostia")),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("Manipula", roles.get("Manipulador").Individual.name, roles.get("Manipulado").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "PrimeraHostia",
            "[Hostiador] le suelta una hotia a [Hostiado]",
            new RolesDescriptor("Hostiador", [ "Hostiado" ]),
            [
                new Phrase("Hostiador")
                    .withAlternative(roles => "[Hostiador]: A tomar por culo, ¡te reviento!"),
                new Phrase("Hostiador", "Hostiado")
                    .withAlternative(roles => "[Hostiador] le da un sonoro puñetazo en el estómago a [Hostiado].",
                    roles => new Effect("Hostiado", [
                        EffectComponent.negative(EffectKind.Friend, EffectStrength.Medium),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium)
                    ])),
                new Phrase("Hostiado")
                    .withAlternative(roles => "[Hostiado]: ¿Pero qué?...¡Aaargh!"),
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                //postconditions.elements.filter(x => x.function.name === "Manipula").length >= 4
                //&& postconditions.elements.filter(x => x.function.name === "Amenaza").length >= 4
                roles.get("Hostiador").IsActive
                && Alcoholic.is(roles.get("Hostiador"))
                && Alcoholic.to(roles.get("Hostiador")).alcoholism.isMedium
                && roles.get("Hostiador").Aspect.sex === SexKind.Male
                && roles.get("Hostiador").Characteristics.is("Estudiante")
                && roles.get("Hostiado").IsActive
                && Lifed.is(roles.get("Hostiado"))
                && roles.get("Hostiado").Characteristics.is("Profesor")
                && !postconditions.exists(Sentence.build("PrimeraHostia")),
                (roles, map) => {
                    Lifed.to(roles.get("Hostiado")).hitSoft();
                    return new TruthTable()
                        .with(Sentence.build("PrimeraHostia"));
                }
        ));

        this._elements.push(new Interaction(
            "DesnudarArriba",
            "[Desnudador] propone desnudar a [Victima]",
            new RolesDescriptor("Desnudador", [ "Victima", "Complice" ]),
            [
                new Phrase("Desnudador")
                    .withAlternative(roles => "[Desnudador]: Se me ocurre algo. ¡Vamos a desnudar a este capullo!"),
                new Phrase("Complice", "Desnudador")
                    .withAlternative(roles => "[Complice]: No me parece buena idea.")
                    .withAlternative(
                        roles => "[Complice]: ¡Estás muy loco [Desnudador]! ¡Hagámoslo!",
                        roles => Effect.null(),
                        roles => {
                            Clothed.to(roles.get("Victima")).clothing.removeTop();
                            return Sentence.build("DesnudoArriba", roles.get("Victima").Individual.name);
                        }),
                new Phrase("Desnudador", "Complice")
                    .withAlternative(roles => Clothed.to(roles.get("Victima")).clothing.topNaked
                        ? "[Desnudador] y [Complice] arrancan la camisa de [Victima]."
                        : "[Desnudador] y [Complice] se miran con dudas."),
                new Phrase("Victima")
                    .withAlternative(roles => Clothed.to(roles.get("Victima")).clothing.topNaked
                        ? "[Victima]: ¡Qué hacéis! ¡Estáis mal de la puta cabeza!"
                        : "[Victima]: Ni se os ocurra tocarme."),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                roles.get("Desnudador").IsActive
                && Alcoholic.is(roles.get("Desnudador"))
                && Alcoholic.to(roles.get("Desnudador")).alcoholism.isMedium
                && roles.get("Desnudador").Aspect.sex === SexKind.Male
                && roles.get("Desnudador").Characteristics.is("Estudiante")
                && roles.get("Complice").IsActive
                && Alcoholic.is(roles.get("Complice"))
                && Alcoholic.to(roles.get("Complice")).alcoholism.isMedium
                && roles.get("Complice").Characteristics.is("Estudiante")
                && roles.get("Victima").IsActive
                && Clothed.is(roles.get("Victima"))
                && !Clothed.to(roles.get("Victima")).clothing.topNaked
                && roles.get("Victima").Characteristics.is("Profesor")
                && !postconditions.exists(Sentence.build("DesnudoArriba", roles.get("Victima").Individual.name)),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("DesnudoArriba", roles.get("Victima").Individual.name))
        ));

        /*
        this._elements.push(new Interaction(
            "IrBalcon",
            "[Desplazado] sale al balcón",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => "[Desplazado] sale al balcón.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                map.getLocation("Terraza").agents.length === 0
                && roles.get("Desplazado").IsActive
                && roles.get("Desplazado").Happiness.isUnhappy
                && postconditions.exists(Sentence.build("Balcon"))
                && roles.get("Desplazado").Characteristics.is("Auxiliar")
                && map.getUbication(roles.get("Desplazado")).isConnected(map.getLocation("Terraza")),
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Terraza"));
                return TruthTable.empty;
            },
        ));


        this._elements.push(new Interaction(
            "VolverBalcon",
            "[Desplazado] vuelve del balcón",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => "[Desplazado] vuelve del balcón.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Desplazado")).name === "Terraza"
                && roles.get("Desplazado").IsActive
                && roles.get("Desplazado").Characteristics.is("Auxiliar")
                && !roles.get("Desplazado").Happiness.isUnhappy
                && map.getUbication(roles.get("Desplazado")).isConnected(map.getLocation("Salon")),
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Salon"));
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "CambiarCanal",
            "Pedir a [Cambiador] que cambie de canal la tele",
            new RolesDescriptor("Pedidor", [ "Cambiador" ]),
            [
                new Phrase("Pedidor")
                    .withAlternative(roles => "[Pedidor]: Nena, ¿por qué no cambias la tele a otra cosa?"),
                new Phrase("Cambiador")
                    .withAlternative(roles => "[Cambiador]: Como usted mande reina."),
                new Phrase("Pedidor")
                    .withAlternative(roles => "En la tele dan \"Estudio estadio\".")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Pedidor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Pedidor"), roles.get("Cambiador"))
                && roles.get("Cambiador").Characteristics.is("Auxiliar")
                && roles.get("Pedidor").Name === "Jacinta"
                && roles.get("Cambiador").IsActive
                && roles.get("Pedidor").IsActive
                && postconditions.exists(Sentence.build("TeleCorazon"))
                && !postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Pedidor").Individual.name, roles.get("Cambiador").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("TeleDeportes"))
        ));

        this._elements.push(new Interaction(
            "ComentarioDeporte",
            "[Comentador] hace un comentario sobre programa de deporte",
            new RolesDescriptor("Comentador"),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele aparece una notícia sobre ${randomFromList([ 
                        "Usain Bolt", 
                        "Cristiano Ronaldo", 
                        "Radamel Falcao", 
                        "Edinson Cavani",
                        "Iker Casillas",
                        "Sergio Ramos",
                        "Gerard Piqué",
                        "Manuel Neuer",
                        "Didier Drogba"
                    ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => roles.get("Comentador").Aspect.sex === SexKind.Male
                        ? randomFromList([
                            "[Comentador]: Menudo paquete. Los deportistas de hoy día van todos drogados.",
                            "[Comentador]: Un inútil. A hacer la vendimia lo ponía yo a ver cuanto duraba.",
                            "[Comentador]: Si no fuera por el Eufemiano Fuentes a este no lo conocen ni en su casa.",
                            "[Comentador]: Va éste más depilado que mi señora esposa que en paz descanse."
                        ])
                        : randomFromList([
                            "[Comentador]: Las piernas de este tio deberían estar prohibidas.",
                            "[Comentador]: No me importaría tener que untar aceite en esos muslos.",
                            "[Comentador]: Quién agarrara a uno de estos, me solucionaba la vida.",
                            "[Comentador]: Uno como ese me tengo que cazar yo, y a vivir como una reina."
                        ])),
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").IsHuman === false
                && roles.get("Comentador").IsActive
                && (roles.get("Comentador").Characteristics.is("Auxiliar") || roles.get("Comentador").Characteristics.is("Residente"))
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Comentador").Individual.name))
                && postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "CambiarCanal2",
            "Pedir a [Cambiador] que cambie de canal la tele",
            new RolesDescriptor("Pedidor", [ "Cambiador" ]),
            [
                new Phrase("Pedidor")
                    .withAlternative(roles => "[Pedidor]: Nena, esto me aburre. Pon otra cosa anda."),
                new Phrase("Cambiador")
                    .withAlternative(roles => "[Cambiador]: Como usted prefiera doña Jacinta."),
                new Phrase("Pedidor")
                    .withAlternative(roles => "En la tele ahora dan el telediario.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Pedidor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Pedidor"), roles.get("Cambiador"))
                && roles.get("Cambiador").Characteristics.is("Auxiliar")
                && roles.get("Pedidor").Name === "Jacinta"
                && roles.get("Cambiador").IsActive
                && roles.get("Pedidor").IsActive
                && postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Pedidor").Individual.name, roles.get("Cambiador").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("TelePolitica"))
        ));



        this._elements.push(new Interaction(
            "IrLavabo",
            "[Meador] pide a [Portador] que le ayude a ir al lavabo",
            new RolesDescriptor("Meador", [ "Portador" ]),
            [
                new Phrase("Meador", "Portador")
                    .withAlternative(roles => "[Meador]: Perdona [Portador], creo que tengo una urgencia. ¿Podrías ayudarme a ir al lavabo?"),
                new Phrase("Portador", "Meador")
                    .withAlternative(roles => "[Portador]: Faltaría más don [Meador], vamos ahora mismo."),
                new Phrase("Meador", "Portador")
                    .withAlternative(roles => "[Meador] se mete en el lavabo con la ayuda de [Portador].")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Meador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Meador"), roles.get("Portador"))
                && roles.get("Portador").Characteristics.is("Auxiliar")
                && roles.get("Meador").Characteristics.is("Residente")
                && !roles.get("Meador").Characteristics.is("Demente")
                && roles.get("Meador").Characteristics.is("Impedido")
                && roles.get("Meador").Aspect.sex === SexKind.Male
                && roles.get("Portador").IsActive
                && roles.get("Meador").IsActive
                && map.getLocation("Lavabo").agents.length === 0
                && postconditions.exists(Sentence.build("Lavabo"))
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Meador").Individual.name))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Meador").Individual.name, roles.get("Portador").Individual.name, true)),
            (roles, map) => {
                map.move(roles.get("Meador"), map.getLocation("Lavabo"));
                map.move(roles.get("Portador"), map.getLocation("Lavabo"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "VerPechuga",
            "[Salido] pide a [Mostrador] que le enseñe pechuga",
            new RolesDescriptor("Salido", [ "Mostrador" ]),
            [
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Oye [Mostrador] bonita, se que es feo que lo pida pero, ¿podrías enseñarme un poco de pechuga ahora que no nos ve nadie?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Siempre estamos igual don [Salido]..."),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Soy un hombre mayor encerrado, solo Dios sabe lo que me queda en este mundo. ¿Qué gusto me puedo dar yo a estas alturas?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Bueno bueno, a ver que se puede hacer. ¿Tiene usted por ahí 20 eurillos?"),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(
                        roles => "[Salido] se saca un billete de 20 de la camisa y se lo da a [Mostrador] que lo guarda rápidamente en su bolsillo.",
                        roles => new Effect("Mostrador", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.High) ])
                    ),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(
                        roles => "[Mostrador] se desabrocha la bata y la blusa, y enseña durante unos segundos el sostén a [Salido]. Al poco se abrocha todo de nuevo.",
                        roles => new Effect("Salido", [ 
                            EffectComponent.positive(EffectKind.Sex, EffectStrength.High), 
                            EffectComponent.positive(EffectKind.Happiness, EffectStrength.High) 
                        ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salido")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Salido"), roles.get("Mostrador"))
                && roles.get("Mostrador").Characteristics.is("Auxiliar")
                && roles.get("Salido").Characteristics.is("Residente")
                && !roles.get("Salido").Characteristics.is("Demente")
                && roles.get("Salido").Characteristics.is("Impedido")
                && roles.get("Salido").Aspect.sex === SexKind.Male
                && roles.get("Mostrador").IsActive
                && roles.get("Salido").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Salido").Individual.name))
                && !postconditions.exists(Sentence.build("Pobre", roles.get("Salido").Individual.name)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Pobre", roles.get("Salido").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "VerPechugaFallido",
            "[Salido] pide a [Mostrador] que le enseñe pechuga",
            new RolesDescriptor("Salido", [ "Mostrador" ]),
            [
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Oye [Mostrador] bonita, se que es feo que lo pida pero, ¿podrías enseñarme un poco de pechuga ahora que no nos ve nadie?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Siempre estamos igual don [Salido]..."),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Soy un hombre mayor encerrado, solo Dios sabe lo que me queda en este mundo. ¿Qué gusto me puedo dar yo a estas alturas?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(roles => "[Mostrador]: Bueno bueno, a ver que se puede hacer. ¿Tiene usted por ahí 20 eurillos?"),
                new Phrase("Salido", "Mostrador")
                    .withAlternative(roles => "[Salido]: Es que no me queda ya nada para este mes. ¿Podrías hacerle el gusto a este pobre viejo?"),
                new Phrase("Mostrador", "Salido")
                    .withAlternative(
                        roles => "[Mostrador]: Me temo que no don [Salido]. Habrá que esperar a que su familia le de su próximo aguinaldo.",
                        roles => new Effect("Salido", [ 
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium) 
                        ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salido")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Salido"), roles.get("Mostrador"))
                && roles.get("Mostrador").Characteristics.is("Auxiliar")
                && roles.get("Salido").Characteristics.is("Residente")
                && !roles.get("Salido").Characteristics.is("Demente")
                && roles.get("Salido").Characteristics.is("Impedido")
                && roles.get("Salido").Aspect.sex === SexKind.Male
                && roles.get("Mostrador").IsActive
                && roles.get("Salido").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Salido").Individual.name))
                && postconditions.exists(Sentence.build("Pobre", roles.get("Salido").Individual.name)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "Cagar",
            "[Caganer] caga",
            new RolesDescriptor("Caganer", [ "Otro" ]),
            [
                new Phrase("Caganer")
                    .withAlternative(roles => "[Caganer] hace de vientre entre estridentes flatulencias."),
                new Phrase("Caganer", "Otro")
                    .withAlternative(
                        roles => "[Caganer]: ¡Se me esta resistiendo el condenado!",
                        roles => new Effect("Otro", [ EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) ])
                    ),
                new Phrase("Otro", "Caganer")
                    .withAlternative(roles => "[Otro]: Hay que comer más fibra don [Caganer].")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Caganer")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Caganer"), roles.get("Otro"))
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && roles.get("Caganer").Characteristics.is("Residente")
                && !roles.get("Caganer").Characteristics.is("Demente")
                && roles.get("Caganer").Characteristics.is("Impedido")
                && roles.get("Caganer").Aspect.sex === SexKind.Male
                && roles.get("Otro").IsActive
                && roles.get("Caganer").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Caganer").Individual.name))
                && !postconditions.exists(Sentence.build("Cagado", roles.get("Caganer").Individual.name)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Cagado", roles.get("Caganer").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "VolverLavabo",
            "[Meador] y [Portador] vuelven del lavabo",
            new RolesDescriptor("Meador", [ "Portador" ]),
            [
                new Phrase("Meador", "Portador")
                    .withAlternative(roles => "[Meador] y [Portador] vuelven del lavabo.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Meador")).name === "Lavabo"
                && map.areInTheSameLocation(roles.get("Meador"), roles.get("Portador"))
                && roles.get("Portador").Characteristics.is("Auxiliar")
                && roles.get("Meador").Characteristics.is("Residente")
                && !roles.get("Meador").Characteristics.is("Demente")
                && roles.get("Meador").Characteristics.is("Impedido")
                && roles.get("Meador").Aspect.sex === SexKind.Male
                && roles.get("Portador").IsActive
                && roles.get("Meador").IsActive
                && postconditions.exists(Sentence.build("Lavabo"))
                && map.getLocation("Lavabo").agents.length === 2
                && postconditions.exists(Sentence.build("Pobre", roles.get("Meador").Individual.name)),
            (roles, map) => {
                map.move(roles.get("Meador"), map.getLocation("Salon"));
                map.move(roles.get("Portador"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "IrBalconResidente",
            "[Salidor] sale al balcón",
            new RolesDescriptor("Salidor"),
            [
                new Phrase("Salidor")
                    .withAlternative(roles => "[Salidor] se levanta y se va andando pesadamente al balcón.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salidor")).name === "Salon"
                && roles.get("Salidor").Characteristics.is("Residente")
                && roles.get("Salidor").Characteristics.is("Fumador")
                && postconditions.exists(Sentence.build("Balcon"))
                && roles.get("Salidor").IsActive
                && map.getLocation("Terraza").agents.length === 1
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Salidor").Individual.name))
                && !postconditions.exists(Sentence.build("Pobre", roles.get("Salidor").Individual.name)),
            (roles, map) => {
                map.move(roles.get("Salidor"), map.getLocation("Terraza"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "FumarEstrangis",
            "[Fumador] pide a [Otro] que le deje fumar",
            new RolesDescriptor("Fumador", [ "Otro" ]),
            [
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: Oye [Otro] bonita, se que no debería pero, ¿podrías dejarme darle una caladita a uno de esos cigarros?"),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: A su edad don [Fumador]..."),
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: ¿Qué otro gusto me puedo dar ya a estas alturas?. Una caladita no me va a matar mujer."),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: Bueno bueno, piense que el tabaco va muy caro hoy en día. ¿Tiene usted por ahí 5 eurillos?"),
                new Phrase("Fumador", "Otro")
                    .withAlternative(
                        roles => "[Fumador] saca un billete de 5 del bolsillo y se lo da a [Otro] que lo mete cuidadosamente en un bolsillo de la bata.",
                        roles => new Effect("Otro", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.Medium) ])
                    ),
                new Phrase("Otro", "Fumador")
                    .withAlternative(
                        roles => "[Otro] le acerca un pitillo encendido a [Fumador], que aspira como si le fuera la vida en ello. Después tose grotescamente hasta casi la arcada.",
                        roles => new Effect("Fumador", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.High) ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Fumador")).name === "Terraza"
                && map.areInTheSameLocation(roles.get("Fumador"), roles.get("Otro"))
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && roles.get("Fumador").Characteristics.is("Residente")
                && roles.get("Fumador").Characteristics.is("Fumador")
                && roles.get("Otro").IsActive
                && roles.get("Fumador").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Fumador").Individual.name))
                && !postconditions.exists(Sentence.build("Pobre", roles.get("Fumador").Individual.name)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Pobre", roles.get("Fumador").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "FumarEstrangisFallido",
            "[Fumador] pide a [Otro] que le deje fumar",
            new RolesDescriptor("Fumador", [ "Otro" ]),
            [
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: Oye [Otro] bonita, se que no debería pero, ¿podrías dejarme darle una caladita a uno de esos cigarros?"),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: A su edad don [Fumador]..."),
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: ¿Qué otro gusto me puedo dar ya a estas alturas?. Una caladita no me va a matar mujer."),
                new Phrase("Otro", "Fumador")
                    .withAlternative(roles => "[Otro]: Bueno bueno, piense que el tabaco va muy caro hoy en día. ¿Tiene usted por ahí 5 eurillos?"),
                new Phrase("Fumador", "Otro")
                    .withAlternative(roles => "[Fumador]: Es que no me queda ya nada para este mes. ¿No podrías dejarme ni siquiera una caladita?"),
                new Phrase("Otro", "Fumador")
                    .withAlternative(
                        roles => "[Otro]: No va a poder ser don [Fumador]. Habrá que esperar a que su familia le de algo más de dinerillo.",
                        roles => new Effect("Fumador", [ 
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium) 
                        ])
                    ),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Fumador")).name === "Terraza"
                && map.areInTheSameLocation(roles.get("Fumador"), roles.get("Otro"))
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && roles.get("Fumador").Characteristics.is("Residente")
                && roles.get("Fumador").Characteristics.is("Fumador")
                && roles.get("Otro").IsActive
                && roles.get("Fumador").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Fumador").Individual.name))
                && postconditions.exists(Sentence.build("Pobre", roles.get("Fumador").Individual.name)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "VolverBalconResidente",
            "[Salidor] vuelve del balcón",
            new RolesDescriptor("Salidor"),
            [
                new Phrase("Salidor")
                    .withAlternative(roles => "[Salidor] entra de nuevo en el salón y se deja caer sobre una butaca.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salidor")).name === "Terraza"
                && roles.get("Salidor").Characteristics.is("Residente")
                && !roles.get("Salidor").Characteristics.is("Demente")
                && !roles.get("Salidor").Characteristics.is("Impedido")
                && roles.get("Salidor").IsActive
                && map.getLocation("Terraza").agents.length === 1
                && postconditions.exists(Sentence.build("Pobre", roles.get("Salidor").Individual.name)),
            (roles, map) => {
                map.move(roles.get("Salidor"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "IrBalconLibremente",
            "[Salidor] sale al balcón",
            new RolesDescriptor("Salidor"),
            [
                new Phrase("Salidor")
                    .withAlternative(roles => "[Salidor] se desplaza hacia el balcón moviendo su silla de ruedas.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salidor")).name === "Salon"
                && roles.get("Salidor").Characteristics.is("Residente")
                && !roles.get("Salidor").Characteristics.is("Demente")
                && roles.get("Salidor").Characteristics.is("Impedido")
                && roles.get("Salidor").IsActive
                && roles.get("Salidor").Aspect.sex === SexKind.Female
                && postconditions.exists(Sentence.build("Balcon"))
                && !postconditions.exists(Sentence.build("Afresor", "Anselmo"))
                && !postconditions.exists(Sentence.build("Afresor", "Fructuoso")),
            (roles, map) => {
                map.move(roles.get("Salidor"), map.getLocation("Terraza"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "VolderBalconLibremente",
            "[Salidor] vuelve del balcón",
            new RolesDescriptor("Salidor"),
            [
                new Phrase("Salidor")
                    .withAlternative(roles => "[Salidor] entra en el salón moviendo su silla de ruedas.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Salidor")).name === "Terraza"
                && roles.get("Salidor").Characteristics.is("Residente")
                && !roles.get("Salidor").Characteristics.is("Demente")
                && roles.get("Salidor").Characteristics.is("Impedido")
                && roles.get("Salidor").IsActive
                && postconditions.exists(Sentence.build("Balcon"))
                && roles.get("Salidor").Aspect.sex === SexKind.Female,
            (roles, map) => {
                map.move(roles.get("Salidor"), map.getLocation("Salon"));
                return TruthTable.empty;
            }
        ));


        this._elements.push(new Interaction(
            "PicarLavabo",
            "[Picador] intenta ir al lavabo",
            new RolesDescriptor("Picador", ["Otro"]),
            [
                new Phrase("Picador")
                    .withAlternative(roles => "[Picador] se acerca con la silla a la puerta del lavabo, pero oye que hay gente dentro."),
                new Phrase("Picador")
                    .withAlternative(roles => "[Picador]: Mucho rato lleváis en el lavabo. ¡A saber qué estáis haciendo!"),
                new Phrase("Otro")
                    .withAlternative(roles => "[Otro]: Un poco de paciencia, enseguida salimos.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Picador")).name === "Salon"
                && map.getUbication(roles.get("Otro")).name === "Lavabo"
                && roles.get("Picador").Characteristics.is("Residente")
                && !roles.get("Picador").Characteristics.is("Demente")
                && roles.get("Picador").Characteristics.is("Impedido")
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && roles.get("Picador").IsActive
                && roles.get("Picador").Aspect.sex === SexKind.Female,
            (roles, map) => TruthTable.empty
        ));



        this._elements.push(new Interaction(
            "ComentarioPoliticoFavorableIzquierdas",
            "[Comentador] comenta noticia sobre política favorable a la izquierda",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre ${randomFromList([ "el PSOE", "IU" ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador]: La izquierda siempre le ha venido bien a este país.",
                        "[Comentador]: Cuando gobierna la izquierda las cosas se hacen bien.",
                        "[Comentador]: Como siempre la izquierda defendiéndonos a todos de los explotadores de siempre."
                    ])),
                new Phrase("Contrario", "Comentador")
                    .withAlternative(
                        roles => "[Contrario]: Si hubieran ganado la guerra ahora seríamos como Cuba.",
                        roles => new Effect("Comentador", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Medium)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Republicano")
                && roles.get("Contrario").Characteristics.is("Nacional")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Comentador").Individual.name))
                && postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "ComentarioPoliticoFavorableDerechas",
            "[Comentador] comenta noticia sobre política favorable a la derecha",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre ${randomFromList([ "el PP", "Ciudadanos" ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador]: Menos mal que la derecha siempre pone orden.",
                        "[Comentador]: Con la derecha la economía siempre va bien.",
                        "[Comentador]: Cuando gobierna la derecha hay trabajo para todo el mundo, menos para los vagos."
                    ])),
                new Phrase("Contrario", "Comentador")
                    .withAlternative(
                        roles => "[Contrario]: Si no hubieran ganado la guerra ahora seríamos como Inglaterra o Francia.",
                        roles => new Effect("Comentador", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Medium)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Nacional")
                && roles.get("Contrario").Characteristics.is("Republicano")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Comentador").Individual.name))
                && postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "ComentarioPoliticoChanchulloDerechas",
            "[Comentador] comenta noticia sobre política desfavorable a la derecha",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre un escándalo ${randomFromList([ "del PP", "de Ciudadanos" ])}.`),
                new Phrase("Comentador", "Contrario")
                    .withAlternative(
                        roles => randomFromList([
                            "[Comentador]: Ahí lo tienes [Contrario], los descendientes de Franco haciendo de las suyas.",
                            "[Comentador]: Ahí van los tuyos [Contrario], más que un partido son una banda criminal."
                        ]),
                        roles => new Effect("Contrario", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Medium)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Republicano")
                && roles.get("Contrario").Characteristics.is("Nacional")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Comentador").Individual.name))
                && postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "ComentarioPoliticoChanchulloIzquierdas",
            "[Comentador] comenta noticia sobre política desfavorable a la izquierda",
            new RolesDescriptor("Comentador", [ "Contrario" ]),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele sale una notícia sobre un chanchullo ${randomFromList([ "del PSOE", "de IU" ])}.`),
                new Phrase("Comentador", "Contrario")
                    .withAlternative(
                        roles => randomFromList([
                            "[Comentador]: Ahí lo tienes [Contrario], los comunistas siempre amasando el dinero ajeno.",
                            "[Comentador]: Ahí van los tuyos [Contrario], fusilados tendrían que acabar todos esos."
                        ]),
                        roles => new Effect("Contrario", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Medium)
                        ])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Comentador"), roles.get("Contrario"))
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Comentador").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Comentador").Characteristics.is("Nacional")
                && roles.get("Contrario").Characteristics.is("Republicano")
                && roles.get("Comentador").IsActive
                && roles.get("Contrario").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Comentador").Individual.name))
                && postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "CriticarDerecha",
            "[Criticador] critica a la derecha",
            new RolesDescriptor("Criticador", [ "Favorable", "Contrario" ]),
            [
                new Phrase("Criticador")
                    .withAlternative(roles => "En la tele aparece un miembro del PP cualquiera."),
                new Phrase("Criticador")
                    .withAlternative(
                        roles => randomFromList([
                            "[Criticador]: Menudo careto tiene el Aznar, menos mal que el bigote le tapa media jeta.",
                            "[Criticador]: Menudo atontao el Rajoy, pa lo único que vale es para cobrar sobres.",
                            "[Criticador]: Lo más ilegal del PP es el bronzeado de Zaplana.",
                            "[Criticador]: Si Esperanza Aguirre se mordiera la lengua moriría envenenada.",
                            "[Criticador]: ¡Franco tenía el culo blanco!",
                            "[Criticador]: ¡Carrero Blanco campeón de salto!",
                            "[Criticador]: Mario Conde era el más espavilado de estos...",

                        ])),
                new Phrase("Favorable", "Contrario")
                    .withAlternative(
                        roles => "[Favorable]: Jajajaja, ¡putos fachas!",
                        roles => new Effect("Contrario", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Medium)
                        ])
                    )
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Criticador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Criticador"), roles.get("Favorable"))
                && map.areInTheSameLocation(roles.get("Criticador"), roles.get("Contrario"))
                && roles.get("Criticador").Name === "Jacinta"
                && roles.get("Favorable").Characteristics.is("Residente")
                && !roles.get("Favorable").Characteristics.is("Demente")
                && roles.get("Contrario").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Favorable").Characteristics.is("Republicano")
                && roles.get("Contrario").Characteristics.is("Nacional")
                && roles.get("Criticador").IsActive
                && roles.get("Favorable").IsActive
                && roles.get("Contrario").IsActive
                && postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "CriticarIzquierda",
            "[Criticador] critica a la izquierda",
            new RolesDescriptor("Criticador", [ "Favorable", "Contrario" ]),
            [
                new Phrase("Criticador")
                    .withAlternative(roles => "En la tele aparece un miembro del PSOE cualquiera."),
                new Phrase("Criticador")
                    .withAlternative(
                        roles => randomFromList([
                            "[Criticador]: Vaya mamón el ZParo, hunde el país y ni se inmuta.",
                            "[Criticador]: Rubalcaba es más feo que un coche por abajo.",
                            "[Criticador]: Ahí va Felipe González \"El químico\", sabe usar como nadie la cal viva.",
                            "[Criticador]: Menudo falso el Solana, un día se besaba con uno y al día siguiente lo bombardeaba.",
                            "[Criticador]: El Che que tanto les gusta a estos les habría fusilado a todos.",
                            "[Criticador]: A estos si les llevas la contraria te mandan al Gulag.",
                            "[Criticador]: Viendo lo tontos que son entiendes porqué perdieron la guerra."
                        ])),
                new Phrase("Favorable", "Contrario")
                    .withAlternative(
                        roles => "[Favorable]: Jajajaja, ¡putos rojos!",
                        roles => new Effect("Contrario", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Medium)
                        ])
                    )
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Criticador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Criticador"), roles.get("Favorable"))
                && map.areInTheSameLocation(roles.get("Criticador"), roles.get("Contrario"))
                && roles.get("Criticador").Name === "Jacinta"
                && roles.get("Favorable").Characteristics.is("Residente")
                && !roles.get("Favorable").Characteristics.is("Demente")
                && roles.get("Contrario").Characteristics.is("Residente")
                && !roles.get("Contrario").Characteristics.is("Demente")
                && roles.get("Favorable").Characteristics.is("Nacional")
                && roles.get("Contrario").Characteristics.is("Republicano")
                && roles.get("Criticador").IsActive
                && roles.get("Favorable").IsActive
                && roles.get("Contrario").IsActive
                && postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "Agresion",
            "[Agresor] intenta agredir a [Agredido]",
            new RolesDescriptor("Agresor", [ "Agredido", "Separador" ]),
            [
                new Phrase("Agresor")
                    .withAlternative(roles => roles.get("Agresor").Characteristics.is("Impedido")
                        ? "[Agresor] se pone en pie apoyándose en la silla de ruedas con intención de agredir a [Agredido]."
                        : "[Agresor] se levanta de la butaca trabajosamente para agredir a [Agredido]."
                    ),
                new Phrase("Agresor")
                    .withAlternative(
                        roles => roles.get("Agresor").Characteristics.is("Impedido")
                            ? "[Agresor]: [Agredido] puto rojo, ¡que te pego leche!"
                            : "[Agresor]: [Agredido] puto facha, ¡que te pego leche!",
                        roles => Effect.empty([ EffectComponent.negative(EffectKind.Happiness, EffectStrength.High) ])
                    ),
                new Phrase("Separador", "Agresor")
                    .withAlternative(roles => "[Separador] agarra por los hombros a [Agresor] y lo sienta de nuevo a la fuerza."),
                new Phrase("Separador")
                    .withAlternative(roles => "[Separador]: ¡Vamos a calmarnos todos! Por mi coño que nos calmamos. Cada día la misma puta historia."),
                new Phrase("Separador")
                    .withAlternative(roles => "[Separador]: ¡Se acabó la tele!")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Agresor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Agresor"), roles.get("Agredido"))
                && map.areInTheSameLocation(roles.get("Agresor"), roles.get("Separador"))
                && roles.get("Agresor").Characteristics.is("Residente")
                && !roles.get("Agresor").Characteristics.is("Demente")
                && roles.get("Agredido").Characteristics.is("Residente")
                && !roles.get("Agredido").Characteristics.is("Demente")
                && roles.get("Agresor").Relations.get(roles.get("Agredido").Name).isEnemy
                && roles.get("Separador").Characteristics.is("Auxiliar")
                && roles.get("Agresor").IsActive
                && roles.get("Agredido").IsActive
                && roles.get("Separador").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Agresor").Individual.name))
                && postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => {
                roles.get("Agresor").humanize();
                return new TruthTable()
                    .with(Sentence.build("Agresor", roles.get("Agresor").Individual.name))
                    .with(Sentence.build("TeleApagada"));
            }
        ));

        this._elements.push(new Interaction(
            "RecuerdoAnselmo",
            "Anselmo recuerda un suceso de la guerra civil",
            new RolesDescriptor("Recordador"),
            [
                new Phrase("Recordador")
                    .withAlternative(roles => "[Recordador] se mira las manos aturdido. Lo que acaba de pasar le hace recordar una historia de hace mucho tiempo. Una historia que casi había olvidado."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Anselmo se encuentra en el frente, ataviado con un delantal mugriento dentro de una tienda del campamento militar."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Delante suyo hay una enorme olla con caldo hirviendo. Alguien le grita desde fuera de la tienda."),
                new Phrase("Recordador")
                    .withAlternative(roles => "\"¡Anselmo carajo! ¡Cuanto queda para comer!\", es el sargento. Todo es tan vivo que parece real, como si hubiese rejuvenecido y estuviera otra vez allí."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Oye un ruido detrás de la tienda. Son tiempos de guerra, así que coje su cuchillo y sale corriendo alrededor de la tienda."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Un chico joven está husmeando por fuera de la tienda, por la indumentaria puede ser un desertor del bando golpista. Al ver a Anselmo sale corriendo."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Anselmo le persigue y grita para dar la alarma. Le persigue durante un largo trecho, hasta que el joven tropieza y cae por un terraplén."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Le tiene."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Se avalanza sobre él empuñando su cuchillo. Pero cuando va a matarlo el joven le mira. Le mira a los ojos. Está asustado. Anselmo duda, porque es humano. Nunca ha matado."),
                new Phrase("Recordador")
                    .withAlternative(
                        roles => "Anselmo apuñala al joven",
                        roles => Effect.null(),
                        roles => Sentence.build("Malo", roles.get("Recordador").Individual.name)
                    )
                    .withAlternative(
                        roles => "Anselmo deja marchar al joven",
                        roles => Effect.null(),
                        roles => Sentence.build("Bueno", roles.get("Recordador").Individual.name)
                    ),
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Recordador")).name === "Salon"
                && roles.get("Recordador").Name === "Anselmo"
                && roles.get("Recordador").IsActive
                && postconditions.exists(Sentence.build("Agresor", roles.get("Recordador").Individual.name)),
            (roles, map) => {
                roles.get("Recordador").dehumanize();
                return new TruthTable()
                    .with(Sentence.build("Recuerdo", roles.get("Recordador").Individual.name));
            }
        ));

        this._elements.push(new Interaction(
            "SocorroSeVa",
            "Socorro se va",
            new RolesDescriptor("Marchante"),
            [
                new Phrase("Marchante")
                    .withAlternative(roles => "[Marchante] coge su bolso y se va hacia el comedor.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Marchante")).name === "Salon"
                && roles.get("Marchante").Name === "Socorro"
                && postconditions.exists(Sentence.build("Comer")),
            (roles, map) => {
                map.move(roles.get("Marchante"), map.getLocation("Limbo"));
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "AuxiliarSeVa",
            "[Marchante] se va",
            new RolesDescriptor("Marchante"),
            [
                new Phrase("Marchante")
                    .withAlternative(roles => "[Marchante] se va al comedor.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Marchante")).name === "Salon"
                && roles.get("Marchante").Characteristics.is("Auxiliar")
                && map.getLocation("Salon").agents.length <= 2
                && postconditions.exists(Sentence.build("Comer")),
            (roles, map) => {
                map.move(roles.get("Marchante"), map.getLocation("Limbo"));
                return TruthTable.empty;
            }
        ));*/
    }

    get all(){
        return this._elements;
    }

    get(name: string): IInteraction | null{
        let filtered = this._elements.filter(x => x.name === name);
        return filtered.length === 0 ? null : filtered[0];
    }
}