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

function getLevels(resourceArray)
{
	var levels = [];
	var currentResource;
	
	for(var i=0, length=resourceArray.length; i<length; i++)
	{
		currentResource = resourceArray[i];
		
		if(currentResource.type=="level")
		{
			levels.push(currentResource);
		}
	}
	
	return levels;
}

function changeLevel(levelString)
{
	l.currentLevel = parseLevel(levelString);
}

function loadNextLevel()
{
	changeLevel(l.levels[l.currentLevelIndex].data);
	
	if(l.currentLevelIndex<l.levels.length-1) // To make sure we don't load a non-existing level
	{
		l.currentLevelIndex++;
	}
}

function loadNextPotatoLevel() // Levels defined here
{
	var level = {};
	
	// Default values, just in case
	level.name = "";
	level.amountOfLines = 100;
	level.backgroundColor = "white";
	level.backgroundImage = 0;
	level.floorTileStyle = "grass";
	
	level.backgroundObjects = [];
	level.foregroundObjects = [];
	level.isLastLevel = false;
	
	switch(l.currentLevelIndex)
	{
		case 0:
			level.name = "Potato Clouds";
			level.amountOfLines = 100;
			level.backgroundColor = "rgb(100, 100, 255)";
			level.floorTileStyle = "grass";
			
			level.backgroundObjects = [{style: "transparentCloud01", amount: 100, speed: -2}, // Somehow the speed defines how 3d it looks like. The lower the number, the deeper the cloud.
									   {style: "transparentCloud02", amount: 100, speed: -2},
									   {style: "transparentCloud03", amount: 100, speed: -2},
									   {style: "jet", amount: 10, speed: -4}]; // Speed 0 means it goes at the same speed as the level scrolling
									   
			level.foregroundObjects = [{style: "transparentCloud01", amount: 50, speed: 1},
									   {style: "transparentCloud02", amount: 50, speed: 1},
									   {style: "transparentCloud03", amount: 50, speed: 1}];
			break;
		
		case 1: // Floor tiles only start animating when they show up on screen
			level.name = "Christmas Potato";
			level.amountOfLines = 110;
			level.backgroundColor = "green";
			level.floorTileStyle = "metal";
			
			level.backgroundObjects = [{style: "christmasTree", amount: 100, speed: 0}];
			break;
			
		case 2:
			level.name = "Underwater Potatoes";
			level.amountOfLines = 130;
			level.backgroundColor = "blue";
			level.floorTileStyle = "underwater";
			
			level.backgroundObjects = [{style: "bubble", amount: 100, speed: 2},
									   {style: "fish", amount: 100, speed: -4},
									   {style: "potato", amount: 10, speed: 4}];
									   
			level.foregroundObjects = [{style: "bubble", amount: 50, speed: 2}];
			break;
			
		case 3:
			level.name = "Space Potatos";
			level.amountOfLines = 170;
			level.backgroundImage = "spaceBackground";
			level.floorTileStyle = "space";
			
			level.backgroundObjects = [{style: "rocket", amount: 50, speed: -8}];
			level.isLastLevel = true;
			break;
		
		default:
			break;
	}
	
	// Additional values
	level.length = level.amountOfLines * ga.floorTileSide;
	
	l.currentLevelIndex++;
	
	return level;
}

function parseLevel(levelString)
{
	var parsedLevel = {}; // Return value
	var parsedString = parseSimpleTextDatabase(levelString);
	
	var currentLine;
	
	parsedLevel.sprites = [];
	parsedLevel.floorTiles = [];
	
	for(var i=0, length=parsedString.length; i<length; i++)
	{
		currentLine = parsedString[i];
		
		switch(currentLine.name)
		{
			case "Author":
				parsedLevel.author = currentLine.values[0];
				break
				
			case "Sprite":
				var animationSprite = getAnimationFromName(currentLine.values[0]);
				var spriteX = currentLine.values[1];
				var spriteY = currentLine.values[2];
				
				parsedLevel.sprites.push(createSprite(animationSprite, spriteX, spriteY));
				break;
			
			default:
				break;
		}
	}
	
	return parsedLevel;
}