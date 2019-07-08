/* Local Variables */
let playerOne = null;
let playerTwo = null;

let playerOneName = '';
let playerTwoName = '';

let localPlayerName = '';

let playerOneChoice = '';
let playerTwoChoice = '';

let currentPhase = 0;
let ties = 0;
let res = 'While you wait, please refer to the rules button in the top right corner.';

const colorWheel = {
    white: {
        allies: ['black', 'green'],
        enemies: ['blue', 'red'],
    },
    blue: {
        allies: ['red', 'white'],
        enemies: ['black', 'green'],
    },
    black: {
        allies: ['green', 'blue'],
        enemies: ['red', 'white'],
    },
    red: {
        allies: ['white', 'black'],
        enemies: ['green', 'blue'],
    },
    green: {
        allies: ['blue', 'red'],
        enemies: ['white', 'black'],
    },
};
/* Firebase Config */

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBMe8wub75E2as0p_HYoABdsSwe9axl2as',
    authDomain: 'rps-multiplayer-fc8e3.firebaseapp.com',
    databaseURL: 'https://rps-multiplayer-fc8e3.firebaseio.com',
    projectId: 'rps-multiplayer-fc8e3',
    storageBucket: '',
    messagingSenderId: '500300842060',
    appId: '1:500300842060:web:1cee0ba601dd01e0',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference the database
const db = firebase.database();

// Reference to database location
const usersRef = db.ref('game/users');
const phaseRef = db.ref('game/phase');
const tiesRef = db.ref('game/ties');
const resRef = db.ref('game/result');

/* Functionality */

usersRef.on('value', (snap) => {
    // Check for first player
    if (snap.child('playerOne').exists()) {
        // Set player one
        playerOne = snap.val().playerOne;
        playerOneName = playerOne.name;

        document.querySelector(`#player--one`).textContent = playerOneName;
    } else {
        playerOne = null;
        playerOneName = '';
        document.querySelector(`#player--one`).textContent = 'Waiting for connection.';
    }

    // Check for second player
    if (snap.child('playerTwo').exists()) {
        // Set player one
        playerTwo = snap.val().playerTwo;
        playerTwoName = playerTwo.name;

        document.querySelector(`#player--two`).textContent = playerTwoName;
    } else {
        playerTwo = null;
        playerTwoName = '';
        document.querySelector(`#player--two`).textContent = 'Waiting for connection.';
    }

    if (playerOne && playerTwo) {
        document.querySelector(
            '#instructions'
        ).textContent = `${playerOneName}, please make your selection.`;

        setBoard();
    }

    if (!playerOne && !playerTwo) {
        phaseRef.remove();
        tiesRef.remove();
    }
});

phaseRef.on('value', (snap) => {
    if (snap.val() === 1) {
        currentPhase = 1;

        if (playerOne && playerTwo) {
            document.querySelector(
                '#instructions'
            ).textContent = `${playerOneName}, please make your selection.`;
        }
    } else if (snap.val() === 2) {
        currentPhase = 2;

        if (playerOne && playerTwo) {
            document.querySelector(
                '#instructions'
            ).textContent = `${playerTwoName}, please make your selection.`;
        }
    }
});

// Listens for ties to update player one's page
tiesRef.on('value', (snap) => {
    ties = snap.val();

    document.querySelector('#ties').textContent = ties;
});

// Listens for results to update player one's page
resRef.on('value', (snap) => {
    res = snap.val();

    document.querySelector('#results').textContent = res;
});

function processGame() {
    /* Player one chooses white */
    if (playerOne.choice === 'w') {
        // Player two chooses white
        if (playerTwo.choice === 'w') {
            ties++;

            tiesRef.set(ties);

            res = `Both players picked white, it's a tie!`;

            // Player two chooses blue or red
        } else if (playerTwo.choice === 'u' || playerTwo.choice === 'r') {
            playerOne.wins++;

            usersRef.child('playerOne/wins').set(playerOne.wins);

            res = `White beats ${playerTwo.choice === 'u' ? 'blue' : 'red'}, ${
                playerOne.name
            } wins!`;

            // Player two chooses black or green
        } else {
            playerTwo.wins++;

            usersRef.child('playerTwo/wins').set(playerTwo.wins);

            res = `${playerTwo.choice === 'b' ? 'black' : 'green'} beats white, ${
                playerTwo.name
            } wins!`;
        }

        /* Player one chooses blue */
    } else if (playerOne.choice === 'u') {
        // Player two chooses blue
        if (playerTwo.choice === 'u') {
            ties++;

            tiesRef.set(ties);

            res = `Both players picked blue, it's a tie!`;

            // Player two chooses black or green
        } else if (playerTwo.choice === 'b' || playerTwo.choice === 'g') {
            playerOne.wins++;

            usersRef.child('playerOne/wins').set(playerOne.wins);

            res = `Blue beats ${playerTwo.choice === 'b' ? 'black' : 'green'}, ${
                playerOne.name
            } wins!`;

            // Player two chooses white or red
        } else {
            playerTwo.wins++;

            usersRef.child('playerTwo/wins').set(playerTwo.wins);

            res = `${playerTwo.choice === 'w' ? 'white' : 'red'} beats blue, ${
                playerTwo.name
            } wins!`;
        }

        /* Player one chooses black */
    } else if (playerOne.choice === 'b') {
        // Player two chooses black
        if (playerTwo.choice === 'b') {
            ties++;

            tiesRef.set(ties);

            res = `Both players picked black, it's a tie!`;

            // Player two chooses white or red
        } else if (playerTwo.choice === 'w' || playerTwo.choice === 'r') {
            playerOne.wins++;

            usersRef.child('playerOne/wins').set(playerOne.wins);

            res = `Black beats ${playerTwo.choice === 'w' ? 'white' : 'red'}, ${
                playerOne.name
            } wins!`;

            // Player two chooses blue or green
        } else {
            playerTwo.wins++;

            usersRef.child('playerTwo/wins').set(playerTwo.wins);

            res = `${playerTwo.choice === 'u' ? 'blue' : 'green'} beats black, ${
                playerTwo.name
            } wins!`;
        }

        /* Player one chooses red */
    } else if (playerOne.choice === 'r') {
        // Player two chooses red
        if (playerTwo.choice === 'r') {
            ties++;

            tiesRef.set(ties);

            res = `Both players picked red, it's a tie!`;

            // Player two chooses blue or green
        } else if (playerTwo.choice === 'u' || playerTwo.choice === 'g') {
            playerOne.wins++;

            usersRef.child('playerOne/wins').set(playerOne.wins);

            res = `Red beats ${playerTwo.choice === 'u' ? 'blue' : 'green'}, ${
                playerOne.name
            } wins!`;

            // Player two chooses white or black
        } else {
            playerTwo.wins++;

            usersRef.child('playerTwo/wins').set(playerTwo.wins);

            res = `${playerTwo.choice === 'w' ? 'white' : 'black'} beats red, ${
                playerTwo.name
            } wins!`;
        }

        /* Player one chooses green */
    } else if (playerOne.choice === 'g') {
        // Player two chooses green
        if (playerTwo.choice === 'g') {
            ties++;

            tiesRef.set(ties);

            res = `Both players picked green, it's a tie!`;

            // Player two chooses white or black
        } else if (playerTwo.choice === 'w' || playerTwo.choice === 'b') {
            playerOne.wins++;

            usersRef.child('playerOne/wins').set(playerOne.wins);

            res = `Green beats ${playerTwo.choice === 'w' ? 'white' : 'black'}, ${
                playerOne.name
            } wins!`;

            // Player two chooses blue or red
        } else {
            playerTwo.wins++;

            usersRef.child('playerTwo/wins').set(playerTwo.wins);

            res = `${playerTwo.choice === 'u' ? 'blue' : 'red'} beats green, ${
                playerTwo.name
            } wins!`;
        }
    }

    // Update the result with produced string
    resRef.set(res);
    setBoard();

    currentPhase = 1;
    phaseRef.set(currentPhase);
}

/* Supporting Functions */

function newUser(name) {
    // Return an object to be stored in firebase
    return {
        name: name,
        wins: 0,
        choice: '',
    };
}

function setBoard() {
    document.querySelector('#wins--p1').textContent = '';
    document.querySelector('#wins--p2').textContent = '';
    document.querySelector('#losses--p1').textContent = '';
    document.querySelector('#losses--p2').textContent = '';
    document.querySelector('#ties').textContent = '';

    document.querySelector('#wins--p1').textContent = playerOne.wins;
    document.querySelector('#wins--p2').textContent = playerTwo.wins;

    document.querySelector('#losses--p1').textContent = playerTwo.wins;
    document.querySelector('#losses--p2').textContent = playerOne.wins;

    document.querySelector('#ties').textContent = ties;

    document.querySelector('#results').textContent = res;
}

// /* On Click Functions */

const nameBtn = document.querySelector('#name__btn');
const nameField = document.querySelector('#name__field');
nameBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (nameField.value.trim() !== '' && !(playerOne && playerTwo)) {
        if (playerOne === null) {
            localPlayerName = nameField.value.trim();

            playerOne = newUser(localPlayerName);

            phaseRef.set(0);

            usersRef.child('playerOne').set(playerOne);

            db.ref('game/users/playerOne')
                .onDisconnect()
                .remove();
        } else if (playerOne !== null && playerTwo === null) {
            localPlayerName = nameField.value.trim();

            playerTwo = newUser(localPlayerName);

            usersRef.child('playerTwo').set(playerTwo);

            phaseRef.set(1);
            tiesRef.set(0);

            db.ref('game/users/playerTwo')
                .onDisconnect()
                .remove();
        }
    }

    nameField.value = '';
    document.querySelector('#name__form').style.display = 'none';
});

function chooseColor(mana) {
    // If both players are connected, you are player one, and it's your turn
    if (playerOne && playerTwo && localPlayerName === playerOneName && currentPhase === 1) {
        playerOneChoice = mana;

        usersRef.child('playerOne/choice').set(playerOneChoice);

        currentPhase = 2;
        phaseRef.set(currentPhase);
    }

    // If both players are connected, you are player two, and it's your turn
    if (playerOne && playerTwo && localPlayerName === playerTwoName && currentPhase === 2) {
        playerTwoChoice = mana;

        usersRef.child('playerTwo/choice').set(playerTwoChoice);

        processGame();
    }
}

/* Non Game Functions */

function setHovers(id) {
    // Find a color in the wheel by provided id
    const color = colorWheel[id];

    // Select the button with the matching id
    const colorBtn = document.querySelector(`#${id}`);

    // On hover...
    colorBtn.addEventListener('mouseover', () => {
        // Highlight enemy colors
        color.enemies.forEach((clr) => {
            const enemyBtn = document.querySelector(`#${clr}`);

            enemyBtn.classList.add('enemy');
        });

        // Dim ally colors
        color.allies.forEach((clr) => {
            const allyBtn = document.querySelector(`#${clr}`);

            allyBtn.classList.add('ally');
        });
    });

    // After hovering...
    colorBtn.addEventListener('mouseout', () => {
        // Remove highlighting from enemies
        color.enemies.forEach((clr) => {
            const enemyBtn = document.querySelector(`#${clr}`);

            enemyBtn.classList.remove('enemy');
        });

        // Remove dimming from allies
        color.allies.forEach((clr) => {
            const allyBtn = document.querySelector(`#${clr}`);

            allyBtn.classList.remove('ally');
        });
    });
}

function showRules() {
    // Reveals rules card
    document.querySelector('#rules__card').classList.remove('hidden');

    // Removes slower transition speed after entry
    setTimeout(() => {
        document.querySelector('#rules__card').classList.remove('slow');
    }, 1000);

    // Toggles button to hide rules
    document.querySelector('#rules__btn').addEventListener('click', () => {
        hideRules();
    });
}

function hideRules() {
    // Adds slow transition speed
    document.querySelector('#rules__card').classList.add('slow');

    // Hides card
    document.querySelector('#rules__card').classList.add('hidden');

    // Toggles button to show rules
    document.querySelector('#rules__btn').addEventListener('click', () => {
        showRules();
    });
}

function showRulesBtn() {
    // Reveals rules button
    document.querySelector('#rules__btn').classList.remove('hidden');

    // Removes slower transition speed after entry
    setTimeout(() => {
        document.querySelector('#rules__btn').classList.remove('slow');
    }, 700);

    // Toggles button to show rules
    document.querySelector('#rules__btn').addEventListener('click', () => {
        showRules();
    });
}

function randomAccentColor() {
    // Select the root element
    const root = document.documentElement;

    // Generate a random number between 1 and 5, then select a random color based on that number
    const r = Math.floor(Math.random() * 5);
    const colors = 'wubrg';
    const color = colors[r];

    // Select colors from root variables
    const accent = getComputedStyle(root).getPropertyValue(`--clr-${color}`);
    const accent2 = getComputedStyle(root).getPropertyValue(`--clr-${color}-bg`);

    // Change accent colors to match the selected color
    root.style.setProperty('--clr-accent', accent);
    root.style.setProperty('--clr-accent-2', accent2);
}

/* Call Functions */

// Called before document loaded intentionally
randomAccentColor();

document.addEventListener('DOMContentLoaded', () => {
    showRulesBtn();
    resRef.set(res);

    // Set Hovers
    for (const color in colorWheel) {
        setHovers(color);
    }

    const mana = document.querySelector('.mana__field');
    mana.addEventListener('click', (e) => {
        if (!e.target.matches('.mana__btn')) {
            return;
        } else {
            const color = e.target.dataset.mana;

            chooseColor(color);
        }
    });
});
