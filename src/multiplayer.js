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

function setupSocket() // Call this as many times as you want
{
	var valid = false;
	var playerRegistered = false;
	var nick;
	
	if(!ga.multiplayerNick)
	{
		if(ga.gamejoltUsername!=null && ga.gamejoltUserToken!=null)
		{
			nick = ga.gamejoltUsername;
			playerRegistered = true;
			valid = true;
		} else
		{
			nick = prompt("Please enter your nick: ", getRandomName());
				
			if(nick==null || nick==undefined)
			{
				valid = false;
			} else
			{
				valid = true;
				playerRegistered = false;
			}
		}
	} else
	{
		valid = true;
	}
	
	if(valid)
	{
		var availableNick = nickAvailable(nick); // availableNick might be different from nick
		
		if(availableNick!==false) // User did not cancel
		{
			ga.multiplayerNick = availableNick;
			
			socketIo.emit(c.potatoShake, {nick: ga.multiplayerNick, registered: playerRegistered});
			window.setInterval(updateServer, c.updateServerDelay);
			return true;
		} else
		{
			return false;
		}
	}
	
	return false;
}

function byeSocket() // Send message to server that we left
{
	socketIo.emit(c.potatoBye, "");
}

function setupSocketEvents()
{
	socketIo.on(c.clientUpdate, function(data)
	{
		doPotatoes(data); // data is an array of potatoes
		updateInfo(data);
	});
}

function nickAvailable(nick) // Checks if nick is not already used online, returns an available nick, or false if the user cancelled
{
	for(var i=0, length=ga.onlinePlayers.length; i<length; i++)
	{
		if(ga.onlinePlayers[i]===nick) // Nick already chosen!
		{
			var newNick = prompt("Nick already chosen! Pleas choose another one: ", getRandomName());
				
			if(newNick==null || newNick==undefined) // Nothing entered/pressed cancel
			{
				return false;
			} else // Valid input
			{
				var newAvailableNick = nickAvailable(newNick); // Recursion! Is new nick available?
				
				if(newAvailableNick===false) // Cancelled!
				{
					return false;
				} else
				{
					return newAvailableNick;
				}
			}
		}
	}
	
	return nick; // All good! Nick not already used
}

function updateInfo(data) // Optimization? I think not!
{
	var newOnlinePlayers = [];
	var potato;
	
	for(var i=0, length=data.length; i<length; i++)
	{
		potato = data[i];
		
		if(potato.newChatMessages.length>0)
		{
			ga.gotNewInfo = true;
			appendChatArray(potato.newChatMessages, potato.nick);
		}
		
		newOnlinePlayers[newOnlinePlayers.length] = potato.nick;
	}
	
	if(!newOnlinePlayers.equals(ga.onlinePlayers)) // Custom method, see helperFunctions.js
	{
		ga.gotNewInfo = true;
		ga.onlinePlayers = newOnlinePlayers;
	}
}

function appendChatArray(chatMessages, name)
{
	var array = ga.chatMessages;
	var message;
	
	for(var i=0, length=chatMessages.length; i<length; i++)
	{
		message = chatMessages[i];
		
		if(array.length>=ga.maxNumberOfChatMessages)
		{
			array.splice(0, 1); // Remove one
		}
		
		array[array.length] = name + ": " + message;
	}
}

function updateServer()
{
	var data = {};
	
	if(ga.isMultiplayer)
	{
		if(typeof ga.potato!="undefined")
		{
			data.coords = {};
			
			data.coords.x = ga.potato.x;
			data.coords.y = ga.currentScrollingY;
			data.newChatMessages = ga.newChatMessages;
			
			socketIo.emit(c.serverUpdate, data);
			ga.newChatMessages = [];
		}
	}
}

function doPotatoes(potatoes)
{
	var potato;
	var potatoSprite;
	
	ga.multiplayerPotatoSprites = []; // Clear
	
	for(var i=0, length=potatoes.length; i<length; i++)
	{
		potato = potatoes[i];
		
		if(potato.nick!=ga.multiplayerNick)
		{
			potatoSprite = createSprite(getAnimationFromName("potato"), potato.coords.x, (c.hCanHeight - potato.coords.y) + ga.currentScrollingY);
			potatoSprite.nick = potato.nick;
			
			ga.multiplayerPotatoSprites[ga.multiplayerPotatoSprites.length] = potatoSprite;
		}
	}
}

function getRandomName()
{
	var randomIndex = randomInt(-1, ga.randomNames.length);
	
	return ga.randomNames[randomIndex];
}

function chat()
{
	if(ga.isMultiplayer)
	{
		var chatMessage = prompt("Chat:", "");
		
		if(chatMessage!=undefined && chatMessage!=null)
		{
			ga.newChatMessages[ga.newChatMessages.length] = chatMessage;
		}
	}
}