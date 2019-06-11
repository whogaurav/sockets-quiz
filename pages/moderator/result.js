import React, { Component } from "react";
import Layout from "../../comps/Layout";
import { getFinalResult } from "../../helpers";

export default class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      show: false
    };
  }

  componentDidMount() {
    this.getResults();
  }

  getResults = async e => {
    let groupId = "test";
    let data = await getFinalResult(groupId);
    this.setState({
      data: data,
      show: !this.state.show
    });
  };

  render() {
    const { show } = this.state;

    return (
      <Layout className="secondary-screens-bg">
        <div className="main-screen-container" style={{ width: "80%" }}>
          {show &&
            this.state.data.length > 0 &&
            this.state.data.map((item, index) => (
              <div key={index} className="result-container">
                <small className="lead">{item.name} &nbsp;&nbsp;</small>
                <div className="progress">
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
