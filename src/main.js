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

// NOTE: Floor tiles need to be 174x174 pixels!

// Level objects highly not-optimized! Fairly ugly code, sorry :(

// TODO: Make it work in IE on Gamejolt?

window.onload = main;

// All evil globals defined here. Don't look!
var ui; // Layer 1 (The top layer)
var fg; // Layer 2
var bg; // Layer 3

var canvasContainer;
var canvases = [];
var canvasContexts = [];
var mainCanvas;
var mainCanvasContext;

var socketIo = io("http://potato.biz.tm:2450");

// "Namespaces"
var gr = {}; // Graphics. Game and graphics both start with g
var r = {}; // Resources
var a = {}; // Animations
var inp = {}; // Input. i is used in for loops, in is a reserved word, doh! Use inp
var m = {}; // Menu
var o = {}; // Options
var ga = {}; // Game. Game and graphics both start with g
var l = {}; // Levels
var c = {}; // Constants

function definitions() // Has access to other functions, since this is after function definitions.
{
	// Resources
	r.resourceConstructors = [
		{type: "audio", name: "potatoMusic", path: "potato.mp3"},
		
		{type: "image", name: "potato01", path: "potato/potato01.png"},
		{type: "image", name: "potato02", path: "potato/potato02.png"},
		{type: "image", name: "potato03", path: "potato/potato03.png"},
		{type: "image", name: "potato04", path: "potato/potato04.png"},
		
		{type: "image", name: "cloud01", path: "cloud/cloud01.png"},
		{type: "image", name: "cloud02", path: "cloud/cloud02.png"},
		{type: "image", name: "cloud03", path: "cloud/cloud03.png"},
		
		{type: "image", name: "transparentCloud01", path: "cloud/transparentCloud01.png"},
		{type: "image", name: "transparentCloud02", path: "cloud/transparentCloud02.png"},
		{type: "image", name: "transparentCloud03", path: "cloud/transparentCloud03.png"},
		
		{type: "image", name: "jet01", path: "jet/jet01.png"},
		{type: "image", name: "jet02", path: "jet/jet02.png"},
		{type: "image", name: "jet03", path: "jet/jet03.png"},
		{type: "image", name: "jet04", path: "jet/jet04.png"},
		{type: "image", name: "jet05", path: "jet/jet05.png"},
		{type: "image", name: "jet06", path: "jet/jet06.png"},
		{type: "image", name: "jet07", path: "jet/jet07.png"},
		{type: "image", name: "jet08", path: "jet/jet08.png"},
		
		{type: "image", name: "christmasTree01", path: "christmasTree/christmasTree01.png"},
		{type: "image", name: "christmasTree02", path: "christmasTree/christmasTree02.png"},
		{type: "image", name: "christmasTree03", path: "christmasTree/christmasTree03.png"},
		{type: "image", name: "christmasTree04", path: "christmasTree/christmasTree04.png"},
		
		{type: "image", name: "bubble01", path: "bubble/bubble01.png"},
		{type: "image", name: "bubble02", path: "bubble/bubble02.png"},
		{type: "image", name: "bubble03", path: "bubble/bubble03.png"},
		{type: "image", name: "bubble04", path: "bubble/bubble04.png"},
		{type: "image", name: "bubble05", path: "bubble/bubble05.png"},
		{type: "image", name: "bubble06", path: "bubble/bubble06.png"},
		
		{type: "image", name: "fish01", path: "fish/fish01.png"},
		{type: "image", name: "fish02", path: "fish/fish02.png"},
		{type: "image", name: "fish03", path: "fish/fish03.png"},
		{type: "image", name: "fish04", path: "fish/fish04.png"},
		
		{type: "image", name: "rocket01", path: "rocket/rocket01.png"},
		{type: "image", name: "rocket02", path: "rocket/rocket02.png"},
		
		{type: "image", name: "grass", path: "levelTiles/grass.png"},
		
		{type: "image", name: "metalChristmas01", path: "levelTiles/metalChristmas01.png"},
		{type: "image", name: "metalChristmas02", path: "levelTiles/metalChristmas02.png"},
		{type: "image", name: "metalChristmas03", path: "levelTiles/metalChristmas03.png"},
		{type: "image", name: "metalChristmas04", path: "levelTiles/metalChristmas04.png"},
		
		{type: "image", name: "underwater", path: "levelTiles/underwater.png"},
		{type: "image", name: "space", path: "levelTiles/space.png"},
		{type: "image", name: "spaceBackground", path: "spaceBackground.png"},
		
		{type: "image", name: "finish01", path: "levelTiles/finish01.png"},
		{type: "image", name: "finish02", path: "levelTiles/finish02.png"}];
	
	r.resourceArray = createResources(r.resourceConstructors); // Creates an array of resource objects
	r.resourcesLoaded = 0;
	
	// Animations
	a.animationSpriteContructors = [
		{name: "potato", frames: ["potato01", "potato02", "potato03", "potato04"], delay: 10, randomStart: false},
		
		{name: "cloud01", frames: ["cloud01"], delay: 10000, randomStart: false},
		{name: "cloud02", frames: ["cloud02"], delay: 10000, randomStart: false},
		{name: "cloud03", frames: ["cloud03"], delay: 10000, randomStart: false},
		
		{name: "transparentCloud01", frames: ["transparentCloud01"], delay: 10000, randomStart: false},
		{name: "transparentCloud02", frames: ["transparentCloud02"], delay: 10000, randomStart: false},
		{name: "transparentCloud03", frames: ["transparentCloud03"], delay: 10000, randomStart: false},
		
		{name: "jet", frames: ["jet01", "jet02", "jet03", "jet04", "jet05", "jet06", "jet07", "jet08"], delay: 10, randomStart: true},
		
		{name: "christmasTree", frames: ["christmasTree01", "christmasTree02", "christmasTree03", "christmasTree04"], delay: 10, randomStart: true},
		
		{name: "bubble", frames: ["bubble01", "bubble02", "bubble03", "bubble04", "bubble05", "bubble06"], delay: 10, randomStart: true},
		{name: "fish", frames: ["fish01", "fish02", "fish03", "fish04"], delay: 10, randomStart: true},
		{name: "rocket", frames: ["rocket01", "rocket02"], delay: 10, randomStart: true},
		
		{name: "grass", frames: ["grass"], delay: 10000, randomStart: false}, // Should I do this? It seems lazy...
		{name: "metal", frames: ["metalChristmas01", "metalChristmas02", "metalChristmas03", "metalChristmas04"], delay: 20, randomStart: true},
		{name: "underwater", frames: ["underwater"], delay: 10000, randomStart: false},
		{name: "space", frames: ["space"], delay: 10000, randomStart: false},
		
		{name: "finish", frames: ["finish01", "finish02"], delay: 5, randomStart: false}];
	
	// Input
	inp.x = 0;
	inp.y = 0;
	inp.clickBuffer = false;
	inp.clicked = false; // Updated each frame. Use this! (inp.clicked = checkForClick() each frame)
	
	inp.lastMouseMoveTime = 0;
	
	inp.keys = [];
	
	inp.up = newInputKey(38); // In javascript, objects get passed by reference
	inp.down = newInputKey(40);
	inp.left = newInputKey(37);
	inp.right = newInputKey(39);
	inp.enter = newInputKey(13, true, chat);

	// Menu
	m.mainMenuButtons = [];
	m.optionsButtons = [];
	m.creditsButtons = [];
	m.confirmFullScreenButtons = [];
	m.gameOverButtons = [];
	m.gameWonButtons = [];
	m.levelFinishedButtons = [];
	m.gameSelectionButtons = []; // Singleplayer/Multiplayer
	m.respawnButtons = [];
	
	m.location = "loading";
	m.oldLocation = "";
	m.newLocation = true; // Is true when this is the first frame since m.location changed
	m.buttonHeight = 20;

	m.creditsHeight = 0;
	
	// Options
	o.displayMode = "Normal"; // Default settings defined here
	o.music = true;
	
	ga.firstFrame = true;
	ga.uiLocation = "game";
	
	ga.defaultPotatoSpeed = 3;
	
	ga.potatoAnimationAugmentation = 0.003;
	ga.potatoSpeed;
	ga.potato;
	
	ga.backgroundObjects;
	ga.foregroundObjects;
	
	ga.floorTiles;
	ga.floorTileSide = 174; // 696/4 = 174. 800 - 696 = 104. We have 52 pixels each side for space, yay!
	
	ga.finishFloorTileAnimationName = "finish";
	
	ga.slotsXOffset; // Calculated in main because constants
	
	ga.numberOfSlots = 4;
	
	ga.defaultScrollingSpeed = ga.defaultPotatoSpeed;
	ga.scrollingSpeed;
	
	ga.defaultScrollingY = 200;
	ga.currentScrollingY;
	
	ga.speedAugmentation = 0.005;
	
	ga.currentLevelScore = 0;
	ga.score = 0; // Total score
	
	ga.askedPlayerInfo = false;
	ga.gamejoltUsername;
	ga.gamejoltUserToken;
	
	// Multiplayer
	ga.isMultiplayer = false;
	ga.multiplayerNick = false;
	ga.maxNumberOfChatMessages = 10;
	ga.chatMessages = [];
	ga.newChatMessages = [];
	ga.onlinePlayers = []; // Player names
	ga.gotNewInfo = true;
	ga.maxNumberOfShownPlayers = 10;
	ga.multiplayerPotatoSprites = []; // All other potatoes
	
	ga.randomNames = ["Lolnoname", "Noname", "Nameplease?", "Ineedaname"];
	
	// Levels
	l.levels = getLevels(r.resourceArray); // Gets all levels, in order (the order they are loaded, in r.resourceConstructors)
	l.currentLevelIndex = 0;
	l.currentLevel; // Used for without other stuff in this case
	
	// Constants
	c.gameName = "Potato";
	c.gameVersion = "0.4.1";
	c.numberOfLayers = 3;
	c.defaultCanWidth = 800;
	c.defaultCanHeight = 600;
	c.canWidth = c.defaultCanWidth;
	c.canHeight = c.defaultCanHeight;
	c.hCanWidth = c.defaultCanWidth / 2;
	c.hCanHeight = c.defaultCanHeight / 2;
	
	c.numberOfResources = r.resourceArray.length;
	c.resourcesPath = "resources/"; // Used in loadResources()
	
	c.defaultTranslationX = 0;
	c.defaultTranslationY = 0;
	c.defaultScalingX = 1;
	c.defaultScalingY = 1;

	c.mainTextFont = "20pt Courier New";
	c.mainTextHeight = 20;
	c.bigTextFont = "30pt Courier New";
	c.bigTextHeight = 30;
	c.mainMenuColor = "rgb(235, 204, 80)";
	c.mainMenuBackgroundColor = "black";
	c.selectedButtonColor = "white";
	
	c.credits = ["-PROGRAMMING-", "Carl Hewett", "", "-MUSIC-", "Carl Hewett", "", "-ARTWORK-", "Carl Hewett", "", "-SPECIAL THANKS TO-", "Me"] // '-' are used to indicate titles
	c.numberOfCredits = c.credits.length;
	c.creditsVisibleHeight = 80;
	c.defaultCreditsHeight = c.defaultCanHeight - c.creditsVisibleHeight + c.bigTextHeight + 5;
	
	c.numberOfInputKeys = inp.keys.length;
	c.defaultToggleButtonValueIndex = 0;
	c.mouseMoveThrottle = 1; // The smaller the more precise (at the cost of CPU)
	
	c.lineEndings = "\n"; // All line endings in levels are set to this
	
	c.randomSpeedOffset = 2;
	
	c.gamejoltAPIUrl = "http://gamejolt.com/api/game/v1"
	c.gamejoltId = 38906;
	c.gamejoltPrivateKey = "3af03e6a834a552e1c0375743507d736"; // Insecure to put this here?
	
	c.gamejoltPingDelay = 30000; // 30 seconds
	
	// Gamejolt trophies
	c.tNormalPotato = 13019;
	c.tChristmasPotato = 13120;
	c.tWetPotato = 13118;
	c.tSpacePotato = 13145;
	
	c.updateServerDelay = 150;
	
	c.potatoShake = "potatoShake";
	c.clientUpdate = "clientUpdate";
	c.serverUpdate = "serverUpdate";
	c.potatoBye = "potatoBye";
	
	c.multiplayerLevel = [2, 2, 2, 2, 3, 3, 2, 3, 2, 3, 2, 2, 1, 0, 1, 0,
	1, 1, 1, 0, 0, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 2, 3, 2, 2, 3, 3, 2, 3,
	2, 3, 2, 3, 3, 3, 2, 2, 2, 3, 2, 1, 1, 0, 0, 1, 2, 2, 1, 0, 0, 1, 1,
	1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 2, 3, 3, 3,
	3, 3, 3, 2, 3, 2, 2, 2, 3, 2, 3, 2, 3, 2, 2, 2, 3, 2, 1, 1, 1, 1, 0,
	0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1,
	0, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 0, 1, 2, 1, 0, 0]; // Tile slots, can be 0, 1, 2 or 3
}

function main()
{
	var currentCanvas;
	var currentCanvasContext;
	
	definitions();
	
	// Other definitions
	ga.slotsXOffset = (c.canWidth - (ga.numberOfSlots * ga.floorTileSide)) / 2;

	(function() // requestAnimationFrame polyfill by Erik Möller. Fixed by Paul Irish and Tino Zijdel, https://gist.github.com/paulirish/1579671, MIT license
	{
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
				window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
					|| window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}());
	
	setupElements(document.body);
	createMenuButtons();
	setupSocketEvents();
	
	loadResources(r.resourceArray); // Starts loading resources
	
	window.requestAnimationFrame(update);
}

function setupElements(parent)
{
	canvasContainer = document.createElement("div");
	parent.appendChild(canvasContainer);
	
	for(var i=c.numberOfLayers-1; i>=0; i--)
	{
		currentCanvas = document.createElement("canvas");

		currentCanvas.style.position = "absolute";
		currentCanvas.style.left = 0;
		currentCanvas.style.top = 0;
		currentCanvas.style.zIndex = i;
		
		currentCanvas.width = c.defaultCanWidth;
		currentCanvas.height = c.defaultCanHeight;
		
		canvases.push(currentCanvas);
		
		currentCanvasContext = currentCanvas.getContext("2d");
		
		currentCanvasContext.save(); // For restoring
		addGraphicMembers(currentCanvasContext); // In graphics.js
		
		canvasContexts.push(currentCanvasContext);
		
		canvasContainer.appendChild(currentCanvas);
	}

	mainCanvas = canvases[0];
	mainCanvasContext = canvasContexts[0];
	
	ui = canvasContexts[0];
	fg = canvasContexts[1];
	bg = canvasContexts[2];
	
	addEventListeners(); // In input.js
}

function update()
{
	window.requestAnimationFrame(update);
	
	var menuLoc = m.location;
	
	inp.clicked = checkForClick();
	updateMenuInfo();
	
	if(m.newLocation)
	{
		if(menuLoc!="play")
		{
			clearAllLayers();
		}
	}
	
	if(menuLoc=="loading")
	{
		displayLoading(fg);
	} else if(menuLoc=="main")
	{	
		if(!ga.askedPlayerInfo) // BEFORE displaying the menu
		{
			ga.askedPlayerInfo = true;
			getPlayerInfo(); // Also opens ping session
		}
		
		displayMainMenu(fg);
	} else if(menuLoc=="gameSelection")
	{
		displayGameSelection(fg);
	} else if(menuLoc=="play")
	{
		displayGame(); // In game.js
	} else if(menuLoc=="options")
	{
		displayOptions(fg);
	} else if(menuLoc=="credits")
	{
		displayCredits(fg);
	} else if(menuLoc=="confirmFullScreen")
	{
		displayConfirmFullScreen(fg);
	} else if(menuLoc=="gameOver")
	{
		displayGameOver(fg);
	} else if(menuLoc=="gameWon")
	{
		displayGameWon(fg);
	} else if(menuLoc=="levelFinished")
	{
		displayLevelFinished(fg);
	}
}

function getPlayerInfo()
{
	var errorText = "You will not be able to receive trophies or save scores. Reload the page if you change your mind :)";
	
	ga.gamejoltUsername = prompt("To receive trophies and upload high scores, please enter your username (this will also be used for multiplayer): ", getRandomName());
	
	if(ga.gamejoltUsername==null || ga.gamejoltUsername==undefined)
	{
		alert(errorText);
	} else
	{
		ga.gamejoltUserToken = prompt("Please enter your user token: ", "User token");
		
		if(ga.gamejoltUserToken==null || ga.gamejoltUserToken==undefined)
		{
			alert(errorText);
		}
	}
	
	openSession(); // Open ping session
	window.setInterval(ping, c.gamejoltPingDelay);
}