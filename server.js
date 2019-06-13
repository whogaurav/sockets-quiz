const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const next = require("next");
const { port, url, db, webSocketsServerPort } = require("./config");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const session = require("express-session");

mongoose.connect(db, { useCreateIndex: true, useNewUrlParser: true });
mongoose.connection.on("error", err => {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

const Game = require("./model/Game");

/////////////////////////////////////////////////////////
// fake DB
// const messages = {
//   chat1: [],
//   chat2: []
// };

// socket.io server
// const app = require("express")();
// const server = require("http").Server(app);
// const io = require("socket.io")(server);
// io.on("connection", socket => {
//   socket.on("message.chat1", data => {
//     messages["chat1"].push(data);
//     socket.broadcast.emit("message.chat1", data);
//   });
//   socket.on("message.chat2", data => {
//     messages["chat2"].push(data);
//     socket.broadcast.emit("message.chat2", data);
//   });
// });
/////////////////////////////////////////////////////////

nextApp
  .prepare()
  .then(() => {
    const server = express();

    // server.use(
    //   session({
    //     secret: "998ha66bd2hasdo191",
    //     cookie: { maxAge: 60000, secure: false }
    //   })
    // );

    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    server.post("/postResult", (req, res) => {
      const { name, ques, ans, score, time } = req.body;
      const timeTaken = 20 - parseFloat(time).toFixed(2);

      Game.findOne({ name: name })
        .then(result => {
          if (!result) {
            return res
              .status(400)
              .json({ msg: "Please send username in params" });
          }
          result.answers.push({
            quesNo: ques,
            ans: ans
          });
          result.totalScore = parseInt(result.totalScore) + parseInt(score);
          result.time = parseFloat(result.time) + timeTaken;

          result.save();
          res.json({ success: true });
        })
        .catch(err => console.log(err));
    });

    server.post("/createUser", (req, res) => {
      const { name, groupId } = req.body;

      Game.findOne({ name: name }, function(err, user) {
        if (err) {
          //handle error here
        }
        if (user) {
          res.status(400).json({
            success: false,
            msg:
              "A user with that name has already registered. Please use a different name."
          });
        } else {
          return Game.create(
            {
              name: name,
              groupId: groupId,
              totalScore: parseInt(0),
              time: parseFloat(0)
            },
            function(err, user) {
              if (err) {
                return res.status(400).json({
                  msg: "Error"
                });
              } else return res.json(user);
            }
          );
        }
      });
    });

    // server.post("/getSession", (req, res) => {
    //   req.session.save();
    //   res.json(req.session);
    // });

    // server.post("/createSession", (req, res) => {
    //   req.session[req.body.key] = req.body.value;

    //   req.session.save(function() {
    //     res.json(req.session);
    //   });
    // });

    server.post("/getFinalResult", (req, res) => {
      const groupId = "test";

      Game.find(
        {},
        null,
        {
          skip: 0,
          limit: 100,
          sort: {
            totalScore: -1
          }
        },
        (err, result) => {
          //console.log(result);
          return res.json(result);
        }
      );
    });

    server.post("/reset", (req, res) => {
      Game.remove({}, (err, result) => res.json(result));
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on ${url}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

/*****************************************************/

var webSocketServer = require("websocket").server;
var http = require("http");

// list of currently connected clients (users)
var clients = [];
var clientsData = [];
var server = http.createServer(function(request, response) {
  // not HTTP server
});
server.listen(webSocketsServerPort, function() {
  console.log(
    new Date() + " Server is listening on port " + webSocketsServerPort
  );
});

var wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on("request", function(request) {
  console.log(new Date() + " Connection from origin " + request.origin + ".");
  var connection = request.accept(null, request.origin);
  var index = clients.push(connection) - 1;

  console.log(new Date() + " Connection accepted.");

  connection.on("message", function(message) {
    const data = JSON.parse(message.utf8Data);
    if (data.type == "client" && !clientsData.includes(data.name)) {
      clientsData.push(data.name);
      clients.forEach(function(client) {
        client.send(JSON.stringify({ type: "clients", data: clientsData }));
      });
    }
    //console.log(data);
    if (
      data.type == "start" ||
      data.type == "next" ||
      data.type == "show-instructions" ||
      data.type == "winner-screen"
    ) {
      clients.forEach(function(client) {
        client.send(JSON.stringify(data));
      });
    }

    // if (data.type == "reset") {
    //   clients.forEach(function(client) {
    //     if (client.name === "moderator") {
    //       client.send(JSON.stringify({ type: "clients", data: [] }));
    //     }
    //   });
    // }
  });

  connection.on("close", function(connection) {
    console.log(new Date() + " Peer " + clientsData[index] + " disconnected.");
    // remove user from the list of connected clients
    clientsData.splice(index, 1);
    clients.splice(index, 1);
    clients.forEach(function(client) {
      client.send(JSON.stringify({ type: "clients", data: clientsData }));
    });
  });
});
