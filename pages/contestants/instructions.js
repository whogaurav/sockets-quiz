import React, { Component } from "react";
import Layout from "../../comps/Layout";
import Router from "next/router";
const { socketUrl } = require("../../config.js");

let connection = null;

class Instructions extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.url.query.name) {
      Router.push("/contestants/team-name");
    }
    const { name } = this.props.url.query;
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    connection = new WebSocket(socketUrl);
    connection.onopen = function() {
      connection.send(JSON.stringify({ type: "client", name: name }));
    };
    connection.onerror = function(error) {
      // an error occurred when sending/receiving data
    };
    connection.onmessage = function(message) {
      var json = JSON.parse(message.data);
      //console.log(json);
      if (json.type === "start") {
        console.log("Start the Quiz");
        Router.push({ pathname: "/contestants/questions", query: { name } });
      }
    };
  }

  render() {
    return (
      <Layout className="instructions-screens-bg">
        <div
          className="main-screen-container instructions-container"
          style={{
            marginRight: "32%",
            padding: "20px",
            backgroundColor: "transparent"
          }}
        >
          <h1>Instructions</h1>
          <p>
            Try to answer to the 12 questions as fast as possible in order to
            collect a maximum amount of points. <br />
            You have 20 seconds per question.
          </p>
        </div>
      </Layout>
    );
  }
}

export default Instructions;
