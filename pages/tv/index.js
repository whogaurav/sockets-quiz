import React, { Component } from "react";
import Layout from "../../comps/Layout";
import Router from "next/router";
const { socketUrl } = require("../../config");

export default class TV extends Component {
  state = {
    instructions: false
  };
  componentDidMount() {
    this.ws = new WebSocket(socketUrl);
    this.ws.onopen = () => {
      console.log("connected");
      this.ws.send(JSON.stringify({ type: "client", name: "TV" }));
    };

    this.ws.onmessage = message => {
      var json = JSON.parse(message.data);
      console.log(json);
      if (json.type === "start") {
        console.log("Start the Quiz");
        Router.push({ pathname: "/tv/start" });
      }
      if (json.type === "show-instructions") {
        this.setState({ instructions: true });
      }
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    if (this.state.instructions === true) {
      return (
        <Layout className="instructions-screens-bg">
          <div className="main-screen-container instructions-container">
            <h1>Instructions</h1>
            <p>
              And an even wittier subheading.And an even wittier subheading.And
              an even wittier subheading.And an even wittier subheading.And an
              even wittier subheading.And an even wittier subheading.And an even
              wittier subheading.And an even wittier subheading.And an even
              wittier subheading.And an even wittier subheading.And an even
              wittier subheading.And an even wittier subheading
            </p>
            {/* <Link href="/contestants/questions">
                <button className="blue-button" onClick={this.onSubmit}>
                  Continue
                </button>
              </Link> */}
          </div>
        </Layout>
      );
    }
    return (
      <Layout className="moderator-container-bg">
        {/* <div className="main-screen-container">
      <span />
    </div> */}
      </Layout>
    );
  }
}
