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
    checkSensor(sensorName);
    console.log("Sensor list " + sensorList[0]);
    document.getElementById("sensor").value = ""; // clear the input field
  });
});



setInterval(allSensorsMinute, 60000); // every minute calls minute query
setInterval(allSensorsHour, 600000); // every minute calls minute query

socket.on('minuteQueryResponse', function(data) {
  console.log(data); // This will log the data received from the server
  // Process the received data as needed
});

socket.on('hourQueryResponse', function(data) { //sums the data over the hour
  console.log("In hour query response")
  const dataAccess = data[0];
  temperature(dataAccess.tempF);
  humidity(dataAccess.humidity);
  moisture(dataAccess.moisture);
  console.log("Temp:" + dataAccess.tempF + " Huidity:" + dataAccess.humidity+" Moisture:" + dataAccess.moisture); // This will log the data received from the server
  // Process the received data as needed
});


socket.on('checkSensorResponse', function(data) { //response from server to see if there are values in sensor over last 15 minutes if so add it to valid sensor list
  console.log("In check sensor response")
  const dataAccess = data[0];
  if (dataAccess.tempF != null || dataAccess.humidity != null || dataAccess.moisture != null ){
    sensorList.push(dataAccess.sensor);
  }
  console.log("In check sensor response after if " + sensorList[0])
});

function minuteQuery(sensor) { //sends to server to check last minute
  socket.emit('minuteQueryRequest',sensor);
}

function hourQuery() { //sends to server to check last hour
  socket.emit('hourQueryRequest');
}


function temperature(temperature) { //checks if temp is to high or low, will need to change this
  //fetch temp data 
  //var temperature = 73;
  if(temperature < 69){
    console.log('Temperature too low');
  }
  if(temperature > 82){
    console.log('Temperature too high');
  }
}

function humidity(humidty){ //checks if humidity is to high or low, will need to change this
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

function moisture(moisture){ //checks if moisture is to high or low, will need to change this
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

function checkSensor(sensor) //sends sensor name to server to see if it has values
{
  console.log("in check sensor")
  socket.emit('checkSensorRequest',sensor);
}

function allSensorsMinute(){ //makes all sensors in list go through minute query
  if (sensorList.length != 0){
    sensorList.forEach(element => {
      minuteQuery(element)
    });
  }
}
function allSensorsHour(){ //makes all sensors in list go through hour query
  if (sensorList.length != 0){
    sensorList.forEach(element => {
      hourQuery(element)
    });
  }
}

// socket.on('buttonPushedEvent', function(data) {
//   const userInput = prompt("Please enter your name:");
//   alert(data);
// });
// Socket event handlers remain the same
// socket.on('buttonPushedResponse', function(data) {
//   alert(data);
// });

// socket.on('colorChangedEvent', function(data) {
//   document.body.style.background = data;
// });

// socket.on('moodChanged', function(data) {
//   document.getElementById('mood').value = data;
// });
// socket.on('sensor-average', function(data) {
//   console.log(data);
// });
// socket.on('humidityEvent', function(data) {
//   console.log(data);
//   alert(data);
// });
