import { Reactions, EffectReaction } from "npc-emotional";
import { randomFromList } from "role-methods";

export function parse(reactions: Reactions): string[]{
    let lines: string[] = [];

    if (!reactions.any)
        lines.push("A nadie parece influirle esto.");
    else{
        for(let reaction of reactions.elements){
            let description = parseReaction(reaction.name, reaction.reaction);
            lines.push(description);
        }
    }

    return lines;
}

function parseReaction(name: string, reaction: EffectReaction): string{
    switch (reaction)
    {
        case EffectReaction.VeryPositive:
            return randomFromList(
            [
                `A ${name} le ha extasiado esto.`,
                `A ${name} le ha encantado.`,
                `${name} se ha deleitado con esto.`
            ]);

        case EffectReaction.Positive:
            return randomFromList(
            [
                `A ${name} le ha alegrado esto.`,
                `A ${name} le ha gustado esto.`,
                `A ${name} le ha molado esto.`
            ]);

        case EffectReaction.Negative:
            return randomFromList(
            [
                `A ${name} no le ha gustado nada eso.`,
                `A ${name} no le ha parecido bien esto.`,
                `A ${name} no le ha enrollao esto.`,
                `A ${name} le sentado mal esto.`,
                `A ${name} le ha puesto triste esto.`
            ]);

        case EffectReaction.VeryNegative:
            return randomFromList(
            [
                `A ${name} le ha disgustado esto notablemente.`,
                `A ${name} le ha sentado fatal esto.`,
                `A ${name} le ha parecido una mierda esto.`,
                `A ${name} le ha jodido notablemente esto.`
            ]);

        default:
            return "";
    }
}