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

function getTrophyUrl(url, gameId, username, userToken, trophyId)
{
	return url + "/api/game/v1/trophies/add-achieved?game_id=" + gameId + "&username=" + username + "&user_token=" + userToken + "&trophy_id=" + trophyId;
}

function getFullUrl(url, signature)
{
	return url + "&signature=" + signature;
}

function getFullTrophyUrl(url, gameId, username, userToken, trophyId, gamePrivateKey)
{
	var trophyUrl = getTrophyUrl(url, gameId, username, userToken, trophyId);
	var signature = getSignature(trophyUrl, gamePrivateKey);
	
	return getFullUrl(trophyUrl, signature);
}

function achieveTrophy(trophyId) // Helper function
{
	if(ga.gamejoltUsername!=null && ga.gamejoltUserToken!=null)
	{
		var fullUrl = getFullTrophyUrl(c.gamejoltUrl, c.gamejoltId, ga.gamejoltUsername, ga.gamejoltUserToken, trophyId, c.gamejoltPrivateKey);
	
		return httpGet(fullUrl);
	}
}