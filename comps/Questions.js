import React, { Component } from "react";
import Questions from "../data/questions.json";
import { updateAnswer, getScore } from "../helpers";
const { socketUrl } = require("../config");

const defaultState = {
  answer: "",
  time: 0,
  timeUp: false,
  submitted: false,
  closePopup: false,
  score: "",
  gameFinish: false
};

export default class QuestionsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentQuestion: 1,
      answer: "",
      time: 0,
      timeUp: false,
      submitted: false,
      closePopup: false,
      score: "",
      gameFinish: false,
      name: ""
    };
  }

  ws = new WebSocket(socketUrl);

  componentDidMount() {
    this.setState({ name: this.props.url.query.name });
    //this.timeFucn();
    this.init();

    this.ws.onopen = () => {
      console.log("connected");
      this.ws.send(
        JSON.stringify({ type: "client", name: this.props.url.query.name })
      );
    };

    this.ws.onmessage = message => {
      const json = JSON.parse(message.data);
      if (json.type === "next") {
        this.nextQuestion();
      }
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL)
      });
    };
  }

  onClick = e => {
    this.setState({
      answer: e.target.value
    });
  };

  submitAnswer = e => {
    const answer = this.state.answer;
    const name = this.state.name;
    const score = getScore(this.state.time);

    // clear interval + reset
    clearInterval(this.interval);
    this.setState({ time: 0 });

    if (answer == Questions[this.state.currentQuestion].answer) {
      this.setState({
        submitted: true,
        score: score
      });
      updateAnswer(name, this.state.currentQuestion, this.state.answer, score);
    } else {
      this.setState({
        submitted: true,
        score: 0
      });
      updateAnswer(name, this.state.currentQuestion, this.state.answer, 0);
    }
  };

  interval = null;

  init = () => {
    //start timer after 1.5 seconds
    setTimeout(() => {
      this.interval = setInterval(this.timer, 1000);
    }, 700);
  };

  timer = () => {
    console.log("1 second");

    this.setState({ time: this.state.time + 1 }, () => {
      console.log(this.state.time);
      if (this.state.time >= 20) {
        console.log("clear interval");
        clearInterval(this.interval);
      }
    });
  };

  nextQuestion = () => {
    // clear interval + reset
    clearInterval(this.interval);
    this.setState({ time: 0 });
    this.init();

    if (this.state.currentQuestion == 12) {
      this.setState({
        gameFinish: true
      });
      return;
    }
    let newState = defaultState;
    newState.currentQuestion = this.state.currentQuestion + 1;
    this.setState(newState);
  };

  render() {
    let timeLeft = 20 - this.state.time;
    if (timeLeft <= 0) timeLeft = 0;

    return (
      <div>
        <div
          className="modal"
          id="myModal"
          style={{
            display:
              this.state.submitted || this.state.gameFinish ? "block" : ""
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h4 className="modal-title">Score Board</h4>
                <button type="button" className="close" data-dismiss="modal">
                  ×
                </button>
              </div>
              {/* Modal body */}
              {this.state.gameFinish ? (
                <div className="modal-body"> Welldone ! GameOver</div>
              ) : (
                <div className="modal-body">{this.state.score || 0}</div>
              )}
            </div>
          </div>
        </div>
        <small className="lead">Time Left: {timeLeft}</small>
        <br />
        <label className="h3">Question {this.state.currentQuestion}</label>
        <br />
        <small className="lead">
          {Questions[this.state.currentQuestion].question}
        </small>
        <div className="options-container">
          {Questions[this.state.currentQuestion].options.map((item, index) => (
            <div
              style={{ float: "left", width: "50%" }}
              index={index}
              key={item[index + 1]}
            >
              <button
                className={
                  this.state.answer == index + 1
                    ? `blue-button blue-button-width button-color`
                    : `blue-button blue-button-width`
                }
                onClick={this.onClick}
                value={index + 1}
              >
                {item[index + 1]}
              </button>
            </div>
          ))}
          <div className="clearfix" />
        </div>
        {!this.state.timeEnded && (
          <button
            className="blue-button blue-button-width"
            onClick={this.submitAnswer}
          >
            Submit
          </button>
        )}
      </div>
    );
  }
}
