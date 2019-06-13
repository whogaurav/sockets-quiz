import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import Head from "next/head";
export default class Layout extends Component {
  constructor(props) {
    super();

    this.state = {
      name: ""
    };
  }

  // componentDidMount() {
  //   history.pushState(null, null, location.href);
  //   window.onpopstate = function() {
  //     history.go(1);
  //   };
  // }

  onChange = e => {
    this.setState({
      name: e.target.value
    });
  };

  render() {
    const props = this.props;
    const className = props.className || "";
    const style = props.style || {};
    return (
      <div className="layout">
        <div style={style} className={`main-screen ${className}`}>
          {props.children}
        </div>
      </div>
    );
  }
}
