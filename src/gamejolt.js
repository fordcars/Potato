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

function getSignature(url, gamePrivateKey)
{
	return CryptoJS.MD5(url + gamePrivateKey).toString();
}

// General
function getBasicUrlParameters(gameId, username, userToken) // Without signature. Use this, then api-specific data, then signature.
{
	return "?game_id=" + gameId + "&username=" + username + "&user_token=" + userToken;
}

function getFullUrl(url, signature) // Adds signature
{
	return url + "&signature=" + signature;
}

// API (TODO, make this more dynamic?)
function getTrophyUrl(url, gameId, username, userToken, gamePrivateKey, trophyId) // Adds signature
{
	var trophyUrl = url + "/trophies/add-achieved" + getBasicUrlParameters(gameId, username, userToken) + "&trophy_id=" + trophyId;
	var signature = getSignature(trophyUrl, gamePrivateKey);
	
	return getFullUrl(trophyUrl, signature);
}

function getOpenSessionUrl(url, gameId, username, userToken, gamePrivateKey)
{
	var sessionUrl = url + "/sessions/open/" + getBasicUrlParameters(gameId, username, userToken);
	var signature = getSignature(sessionUrl, gamePrivateKey);
	
	return getFullUrl(sessionUrl, signature);
}

function getCloseSessionUrl(url, gameId, username, userToken, gamePrivateKey)
{
	var sessionUrl = url + "/sessions/close/" + getBasicUrlParameters(gameId, username, userToken);
	var signature = getSignature(sessionUrl, gamePrivateKey);
	
	return getFullUrl(sessionUrl, signature);
}

function getPingUrl(url, gameId, username, userToken, gamePrivateKey)
{
	var pingUrl = url + "/sessions/ping/" + getBasicUrlParameters(gameId, username, userToken);
	var signature = getSignature(pingUrl, gamePrivateKey);
	
	return getFullUrl(pingUrl, signature);
}

function getAddScoreUrl(url, gameId, username, userToken, gamePrivateKey, score, sort) // sort is the number the scores are sorted with
{
	var scoreUrl = url + "/scores/add/" + getBasicUrlParameters(gameId, username, userToken) + "&score=" + score + "&sort=" + sort;
	var signature = getSignature(scoreUrl, gamePrivateKey);
	
	return getFullUrl(scoreUrl, signature);
}

// Helper functions
function isLoggedIn()
{
	if(ga.gamejoltUsername==null || ga.gamejoltUserToken==null)
	{
		return false;
	} else
	{
		return true;
	}
}

function achieveTrophy(trophyId)
{
	if(isLoggedIn())
	{
		var fullUrl = getTrophyUrl(c.gamejoltAPIUrl, c.gamejoltId, ga.gamejoltUsername, ga.gamejoltUserToken, c.gamejoltPrivateKey, trophyId);
	
		return httpGet(fullUrl);
	}
}

function openSession() // Most call this before pings
{
	if(isLoggedIn())
	{
		var fullUrl = getOpenSessionUrl(c.gamejoltAPIUrl, c.gamejoltId, ga.gamejoltUsername, ga.gamejoltUserToken, c.gamejoltPrivateKey);
	
		return httpGet(fullUrl);
	}
}

function closeSession() // I haven't figured out how to call this when the page closes without a pop-up, poop!
{
	if(isLoggedIn())
	{
		var fullUrl = getCloseSessionUrl(c.gamejoltAPIUrl, c.gamejoltId, ga.gamejoltUsername, ga.gamejoltUserToken, c.gamejoltPrivateKey);
	
		return httpGet(fullUrl);
	}
}

function ping() // Use every ~30 seconds, after openning session
{
	if(isLoggedIn())
	{
		var fullUrl = getPingUrl(c.gamejoltAPIUrl, c.gamejoltId, ga.gamejoltUsername, ga.gamejoltUserToken, c.gamejoltPrivateKey);
	
		return httpGet(fullUrl);
	}
}

function addScore(score) // Adds a score in the leader boards
{
	if(isLoggedIn())
	{
		var fullUrl = getAddScoreUrl(c.gamejoltAPIUrl, c.gamejoltId, ga.gamejoltUsername, ga.gamejoltUserToken, c.gamejoltPrivateKey, score, score);
	
		return httpGet(fullUrl);
	}
}