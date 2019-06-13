import React, { Component } from "react";
import Router from "next/router";
const { socketUrl } = require("../config");
import { reset } from "../helpers";

export default class Sockets extends Component {
  state = {
    clients: [],
    question: 1
  };

  ws = new WebSocket(socketUrl);
  componentDidMount() {
    if (
      JSON.parse(localStorage.getItem("question")) &&
      JSON.parse(localStorage.getItem("question")).currentQuestion
    ) {
      this.setState({
        question:
          JSON.parse(localStorage.getItem("question")).currentQuestion || 1
      });
    }
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

  onNextQuestion = number => {
    this.ws.send(JSON.stringify({ type: "next", question: number }));
  };

  onShowInstructionsScreenOnTV = () => {
    this.ws.send(JSON.stringify({ type: "show-instructions" }));
  };

  onShowWinnerScreen = () => {
    this.ws.send(JSON.stringify({ type: "winner-screen" }));
  };

  onNext = () => {
    let currentQuestion = this.state.question + 1;
    this.onNextQuestion(currentQuestion);
    this.setState({ question: currentQuestion });

    localStorage.setItem("question", JSON.stringify({ currentQuestion }));
  };

  onReset = () => {
    reset();
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
          {this.state.question != 12 && (
            <div>
              <button
                className="blue-button blue-button-width"
                onClick={this.onNext}
              >
                Next Question: {this.state.question + 1}
              </button>
            </div>
          )}
          {/* <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onShowResult}
            >
              Show Results
            </button>
          </div> */}
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onShowInstructionsScreenOnTV}
            >
              Show Instructions Screen On TV
            </button>
          </div>
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onShowWinnerScreen}
            >
              Show Winner Screen
            </button>
          </div>
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={this.onReset}
            >
              Reset Users (Use Carefully)
            </button>
          </div>
          <div>
            <button
              className="blue-button blue-button-width"
              onClick={() => {
                localStorage.setItem("question", null);
                this.setState({ question: 1 });
              }}
            >
              Reset Questions (Use Carefully)
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
