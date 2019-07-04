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

const db = firebase.database();

// Reset Initial Values
const pOneWins = 0;
const pTwoWins = 0;
const pOneLosses = 0;
const pTwoLosses = 0;
const ties = 0;

const colorWheel = [
    {
        white: {
            allies: ['black', 'green'],
            enemies: ['blue', 'red'],
        },
    },
    {
        blue: {
            allies: ['red', 'white'],
            enemies: ['black', 'green'],
        },
    },
    {
        black: {
            allies: ['green', 'blue'],
            enemies: ['red', 'white'],
        },
    },
    {
        red: {
            allies: ['white', 'black'],
            enemies: ['green', 'blue'],
        },
    },
    {
        green: {
            allies: ['blue', 'red'],
            enemies: ['white', 'black'],
        },
    },
];

db.ref().set({
    playerOneWins: pOneWins,
    playerTwoWins: pTwoWins,
    playerOneLosses: pOneLosses,
    playerTwoLosses: pTwoLosses,
    ties: ties,
    colors: colorWheel,
});

const white = document.querySelector('#white');
const blue = document.querySelector('#blue');
const black = document.querySelector('#black');
const red = document.querySelector('#red');
const green = document.querySelector('#green');

function setHovers(id) {
    // Find a color in the wheel by provided id
    const color = colorWheel.find((color) => color[id]);

    // Select the button with the matching id
    const colorBtn = document.querySelector(`#${id}`);

    // On hover...
    colorBtn.addEventListener('mouseover', () => {
        // Highlight enemy colors
        color[id].enemies.forEach((clr) => {
            const enemyBtn = document.querySelector(`#${clr}`);

            enemyBtn.classList.add('enemy');
        });

        // Dim ally colors
        color[id].allies.forEach((clr) => {
            const allyBtn = document.querySelector(`#${clr}`);

            allyBtn.classList.add('ally');
        });
    });

    // After hovering...
    colorBtn.addEventListener('mouseout', () => {
        // Remove highlighting from enemies
        color[id].enemies.forEach((clr) => {
            const enemyBtn = document.querySelector(`#${clr}`);

            enemyBtn.classList.remove('enemy');
        });

        // Remove dimming from allies
        color[id].allies.forEach((clr) => {
            const allyBtn = document.querySelector(`#${clr}`);

            allyBtn.classList.remove('ally');
        });
    });
}

function randomAccentColor() {
    const r = Math.floor(Math.random() * 5);
    const root = document.documentElement;

    let clr;

    switch (r) {
        case 0:
            clr = 'w';
            break;

        case 1:
            clr = 'u';
            break;

        case 2:
            clr = 'b';
            break;

        case 3:
            clr = 'r';
            break;

        case 4:
            clr = 'g';
            break;
    }

    const accent = getComputedStyle(root).getPropertyValue(`--clr-${clr}`);
    const accent2 = getComputedStyle(root).getPropertyValue(`--clr-${clr}-bg`);

    root.style.setProperty('--clr-accent', accent);
    root.style.setProperty('--clr-accent-2', accent2);
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

// Called before document loaded intentionally
randomAccentColor();

document.addEventListener('DOMContentLoaded', () => {
    // Set Hovers
    colorWheel.forEach((color) => {
        for (const key in color) {
            setHovers(key);
        }
    });

    showRulesBtn();
});
