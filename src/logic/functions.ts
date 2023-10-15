import { Function, Cardinality } from "first-order-logic";

export class Functions{
    private static _funcs: Function[] = [
        new Function("Fin", Cardinality.None),
        new Function("Botellas", Cardinality.None),
        new Function("Ubicado", Cardinality.None),
        new Function("Desenmascarado", Cardinality.One),
        new Function("Estudiante", Cardinality.One),
        new Function("Profesor", Cardinality.One),
        new Function("Saludo", Cardinality.Two, "x", "y", true),
        new Function("Pareja", Cardinality.Two, "x", "y", true),
        
        new Function("Comer", Cardinality.None),
        new Function("Republicano", Cardinality.One),
        new Function("Nacional", Cardinality.One),
        new Function("Auxiliar", Cardinality.One),
        new Function("Residente", Cardinality.One),
        new Function("Impedido", Cardinality.One),
        new Function("Demente", Cardinality.One),
        new Function("Racista", Cardinality.One),
        new Function("Medicado", Cardinality.One),
        new Function("MedicadoFake", Cardinality.One),
        new Function("Fumador", Cardinality.One),
        new Function("Salido", Cardinality.One),
        new Function("Pobre", Cardinality.One),
        new Function("Descansado", Cardinality.One),
        new Function("Cagado", Cardinality.One),
        new Function("Agresor", Cardinality.One),
        new Function("Recuerdo", Cardinality.One),
        new Function("Bueno", Cardinality.One),
        new Function("Malo", Cardinality.One),
        
    ];

    static get all(): Function[]{
        return this._funcs;
    }
}