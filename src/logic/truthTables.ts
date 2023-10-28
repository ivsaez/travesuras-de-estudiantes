import { TruthTable, Sentence } from "first-order-logic";

export class Tables{
    private static _tables: Map<string, TruthTable> = new Map<string, TruthTable>([
        ["Paco", new TruthTable()
            .with(Sentence.build("Estudiante", "Sebas"))
            .with(Sentence.build("Estudiante", "Mari"))
            .with(Sentence.build("Estudiante", "Susi"))
            .with(Sentence.build("Estudiante", "Goiko"))],
        ["Sebas", new TruthTable()
            .with(Sentence.build("Profesor", "Paco"))
            .with(Sentence.build("Estudiante", "Mari"))
            .with(Sentence.build("Estudiante", "Susi"))
            .with(Sentence.build("Estudiante", "Goiko"))],
        ["Mari", new TruthTable()
            .with(Sentence.build("Estudiante", "Sebas"))
            .with(Sentence.build("Profesor", "Paco"))
            .with(Sentence.build("Estudiante", "Susi"))
            .with(Sentence.build("Estudiante", "Goiko"))],
        ["Susi", new TruthTable()
            .with(Sentence.build("Estudiante", "Sebas"))
            .with(Sentence.build("Estudiante", "Mari"))
            .with(Sentence.build("Profesor", "Paco"))
            .with(Sentence.build("Estudiante", "Goiko"))],
        ["Goiko", new TruthTable()
            .with(Sentence.build("Estudiante", "Sebas"))
            .with(Sentence.build("Estudiante", "Mari"))
            .with(Sentence.build("Estudiante", "Susi"))
            .with(Sentence.build("Profesor", "Paco"))],
        ["Eladio", new TruthTable()
            .with(Sentence.build("Policia", "Almudena"))],
        ["Almudena", new TruthTable()
            .with(Sentence.build("Policia", "Eladio"))],
    ]);
    
    static tableFrom(actorName: string): TruthTable{
        if(!this._tables.has(actorName))
            throw new Error("Actor doesn't exist.");
        
        return this._tables.get(actorName);
    }
}