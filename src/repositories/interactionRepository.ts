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
import { Concienced } from "../models/Concienced";

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
                && map.getLocation("Limbo").agents.length > 0
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
            Timing.GlobalSingle,
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
            "Pregunta qué hacer a [Preguntado]",
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
                map.getLocation("Limbo").agents.length === 0
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntado").IsActive
                && roles.get("Preguntador").Aspect.sex === SexKind.Female
                && roles.get("Preguntado").Aspect.sex === SexKind.Female
                && map.getUbication(roles.get("Preguntador")).name === "Sotano"
                && map.getUbication(roles.get("Preguntado")).name === "Sotano"
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
                map.getLocation("Limbo").agents.length === 0
                && roles.get("Flipador").IsActive
                && roles.get("Flipador").Aspect.sex === SexKind.Male
                && roles.get("Flipador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Flipador")).name === "Sotano"
                && !postconditions.exists(Sentence.build("Desenmascarado")),
                (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "PideSilencio",
            "Pedir hablar más bajo a [Contestador]",
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
                map.getLocation("Limbo").agents.length === 0
                && roles.get("Pedidor").IsActive
                && roles.get("Pedidor").Aspect.sex === SexKind.Female
                && roles.get("Pedidor").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Pedidor")).name === "Sotano"
                && roles.get("Contestador").IsActive
                && roles.get("Contestador").Aspect.sex === SexKind.Male
                && roles.get("Contestador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Contestador")).name === "Sotano"
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
                && map.getLocation("Limbo").agents.length === 0
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
                map.getLocation("Limbo").agents.length === 0
                && roles.get("Quitador").IsActive
                && roles.get("Quitador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Quitador")).name === "Sotano"
                && roles.get("Quitador").Aspect.sex === SexKind.Male
                && roles.get("Acojonado").IsActive
                && roles.get("Acojonado").Characteristics.is("Estudiante")
                && roles.get("Acojonado").Aspect.sex === SexKind.Female
                && map.getUbication(roles.get("Acojonado")).name === "Sotano"
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
                && map.getUbication(roles.get("Hostiador")).name === "Sotano"
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
                && map.getUbication(roles.get("Reconocido")).name === "Sotano"
                && roles.get("Reconocido").Characteristics.is("Estudiante"),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("Saludo", roles.get("Reconocedor").Individual.name, roles.get("Reconocido").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "SirveCopa",
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
                && roles.get("Servidor").Aspect.sex == SexKind.Male
                && map.getUbication(roles.get("Servidor")).name === "Sotano"
                && roles.get("Servido").IsActive
                && roles.get("Servido").Characteristics.is("Estudiante")
                && roles.get("Servido").Aspect.sex == SexKind.Female
                && Alcoholic.is(roles.get("Servido"))
                && Alcoholic.to(roles.get("Servido")).glass.isEmpty()
                && map.getUbication(roles.get("Servido")).name === "Sotano"
                && postconditions.exists(Sentence.build("Botellas"))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Servidor").Individual.name, roles.get("Servido").Individual.name, true)),
                (roles, map) => {
                    return TruthTable.empty;
                }
        ));

        this._elements.push(new Interaction(
            "Autoservicio",
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
                && roles.get("Servidor").Aspect.sex == SexKind.Male
                && map.getUbication(roles.get("Servidor")).name === "Sotano"
                && Alcoholic.is(roles.get("Servidor"))
                && Alcoholic.to(roles.get("Servidor")).glass.isEmpty()
                && postconditions.exists(Sentence.build("Botellas")),
                (roles, map) => {
                    Alcoholic.to(roles.get("Servidor")).glass.fill();
                    return TruthTable.empty;
                }
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
                && map.getUbication(roles.get("Insultador")).name === "Sotano"
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
                && map.getUbication(roles.get("Amenazado")).name === "Sotano"
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
                && map.getUbication(roles.get("Manipulado")).name === "Sotano"
                && roles.get("Manipulado").Characteristics.is("Estudiante")
                && roles.get("Convencedor").IsActive
                && map.getUbication(roles.get("Convencedor")).name === "Sotano"
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
                && map.getUbication(roles.get("Hostiador")).name === "Sotano"
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
            "HostiaBasica",
            "[Hostiador] le suelta una hotia a [Hostiado]",
            new RolesDescriptor("Hostiador", [ "Hostiado" ]),
            [
                new Phrase("Hostiador")
                    .withAlternative(roles => roles.get("Hostiador").Aspect.sex === SexKind.Male
                        ? randomFromList([
                            "[Hostiador] le da un puñetazo en la cara a [Hostiado].",
                            "[Hostiador] le suelta un codazo en la cabeza a [Hostiado].",
                            "[Hostiador] le da una patada en el estómago a [Hostiado].",
                        ])
                        : randomFromList([
                            "[Hostiador] le da una bofetada a [Hostiado].",
                            "[Hostiador] le da un tirón de pelos [Hostiado].",
                            "[Hostiador] le da una patada en la espinilla a [Hostiado].",
                        ])),
                new Phrase("Hostiado")
                    .withAlternative(roles => randomFromList([
                        "[Hostiado]: ¿Eso es todo lo que tienes?",
                        "[Hostiado]: ¡Nenaza!",
                        "[Hostiado]: ¿Esa es toda la fuerza que tienes?",
                        "[Hostiado]: ¡No sabes pegar!",
                    ])),
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                // check(roles.get("Hostiador").Personality.pacificViolent) 
                roles.get("Hostiador").IsActive
                && Alcoholic.is(roles.get("Hostiador"))
                && Alcoholic.to(roles.get("Hostiador")).alcoholism.isMedium
                && roles.get("Hostiador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Hostiador")).name === "Sotano"
                && roles.get("Hostiado").IsActive
                && Lifed.is(roles.get("Hostiado"))
                && roles.get("Hostiado").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraHostia"))
                && !postconditions.exists(Sentence.build("PrimeraRajada")),
                (roles, map) => {
                    Lifed.to(roles.get("Hostiado")).hitSoft();
                    return TruthTable.empty;
                }
        ));

        this._elements.push(new Interaction(
            "HostiaBasicaPostRajada",
            "[Hostiador] le suelta una hotia a [Hostiado]",
            new RolesDescriptor("Hostiador", [ "Hostiado" ]),
            [
                new Phrase("Hostiador")
                    .withAlternative(roles => roles.get("Hostiador").Aspect.sex === SexKind.Male
                        ? randomFromList([
                            "[Hostiador] le da un puñetazo en la cara a [Hostiado].",
                            "[Hostiador] le suelta un codazo en la cabeza a [Hostiado].",
                            "[Hostiador] le da una patada en el estómago a [Hostiado].",
                        ])
                        : randomFromList([
                            "[Hostiador] le da una bofetada a [Hostiado].",
                            "[Hostiador] le da un tirón de pelos [Hostiado].",
                            "[Hostiador] le da una patada en la espinilla a [Hostiado].",
                        ])),
                new Phrase("Hostiado")
                    .withAlternative(roles => randomFromList([
                        "[Hostiado]: Parad ya joder...",
                        "[Hostiado]: Me vais a matar...",
                        "[Hostiado]: No puedo más..."
                    ])),
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                roles.get("Hostiador").IsActive
                && Alcoholic.is(roles.get("Hostiador"))
                && Alcoholic.to(roles.get("Hostiador")).alcoholism.isMedium
                && roles.get("Hostiador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Hostiador")).name === "Sotano"
                && roles.get("Hostiado").IsActive
                && Lifed.is(roles.get("Hostiado"))
                && roles.get("Hostiado").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraRajada")),
                (roles, map) => {
                    Lifed.to(roles.get("Hostiado")).hitSoft();
                    return TruthTable.empty;
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
                && map.getUbication(roles.get("Desnudador")).name === "Sotano"
                && roles.get("Complice").IsActive
                && Alcoholic.is(roles.get("Complice"))
                && Alcoholic.to(roles.get("Complice")).alcoholism.isMedium
                && roles.get("Complice").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Complice")).name === "Sotano"
                && roles.get("Victima").IsActive
                && Clothed.is(roles.get("Victima"))
                && !Clothed.to(roles.get("Victima")).clothing.topNaked
                && roles.get("Victima").Characteristics.is("Profesor")
                && !postconditions.exists(Sentence.build("DesnudoArriba", roles.get("Victima").Individual.name)),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("DesnudoArriba", roles.get("Victima").Individual.name))
        ));

        this._elements.push(new Interaction(
            "DesnudarAbajo",
            "[Desnudador] propone desnudar de cintura pra abajo a [Victima]",
            new RolesDescriptor("Desnudador", [ "Victima", "Complice" ]),
            [
                new Phrase("Desnudador")
                    .withAlternative(roles => "[Desnudador]: Vamos a quitale también los pantalones. ¡A ver lo pequeña que la tiene!"),
                new Phrase("Complice", "Desnudador")
                    .withAlternative(roles => "[Complice]: No pienso hacer eso.")
                    .withAlternative(
                        roles => "[Complice]: ¡Sí joder! ¡Vamos a ver esa pichurrilla arrugada!",
                        roles => Effect.null(),
                        roles => {
                            Clothed.to(roles.get("Victima")).clothing.removeBottom();
                            return Sentence.build("DesnudoAbajo", roles.get("Victima").Individual.name);
                        }),
                new Phrase("Desnudador", "Complice")
                    .withAlternative(roles => Clothed.to(roles.get("Victima")).clothing.bottomNaked
                        ? "[Desnudador] y [Complice] estiran de los pantalones de [Victima] hasta quitárselos. Luego le arrancan también los calzoncillos."
                        : "[Desnudador] y [Complice] se miran sin saber qué hacer."),
                new Phrase("Victima")
                    .withAlternative(roles => Clothed.to(roles.get("Victima")).clothing.bottomNaked
                        ? "[Victima]: ¡Mierda! ¡Putos guarros! ¡La madre que os parió!"
                        : "[Victima]: Ni se os pase por la cabeza."),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                roles.get("Desnudador").IsActive
                && Alcoholic.is(roles.get("Desnudador"))
                && Alcoholic.to(roles.get("Desnudador")).alcoholism.isMedium
                && roles.get("Desnudador").Aspect.sex === SexKind.Male
                && roles.get("Desnudador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Desnudador")).name === "Sotano"
                && roles.get("Complice").IsActive
                && Alcoholic.is(roles.get("Complice"))
                && Alcoholic.to(roles.get("Complice")).alcoholism.isMedium
                && roles.get("Complice").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Complice")).name === "Sotano"
                && roles.get("Victima").IsActive
                && Clothed.is(roles.get("Victima"))
                && Clothed.to(roles.get("Victima")).clothing.topNaked
                && !Clothed.to(roles.get("Victima")).clothing.bottomNaked
                && roles.get("Victima").Characteristics.is("Profesor")
                && !postconditions.exists(Sentence.build("DesnudoAbajo", roles.get("Victima").Individual.name)),
                (roles, map) => new TruthTable()
                    .with(Sentence.build("DesnudoAbajo", roles.get("Victima").Individual.name))
        ));

        this._elements.push(new Interaction(
            "PedirCalma",
            "[Calmador] pide calma",
            new RolesDescriptor("Calmador", [ "Concienciado", "Victima" ]),
            [
                new Phrase("Calmador")
                    .withAlternative(roles => randomFromList([
                        "[Calmador]: Vamos a calmarnos todos un poco.",
                        "[Calmador]: Creo que nos estamos alterando demasiado.",
                        "[Calmador]: No perdamos la cabeza.",
                    ])),
                new Phrase("Concienciado")
                    .withAlternative(roles => "[Concienciado] mira al suelo. Su cara refleja un mar de dudas."),
                new Phrase("Victima")
                    .withAlternative(roles => "[Victima]: Haced caso a Maria. Es la única de vosotros que tiene media neurona.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Calmador").IsActive
                && Alcoholic.is(roles.get("Calmador"))
                && Alcoholic.to(roles.get("Calmador")).alcoholism.isLow
                && roles.get("Calmador").Name === "Mari"
                && roles.get("Calmador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Calmador")).name === "Sotano"
                && roles.get("Concienciado").IsActive
                && Concienced.is(roles.get("Concienciado"))
                && roles.get("Concienciado").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Concienciado")).name === "Sotano"
                && roles.get("Victima").IsActive
                && roles.get("Victima").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraHostia")),
            (roles, map) => {
                Concienced.to(roles.get("Concienciado")).concience.increse();
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "AlentarViolencia",
            "[Alentador] pide más violencia",
            new RolesDescriptor("Alentador", [ "Concienciado", "Victima" ]),
            [
                new Phrase("Alentador")
                    .withAlternative(roles => randomFromList([
                        "[Alentador]: Me aburroooo. ¿Vamos a darle mas caña al viejo o qué?",
                        "[Alentador]: Lo veo todavía muy chulito. Un par de hostias no le vendrían mal.",
                        "[Alentador]: Paco se está relajando demasiado. Creo que le pegamos muy poco.",
                    ])),
                new Phrase("Concienciado")
                    .withAlternative(roles => "[Concienciado] sonrie con alivio. Las dudas se disipan en su rostro."),
                new Phrase("Victima")
                    .withAlternative(roles => "[Victima]: ¡Cállate la puta boca niñata!")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Alentador").IsActive
                && Alcoholic.is(roles.get("Alentador"))
                && Alcoholic.to(roles.get("Alentador")).alcoholism.isLow
                && roles.get("Alentador").Name === "Mari"
                && roles.get("Alentador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Alentador")).name === "Sotano"
                && roles.get("Concienciado").IsActive
                && Concienced.is(roles.get("Concienciado"))
                && roles.get("Concienciado").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Concienciado")).name === "Sotano"
                && roles.get("Victima").IsActive
                && roles.get("Victima").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraHostia")),
            (roles, map) => {
                Concienced.to(roles.get("Concienciado")).concience.decrese();
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "AmenazaDesesperada",
            "[Amenazador] amenaza desesperadamente",
            new RolesDescriptor("Amenazador"),
            [
                new Phrase("Amenazador")
                    .withAlternative(roles => randomFromList([
                        "[Amenazador]: ¡Os voy a denunciar a todos!",
                        "[Amenazador]: ¡Os voy a arruinar la puta vida después de esto!",
                        "[Amenazador]: ¡Sois carne de reformatorio cabrones!",
                        "[Amenazador]: ¡Pagaréis cada hostia! ¡Lo juro!",
                        "[Amenazador]: ¡Me cago en la madre que os parió!",
                    ]),
                    roles => new Effect(null, [
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low)
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Amenazador").IsActive
                && roles.get("Amenazador").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraHostia")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "IrFuera",
            "[Desplazado] sale fuera",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => randomFromList([
                        "[Desplazado]: Necesito un poco de aire.",
                        "[Desplazado]: Me estoy agobiando, salgo un momento.",
                        "[Desplazado]: Necesito salir a respirar un poco."
                    ])),
                new Phrase("Desplazado")
                    .withAlternative(roles => "[Desplazado] abre la pesada puerta y sale fuera.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                roles.get("Desplazado").IsActive
                && roles.get("Desplazado").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Desplazado")).name === "Sotano"
                && roles.get("Desplazado").Happiness.isUnhappy
                && map.getLocation("Sotano").agents.filter(agent => agent.Characteristics.is("Estudiante")).length > 1
                && postconditions.exists(Sentence.build("PrimeraHostia")),
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Fuera"));
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "IrDentro",
            "[Desplazado] vuelve dentro",
            new RolesDescriptor("Desplazado"),
            [
                new Phrase("Desplazado")
                    .withAlternative(roles => "Se abre la puerta. Es [Desplazado] que entra de nuevo en el sótano.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                roles.get("Desplazado").IsActive
                && roles.get("Desplazado").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Desplazado")).name === "Fuera",
            (roles, map) => 
            {
                map.move(roles.get("Desplazado"), map.getLocation("Sotano"));
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "Respirar",
            "[Respirador] respira",
            new RolesDescriptor("Respirador"),
            [
                new Phrase("Respirador")
                    .withAlternative(roles => "[Respirador] respira profundamente mientras mira al cielo.")
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                roles.get("Respirador").IsActive
                && roles.get("Respirador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Respirador")).name === "Fuera"
                && roles.get("Respirador").Happiness.isUnhappy
                && map.getLocation("Fuera").agents.length == 1,
            (roles, map) => 
            {
                roles.get("Respirador").Happiness.increase(10);
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "Vomitar",
            "[Vomitador] vomita",
            new RolesDescriptor("Vomitador"),
            [
                new Phrase("Vomitador")
                    .withAlternative(roles => "[Vomitador]: Joder que mal cuerpo tengo."),
                new Phrase("Vomitador")
                    .withAlternative(roles => "[Vomitador] abre la boca y vomita todo lo que tiene en el estómago.",
                    roles => new Effect(null, [
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                        EffectComponent.negative(EffectKind.Sex, EffectStrength.Low),
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) =>
                roles.get("Vomitador").IsActive
                && roles.get("Vomitador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Vomitador")).name === "Fuera"
                && roles.get("Vomitador").Aspect.sex === SexKind.Female
                && Alcoholic.is(roles.get("Vomitador"))
                && Alcoholic.to(roles.get("Vomitador")).alcoholism.isMedium,
            (roles, map) => new TruthTable()
                .with(Sentence.build("Potado")),
        ));

        this._elements.push(new Interaction(
            "ComentarioPota",
            "[Comentador] comenta pota",
            new RolesDescriptor("Comentador"),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador] huele algo raro en el ambiente.",
                        "[Comentador] ve un charco naranja con grumos en el suelo."
                    ])),
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador]: Parece que alguien ha echado la papilla.",
                        "[Comentador]: Vaya vaya. ¿Alguien ha comido macarrones recientemente?",
                        "[Comentador]: Uff que puto asco. ¡Vaya potada!"
                    ]))
            ],
            Timing.Single,
            (postconditions, roles, map) =>
                roles.get("Comentador").IsActive
                && roles.get("Comentador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Comentador")).name === "Fuera"
                && roles.get("Comentador").Aspect.sex === SexKind.Male
                && postconditions.exists(Sentence.build("Potado")),
            (roles, map) => TruthTable.empty,
        ));

        this._elements.push(new Interaction(
            "EnrollanFuera",
            "[EnrolladoUno] se enrolla con [EnrolladoDos]",
            new RolesDescriptor("EnrolladoUno", [ "EnrolladoDos" ]),
            [
                new Phrase("EnrolladoUno", "EnrolladoDos")
                    .withAlternative(roles => "[EnrolladoUno] y [EnrolladoDos] se miran sin decirse nada."),
                new Phrase("EnrolladoUno", "EnrolladoDos")
                    .withAlternative(roles => "Sin mediar palabra [EnrolladoUno] y [EnrolladoDos] se abrazan y se funden en un apasionado beso.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) =>
                roles.get("EnrolladoUno").IsActive
                && roles.get("EnrolladoUno").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("EnrolladoUno")).name === "Fuera"
                && roles.get("EnrolladoDos").IsActive
                && roles.get("EnrolladoDos").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("EnrolladoDos")).name === "Fuera"
                && postconditions.exists(Sentence.build("Pareja", roles.get("EnrolladoUno").Individual.name, roles.get("EnrolladoDos").Individual.name, true)),
            (roles, map) => {
                roles.get("EnrolladoUno").Happiness.increase(30);
                roles.get("EnrolladoDos").Happiness.increase(30);
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "DiscusionFuera",
            "[DiscusorUno] discute con [DiscusorDos]",
            new RolesDescriptor("DiscusorUno", [ "DiscusorDos" ]),
            [
                new Phrase("DiscusorUno")
                    .withAlternative(roles => roles.get("DiscusorUno").Aspect.sex === SexKind.Male
                        ? randomFromList([
                            "[DiscusorUno]: ¿No has estado muy suave ahí dentro?",
                            "[DiscusorUno]: ¿Por qué eres tan suave? ¿Te mola el profe o qué?",
                            "[DiscusorUno]: Vas flojísimo con ese cabrón. ¡Espavila!"
                        ])
                        : randomFromList([
                            "[DiscusorUno]: ¿No te has pasado de vueltas un poco ahí dentro?",
                            "[DiscusorUno]: ¿No se te está yendo la olla demasiado ahí dentro?",
                            "[DiscusorUno]: Vas pasadísimo de vueltas ahí dentro."
                        ])),
                new Phrase("DiscusorDos")
                    .withAlternative(roles => roles.get("DiscusorDos").Aspect.sex === SexKind.Male
                        ? randomFromList([
                            "[DiscusorDos]: ¡Pero que coño me estás contando! ¡No me jodas anda!",
                            "[DiscusorDos]: ¡Vete a tomar por culo anda!",
                            "[DiscusorDos]: ¡Que te folle un pez polla!"
                        ])
                        : randomFromList([
                            "[DiscusorDos]: No todos estamos tan tarados como tú joder.",
                            "[DiscusorDos]: Al final va a tener razón Paco y resulta que estás mal de la cabeza.",
                            "[DiscusorDos]: No a todos se nos va la olla como a ti."
                        ]),
                        roles => new Effect("DiscusorUno", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                        ])),
            ],
            Timing.Single,
            (postconditions, roles, map) =>
                roles.get("DiscusorUno").IsActive
                && roles.get("DiscusorUno").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("DiscusorUno")).name === "Fuera"
                && roles.get("DiscusorDos").IsActive
                && roles.get("DiscusorDos").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("DiscusorDos")).name === "Fuera"
                && roles.get("DiscusorUno").Aspect.sex !== roles.get("DiscusorDos").Aspect.sex
                && !postconditions.exists(Sentence.build("Pareja", roles.get("DiscusorUno").Individual.name, roles.get("DiscusorDos").Individual.name, true)),
            (roles, map) => TruthTable.empty,
        ));

        this._elements.push(new Interaction(
            "PrimeraRajada",
            "[Rajador] raja por primera vez a [Rajado]",
            new RolesDescriptor("Sugeridor", [ "Rajador", "Rajado" ]),
            [
                new Phrase("Sugeridor")
                    .withAlternative(roles => "[Sugeridor]: ¿Sabéis qué estoy pensando? Pienso que podríamos rajarlo como a un cerdo.",
                    roles => new Effect("Rajado", [
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium)
                    ])),
                new Phrase("Rajador")
                    .withAlternative(roles => "[Rajador]: ¡Buena idea! A ver si después de esto sigues siendo tan chulo."),
                new Phrase("Rajador", "Rajado")
                    .withAlternative(roles => "[Rajador] le hace un corte en el antebrazo [Rajado] con una navaja.",
                    roles => new Effect("Rajado", [
                        EffectComponent.negative(EffectKind.Friend, EffectStrength.High),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.High)
                    ])),
                new Phrase("Rajado")
                    .withAlternative(roles => "[Rajado]: ¡Aaaaaah! ¡Pero qué cojones...!"),
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                roles.get("Rajador").IsActive
                && Alcoholic.is(roles.get("Rajador"))
                && Alcoholic.to(roles.get("Rajador")).alcoholism.isHigh
                && roles.get("Rajador").Aspect.sex === SexKind.Male
                && roles.get("Rajador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Rajador")).name === "Sotano"
                && roles.get("Sugeridor").IsActive
                && roles.get("Sugeridor").Characteristics.is("Estudiante")
                && Alcoholic.is(roles.get("Sugeridor"))
                && (Alcoholic.to(roles.get("Sugeridor")).alcoholism.isMedium || Alcoholic.to(roles.get("Sugeridor")).alcoholism.isHigh)
                && map.getUbication(roles.get("Sugeridor")).name === "Sotano"
                && roles.get("Rajado").IsActive
                && Lifed.is(roles.get("Rajado"))
                && roles.get("Rajado").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraHostia"))
                && !postconditions.exists(Sentence.build("PrimeraRajada")),
                (roles, map) => {
                    Lifed.to(roles.get("Rajado")).hitHard();
                    return new TruthTable()
                        .with(Sentence.build("PrimeraRajada"));
                }
        ));

        this._elements.push(new Interaction(
            "RajadaEstandar",
            "[Rajador] raja a [Rajado]",
            new RolesDescriptor("Rajador", [ "Rajado" ]),
            [
                new Phrase("Rajador", "Rajado")
                    .withAlternative(roles => randomFromList([
                        "[Rajador] saca la navaja y la clava en el muslo de [Rajado].",
                        "[Rajador] hace un corte fino en la cara de [Rajado].",
                        "[Rajador] pincha con la navaja en el hombro de [Rajado].",
                        "[Rajador] hace un corte largo en la espalda de [Rajado] utilizando su navaja.",
                        "[Rajador] pincha varias veces en la mano a [Rajado] con la punta de la navaja."
                    ]),
                    roles => new Effect("Rajado", [
                        EffectComponent.negative(EffectKind.Friend, EffectStrength.High),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.High)
                    ])),
                new Phrase("Rajado")
                    .withAlternative(roles => randomFromList([
                        "[Rajado]: !Noooo! ¡Qué haces! ¡Paraaaa!",
                        "[Rajado]: !Aaaaaah! ¡Cabronazo!",
                        "[Rajado]: !Noooo! ¡Aaaaargh!",
                    ])),
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Rajador").IsActive
                && Alcoholic.is(roles.get("Rajador"))
                && Alcoholic.to(roles.get("Rajador")).alcoholism.isHigh
                && roles.get("Rajador").Aspect.sex === SexKind.Male
                && roles.get("Rajador").Characteristics.is("Estudiante")
                && map.getUbication(roles.get("Rajador")).name === "Sotano"
                && roles.get("Rajado").IsActive
                && Lifed.is(roles.get("Rajado"))
                && roles.get("Rajado").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraRajada")),
                (roles, map) => {
                    Lifed.to(roles.get("Rajado")).hitHard();
                    return TruthTable.empty;
                }
        ));

        this._elements.push(new Interaction(
            "Lloriqueo",
            "[Llorica] lloriquea",
            new RolesDescriptor("Llorica"),
            [
                new Phrase("Llorica")
                    .withAlternative(roles => randomFromList([
                        "[Llorica]: Os lo suplico... parad ya con esto.",
                        "[Llorica]: ¿Vais a matarme? ¿Es eso lo que queréis?",
                        "[Llorica]: Por favor, dejadme ya. Os lo suplico.",
                        "[Llorica]: No quiero morir...",
                    ]),
                    roles => new Effect(null, [
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium)
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Llorica").IsActive
                && roles.get("Llorica").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraRajada")),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "Auxilio",
            "[Pedidor] pide auxilio",
            new RolesDescriptor("Pedidor"),
            [
                new Phrase("Pedidor")
                    .withAlternative(roles => randomFromList([
                        "[Pedidor]: ¡Socorro!",
                        "[Pedidor]: ¡Ayuda! ¡Que alguien me ayude!",
                        "[Pedidor]: ¡Alguien me oye! ¡Estoy en peligro!"
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                roles.get("Pedidor").IsActive
                && roles.get("Pedidor").Characteristics.is("Profesor")
                && postconditions.exists(Sentence.build("PrimeraRajada")),
            (roles, map) => TruthTable.empty
        ));
        
        /*
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