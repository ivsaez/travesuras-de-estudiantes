import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import Card from 'react-bootstrap/esm/Card';
import AgentMessage from './AgentMessage';

interface MessageProps{
    agentMessage: AgentMessage;
    image: string;
}

function Message(props: MessageProps){
    return (
        <Card className="card rounded mb-2 bg-dark border-light shadow-lg shadow-light shadow-intensity-lg">
          <div className="row no-gutters">
            {leftImage(props.image, props.agentMessage.sided)}
            <div className="col">
              <div className="card-block px-2">
                  <Card.Title className="card-title mt-1">{props.agentMessage.agent}</Card.Title>
                  <Card.Text className="card-text">{props.agentMessage.message}</Card.Text>
              </div>
            </div>
            {rightImage(props.image, props.agentMessage.sided)}
          </div>
        </Card>
    );
}

function leftImage(image: string, rightSided: boolean){
    if(rightSided)
        return <></>;
    
        return imageComponent(image);
}

function rightImage(image: string, rightSided: boolean){
    if(!rightSided)
        return <></>;
    
    return imageComponent(image);
}

function imageComponent(image: string){
    return (<div className="col-auto">
        <img src={image} className="img-fluid" alt="face" />
    </div>);
}

export default Message;