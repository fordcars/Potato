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

function drawMultiplayerUi(layer, forceDraw)
{
	if(ga.gotNewInfo || forceDraw)
	{
		var playersOnlineX = c.canWidth - 200;
		var playersOnlineY = 50;
		var playersOnlineSeperation = 20;
		
		var playersOnlineRectX = playersOnlineX-10;
		var playersOnlineRectY = playersOnlineY-playersOnlineSeperation;
		
		var chatSeperation = 20;
		var chatHeight = (chatSeperation * ga.maxNumberOfChatMessages) - 20;
		var chatX = 30;
		var chatY = c.canHeight - chatHeight - 20;
		
		layer.clearLayer();
		layer.fillStyle = "black";
		layer.strokeStyle = "black";
		layer.font = "15pt Courrier New";
		
		layer.fillText("Online Potatoes:", playersOnlineRectX, playersOnlineRectY-5);
		layer.fillText("Press <Enter> to chat", c.canWidth - 200, c.canHeight - 20);
		drawChat(layer, chatX, chatY, chatHeight, chatSeperation);
		
		layer.fillStyle = "rgba(100, 100, 100, 0.5)";
		layer.fillRect(playersOnlineRectX, playersOnlineRectY, 200+playersOnlineSeperation, playersOnlineSeperation * ga.maxNumberOfShownPlayers);
		layer.strokeRect(playersOnlineRectX, playersOnlineRectY, 200+playersOnlineSeperation, playersOnlineSeperation * ga.maxNumberOfShownPlayers);
		
		layer.fillStyle = "white";
		drawOnlinePlayers(layer, ga.onlinePlayers, playersOnlineX, playersOnlineY, playersOnlineSeperation);
		
		ga.gotNewInfo = false; // Don't render again and again and again and again
	}
}

function drawOnlinePlayers(layer, players, x, y, seperation)
{
	var player;
	var playerY;
	
	for(var i=0, length=players.length; i<length; i++)
	{
		player = players[i];
		playerY = y + (i * seperation);
		
		layer.fillText(player, x, playerY);
		
		if(i>=ga.maxNumberOfShownPlayers)
		{
			return;
		}
	}
}

function drawChat(layer, x, y, height, seperation)
{
	var message
	var messageY;
	var messageNumber = -1;
	
	for(var i=ga.chatMessages.length-1; i>=0; i--)
	{
		message = ga.chatMessages[i];
		messageNumber++;
		messageY = y + height - (messageNumber * seperation);
		
		layer.fillText(message, x, messageY);
	}
}