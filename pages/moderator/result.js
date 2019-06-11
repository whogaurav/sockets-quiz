import React, { Component } from "react";
import Layout from "../../comps/Layout";
import Button from "../../comps/Button";
import { getFinalResult } from "../../helpers";

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      show: false
    };
  }

  onClick = async e => {
    let groupId = "groupIdTest";
    let data = await getFinalResult(groupId);

    this.setState({
      data: data,
      show: !this.state.show
    });
  };

  render() {
    let show = this.state.show;

    return (
      <Layout className="secondary-screens-bg">
        <div className="main-screen-container">
          <Button
            onClick={this.onClick}
            title="Get Result"
            style={{
              background: "linear-gradient(#a1defa, #5ca7de)",
              borderRadius: "50px",
              padding: "15px",
              width: "25%"
            }}
          />

          {this.state.show &&
            this.state.data.length > 0 &&
            this.state.data.map((item, index) => (
              <div key={index}>
                <small className="lead">{item.name} &nbsp;&nbsp;</small>
                <div
                  className="progress"
                  style={{
                    borderRadius: "2.25rem",
                    width: "50%",
                    height: "2.5em",
                    display: "inline-flex",
                    backgroundColor: "#e0e0e0"
                  }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(item.totalScore / 6000) * 100}%` }}
                    aria-valuenow={item.totalScore}
                    aria-valuemin={0}
                    aria-valuemax={6000}
                  >
                    {item.totalScore}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Layout>
    );
  }
}
