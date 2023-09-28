import { Axiom/*, Function, Cardinality*/ } from "first-order-logic";

export class Rules{
    private static _rules: Axiom[] = [
        /*new Axiom([
            new Function("Cocacola", Cardinality.One),
            new Function("Mentos", Cardinality.One)
        ],
        new Function("Idiota", Cardinality.One))*/
    ];

    static get all(): Axiom[]{
        return this._rules;
    }
}