const fetch = require("isomorphic-unfetch");
const { url } = require("./config");

module.exports = {
  getScore: t => {
    let time = null;

    if (t < 1) {
      time = Math.ceil(t);
    } else {
      time = Math.floor(t);
    }

    time = 20 - time;

    let max_score = 2000;
    let score = max_score - time * 100;
    console.log("max_score: ", max_score);
    console.log("score: ", score);
    return score;
  },
  updateAnswer: (name, ques, ans, score, time) => {
    fetch(`${url}/postResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        ques,
        ans,
        score,
        time
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  },

  getFinalResult: () => {
    var groupId = "test";
    return fetch(`${url}/getFinalResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId
      })
    }).then(response => response.json());
  },

  reset: () => {
    return fetch(`${url}/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: ""
    }).then(response => response.json());
  },

  createUser: (name, cb) => {
    var groupId = "test";
    fetch(`${url}/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        groupId
      })
    })
      .then(response => {
        if (response.status != 200) {
          response.json().then(data => cb(true, data));
        } else {
          response.json().then(data => cb(false, data));
        }
      })
      .catch(err => cb(true, err));
  }
  // getSession: () => {
  //   return fetch('http://localhost:3000/getSession', {
  //     method: 'POST'
  //   }).then(response => response.json())
  // },
  // postSession: (key, value) => {
  //   return fetch('http://localhost:3000/createSession', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       key,
  //       value
  //     })
  //   }).then(response => response.json())
  // }
};
