var socket = io.connect('/');

socket.on( 'buttonPushedResponse', function( data )
{
  alert( data );
});

socket.on( 'colorChangedEvent', function( data )
{
  document.body.style.background = data;
});

socket.on( 'moodChanged', function( data )
{
  document.getElementById( 'mood' ).value = data;
});

socket.on( 'sensor-average', function( data )
{
  console.log( data );
});
    
function buttonPushed()
{
  console.log('user did a naughty...');
  socket.emit( 'buttonPushedEvent', {} );
}

function colorChanged()
{
  var colorPicker = document.getElementById( 'colorpicker' );
  var colorValue = colorPicker.value;
  document.body.style.background = colorValue;
  socket.emit( 'colorChangedEvent', colorValue );
}

function moodChanged()
{
  var slider = document.getElementById( 'mood' );
  var currentMood = slider.value;
  socket.emit( 'moodChanged', currentMood );
}





