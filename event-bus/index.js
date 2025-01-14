const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  try {
    const event = req.body;

    events.push(event);

    await Promise.all([
      axios.post("http://posts-clusterip-srv:4000/events", event),
      axios.post("http://comments-clusterip-srv:4001/events", event),
      axios.post("http://query-clusterip-srv:4002/events", event),
      axios.post("http://moderation-clusterip-srv:4003/events", event),
    ]);

    res.send({ status: "OK" });
  } catch (error) {
    console.error(error);
    res.send({});
  }
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Event Bus listening on 4005");
});
