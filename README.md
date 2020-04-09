# MMM-Twitch
A twitch module for the magic mirror project.

This module utilizes the Twitch API to grab the top live streamers for a user specified game.

Register as a developer at https://dev.twitch.tv/ and create an application. Record the given client ID.

To obtain the ID code for the game(s) that you want to monitor, write the following command into your terminal:
curl -H 'Client-ID: {{yourClientID}}' -X GET 'https://api.twitch.tv/helix/games?name={{nameOfGame}}'

For your convenience, I added a few game IDs below so that you don't need to run the command listed above:
Fortnite: 33214,
PlayerUnkown's Battlegrounds: 493057,
