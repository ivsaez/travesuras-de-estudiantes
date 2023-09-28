import { Agent } from "agents-flow";

import anselmo_happy from './images/toon/anselmo_happy.png';
import anselmo_normal from './images/toon/anselmo_normal.png';
import anselmo_unhappy from './images/toon/anselmo_unhappy.png';
import fructuoso_happy from './images/toon/fructuoso_happy.png';
import fructuoso_normal from './images/toon/fructuoso_normal.png';
import fructuoso_unhappy from './images/toon/fructuoso_unhappy.png';
import jacinta_happy from './images/toon/jacinta_happy.png';
import jacinta_normal from './images/toon/jacinta_normal.png';
import jacinta_unhappy from './images/toon/jacinta_unhappy.png';
import maria_happy from './images/toon/maria_happy.png';
import maria_normal from './images/toon/maria_normal.png';
import maria_unhappy from './images/toon/maria_unhappy.png';
import mariano_happy from './images/toon/mariano_happy.png';
import mariano_normal from './images/toon/mariano_normal.png';
import mariano_unhappy from './images/toon/mariano_unhappy.png';
import raquel_happy from './images/toon/raquel_happy.png';
import raquel_normal from './images/toon/raquel_normal.png';
import raquel_unhappy from './images/toon/raquel_unhappy.png';
import recepcionista_happy from './images/toon/recepcionista_happy.png';
import recepcionista_normal from './images/toon/recepcionista_normal.png';
import recepcionista_unhappy from './images/toon/recepcionista_unhappy.png';
import socorro_happy from './images/toon/socorro_happy.png';
import socorro_normal from './images/toon/socorro_normal.png';
import socorro_unhappy from './images/toon/socorro_unhappy.png';

export function buildPortraitFor(agent: Agent): string{
    if(agent.Name === "Anselmo"){
        return agent.Happiness.isHappy
            ? anselmo_happy
            : agent.Happiness.isUnhappy
                ? anselmo_unhappy
                : anselmo_normal;
    }
    else if(agent.Name === "Fructuoso"){
        return agent.Happiness.isHappy
            ? fructuoso_happy
            : agent.Happiness.isUnhappy
                ? fructuoso_unhappy
                : fructuoso_normal;
    }
    else if(agent.Name === "Jacinta"){
        return agent.Happiness.isHappy
            ? jacinta_happy
            : agent.Happiness.isUnhappy
                ? jacinta_unhappy
                : jacinta_normal;
    }
    else if(agent.Name === "Maria"){
        return agent.Happiness.isHappy
            ? maria_happy
            : agent.Happiness.isUnhappy
                ? maria_unhappy
                : maria_normal;
    }
    else if(agent.Name === "Raquel"){
        return agent.Happiness.isHappy
            ? raquel_happy
            : agent.Happiness.isUnhappy
                ? raquel_unhappy
                : raquel_normal;
    }
    else if(agent.Name === "Socorro"){
        return agent.Happiness.isHappy
            ? socorro_happy
            : agent.Happiness.isUnhappy
                ? socorro_unhappy
                : socorro_normal;
    }
    else if(agent.Name === "Mariano"){
        return agent.Happiness.isHappy
            ? mariano_happy
            : agent.Happiness.isUnhappy
                ? mariano_unhappy
                : mariano_normal;
    }
    else if(agent.Name === "Recepcionista"){
        return agent.Happiness.isHappy
            ? recepcionista_happy
            : agent.Happiness.isUnhappy
                ? recepcionista_unhappy
                : recepcionista_normal;
    }
    
    return "";
}