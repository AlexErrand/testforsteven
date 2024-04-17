//import Dygraph from 'dygraphs';
//import {InfluxDBClient, Point} from '@influxdata/influxdb3-client'

var socket = io.connect('/');


// Set up button event listener
//document.getElementById('loadGraphButton').addEventListener('click', createGraph);
document.getElementById('data').addEventListener('click', humidity);

socket.on('minuteQueryResponse', function(data) {
  console.log(data); // This will log the data received from the server
  // Process the received data as needed
});

function minuteQuery() {
  socket.emit('minuteQueryRequest');
}

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
