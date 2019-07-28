# RoShamBo: The Gathering

[Play the game live.](https://mmcxii.github.io/rps-multiplayer/)

## The Problem

For this project I was tasked with making a multiplayer Rock Paper Scissors game which could handle inputs from two players using separate devices at once.

## The Solution

Inputs from users are stored using Google Firebase. The app detects the presence of players and assigns them a role based on the order they connect to the lobby. Once both players are connected the game begins. It is turn based, with Player One taking an action, then Player Two taking their action, and then the game processing the results and displaying them on both players screens. Then the game begins again.

This assignment was very challenging for me, I experienced difficulties tracking which player was which and ensuring the correct player's choice was assigned to their reference in the database. The solution I ended up using was to preassign values of 'null' to predictable names in the database (playerOne & playerTwo), and overwriting them when players connected. This solution may be considered rigid and 'hard-coded' but it works and I am happy with the strict functionality it provides.
