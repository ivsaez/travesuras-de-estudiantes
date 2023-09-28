import { Location } from "agents-flow";

export class LocationRepository{
    private _elements: Location[];

    constructor(){
        this._elements = [];

        let salon = new Location("Salon");
        let bath = new Location("Lavabo");
        let terrace = new Location("Terraza");
        let limbo = new Location("Limbo");
        let recepcion = new Location("Recepcion");

        this._elements.push(salon);
        this._elements.push(bath);
        this._elements.push(terrace);
        this._elements.push(limbo);
        this._elements.push(recepcion);

        Location.join(salon, bath);
        Location.join(salon, terrace);
        Location.join(salon, limbo);
    }

    get all(){
        return this._elements;
    }

    get(name: string): Location | null{
        let filtered = this._elements.filter(x => x.name === name);
        return filtered.length === 0 ? null : filtered[0];
    }
}