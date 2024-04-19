//import Dygraph from 'dygraphs';

var socket = io.connect('/');
const sensorList = [];

// Set up button event listener
//document.getElementById('loadGraphButton').addEventListener('click', createGraph);
document.getElementById('data').addEventListener('click', minuteQuery);
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('myButton').addEventListener('click', function () {
    console.log("right after dom thingy")
    document.getElementById("inputFieldContainer").style.display = "block";
  });

  const addButton = document.getElementById('addButton');
  
  addButton.addEventListener('click', function () {
    console.log("right after add button")
    const sensorName = document.getElementById("sensor").value;
    sensorList.push(sensorName);
    console.log("Sensor list " + sensorList);
    document.getElementById("sensor").value = ""; // clear the input field
  });
});



setInterval(allSensorsMinute, 60000); // every minute calls minute query
setInterval(allSensorsHour, 600000); // every minute calls minute query

socket.on('minuteQueryResponse', function(data) {
  console.log(data); // This will log the data received from the server
  // Process the received data as needed
});

socket.on('hourQueryResponse', function(data) {
  console.log("In hour query response")
  const dataAccess = data[0];
  temperature(dataAccess.tempF);
  humidity(dataAccess.humidity);
  moisture(dataAccess.moisture);
  console.log("Temp:" + dataAccess.tempF + " Huidity:" + dataAccess.humidity+" Moisture:" + dataAccess.moisture); // This will log the data received from the server
  // Process the received data as needed
});
socket.on('checkSensorResponse', function(data) {
  console.log("In check sensor response")
  const dataAccess = data[0];
  if (dataAccess.tempF != 0 || dataAccess.humidity !=0 || dataAccess.moisture != 0 ){
    sensorList.append(dataAccess.sensor);
  }
});

function minuteQuery(sensor) {
  socket.emit('minuteQueryRequest',sensor);
}

function hourQuery() {
  socket.emit('hourQueryRequest');
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

// socket.on('sensor-average', function(data) {
//   console.log(data);
// });
socket.on('humidityEvent', function(data) {
  console.log(data);
  alert(data);
});

function temperature(temperature) {
  //fetch temp data 
  //var temperature = 73;
  if(temperature < 69){
    console.log('Temperature too low');
  }
  if(temperature > 82){
    console.log('Temperature too high');
  }
}

function humidity(humidty){
  console.log("in humidity");
  //fetch humidity data
  //var humidity = 50;
  if(humidity < 40){
    console.log('low humidity');
  }
  if(humidity > 60){
    console.log('high humidity');
  }
  else{
    console.log('humidity ideal');
  }
  //socket.emit('humidityResponse', {})
  
}

function moisture(moisture){
  console.log("in moisture");
  //fetch moisture data
  //var moisture = 50;
  if(moisture > 2000){
    console.log('low moisture');
  }
  if(moisture < 1000){
    console.log('high moisture');
  }
  else{
    console.log('moisture ideal');
  }
  //socket.emit('moistureResponse', {})
  
}
function checkSensor(sensor)
{
  socket.emit('checkSensorRequest',sensor);
}

function allSensorsMinute(){
  if (sensorList.length != 0){
    sensorList.forEach(element => {
      minuteQuery(element)
    });
  }
}
function allSensorsHour(){
  if (sensorList.length != 0){
    sensorList.forEach(element => {
      hourQuery(element)
    });
  }
}
