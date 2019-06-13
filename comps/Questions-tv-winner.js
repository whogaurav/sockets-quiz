import React, { Component } from "react";
import { getFinalResult } from "../helpers";

export default class QuestionsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.fetchResults();
  }

  resultInterval = null;

  fetchResults = async e => {
    const data = await getFinalResult();
    this.setState({
      data: data
    });
  };

  getResults = () => {
    this.resultInterval = setInterval(this.fetchResults, 1000);
  };

  render() {
    const { data } = this.state;
    return (
      <div style={{ width: "100%" }}>
        <h2>And the winner is</h2>
        <br />
        {data.length > 1 && (
          <div>
            <h1>
              Team:{" "}
              {data[0].totalScore > data[1].totalScore && data[0].totalScore}
            </h1>
            <br />
          </div>
        )}

        {data.length > 0 &&
          data.map((item, index) => (
            <div key={index} className="result-container">
              <small className="lead">{item.name} &nbsp;&nbsp;</small>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(item.totalScore / 40000) * 100}%` }}
                  aria-valuenow={item.totalScore}
                  aria-valuemin={0}
                  aria-valuemax={40000}
                >
                  Score: {item.totalScore}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }
}
