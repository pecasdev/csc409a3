import PlaceCanvas from './place-canvas.js'

var socket

$(function () {
  // TODO: canvas
  let canvas = new PlaceCanvas(250, 250);

  // socket = new WebSocket("ws://cslinux.utm.utoronto.ca:8001");
  // socket = new WebSocket("ws://localhost:8001");
  socket = new WebSocket('ws://' + window.location.hostname + ':8081')
  socket.onopen = function (event) {
    $('#sendButton').removeAttr('disabled')
    console.log('connected')
  }
  socket.onclose = function (event) {
    alert('closed code:' + event.code + ' reason:' + event.reason + ' wasClean:' + event.wasClean)
  }
  socket.onmessage = function (event) {
    var o = JSON.parse(event.data)

    canvas.setColor(o.x, o.y, o.color)
    canvas.displayBufferedDraws() // TODO: see below

    /* TODO: for pixel updates
       periodically call displayBufferedDraws if buffer is dirty
		canvas.drawPixelToDisplay(o.x, o.y, 'rgb('+o.r+','+o.g+','+o.b+')');
		*/
  }

  $('#setForm').on('submit', function (event) {
    var o = {
      'x': $('#x').val(),
      'y': $('#y').val(),
      'color': $('#color option:selected').val(),
    }

    for (var key in o) {
      o[key] = parseInt(o[key])
    }
    socket.send(JSON.stringify(o))
    event.preventDefault()
  })
})