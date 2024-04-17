//import Dygraph from 'dygraphs';
//import {InfluxDBClient, Point} from '@influxdata/influxdb3-client'


var socket = io.connect('/');
const token = process.env.INFLUXDB_TOKEN

// Set up button event listener
//document.getElementById('loadGraphButton').addEventListener('click', createGraph);
document.getElementById('data').addEventListener('click', humidity);
socket.on('buttonPushedEvent', function(data) {
  const userInput = prompt("Please enter your name:");
  alert(data);
});
// Socket event handlers remain the same
socket.on('buttonPushedResponse', function(data) {
  alert(data);
});

socket.on('colorChangedEvent', function(data) {
  document.body.style.background = data;
});

socket.on('moodChanged', function(data) {
  document.getElementById('mood').value = data;
});

socket.on('sensor-average', function(data) {
  console.log(data);
});
socket.on('humidityEvent', function(data) {
  console.log(data);
  alert(data);
});

function temperature() {
  //fetch temp data 
  var temperature = 73;
  if(temperature < 69){
    console.log('Temperature too low');
  }
  if(temperature > 82){
    console.log('Temperature too high');
  }
}

function humidity(){
  console.log("rogelio is super gay");
  //fetch humidity data
  var humidity = 50;
  if(humidity < 40){
    console.log('low humidity');
  }
  if(humidity > 60){
    console.log('high humidity');
  }
  else{
    console.log('humidity ideal');
  }
  socket.emit('humidityResponse', {})
  
}

async function minuteQuery(){
  

  
  console.log("rogelio is gay");
  const client = new InfluxDBClient({host: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token})
  const query = `SELECT * FROM 'PlantSensor1'
  WHERE time >= now() - interval '1 minute' AND
  ('moisture' IS NOT NULL OR 'tempF' IS NOT NULL OR 'humidity' IS NOT NULL) order by time asc`

  const rows = await client.query(query, 'iotProject')
  

  //console.log(`${"humidty".padEnd(5)}${"moisture".padEnd(5)}${"tempF".padEnd(10)}`);
  for await (const row of rows) {
      let humidty = row.humidity || '';
      let moisture = row.moisture || '';
      let tempF = row.tempF;
      socket.emit('minuteQuery', `${humidity.toString().padEnd(5)}${moisture.toString().padEnd(5)}${tempF.toString.padEnd(10)}`);
      console.log(`${humidity.toString().padEnd(5)}${moisture.toString().padEnd(5)}${tempF.toString.padEnd(10)}`);
  }
  client.close()
  
  
}