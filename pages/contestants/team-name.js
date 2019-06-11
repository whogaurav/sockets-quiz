import React, { Component } from "react";
import Layout from "../../comps/Layout";
import { createUser } from "../../helpers";
import Router from "next/router";

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: false
    };
  }
  onSubmit = () => {
    if (!this.state.name) {
      this.setState({ error: "Please enter team name" });
      return;
    }
    this.setState({ error: false });
    const name = this.state.name;
    createUser(name, (error, data) => {
      if (error) {
        this.setState({ error: data.msg });
      } else {
        Router.push({
          pathname: "/contestants/instructions",
          query: { name: this.state.name }
        });
      }
    });
  };

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  render() {
    return (
      <Layout className="secondary-screens-bg">
        <div className="main-screen-container">
          <h2 className="welcome-heading">Please enter name of your team</h2>
          <input
            onChange={this.onChange}
            placeholder="Team Name"
            value={this.state.name}
            type="input"
            className="form-control team-name-input"
          />

          <div className="error-message">
            {this.state.error ? this.state.error : ""}
          </div>

          <br />
          <button className="blue-button" onClick={this.onSubmit}>
            Continue
          </button>
        </div>
      </Layout>
    );
  }
}

export default Teams;
