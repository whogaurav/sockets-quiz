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

  fetchResults = async e => {
    const data = await getFinalResult();
    this.setState({
      data: data
    });
  };

  render() {
    const { data } = this.state;

    let winner = null;
    if (data.length > 1) {
      if (data[0].totalScore > data[1].totalScore) {
        winner = data[0];
      }
      if (data[0].totalScore === data[1].totalScore) {
        if (data[0].totalScore < data[1].totalScore) {
          winner = data[0];
        } else {
          winner = data[1];
        }
      }
    } else if (data.length === 1) {
      winner = data[0];
    } else {
    }
    if (winner) {
      return (
        <div className="ribbon">
          <h2 className="winner-name">
            {winner.name} : {winner.totalScore} Points
          </h2>
        </div>
      );
    } else {
      return <h2 />;
    }
  }
}
