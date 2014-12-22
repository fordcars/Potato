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

function setupGame()
{
	var potatoX;
	
	ga.potatoSpeed = ga.defaultPotatoSpeed;
	ga.scrollingSpeed = ga.defaultScrollingSpeed;
	ga.currentScrollingY = ga.defaultScrollingY;
	ga.score = 0;
	
	l.currentLevel = loadNextPotatoLevel();
	
	clearAllLayers();
	
	drawBasicBackground(bg);
	
	ga.backgroundObjects = createBackgroundObjects();
	ga.floorTiles = createNewFloorTiles(getAnimationFromName(l.currentLevel.floorTileStyle), l.currentLevel.amountOfLines);
	
	potatoX = ga.floorTiles[1].x + (ga.floorTileSide / 2);
	
	ga.potato = createSprite(getAnimationFromName("potato"), potatoX, c.hCanHeight); // Create potato
	
	ga.uiLocation = "game";
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

function createBackgroundObjects()
{
	var backgroundObjects = [];
	var currentBackgroundObject;
	var currentBackgroundObjectAnimation;
	
	var currentSprite;
	var currentSpriteX;
	var currentSpriteY;
	
	var spriteWidth;
	var spriteHeight;
	
	for(var i=0, length=l.currentLevel.backgroundObjects.length; i<length; i++)
	{
		currentBackgroundObject = l.currentLevel.backgroundObjects[i];
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
			currentSprite.speed = currentBackgroundObject.speed;
			
			backgroundObjects.push(currentSprite);
		}
	}
	
	return backgroundObjects;
}
			
function createNewFloorTiles(animation, numberOfTileLines)
{
	var floorTiles = [];
	
	var lastSlot = 0;
	var secondTile = false;
	var currentSlot = 0;
	
	var finishFloorTile;
	
	for(var i=0; i>=-numberOfTileLines; i--)
	{
		if(i==-numberOfTileLines) // Last line
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


function createFloorTile(animation, slot, line)
{
	var floorTileX = (slot * ga.floorTileSide) + ga.slotsXOffset;
	var floorTileY = line * ga.floorTileSide;
	
	return createSprite(animation, floorTileX, floorTileY);
}

// Game events
function gameOver()
{
	ga.firstFrame = true;
	l.currentLevelIndex--;
	changeMenuLocation("gameOver");
}

function gameWon()
{
	var realCurrentLevelIndex = l.currentLevelIndex - 1; // The make it more logical at this stage
	
	ga.firstFrame = true;
	l.currentLevelIndex = 0;
	changeMenuLocation("gameWon");
	
	getTrophy(realCurrentLevelIndex);
}

function levelFinished()
{
	if(l.currentLevel.lastLevel)
	{
		gameWon();
	} else
	{
		var realCurrentLevelIndex = l.currentLevelIndex - 1; // The make it more logical at this stage
		
		ga.firstFrame = true;
		changeMenuLocation("levelFinished");
		
		getTrophy(realCurrentLevelIndex);
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
	ga.scrollingSpeed += ga.speedAugmentation;
	ga.potatoSpeed += ga.speedAugmentation;
	
	ga.potato.animation.delay -= ga.potatoAnimationAugmentation;
	
	ga.score++;
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
	
	drawPotato(fg);
}