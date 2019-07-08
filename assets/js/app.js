/* Local Variables */
let localUserName = '';
let localUserId = '';
let LocalPlayerOneId = '';
let LocalPlayerTwoId = '';
let localPlayerOne = {};
let localPlayerTwo = {};

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

/* Connections */

// References to database locations
const usersRef = db.ref('game/users');
const connectedRef = db.ref('.info/connected');

// When a client connects
connectedRef.on(
    'value',
    (snap) => {
        // Confirm connection
        if (snap.val()) {
            // Add the user to the connections list
            const localUser = newUser();
            const con = usersRef.push(localUser);
            localUserId = con.key;

            usersRef.child(localUserId).set(localUser);

            // Begin animation after values are recieved
            showRulesBtn();

            // Remove them when they disconnect
            con.onDisconnect().remove();
        }
    },
    (err) => console.error(err)
);

/* Functionality */

usersRef.on('value', (snap) => {
    if (snap.numChildren() >= 2) {
        startGame();
    }
});

function startGame() {
    usersRef.once('value').then((snap) => {
        // Assign player roles one and two
        if (Object.keys(snap.val())[0] === localUserId) {
            usersRef.child(localUserId).update({ player: 'one' });
        } else {
            usersRef.child(localUserId).update({ player: 'two' });
        }

        // Assign local copies of player one and player two and their ids
        snap.forEach(function(usersSnap) {
            if (usersSnap.child('player').val() === 'one') {
                localPlayerOne = usersSnap.val();
                localPlayerOneId = usersSnap.key;

                if (localPlayerOne.state === 'connected') localPlayerOne.state = 'active';

                usersRef.child(usersSnap.key).update({ state: localPlayerOne.state });
            } else if (usersSnap.child('player').val() === 'two') {
                localPlayerTwo = usersSnap.val();
                localPlayerTwoId = usersSnap.key;

                if (localPlayerTwo.state === 'connected') localPlayerTwo.state = 'passsive';

                usersRef.child(usersSnap.key).update({ state: localPlayerTwo.state });
            }
        });

        // Update name fields
        document.querySelector(`#player--one`).textContent = localPlayerOne.name;
        document.querySelector(`#player--two`).textContent = localPlayerTwo.name;

        document.querySelector('#instructions').textContent = `${
            localPlayerOne.name
        }, please make your selection.`;
    });
}

function newUser() {
    // Get the user's name
    localUserName = prompt('What is your name?');

    // Return an object to be stored in firebase
    return {
        name: localUserName,
        wins: 0,
        losses: 0,
        choice: '',
        state: 'connected',
        timeJoin: firebase.database.ServerValue.TIMESTAMP,
    };
}

/* Helper Functions */

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

function chooseColor(mana) {
    // Updates the user's choice based on their local id
    usersRef.child(localUserId).update({ choice: mana });

    if (localPlayerOne.state === 'active') {
        localPlayerOne.choice = mana;

        localPlayerOne.state = 'passive';
        usersRef.child(localPlayerOneId).update({ state: localPlayerOne.state });

        localPlayerTwo.state = 'active';
        usersRef.child(localPlayerTwoId).update({ state: localPlayerTwo.state });
    } else {
        localPlayerTwo.choice = mana;

        localPlayerOne.state = 'active';
        usersRef.child(localPlayerOneId).update({ state: localPlayerOne.state });

        localPlayerTwo.state = 'passive';
        usersRef.child(localPlayerTwoId).update({ state: localPlayerTwo.state });
    }
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

/* Call Functions */

// Called before document loaded intentionally
randomAccentColor();

document.addEventListener('DOMContentLoaded', () => {
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

            usersRef.once('value', (snap) => {
                if (
                    snap
                        .child(localUserId)
                        .child('state')
                        .val() === 'active'
                ) {
                    chooseColor(color);
                }
            });
        }
    });
});
