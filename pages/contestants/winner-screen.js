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
      <Layout className="winner-screens-bg">
        <DynamicComponentWithNoSSR {...this.props} />
      </Layout>
    );
  }
}
