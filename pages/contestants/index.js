import React, { Component } from "react";
import Link from "next/link";
import Layout from "../../comps/Layout";

export default class Tab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout className="main-screen-bg">
        <div className="main-screen-container">
          <h2 className="welcome-heading">Welcome to the Quiz</h2>
          <Link href="/contestants/team-name">
            <button className="blue-button" title="Start from here">
              Let's Go
            </button>
          </Link>
        </div>
      </Layout>
    );
  }
}
