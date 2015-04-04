// Potato
// Copyright © 2014 Carl Hewett

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var c = {}; // Constants

c.serverPort = 3000;
c.maxNumberOfPlayers = 40;
c.updateClientsDelay = 150;

c.potatoShake = "potatoShake"; // First data transfer from client, contains potato nick. Sets online mode for potato to true
c.clientUpdate = "clientUpdate"; // Client being updated (server->client)
c.serverUpdate = "serverUpdate"; // Server being updated (client->server)
c.potatoBye = "potatoBye"; // Player 'left'

var io = require("socket.io")(c.serverPort);
var potatoTracker = require("PotatoTracker").Tracker(io);

var playerCount = 0;

function main()
{
	console.log("Hosting potato server on port " + c.serverPort);
	setInterval(sendData, c.updateClientsDelay);
}

function sendData()
{
	if(playerCount>0)
	{
		var data = potatoTracker.getPotatoData();
		io.emit(c.clientUpdate, data);
	}
}

function connectUser(socket, address)
{
	if(playerCount>=c.maxNumberOfPlayers)
	{
		return false;
	} else
	{
		var addressString = address.address + ":" + address.port;
		
		playerCount++;
		console.log("User connected [" + playerCount + "] from " + addressString);
		potatoTracker.createPotato(socket);
		setupSocketEvents(socket);
		
		return true;
	}
}

function setupSocketEvents(socket)
{
	socket.on(c.potatoShake, function(data)
	{
		potatoTracker.potatoShake(socket, data);
	});
	
	socket.on(c.serverUpdate, function(data)
	{
		potatoTracker.potatoUpdate(socket, data);
	});
	
	socket.on(c.potatoBye, function(data)
	{
		potatoTracker.potatoBye(socket);
	});
}

function userDisconnected(socket, address)
{
	var addressString = address.address + ":" + address.port;
	
	playerCount--;
	console.log("User disconnected [" + playerCount + "] from " + addressString);
	
	potatoTracker.deletePotato(socket);
}

io.on("connection", function(socket)
{
	var address = socket.handshake.address;
	
	if(connectUser(socket, address))
	{
		socket.on("disconnect", function(){userDisconnected(socket, address);});
	} else
	{
		socket.disconnect();
		console.log("Client disconnected; max number of clients reached! [" + c.maxNumberOfPlayers + "]");
	}
});

main();