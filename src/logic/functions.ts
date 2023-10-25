import { Function, Cardinality } from "first-order-logic";

export class Functions{
    private static _funcs: Function[] = [
        new Function("Fin", Cardinality.None),
        new Function("Nothing", Cardinality.None),
        new Function("Botellas", Cardinality.None),
        new Function("Ubicado", Cardinality.None),
        new Function("PrimeraHostia", Cardinality.None),
        new Function("PrimeraRajada", Cardinality.None),
        new Function("Potado", Cardinality.None),
        new Function("Desenmascarado", Cardinality.One),
        new Function("Estudiante", Cardinality.One),
        new Function("Profesor", Cardinality.One),
        new Function("DesnudoArriba", Cardinality.One),
        new Function("DesnudoAbajo", Cardinality.One),
        new Function("Saludo", Cardinality.Two, "x", "y", true),
        new Function("Pareja", Cardinality.Two, "x", "y", true),
        new Function("Amenaza", Cardinality.Two, "x", "y", true),
        new Function("Manipula", Cardinality.Two, "x", "y", true)
    ];

    static get all(): Function[]{
        return this._funcs;
    }
}