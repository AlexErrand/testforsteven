// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const socket = require("socket.io");
const influx = require('@influxdata/influxdb3-client');
const token = process.env.INFLUXDB_TOKEN

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// database (temp, rip)
var currentColor = "#FFCD00";
var socketName = "placeholder";

// socket stuff

var io = socket(listener);

io.on("connection", function (socket) {
  console.log("Yay, I have a new friend!");
  socket.emit("colorChangedEvent", currentColor);

  // connect to db
  socket.on('minuteQueryRequest', async function () {
    const client = new influx.InfluxDB({host: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token});
    const query = `SELECT * FROM 'PlantSensor1'
    WHERE time >= now() - interval '1 minute' AND
    ('moisture' IS NOT NULL OR 'tempF' IS NOT NULL OR 'humidity' IS NOT NULL) order by time asc`;
    
    const rows = await client.query(query, 'iotProject');
    
    let dataToSend = [];

    for await (const row of rows) {
      let humidity = row.humidity || '';
      let moisture = row.moisture || '';
      let tempF = row.tempF;

      dataToSend.push({
        humidity: humidity,
        moisture: moisture,
        tempF: tempF
      });
    }

    client.close();

    socket.emit('minuteQueryResponse', dataToSend);
  });



  //for plant
  socket.on('socketName', function(data) {
    console.log('Socket name received: ', data);
    // Add socketName to the database
    //db.collection('users').add({ name: socketName });
  });
  //from class
  socket.on("buttonPushedEvent", function (data) {
    console.log("user pressed their button :(");
    socket.emit("buttonPushedResponse", "coming soon");
  });

  socket.on("colorChangedEvent", function (data) {
    currentColor = data;
    socket.broadcast.emit("colorChangedEvent", data);
  });

  socket.on("moodChanged", function (data) {
    // example: record mood in a database...
    // TODO (chatgpt)

    // tell my friends
    socket.broadcast.emit("moodChanged", data);
  });
  socket.on("humidityResponse", function (data) {
    console.log("No mami");
    socket.emit("humidityEvent", "hello");
  });
});

function generateAverageSensorValue() {
  const min = 70;
  const max = 80;
  return Math.random() * (max - min) + min;
}

setInterval(() => {
  // DO WHAT EVERY 1000ms
  io.emit("sensor-average", generateAverageSensorValue().toFixed(2));
}, 1000);
