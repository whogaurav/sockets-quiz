import React, { Component } from "react";
import Questions from "../data/questions.json";
import { updateAnswer, getScore, getFinalResult } from "../helpers";
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
      name: "",
      data: [],
      showWinnerScreen: false
    };
  }

  ws = new WebSocket(socketUrl);

  componentDidMount() {
    this.getResults();
    this.setState({ name: "TV" });
    //this.timeFucn();
    this.init();

    this.ws.onopen = () => {
      console.log("connected");
      this.ws.send(JSON.stringify({ type: "client", name: "TV" }));
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

  // init = () => {
  //   this.counter = setInterval(this.timer, 10);
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
    this.count = 2000;
    this.setState({ time: 20 });
    this.init();

    if (this.state.currentQuestion == 12) {
      this.setState({
        gameFinish: true
      });
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

  resultInterval = null;

  fetchResults = async e => {
    const data = await getFinalResult();
    this.setState({
      data: data
    });
    // console.log(data);
  };

  getResults = () => {
    this.resultInterval = setInterval(this.fetchResults, 1000);
  };

  render() {
    let timeLeft = Math.floor(this.state.time);
    if (timeLeft <= 0) timeLeft = 0;

    let Message = null;

    Message = props => (
      <div className="modal-body">Points Scored: {props.score || 0}</div>
    );

    if (timeLeft == 0)
      Message = () => <div className="modal-body">Time's Up</div>;

    if (this.state.gameFinish)
      Message = () => (
        <div className="modal-body">Well done! You have finished the quiz</div>
      );

    return (
      <div style={{ width: "90%" }}>
        {timeLeft != 0 && (
          <span>
            <span
              className="lead"
              style={{ fontSize: "25px", textAlign: "left" }}
            >
              Question {this.state.currentQuestion}
            </span>
            <br />
            <br />
            <span
              className="h3"
              style={{ fontSize: "30px", marginTop: "20px" }}
            >
              {Questions[this.state.currentQuestion].question}
            </span>
            <br />
            <br />

            <span
              className="lead"
              style={{ fontSize: "30px", marginBottom: "20px" }}
            >
              Time Left: {timeLeft}
            </span>
            <hr />
            <img
              src={Questions[this.state.currentQuestion].image}
              style={{ width: "500px" }}
            />
          </span>
        )}

        {timeLeft === 0 && (
          <span className="h3" style={{ fontSize: "30px", marginTop: "20px" }}>
            Leaderboard
          </span>
        )}
        <br />
        <br />
        <br />

        {timeLeft === 0 &&
          this.state.data.length > 0 &&
          this.state.data.map((item, index) => (
            <div key={index} className="result-container">
              <small className="lead">{item.name} &nbsp;&nbsp;</small>
              <small
                className="lead"
                style={{ fontSize: "16px", position: "relative", top: "7px" }}
              >
                Total Time: {parseFloat(item.time).toFixed(2)}
              </small>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(item.totalScore / 40000) * 100}%` }}
                  aria-valuenow={item.totalScore}
                  aria-valuemin={0}
                  aria-valuemax={40000}
                >
                  {item.totalScore}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
}
