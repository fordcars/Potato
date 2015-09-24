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

function displayGame()
{
	var gameLocation = ga.uiLocation;
	
	if(ga.firstFrame)
	{
		ga.firstFrame = false;
		setupGame();
	}
	
	if(gameLocation=="game")
	{
		mainGameLoop();
	}
}

function initValues() // Useful initializations
{
	ga.currentScrollingY = ga.defaultScrollingY;
	ga.scrollingSpeed = ga.defaultScrollingSpeed;
	ga.potatoSpeed = ga.defaultPotatoSpeed;
	ga.currentLevelScore = 0;
}

function setupGame()
{
	var potatoX;
	
	initValues();
	
	l.currentLevel = loadNextPotatoLevel();
	
	clearAllLayers();
	drawBasicBackground(bg);
	
	if(ga.isMultiplayer)
	{
		// Use pre-generated level
		ga.floorTiles = buildFloorTilesFromArray(getAnimationFromName(l.currentLevel.floorTileStyle), c.multiplayerLevel);
		drawMultiplayerUi(ui, true); // Draw multiplayer ui
	} else // Not multiplayer
	{console.log("Hi");
		// Generate random level
		ga.floorTiles = createNewFloorTiles(getAnimationFromName(l.currentLevel.floorTileStyle), l.currentLevel.amountOfLines);
	}
	
	ga.backgroundObjects = createLevelObjects(true); // True for background
	ga.foregroundObjects = createLevelObjects(false);
	
	potatoX = ga.floorTiles[0].x + (ga.floorTileSide / 2); // Puts potato on first tile
	
	ga.potato = createSprite(getAnimationFromName("potato"), potatoX, c.hCanHeight); // Create potato
	
	ga.uiLocation = "game";
}

function resetGame()
{
	ga.firstFrame = true;
	ga.score = 0;
	l.currentLevelIndex = 0;
	byeSocket();
	
	changeMenuLocation("main");
}

// Game elements
function createSprite(animationSprite, x, y) // An animation sprite is the raw animation, while the sprite is a game object.
{
	var sprite = {};
	
	sprite.animation = createAnimationSprite(animationSprite, x, y);
	
	sprite.x = x;
	sprite.y = y;
	
	// Collision box
	sprite.boxWidth = sprite.animation.width;
	sprite.boxHeight = sprite.animation.height;
	
	return sprite;
}

function createLevelObjects(isInBackground)
{
	var objectArray = [];
	
	var objects = [];
	var currentBackgroundObject;
	var currentBackgroundObjectAnimation;
	
	var currentSprite;
	var currentSpriteX;
	var currentSpriteY;
	
	var spriteWidth;
	var spriteHeight;
	
	if(isInBackground)
	{
		objectArray = l.currentLevel.backgroundObjects;
	} else
	{
		objectArray = l.currentLevel.foregroundObjects;
	}
	
	for(var i=0, length=objectArray.length; i<length; i++)
	{
		currentBackgroundObject = objectArray[i];
		currentBackgroundObjectAnimation = getAnimationFromName(currentBackgroundObject.style);
		
		if(currentBackgroundObjectAnimation==false)
		{
			error("Animation '" + currentBackgroundObject.style + "' does not exist!");
			continue;
		}
		
		for(var j=0; j<currentBackgroundObject.amount; j++)
		{
			currentSprite = createSprite(currentBackgroundObjectAnimation, 0, 0);
			
			spriteWidth = currentSprite.animation.width;
			spriteHeight = currentSprite.animation.heigth;
			
			currentSprite.x = randomInt(-1, c.canWidth - spriteWidth);
			currentSprite.y = randomInt(-l.currentLevel.length, 0); // Spawns somewhere in the level
			currentSprite.speed = getRandomSpeed(currentBackgroundObject.speed);
			
			objects.push(currentSprite);
		}
	}
	
	return objects;
}

function getRandomSpeed(targetSpeed) // Gets a speed similar to targetSpeed, but random (c.randomSpeedOffset). Not random when the targetSpeed is 0.
{
	if(targetSpeed==0)
	{
		return targetSpeed;
	}
	
	return randomFloat(targetSpeed - c.randomSpeedOffset, targetSpeed + c.randomSpeedOffset);
}
			
function createNewFloorTiles(animation, numberOfTileLines)
{
	var floorTiles = [];
	
	var lastSlot = 0;
	var secondTile = false;
	var currentSlot = 0;
	
	var finishFloorTile;
	
	for(var i=0; i>-numberOfTileLines; i--) // Inverted, since i needs to be <=0
	{
		if(i==-(numberOfTileLines - 1)) // Last line
		{
			currentSlot = lastSlot;
			finishFloorTile = createFloorTile(getAnimationFromName(ga.finishFloorTileAnimationName), currentSlot, i);
			finishFloorTile.isFinish = true;
			
			floorTiles.push(finishFloorTile);
		} else if(i==0) // First line
		{
			currentSlot = randomInt(-1, ga.numberOfSlots); // [1, 3]
			floorTiles.push(createFloorTile(animation, currentSlot, i));
			
			lastSlot = currentSlot;
		} else
		{
			currentSlot = lastSlot;
			floorTiles.push(createFloorTile(animation, currentSlot, i));
			
			if(randomBool())
			{
				if(lastSlot==ga.numberOfSlots-1) // Last (right) slot
				{
					lastSlot--;
					currentSlot = lastSlot;
				} else if(lastSlot==0) // First slot
				{
					lastSlot++;
					currentSlot = lastSlot;
				} else
				{
					if(randomBool())
					{
						lastSlot--;
						currentSlot = lastSlot;
					} else
					{
						lastSlot++;
						currentSlot = lastSlot;
					}
				}
				
				floorTiles.push(createFloorTile(animation, currentSlot, i));
			}
		}
	}
	
	return floorTiles;
}

function buildFloorTilesFromArray(animation, tileArray) // Generates floor tiles from array of floor tile slots
{
	var floorTiles = [];
	var numberOfTiles = tileArray.length;
	var currentTileSlot;
	
	var lastSlot = false; // Make sure we don't have diagonal paths
	
	for(var i=0; i<numberOfTiles; i++)
	{
		currentTileSlot = tileArray[i];
		
		if(i===numberOfTiles-1) // Last tile
		{
			var finishTileAnimation = getAnimationFromName(ga.finishFloorTileAnimationName);
			
			var tile = createFloorTile(finishTileAnimation, currentTileSlot, -i)
			tile.isFinish = true;
			
			floorTiles.push(tile); // Push it too!
		} else
		{
			floorTiles.push(createFloorTile(animation, currentTileSlot, -i)); // -i, because createFloorTile takes an i<=0
		}
		
		if(lastSlot!==currentTileSlot && i!==0) // This isn't the first tile either
		{
			floorTiles.push(createFloorTile(animation, lastSlot, -i)); // Add another tile over the tile on the last line.
		}
		
		lastSlot = currentTileSlot;
	}
	
	return floorTiles;
}

function createFloorTile(animation, slot, line) // Line is the bottom-most line (tiles move, not the potato). Lines are then negative (upwards is negative)
{
	var floorTileX = (slot * ga.floorTileSide) + ga.slotsXOffset;
	var floorTileY = line * ga.floorTileSide;
	
	return createSprite(animation, floorTileX, floorTileY);
}

function respawn()
{
	initValues();
	ga.potato.x = ga.floorTiles[0].x + (ga.floorTileSide / 2); // Reset
	
	// Keep objects fresh
	ga.backgroundObjects = createLevelObjects(true);
	ga.foregroundObjects = createLevelObjects(false);
	
	clearAllLayers();
	drawBasicBackground(bg);
	drawMultiplayerUi(ui, true);
}

// Game events
function gameOver()
{
	if(!ga.isMultiplayer)
	{
		ga.firstFrame = true;
		l.currentLevelIndex--;
		
		addScore(ga.score + ga.currentLevelScore); // Uploads 'fake' score, the score you would of had
	}
	
	changeMenuLocation("gameOver"); // Shows 'fake' score
}

function gameWon()
{
	l.currentLevelIndex = 0;
	
	changeMenuLocation("gameWon");
}

function levelFinished()
{
	if(!ga.isMultiplayer)
	{
		var realCurrentLevelIndex = l.currentLevelIndex - 1; // The make it more logical at this stage
		getTrophy(realCurrentLevelIndex);
		
		ga.score += ga.currentLevelScore; // Add to total score
		addScore(ga.score); // Upload real score
		
		ga.firstFrame = true; // Tells the game to setup next time, to get the next level
		
		if(l.currentLevel.isLastLevel)
		{
			gameWon();
		} else
		{
			changeMenuLocation("levelFinished");
		}
	} else
	{
		changeMenuLocation("levelFinished");
	}
}

function getTrophy(levelIndex)
{
	switch(levelIndex)
	{
		case 0: // First level
			achieveTrophy(c.tNormalPotato);
			break;
		
		case 1:
			achieveTrophy(c.tChristmasPotato);
			break
		
		case 2:
			achieveTrophy(c.tWetPotato);
			break
			
		case 3:
			achieveTrophy(c.tSpacePotato);
			break
	}
}

function doScrolling()
{
	ga.currentScrollingY += ga.scrollingSpeed;
}

function doPotatoControls()
{
	if(inp.left.s)
	{
		ga.potato.x -= ga.potatoSpeed;
	} else if(inp.right.s)
	{
		ga.potato.x += ga.potatoSpeed;
	}
	
	if(ga.isMultiplayer)
	{
		var speedRate = 0.1;
		var minPotatoSpeed = 3;
		
		if(inp.up.s)
		{
			ga.scrollingSpeed += speedRate;
			ga.potatoSpeed = ga.scrollingSpeed;
			
			if(ga.potatoSpeed<minPotatoSpeed)
			{
				ga.potatoSpeed = minPotatoSpeed; // Is this useful?
			}
		} else if(inp.down.s)
		{
			ga.scrollingSpeed -= speedRate;
			ga.potatoSpeed = ga.scrollingSpeed;
			
			if(ga.potatoSpeed<minPotatoSpeed)
			{
				ga.potatoSpeed = minPotatoSpeed; // Is this useful?
			}
		}
	}
}

function spriteIsOnFloorTile(floorTileX, floorTileY, sprite)
{
	var spriteX = sprite.x + (sprite.boxWidth / 2); // Center of sprite
	var spriteY = sprite.y + (sprite.boxHeight / 2);
	
	if(spriteX>=floorTileX && spriteX<=(floorTileX + ga.floorTileSide) &&
	   spriteY>=floorTileY && spriteY<=(floorTileY + ga.floorTileSide))
	{
		return true;
	} else
	{
		return false;
	}
}

function doMath()
{
	if(!ga.isMultiplayer)
	{
		ga.scrollingSpeed += ga.speedAugmentation;
		ga.potatoSpeed += ga.speedAugmentation;
		ga.currentLevelScore++;
	}
	
	ga.potato.animation.delay = 10 - positive(ga.scrollingSpeed);
}

function mainGameLoop()
{
	doMath();
	doScrolling();
	doPotatoControls();
	
	// Drawing
	fg.clearLayer(); // Background layer (actual game, ui is fg)
	
	drawBackgroundObjects(fg); // Also does movement for optimization
	drawFloorTiles(fg); // Also does potato collision detection for optimization
	
	if(ga.isMultiplayer)
	{
		drawMultiplayerPotatos(fg);
	}
	
	drawPotato(fg); // Draw over multiplayer potatoes for clarity
	drawForegroundObjects(fg); // Also does movement for optimization
	
	if(ga.isMultiplayer)
	{
		drawMultiplayerUi(ui);
	}
}