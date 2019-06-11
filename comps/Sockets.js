import React, { Component } from "react";
import Router from "next/router";
const { socketUrl } = require("../config");

export default class Sockets extends Component {
  state = {
    clients: []
  };
  ws = new WebSocket(socketUrl);

  componentDidMount() {
    this.ws.onopen = () => {
      console.log("connected");
      this.ws.send(JSON.stringify({ type: "client", name: this.props.name }));
    };

    this.ws.onmessage = message => {
      const json = JSON.parse(message.data);
      console.log(json);
      if (json.type === "clients") {
        this.setState({ clients: json.data });
      }
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
    };
  }

  onStart = () => {
    this.ws.send(JSON.stringify({ type: "start" }));
  };

  onNextQuestion = () => {
    this.ws.send(JSON.stringify({ type: "next" }));
  };

  onReset = () => {
    this.ws.send(JSON.stringify({ type: "reset" }));
  };

  onShowResult = () => {
    Router.push("/moderator/result");
  };

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return (
      <div className="start-screen">
        <div>
          <h2>Controls</h2>
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onStart}
            >
              Start
            </button>
          </div>
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onNextQuestion}
            >
              Next Question
            </button>
          </div>
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onReset}
            >
              Reset
            </button>
          </div>
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onShowResult}
            >
              Show Results
            </button>
          </div>
        </div>
        <div>
          <h2>Teams Joined</h2>
          {this.state.clients.map((name, key) => (
            <div key={`${name}${key}`}>
              {name != "moderator" && <div>{name}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
