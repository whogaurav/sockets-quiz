import React, { Component } from "react";
import Questions from "../data/questions.json";
import { updateAnswer, getScore } from "../helpers";
const { socketUrl } = require("../config");
import Router from "next/router";

const defaultState = {
  answer: "",
  time: 20,
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
      time: 20,
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
        if (json.question) {
          this.nextQuestion(json.question);
        } else {
          this.nextQuestion();
        }
      }
      if (json.type === "winner-screen") {
        Router.push("/contestants/winner-screen");
      }
    };

    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      // this.setState({
      //   ws: new WebSocket(URL)
      // });
    };
  }

  componentWillUnmount() {
    this.ws.close();
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
    clearInterval(this.counter);
    this.setState({ time: 20 });

    if (answer == Questions[this.state.currentQuestion].answer) {
      this.setState({
        submitted: true,
        score: score
      });
      updateAnswer(
        name,
        this.state.currentQuestion,
        this.state.answer,
        score,
        this.state.time
      );
    } else {
      this.setState({
        submitted: true,
        score: 0
      });
      updateAnswer(
        name,
        this.state.currentQuestion,
        this.state.answer,
        0,
        this.state.time
      );
    }
    if (this.state.currentQuestion == 12) {
      this.setState({
        gameFinish: true
      });
    }
  };

  counter = null;
  startTime = null;

  init = () => {
    this.startTime = Date.now();
    this.counter = setInterval(this.timer, 100);
  };

  timer = () => {
    const elapsedTime = Date.now() - this.startTime;
    const time = 20 - (elapsedTime / 1000).toFixed(3);
    this.setState({ time: time });

    if (time <= 0) {
      this.setState({ timeUp: true });
      clearInterval(this.counter);
    }
  };

  // count = 2000;
  // counter = null;

  // init = () => {
  //   this.counter = setTimeout(() => {
  //     setInterval(this.timer, 10);
  //   }, 700);
  // };

  // timer = () => {
  //   if (this.count <= 0) {
  //     clearInterval(this.counter);
  //     return;
  //   }
  //   this.count--;

  //   this.setState({ time: this.count / 100 });

  //   if (this.count === 0) {
  //     this.setState({ timeUp: true });
  //   }
  // };

  nextQuestion = number => {
    // clear interval + reset
    clearInterval(this.counter);
    //this.startTime = null;
    this.setState({ time: 20 });
    this.init();

    if (this.state.currentQuestion == 12) {
      this.setState({
        gameFinish: true
      });
      return;
    }

    let newState = defaultState;
    if (!number) {
      newState.currentQuestion = this.state.currentQuestion + 1;
      this.setState(newState);
    } else {
      newState.currentQuestion = number;
      this.setState(newState);
    }
  };

  render() {
    let timeLeft = this.state.time;
    timeLeft = Math.floor(timeLeft);

    let Message = null;
    Message = props => {
      if (props.score > 0) {
        return (
          <div className="modal-body">
            <span className="bold-text">Congratulations</span>
            <br /> <span className="light-text">you won</span> <br />{" "}
            <span className="bold-text">+{props.score} Points</span>{" "}
          </div>
        );
      } else {
        return (
          <div className="modal-body">
            <span className="bold-text">Oops!</span>
            <br /> <span className="light-text">Wrong Answer</span> <br />{" "}
            <span className="bold-text">+{props.score || 0} Points</span>{" "}
          </div>
        );
      }
    };

    if (timeLeft === 0 || this.state.timeUp)
      Message = () => (
        <div className="modal-body">
          <span className="bold-text">Time's Up</span>
        </div>
      );

    if (this.state.gameFinish)
      Message = () => (
        <div className="modal-body">
          <span className="bold-text">
            Well done! <br />
            You have finished the quiz
          </span>
        </div>
      );

    if (timeLeft < 0) {
      timeLeft = 0;
    }

    return (
      <div>
        <div
          className="modal"
          id="myModal"
          style={{
            display:
              timeLeft <= 0 || this.state.submitted || timeLeft === 0
                ? "flex"
                : "none"
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <Message score={this.state.score} />
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
        {timeLeft > 0 && (
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
