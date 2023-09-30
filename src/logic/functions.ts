import { Function, Cardinality } from "first-order-logic";

export class Functions{
    private static _funcs: Function[] = [
        new Function("Fin", Cardinality.None),
        new Function("Bolsa", Cardinality.One),
        new Function("Atado", Cardinality.One),
        new Function("Estudiante", Cardinality.One),
        new Function("Profesor", Cardinality.One),
        
        new Function("Penumbra", Cardinality.None),
        new Function("Luz", Cardinality.None),
        new Function("Lavabo", Cardinality.None),
        new Function("Balcon", Cardinality.None),
        new Function("TeleCorazon", Cardinality.None),
        new Function("TeleDeportes", Cardinality.None),
        new Function("TelePolitica", Cardinality.None),
        new Function("TeleApagada", Cardinality.None),
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
        new Function("Saludo", Cardinality.Two),
    ];

    static get all(): Function[]{
        return this._funcs;
    }
}