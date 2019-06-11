const fetch = require("isomorphic-unfetch");
const { url } = require("./config");

module.exports = {
  getScore: time => {
    //accepts seconds
    if (time < 5) {
      return 500;
    } else if (time >= 5 && time <= 10) {
      return 300;
    } else {
      return 200;
    }
  },
  updateAnswer: (name, ques, ans, score) => {
    fetch(`${url}/postResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        ques,
        ans,
        score
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  },

  getFinalResult: () => {
    var groupId = "test";
    return fetch(`${url}//getFinalResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId
      })
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
