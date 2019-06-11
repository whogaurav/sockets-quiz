import React, { Component } from "react";
import Layout from "../../comps/Layout";

import dynamic from "next/dynamic";
const DynamicComponentWithNoSSR = dynamic(
  () => import("../../comps/Sockets.js"),
  {
    ssr: false
  }
);

class Teams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      clients: []
    };
  }

  render() {
    return (
      <Layout className="secondary-screens-bg">
        <div
          className="main-screen-container"
          style={{ width: "100%", alignItems: "unset" }}
        >
          <DynamicComponentWithNoSSR name="moderator" />
        </div>
      </Layout>
    );
  }
}

export default Teams;
