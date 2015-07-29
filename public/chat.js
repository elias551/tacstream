window.onload = function () {
	
	var messages = [];
	var socket = io.connect(window.location.origin);
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var name = document.getElementById("name");
	
	socket.on('message', function (data) {
		if (data.message) {
			messages.push(data);
			var html = '';
			for (var i = 0; i < messages.length; i++) {
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message + '<br />';
			}
			content.innerHTML = html;
		} else {
			console.log("There is a problem:", data);
		}
	});
	
	function sendMessage() {
		if (name.value == "") {
			alert("Please type your name!");
		} else {
			var text = field.value;
			socket.emit('send', {
				message: text, 
				username: name.value
			});
			field.value = '';
		}
	}

	sendButton.onclick = sendMessage;
	
	document.onkeydown = function (evt) {
		if (evt.keyCode === 13 && ['name', 'field'].indexOf(document.activeElement.id) > -1) {
			sendMessage();
		}
	}
}
