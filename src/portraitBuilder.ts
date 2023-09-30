import { Agent } from "agents-flow";

import paco_happy from './images/paco_happy.png';
import paco_normal from './images/paco_normal.png';
import paco_unhappy from './images/paco_unhappy.png';
import paco_bolsa from './images/paco_bolsa.png';
import sebas_happy from './images/sebas_happy.png';
import sebas_normal from './images/sebas_normal.png';
import sebas_unhappy from './images/sebas_unhappy.png';
import susi_happy from './images/susi_happy.png';
import susi_normal from './images/susi_normal.png';
import susi_unhappy from './images/susi_unhappy.png';
import mari_happy from './images/mari_happy.png';
import mari_normal from './images/mari_normal.png';
import mari_unhappy from './images/mari_unhappy.png';
import goiko_happy from './images/goiko_happy.png';
import goiko_normal from './images/goiko_normal.png';
import goiko_unhappy from './images/goiko_unhappy.png';

export function buildPortraitFor(agent: Agent): string{
    if(agent.Name === "Paco"){
        return agent.Happiness.isHappy
            ? paco_happy
            : agent.Happiness.isUnhappy
                ? paco_unhappy
                : paco_normal;
    }
    else if(agent.Name === "Sebas"){
        return agent.Happiness.isHappy
            ? sebas_happy
            : agent.Happiness.isUnhappy
                ? sebas_unhappy
                : sebas_normal;
    }
    else if(agent.Name === "Susi"){
        return agent.Happiness.isHappy
            ? susi_happy
            : agent.Happiness.isUnhappy
                ? susi_unhappy
                : susi_normal;
    }
    else if(agent.Name === "Mari"){
        return agent.Happiness.isHappy
            ? mari_happy
            : agent.Happiness.isUnhappy
                ? mari_unhappy
                : mari_normal;
    }
    else if(agent.Name === "Goiko"){
        return agent.Happiness.isHappy
            ? goiko_happy
            : agent.Happiness.isUnhappy
                ? goiko_unhappy
                : goiko_normal;
    }
    
    return "";
}