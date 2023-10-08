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
import { Familiar } from "npc-relations";

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
                && roles.get("Embolsado").Characteristics.is("Bolsa")
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
                && !postconditions.exists(Sentence.build("Desenmascarado"))
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
                && roles.get("Embolsado").Characteristics.is("Bolsa")
                && roles.get("Embolsado").Characteristics.is("Profesor"),
                (roles, map) => TruthTable.empty
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
            "Fumar",
            "[Fumador] se fuma un cigarro",
            new RolesDescriptor("Fumador"),
            [
                new Phrase("Fumador")
                    .withAlternative(roles => randomFromList([
                        "[Fumador] se fuma un cigarro mientras dirige su mirada perdida a la calle.",
                        "[Fumador] se fuma un cigarro con ansia.",
                        "[Fumador] apura un cigarro mirando alrededor.",
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) =>
                roles.get("Fumador").Happiness.isUnhappy
                && roles.get("Fumador").IsActive
                && roles.get("Fumador").Characteristics.is("Auxiliar")
                && map.getUbication(roles.get("Fumador")).name === "Terraza",
            (roles, map) => 
            {
                roles.get("Fumador").Happiness.increase(30);
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
            "LlegaSocorro",
            "Socorro entra en el salón.",
            new RolesDescriptor("Llegador", [ "Visitado" ]),
            [
                new Phrase("Llegador", "Visitado")
                    .withAlternative(roles => "[Llegador], la hija de [Visitado], entra en el salón."),
                new Phrase("Llegador")
                    .withAlternative(roles => "[Llegador]: Hola papá, ¿qué tal has pasado la noche? Seguro que muy bien, ¿a que sí?")
            ],
            Timing.Single,
            (postconditions, roles, map) =>
                map.getUbication(roles.get("Llegador")).name === "Limbo"
                && map.getUbication(roles.get("Visitado")).name === "Salon"
                && postconditions.exists(Sentence.build("Luz"))
                && roles.get("Llegador").Name === "Socorro"
                && roles.get("Visitado").Name === "Antonio"
                && roles.get("Llegador").IsActive
                && roles.get("Visitado").IsActive
                && map.getUbication(roles.get("Llegador")).isConnected(map.getLocation("Salon")),
            (roles, map) => 
            {
                map.move(roles.get("Llegador"), map.getLocation("Salon"));
                return TruthTable.empty;
            },
        ));

        this._elements.push(new Interaction(
            "SaludoSocorroAuxiliares",
            "[Saludador] saluda a las auxiliares",
            new RolesDescriptor("Saludador", [ "Saludado1", "Saludado2" ]),
            [
                new Phrase("Saludador")
                    .withAlternative(roles => "[Saludador]: Buenos dias chicas. ¿Qué tal todo por aquí?"),
                new Phrase("Saludado1")
                    .withAlternative(roles => "[Saludado1]: Hola guapísima."),
                new Phrase("Saludado2")
                    .withAlternative(roles => "[Saludado2]: ¡Mira Antonio quién ha venido a verte!")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Saludador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado1"))
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado2"))
                && roles.get("Saludado1").Characteristics.is("Auxiliar")
                && roles.get("Saludado2").Characteristics.is("Auxiliar")
                && roles.get("Saludador").Name === "Socorro"
                && roles.get("Saludado1").IsActive
                && roles.get("Saludado2").IsActive
                && roles.get("Saludador").IsActive
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado1").Individual.name, true))
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado2").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado1").Individual.name, true))
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado2").Individual.name, true))
        ));

        this._elements.push(new Interaction(
            "SaludoResidenteSocorro",
            "[Saludador] saluda a una Socorro",
            new RolesDescriptor("Saludador", [ "Saludado" ]),
            [
                new Phrase("Saludador", "Saludado")
                    .withAlternative(roles => "[Saludador]: Hola Socorro, que bueno verte por aquí."),
                new Phrase("Saludado")
                    .withAlternative(roles => "[Saludado]: Hola don [Saludador], igualmente."),
                new Phrase("Saludador")
                    .withAlternative(
                        roles => "[Saludador]: Guapa y elegante, como siempre.", 
                        roles => new Effect("Saludado", [ EffectComponent.positive(EffectKind.Happiness, EffectStrength.Low) ]))
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Saludador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Saludador"), roles.get("Saludado"))
                && roles.get("Saludador").Characteristics.is("Nacional")
                && roles.get("Saludado").Name === "Socorro"
                && roles.get("Saludador").IsActive
                && roles.get("Saludado").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Saludador").Individual.name))
                && !postconditions.exists(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Saludo", roles.get("Saludador").Individual.name, roles.get("Saludado").Individual.name, true))
        ).intimate());

        this._elements.push(new Interaction(
            "HijaAyudaFamiliar",
            "[Hija] ayuda a [Padre]",
            new RolesDescriptor("Hija", [ "Padre" ]),
            [
                new Phrase("Hija")
                    .withAlternative(roles => randomFromList([
                        "[Hija] arregla el cuello de la camisa de [Padre].",
                        "[Hija] limpia un hilillo de saliva de [Padre].",
                        "[Hija] arregla con sus dedos el despeinado pelo de [Padre].",
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Hija")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Hija"), roles.get("Padre"))
                && check(roles.get("Hija").Personality.pesimisticOptimistic)
                && roles.get("Hija").IsActive
                && roles.get("Hija").Relations.get(roles.get("Padre").Name).familiarity === Familiar.Parent,
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "TosCarraspeo",
            "[Tosedor] tose o carraspea cerca de [Escuchador]",
            new RolesDescriptor("Tosedor", [ "Escuchador" ]),
            [
                new Phrase("Tosedor", "Escuchador")
                    .withAlternative(roles => randomFromList([
                        "[Tosedor] tose con fuerza al lado de [Escuchador].",
                        "[Tosedor] carraspea profusamente cerca de [Escuchador].",
                    ]),
                    roles => new Effect("Escuchador", [ 
                        EffectComponent.negative(EffectKind.Sex, EffectStrength.Low),
                        EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low) 
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Tosedor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Tosedor"), roles.get("Escuchador"))
                && roles.get("Tosedor").Characteristics.is("Residente")
                && roles.get("Escuchador").Characteristics.is("Auxiliar")
                && roles.get("Tosedor").IsActive
                && roles.get("Escuchador").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Tosedor").Individual.name))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Tosedor").Individual.name, roles.get("Escuchador").Individual.name, true))
                && check(100 - roles.get("Tosedor").Personality.politeUnpolite),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "EncenderTele",
            "[Encendedor] enciende la tele",
            new RolesDescriptor("Encendedor"),
            [
                new Phrase("Encendedor")
                    .withAlternative(roles => "[Encendedor] enciende el televisor del salón."),
                new Phrase("Encendedor")
                    .withAlternative(roles => "En la tele están dando el \"Sálvame\".")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Encendedor")).name === "Salon"
                && roles.get("Encendedor").Characteristics.is("Auxiliar")
                && roles.get("Encendedor").IsActive
                && postconditions.exists(Sentence.build("Luz"))
                && postconditions.exists(Sentence.build("Balcon"))
                && postconditions.exists(Sentence.build("Lavabo"))
                && !postconditions.exists(Sentence.build("Tele")),
            (roles, map) => new TruthTable()
                .with(Sentence.build("TeleCorazon"))
        ));

        this._elements.push(new Interaction(
            "PreguntaRacista",
            "[Preguntador] hace pregunta racista",
            new RolesDescriptor("Preguntador", [ "Preguntada" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(
                        roles => "[Preguntador]: Oye guapa, ¿todavía te juntas con el negro ese?",
                        roles => new Effect("Preguntada", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                        ])
                    ),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada]: Perdone pero \"el negro ese\" tiene un nombre.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Residente")
                && !roles.get("Preguntador").Characteristics.is("Demente")
                && roles.get("Preguntador").Aspect.sex === SexKind.Male
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Preguntador").Individual.name))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Preguntador").Individual.name, roles.get("Preguntada").Individual.name, true)),
            (roles, map) => new TruthTable()
                .with(Sentence.build("Racista", roles.get("Preguntador").Individual.name))
        ).intimate());

        this._elements.push(new Interaction(
            "PreguntaRacista2",
            "[Preguntador] hace pregunta racista y sexista",
            new RolesDescriptor("Preguntador", [ "Preguntada" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(roles => "[Preguntador]: Si sigues con el negro seguro que tiene un buen mondongo."),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada] hace como que no ha oído la frase.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Residente")
                && !roles.get("Preguntador").Characteristics.is("Demente")
                && roles.get("Preguntador").Aspect.sex === SexKind.Male
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Preguntador").Individual.name))
                && postconditions.exists(Sentence.build("Racista", roles.get("Preguntador").Individual.name)),
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "PreguntaDomingo",
            "[Preguntador] pregunta por el marido",
            new RolesDescriptor("Preguntador", [ "Preguntada" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(roles => "[Preguntador]: ¿Hoy no viene Domingo contigo de visita guapa?"),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada]: No cielo, hoy mi Domingo tiene un congreso de baile."),
                new Phrase("Preguntador")
                    .withAlternative(
                        roles => "[Preguntador]: ¡Uy qué peligro nena! Quién pudiera estar hoy en un congreso de baile...",
                        roles => new Effect("Preguntada", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                        ])
                    )
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Auxiliar")
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && postconditions.exists(Sentence.build("Saludo", roles.get("Preguntador").Individual.name, roles.get("Preguntada").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "PreguntaDomingo2",
            "[Preguntador] pregunta por el marido fuera de tono",
            new RolesDescriptor("Preguntador", [ "Preguntada" ]),
            [
                new Phrase("Preguntador")
                    .withAlternative(roles => "[Preguntador]: Qué pena que no haya venido Domingo. ¡Ese sí que me alegraría la mañana!"),
                new Phrase("Preguntada")
                    .withAlternative(roles => "[Preguntada]: A la única que alegra las mañanas Domingo es a mi bonita."),
                new Phrase("Preguntador")
                    .withAlternative(
                        roles => "[Preguntador]: No me extraña que te pongas celosa. Yo en tu lugar lo estaría, y mucho.",
                        roles => new Effect("Preguntada", [
                            EffectComponent.negative(EffectKind.Happiness, EffectStrength.Low),
                            EffectComponent.negative(EffectKind.Friend, EffectStrength.Low)
                        ])
                    )
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Preguntador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Preguntador"), roles.get("Preguntada"))
                && roles.get("Preguntador").Characteristics.is("Auxiliar")
                && roles.get("Preguntada").Name === "Socorro"
                && roles.get("Preguntador").IsActive
                && roles.get("Preguntada").IsActive
                && postconditions.exists(Sentence.build("Saludo", roles.get("Preguntador").Individual.name, roles.get("Preguntada").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "ComentarioCorazon",
            "[Comentador] hace un comentario sobre programa del corazon",
            new RolesDescriptor("Comentador"),
            [
                new Phrase("Comentador")
                    .withAlternative(roles => `En la tele aparece una notícia sobre ${randomFromList([ 
                        "Isabel Preysler", 
                        "Isabel Pantoja", 
                        "Alba Carrillo", 
                        "Cristina Ortiz",
                        "Belén Esteban",
                        "Aída Nizar",
                        "Yola Berrocal",
                        "Aramis Fuster",
                        "Lydia Lozano",
                        "Nuria Bermúdez"
                    ])}.`),
                new Phrase("Comentador")
                    .withAlternative(roles => randomFromList([
                        "[Comentador]: No hay manera de que esta mujer se centre un poco.",
                        "[Comentador]: Qué vida más movida llevan algunas.",
                        "[Comentador]: Siempre está igual ésta. Cuando no es con uno es con otro.",
                        "[Comentador]: A saber de dónde saca tanto dinero esta tipa."
                    ])),
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Comentador")).name === "Salon"
                && roles.get("Comentador").Aspect.sex === SexKind.Female
                && roles.get("Comentador").IsHuman === false
                && roles.get("Comentador").IsActive
                && postconditions.exists(Sentence.build("TeleCorazon"))
                && !postconditions.exists(Sentence.build("TeleDeportes"))
                && !postconditions.exists(Sentence.build("TelePolitica"))
                && !postconditions.exists(Sentence.build("TeleApagada")),
            (roles, map) => TruthTable.empty
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
            "CaeAlgo",
            "A [Caedor] se le cae algo",
            new RolesDescriptor("Caedor", [ "Recogedor" ]),
            [
                new Phrase("Caedor", "Recogedor")
                    .withAlternative(roles => randomFromList([
                        "[Caedor] tira disimuladamente un pañuelo al suelo cuando [Recogedor] pasa por su lado.",
                        "[Caedor] tira fingiendo un despiste su reloj de bolsillo al suelo cuando [Recogedor] pasa por su lado."
                    ])),
                new Phrase("Recogedor", "Caedor")
                    .withAlternative(
                        roles => "[Recogedor] se agacha justo delante de [Caedor] y se lo devuelve.",
                        roles => new Effect("Caedor", [
                            EffectComponent.positive(EffectKind.Sex, EffectStrength.Medium),
                            EffectComponent.positive(EffectKind.Happiness, EffectStrength.Low)
                        ])),
                new Phrase("Caedor", "Recogedor")
                    .withAlternative(roles => "[Caedor]: Muchas gracias guapísima.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Caedor")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Caedor"), roles.get("Recogedor"))
                && roles.get("Recogedor").Characteristics.is("Auxiliar")
                && roles.get("Caedor").Characteristics.is("Residente")
                && !roles.get("Caedor").Characteristics.is("Demente")
                && roles.get("Caedor").Aspect.sex === SexKind.Male
                && roles.get("Recogedor").IsActive
                && roles.get("Caedor").IsActive
                && !postconditions.exists(Sentence.build("Agresor", roles.get("Caedor").Individual.name))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Caedor").Individual.name, roles.get("Recogedor").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

        this._elements.push(new Interaction(
            "Medicacion",
            "[Medicador] da la medicación a [Medicado]",
            new RolesDescriptor("Medicador", [ "Medicado" ]),
            [
                new Phrase("Medicador", "Medicado")
                    .withAlternative(roles => "[Medicador] prepara el pastillero y un vasito de agua para [Medicado]."),
                new Phrase("Medicador", "Medicado")
                    .withAlternative(
                        roles => roles.get("Medicado").Characteristics.is("Demente")
                            ? "[Medicador]: Venga, le abrimos la boquita y pa'dentro."
                            : randomFromList([
                                "[Medicador]: Venga [Medicado], ya tienes preparadas tus chucherías de la mañana.",
                                "[Medicador]: Venga [Medicado], aquí tienes el vasito con los caramelitos matutinos.",
                                "[Medicador]: Venga [Medicado], todas de un trago. Que te vea yo.",
                            ]),
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? Effect.null() 
                            : new Effect("Medicado", [ EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium) ])
                    ),
                new Phrase("Medicado")
                    .withAlternative(
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? "[Medicado] se traga las pastillas mecánicamente." 
                            : "[Medicado] se traga las pastillas a disgusto.",
                        roles => Effect.null(),
                        roles => Sentence.build("Medicado", roles.get("Medicado").Individual.name)
                    )
                    .withAlternative(
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? "[Medicado] se traga las pastillas mecánicamente." 
                            : "[Medicado] finge tragarse las pastillas para escupirlas después.",
                        roles => Effect.null(),
                        roles => roles.get("Medicado").Characteristics.is("Demente") 
                            ? Sentence.build("Medicado", roles.get("Medicado").Individual.name)
                            : Sentence.build("MedicadoFake", roles.get("Medicado").Individual.name)
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Medicador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Medicador"), roles.get("Medicado"))
                && roles.get("Medicador").Characteristics.is("Auxiliar")
                && roles.get("Medicado").Characteristics.is("Residente")
                && roles.get("Medicador").IsActive
                && roles.get("Medicado").IsActive
                && postconditions.exists(Sentence.build("Luz"))
                && postconditions.exists(Sentence.build("Balcon"))
                && postconditions.exists(Sentence.build("Lavabo"))
                && !postconditions.exists(Sentence.build("Medicado", roles.get("Medicado").Individual.name))
                && !postconditions.exists(Sentence.build("MedicadoFake", roles.get("Medicado").Individual.name))
                && postconditions.exists(Sentence.build("Saludo", roles.get("Medicador").Individual.name, roles.get("Medicado").Individual.name, true)),
            (roles, map) => TruthTable.empty
        ).intimate());

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
            "CriticaBalconDesconocido",
            "[Criticon] grita a un transeúnte",
            new RolesDescriptor("Criticon"),
            [
                new Phrase("Criticon")
                    .withAlternative(roles => "[Criticon] se asoma por la barandilla del balcón y ve a alguien pasar."),
                new Phrase("Criticon")
                    .withAlternative(roles => randomFromList([
                        "[Criticon]: ¡Tápate el canalillo fresca! ¡Te veo el ombligo desde aquí!",
                        "[Criticon]: ¡No mires al movil al andar atontao! ¡Que te vas a estampar con una farola!",
                        "[Criticon]: ¡Recoge la mierda del perro guarro! ¡Es más limpio el perro que tú!",
                        "[Criticon]: ¡Córtate esas greñas melenudo! ¡A saber las pulgas que llevas ahí dentro!",
                        "[Criticon]: ¡Ponte una falda más larga golfa! ¡Puedo verte la marca de las bragas desde aquí!"
                    ]))
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Criticon")).name === "Terraza"
                && roles.get("Criticon").Characteristics.is("Residente")
                && !roles.get("Criticon").Characteristics.is("Demente")
                && roles.get("Criticon").Characteristics.is("Impedido")
                && roles.get("Criticon").IsActive
                && roles.get("Criticon").Aspect.sex === SexKind.Female,
            (roles, map) => TruthTable.empty
        ));

        this._elements.push(new Interaction(
            "CriticaBalconAuxiliar",
            "[Criticon] critica a [Otro] por fumar",
            new RolesDescriptor("Criticon", ["Otro"]),
            [
                new Phrase("Criticon")
                    .withAlternative(roles => "[Criticon]: Ya vas a darle al vicio otra vez..."),
                new Phrase("Otro", "Criticon")
                    .withAlternative(roles => "[Otro]: Algo tendré que hacer para aguantaros a todos lo que queda de día [Criticon]."),
                new Phrase("Criticon", "Otro")
                    .withAlternative(
                        roles => "[Criticon]: Lo que vas a aguantar es una enfermedad terminal, ¡viciosa!.",
                        roles => new Effect("Otro", [EffectComponent.negative(EffectKind.Happiness, EffectStrength.Medium)])
                    )
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Criticon")).name === "Terraza"
                && map.areInTheSameLocation(roles.get("Criticon"), roles.get("Otro"))
                && roles.get("Criticon").Characteristics.is("Residente")
                && !roles.get("Criticon").Characteristics.is("Demente")
                && roles.get("Criticon").Characteristics.is("Impedido")
                && roles.get("Otro").Characteristics.is("Auxiliar")
                && postconditions.exists(Sentence.build("Balcon"))
                && roles.get("Criticon").IsActive
                && roles.get("Criticon").Aspect.sex === SexKind.Female,
            (roles, map) => TruthTable.empty
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
            "ResidenteDuerme",
            "[Dormidor] se duerme",
            new RolesDescriptor("Dormidor"),
            [
                new Phrase("Dormidor")
                    .withAlternative(roles => roles.get("Dormidor").Aspect.sex === SexKind.Male 
                        ? "[Dormidor] se queda dormido."
                        : "[Dormidor] se queda dormida."
                    )
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Dormidor")).name === "Salon"
                && roles.get("Dormidor").Characteristics.is("Residente")
                && roles.get("Dormidor").IsActive
                && postconditions.exists(Sentence.build("Medicado", roles.get("Dormidor").Individual.name))
                && !postconditions.exists(Sentence.build("Descansado", roles.get("Dormidor").Individual.name)),
            (roles, map) => {
                roles.get("Dormidor").deactivate();
                return TruthTable.empty;
            }
        ));

        this._elements.push(new Interaction(
            "ResidenteDespierta",
            "[Dormidor] se despierta",
            new RolesDescriptor("Dormidor"),
            [
                new Phrase("Dormidor")
                    .withAlternative(roles => roles.get("Dormidor").Aspect.sex === SexKind.Male 
                        ? randomFromList([
                            "[Dormidor] se despierta sobresaltado, mirando alrededor.",
                            "[Dormidor] se despierta taciturno."
                         ])
                        : "[Dormidor] se despierta tranquilamente."
                    )
            ],
            Timing.Repeteable,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Dormidor")).name === "Salon"
                && roles.get("Dormidor").Characteristics.is("Residente")
                && !roles.get("Dormidor").IsActive,
            (roles, map) => {
                roles.get("Dormidor").activate();
                return new TruthTable()
                    .with(Sentence.build("Descansado", roles.get("Dormidor").Individual.name));
            }
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
            "RecuerdoFructuoso",
            "Fructuoso recuerda un suceso de la guerra civil",
            new RolesDescriptor("Recordador"),
            [
                new Phrase("Recordador")
                    .withAlternative(roles => "[Recordador] se mira las manos aturdido. Lo que acaba de pasar le hace recordar una historia de hace mucho tiempo. Una historia que casi había olvidado."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Fructuoso tiene el fusil en la mano. Está en la cima de una colina y delante suyo hay un muchacho lloroso y desnudo."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Su cuerpo está lleno de heridas por las torturas que le han hecho los soldados."),
                new Phrase("Recordador")
                    .withAlternative(roles => "\"Mata al maricón este y vuelve al campamento cagando hostias\" dice el sargento detrás suyo. Oye como se marcha con los otros."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Fructuoso tiene la misma sensación que cuando estuvo en ese instante y lugar. El mismo nudo en el estómago. El mismo vértigo de sentir estar a solo un paso de convertirse en un monstruo."),
                new Phrase("Recordador")
                    .withAlternative(roles => "El chico sigue balbuceando entre lloros \"No soy un invertido... lo juro, le digo la verdad\". Fructuoso mira el fusil y luego vuelve a mirar al chico."),
                new Phrase("Recordador")
                    .withAlternative(roles => "Entonces se enfoca en sus ojos vidriosos. El chico tiembla. Fructuoso también, nunca ha matado a nadie. Levanta el rifle y apunta a la cabeza del chico. Pone el dedo en el gatillo."),
                new Phrase("Recordador")
                    .withAlternative(
                        roles => "Fructuoso dispara al chico en la cabeza",
                        roles => Effect.null(),
                        roles => Sentence.build("Malo", roles.get("Recordador").Individual.name)
                    )
                    .withAlternative(
                        roles => "Fructuoso dispara al aire y le deja huir",
                        roles => Effect.null(),
                        roles => Sentence.build("Bueno", roles.get("Recordador").Individual.name)
                    ),
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Recordador")).name === "Salon"
                && roles.get("Recordador").Name === "Fructuoso"
                && roles.get("Recordador").IsActive
                && postconditions.exists(Sentence.build("Agresor", roles.get("Recordador").Individual.name)),
            (roles, map) => {
                roles.get("Recordador").dehumanize();
                return new TruthTable()
                    .with(Sentence.build("Recuerdo", roles.get("Recordador").Individual.name));
            }
        ));

        this._elements.push(new Interaction(
            "Retiro",
            "[Retirador] se retira a su cuarto",
            new RolesDescriptor("Retirador", [ "Otro" ]),
            [
                new Phrase("Retirador")
                    .withAlternative(roles => "[Retirador] sigue un poco aturdido después del vívido recuerdo."),
                new Phrase("Retirador")
                    .withAlternative(roles => "[Retirador]: yo... yo..."),
                new Phrase("Otro", "Retirador")
                    .withAlternative(roles => "[Otro]: ¿Se encuentra bien don [Retirador]?"),
                new Phrase("Retirador")
                    .withAlternative(roles => "[Retirador]: Sí... estoy bien. Gracias [Otro]. Creo que voy a descansar un poco al cuarto."),
                new Phrase("Otro")
                    .withAlternative(roles => "[Otro]: Como usted vea."),
                new Phrase("Retirador")
                    .withAlternative(roles => roles.get("Retirador").Characteristics.is("Impedido")
                        ? "[Retirador] se marcha del salón por el ascensor, con semblante sombrío."
                        : "[Retirador] se marcha del salón subiendo cabizbajo las escaleras.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Retirador")).name === "Salon"
                && roles.get("Retirador").IsActive
                && postconditions.exists(Sentence.build("Recuerdo", roles.get("Retirador").Individual.name)),
            (roles, map) => {
                map.move(roles.get("Retirador"), map.getLocation("Limbo"));
                return new TruthTable()
                    .with(Sentence.build("Fin"));
            }
        ));

        this._elements.push(new Interaction(
            "ApagarTele",
            "[Apagador] apaga la tele",
            new RolesDescriptor("Apagador", [ "Ayudante" ]),
            [
                new Phrase("Apagador")
                    .withAlternative(roles => "[Apagador]: Señoritos y señorita, hora de comer."),
                new Phrase("Ayudante")
                    .withAlternative(roles => "[Ayudante]: ¡Uy que tarde es! [Apagador] tiene razón, hay que ir tirando ya pa'l comedor."),
                new Phrase("Apagador")
                    .withAlternative(roles => "[Apagador] coge el mando del televisor y lo apaga.")
            ],
            Timing.GlobalSingle,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Apagador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Apagador"), roles.get("Ayudante"))
                && roles.get("Apagador").Characteristics.is("Auxiliar")
                && roles.get("Ayudante").Characteristics.is("Auxiliar")
                && roles.get("Apagador").IsActive
                && roles.get("Ayudante").IsActive
                && roles.get("Apagador").Happiness.isUnhappy
                && roles.get("Ayudante").Happiness.isUnhappy
                && postconditions.exists(Sentence.build("TelePolitica")),
            (roles, map) => {
                return new TruthTable()
                    .with(Sentence.build("TeleApagada"))
                    .with(Sentence.build("Comer"));
            }
        ));

        this._elements.push(new Interaction(
            "LlevarResidenteAComer",
            "[Llevador] se lleva a [Llevado] al comedor",
            new RolesDescriptor("Llevador", [ "Llevado" ]),
            [
                new Phrase("Llevador", "Llevado")
                    .withAlternative(roles => "[Llevador] se lleva a [Llevado] al comedor.")
            ],
            Timing.Single,
            (postconditions, roles, map) => 
                map.getUbication(roles.get("Llevador")).name === "Salon"
                && map.areInTheSameLocation(roles.get("Llevador"), roles.get("Llevado"))
                && roles.get("Llevador").IsActive
                && roles.get("Llevador").Characteristics.is("Auxiliar")
                && roles.get("Llevado").Characteristics.is("Residente")
                && postconditions.exists(Sentence.build("Comer")),
            (roles, map) => {
                map.move(roles.get("Llevado"), map.getLocation("Limbo"));
                return TruthTable.empty;
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