import React, { Component } from "react";
import Layout from "../comps/Layout";
import Link from "next/link";

export default class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout className="main-screen-bg">
        <div className="main-screen-container">
          <h2>Welcome to the Quiz</h2>

          <div>
            <Link href="/contestants">
              <a>Contestant</a>
            </Link>
            <span> | </span>
            <Link href="/moderator">
              <a>Moderator</a>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
}
