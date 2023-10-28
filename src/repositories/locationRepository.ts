import { Location } from "agents-flow";

export class LocationRepository{
    private _elements: Location[];

    constructor(){
        this._elements = [];

        let limbo = new Location("Limbo");
        let sotano = new Location("Sotano");
        let fuera = new Location("Fuera");
        let comisaria = new Location("Comisaria");

        this._elements.push(limbo);
        this._elements.push(sotano);
        this._elements.push(fuera);
        this._elements.push(comisaria);

        Location.join(sotano, fuera);
        Location.join(sotano, limbo);
        Location.join(fuera, comisaria);
    }

    get all(){
        return this._elements;
    }

    get(name: string): Location | null{
        let filtered = this._elements.filter(x => x.name === name);
        return filtered.length === 0 ? null : filtered[0];
    }
}