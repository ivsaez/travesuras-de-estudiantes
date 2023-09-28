import "bootstrap/dist/css/bootstrap.min.css";

import {
  MapStructure,
  World,
  Scenario,
  FinishingConditions,
  Agents,
  Input,
  ScenarioEndNoInteractions,
  ScenarioEndAllConditionsMet,
  Agent,
} from "agents-flow";
import React, { useState, useEffect } from "react";
import {
  AgentRepository,
  EndingAgentRepository,
} from "./repositories/agentRepository";
import {
  InteractionRepository,
  EndingInteractionRepository,
} from "./repositories/interactionRepository";
import { LocationRepository } from "./repositories/locationRepository";
import { Functions } from "./logic/functions";
import { Rules } from "./logic/rules";
import { Tables } from "./logic/truthTables";
import { parse } from "./reactionsParser";
import { Sentence } from "first-order-logic";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Message from "./Message";
import AgentMessage from "./AgentMessage";
import Navbar from "react-bootstrap/esm/Navbar";
import { buildPortraitFor } from "./portraitBuilder";
import logo from "./images/logo.png";

const CONTINUE = "Continuar";
const START = "Comenzar";

function App() {
  const [count, setCount] = useState(0);
  const [output, setOutput] = useState([
    new AgentMessage("--LA RESIDENCIA (2012)--"),
  ] as AgentMessage[]);

  const [world, setWorld] = useState(null as World);
  const [choices, setChoices] = useState([START] as string[]);

  let agents: AgentRepository = new AgentRepository();
  let endingAgents: EndingAgentRepository = new EndingAgentRepository();
  let locations: LocationRepository = new LocationRepository();
  let interactions: InteractionRepository = new InteractionRepository();
  let endingInteractions: EndingInteractionRepository =
    new EndingInteractionRepository();

  let map: MapStructure = new MapStructure(locations.all);

  useEffect(() => {
    window.process = {
      ...window.process,
    };

    loadLogicData();
    intializeAgentsLocation();
    initializeAgentDesires();
    createWorld();
  }, []);

  useEffect(() => {
    moveToBottom();
  });

  function loadLogicData(): void {
    for (let agent of agents.all) {
      for (let func of Functions.all) {
        agent.logic.functions.add(func);
      }

      for (let axiom of Rules.all) {
        agent.logic.rules.add(axiom);
      }

      for (let known of agent.Relations.knowns) {
        agent.logic.population.add(agents.get(known).Individual);
      }

      agent.logic.table = Tables.tableFrom(agent.Name);
    }
  }

  function intializeAgentsLocation(): void {
    let limbo = map.getLocation("Limbo");

    for (let agent of agents.all) {
      map.move(agent, limbo);
    }

    map.move(agents.get("Raquel"), map.getLocation("Salon"));

    map.move(endingAgents.get("Recepcionista"), map.getLocation("Recepcion"));
    map.move(endingAgents.get("Mariano"), map.getLocation("Recepcion"));
  }

  function initializeAgentDesires(): void {
    /*let ron = agents.get("Ron");
    let agatha = agents.get("Agatha");

    ron.Desires.append(new Desire(crowd => {
      let aga = crowd.get("Agatha");
      let relation = aga.Relations.get("Ron");
      return (relation.metrics.friendship + relation.metrics.love + agatha.Happiness.value) / 3;
    }, [ agatha.Name ]));*/
  }

  function createWorld(): void {
    var residenceScenario = new Scenario(
      "En la residencia",
      map,
      new Agents(agents.all),
      interactions.all,
      new FinishingConditions().with(
        (scenario: Scenario) =>
          scenario.postconditions.exists(Sentence.build("Fin")) ||
          scenario.turn === 250
      )
    );

    var endingScenario = new Scenario(
      "100 later",
      map,
      new Agents(endingAgents.all),
      endingInteractions.all,
      new FinishingConditions().with(
        (scenario: Scenario) => scenario.turn === 20
      )
    ).inheritor();

    let newWorld = new World();
    newWorld.add(residenceScenario);
    newWorld.add(endingScenario);

    setWorld(newWorld);
  }

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setCount(count + 1);

    let input = Input.void();
    if (button != null) {
      if (button.innerText !== CONTINUE && button.innerText !== START) {
        input = new Input(Number(button.name));
      }
    }

    let scenario = world.currentScenario;
    if (scenario !== null) {
      let step = scenario.performStep(input);

      setWorld(world);

      show(step.content);

      let newChoices: string[] = [];
      if (step.hasChoices) {
        for (let choice of step.choices.items) {
          newChoices.push(choice);
        }

        setChoices(newChoices);
      } else {
        newChoices.push(CONTINUE);
        setChoices(newChoices);
      }

      if (step.hasReactions) {
        let newReactions: string[] = parse(step.reactions);
        show(newReactions);
      }
    }
  };

  function moveToBottom(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  function show(texts: string[]): void {
    if (texts.length === 1 && texts[0] === ScenarioEndNoInteractions) {
      output.push(new AgentMessage("--FIN--"));
    } else if (texts.length === 1 && texts[0] === ScenarioEndAllConditionsMet) {
      output.push(new AgentMessage("--¿FIN?--"));
    } else {
      let sideCalculated = false;
      for (let text of texts) {
        let agentMessage = new AgentMessage(text);

        if (!sideCalculated) {
          updateSide(agentMessage);
          sideCalculated = true;
        }

        output.push(agentMessage);
      }
    }

    setOutput(output);
  }

  function updateSide(agentMessage: AgentMessage): void {
    if (!agentMessage.isTalking) return;

    let lastMessage = output[output.length - 1];
    if (!lastMessage.isTalking) return;

    if (lastMessage.agent === agentMessage.agent) return;

    if (lastMessage.sided) return;

    agentMessage.sideToRight();
  }

  function findAgentByName(name: string): Agent {
    let agent = agents.get(name);
    if (agent === null) agent = endingAgents.get(name);

    return agent;
  }

  return (
    <>
      <Navbar fixed="top" bg="primary" expand="lg">
        <Container>
          <Navbar.Brand>
            <img
              src={logo}
              height="30"
              className="d-inline-block align-top"
              alt="La residencia logo"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <div className="m-4">
          <Row className="h-50 mb-3">
            <Col lg="2"></Col>
            <Col lg="8">
              {output.map((message) => {
                if (message.isTalking) {
                  return (
                    <Message
                      agentMessage={message}
                      image={buildPortraitFor(findAgentByName(message.agent))}
                    ></Message>
                  );
                } else {
                  return <div className="mb-2">{message.message}</div>;
                }
              })}
            </Col>
            <Col lg="2"></Col>
          </Row>
          <Row className="mb-3">
            <Col lg="4"></Col>
            <Col lg="4">
              <div className="d-grid gap-2">
                {choices.map((choice, index) => (
                  <Button
                    name={index + ""}
                    className="mb-2"
                    variant="primary"
                    onClick={onButtonClick}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </Col>
            <Col lg="4"></Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default App;
