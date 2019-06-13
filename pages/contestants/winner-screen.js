import React, { Component } from "react";
import Layout from "../../comps/Layout";

import dynamic from "next/dynamic";
const DynamicComponentWithNoSSR = dynamic(
  () => import("../../comps/Questions-tv-winner.js"),
  {
    ssr: false
  }
);

export default class QuestionsPage extends Component {
  render() {
    return (
      <Layout className="secondary-screens-bg">
        <div
          className="main-screen-container"
          style={{ textAlign: "center", width: "90%" }}
        >
          <DynamicComponentWithNoSSR {...this.props} />
        </div>
      </Layout>
    );
  }
}
