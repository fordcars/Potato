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

function drawBasicBackground(layer)
{
	var backgroundImage = l.currentLevel.backgroundImage;
	
	if(backgroundImage!=0)
	{
		layer.drawImage(getResourceFromName(backgroundImage).data, 0, 0);
	} else
	{
		layer.fillStyle = l.currentLevel.backgroundColor;
	
		layer.fillLayer();
	}
}

function drawSprites(layer)
{
	var currentSprite;
	
	for(var i=0, length=l.currentLevel.sprites.length; i<length; i++)
	{
		currentSprite = l.currentLevel.sprites[i];
		drawSprite(layer, currentSprite);
	}
}

function drawSprite(layer, sprite)
{
	layer.drawImage(sprite.animation.getFrame(), sprite.x, sprite.y);
}

function drawPotato(layer)
{
	drawSprite(layer, ga.potato);
}

function floorTileIsVisible(floorTileY) // Takes y coord
{
	if((floorTileY + ga.floorTileSide)<0 || (floorTileY)> c.canHeight)
	{
		return false;
	} else
	{
		return true;
	}
}

function spriteIsVisible(sprite) // Takes whole sprite
{
	if((sprite.x + sprite.boxWidth)>0 && sprite.x<c.canWidth &&
	   sprite.y + sprite.boxHeight>0 && sprite.y<c.canHeight)
	{
		return true;
	} else
	{
		return false;
	}
}

function drawBackgroundObjects(layer)
{
	var currentBackgroundObject;
	
	for(var i=0, length=ga.backgroundObjects.length; i<length; i++)
	{
		currentBackgroundObject = ga.backgroundObjects[i];
		currentBackgroundObject.y += currentBackgroundObject.speed + ga.scrollingSpeed;
		
		if(spriteIsVisible(currentBackgroundObject))
		{
			layer.drawImage(currentBackgroundObject.animation.getFrame(), currentBackgroundObject.x, currentBackgroundObject.y);
		}
	}
}

function drawForegroundObjects(layer)
{
	var currentForegroundObject;
	
	for(var i=0, length=ga.foregroundObjects.length; i<length; i++)
	{
		currentForegroundObject = ga.foregroundObjects[i];
		currentForegroundObject.y += currentForegroundObject.speed + ga.scrollingSpeed;
		
		if(spriteIsVisible(currentForegroundObject))
		{
			layer.drawImage(currentForegroundObject.animation.getFrame(), currentForegroundObject.x, currentForegroundObject.y);
		}
	}
}

function drawFloorTiles(layer)
{
	var currentFloorTile;
	var floorTileYWithScrolling;
	var hasSeenFloorTile = false;
	
	var potatoIsOnFloorTile = false;
	var potatoIsOnFinishTile = false;
	
	for(var i=0, length=ga.floorTiles.length; i<length; i++)
	{
		currentFloorTile = ga.floorTiles[i];
		
		floorTileYWithScrolling = currentFloorTile.y + ga.currentScrollingY;
		
		if(floorTileIsVisible(floorTileYWithScrolling))
		{
			layer.drawImage(currentFloorTile.animation.getFrame(), currentFloorTile.x, floorTileYWithScrolling);
			
			if(spriteIsOnFloorTile(currentFloorTile.x, floorTileYWithScrolling, ga.potato))
			{
				potatoIsOnFloorTile = true;
				
				if(currentFloorTile.isFinish) // Is the finish tile
				{
					potatoIsOnFinishTile = true;
				}
			}
			
			hasSeenFloorTile = true;
		} else
		{
			if(hasSeenFloorTile) // Optimization makes people look away from the horrible hacks
			{
				break;
			}
		}
	}
	
	if(potatoIsOnFinishTile) // You won!
	{
		levelFinished();
	} else if(!potatoIsOnFloorTile) // Not on a tile, doh!
	{
		gameOver();
	}
}