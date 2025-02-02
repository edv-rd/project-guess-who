// All the DOM selectors stored as short variables
const board = document.getElementById("board");
const questions = document.getElementById("questions");
const restartButton = document.getElementById("restart");
const playAgainButton = document.getElementById("playAgain");
const filterButton = document.getElementById("filter");
const winOrLose = document.getElementById("winOrLose");
const winOrLoseText = document.getElementById("winOrLoseText");
const log = document.getElementById("gameLog");
const logWrapper = document.querySelector(".log-wrapper");
const guessCounter = document.getElementById("guesses");
const questionSection = document.querySelector(".question-section");

// save the entire list of guesses to another array
// because when you remove guesses later on,
// you want to use this to reset the list of guesses
// when starting a new game!
let oldQuestions = questions.innerHTML;

// Array with all the characters, as objects
const CHARACTERS = [
  {
    name: "Jabala",
    img: "images/jabala.svg",
    hair: "covered",
    eyes: "covered",
    accessories: ["glasses", "hat"],
    other: [],
  },
  {
    name: "Jack",
    img: "images/jack.svg",
    hair: "covered",
    eyes: "blue",
    accessories: ["hat"],
    other: [],
  },
  {
    name: "Jacques",
    img: "images/jacques.svg",
    hair: "grey",
    eyes: "blue",
    accessories: ["hat"],
    other: ["smoker"],
  },
  {
    name: "Jai",
    img: "images/jai.svg",
    hair: "black",
    eyes: "brown",
    accessories: [],
    other: [],
  },
  {
    name: "Jake",
    img: "images/jake.svg",
    hair: "yellow",
    eyes: "green",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "James",
    img: "images/james.svg",
    hair: "brown",
    eyes: "green",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jana",
    img: "images/jana.svg",
    hair: "black",
    eyes: "covered",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jane",
    img: "images/jane.svg",
    hair: "yellow",
    eyes: "covered",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jaqueline",
    img: "images/jaqueline.svg",
    hair: "orange",
    eyes: "green",
    accessories: ["glasses"],
    other: [],
  },

  {
    name: "Jazebelle",
    img: "images/jazebelle.svg",
    hair: "purple",
    eyes: "covered",
    accessories: ["glasses"],
    other: ["smoker"],
  },
  {
    name: "Jean",
    img: "images/jean.svg",
    hair: "brown",
    eyes: "blue",
    accessories: ["glasses", "hat"],
    other: ["smoker"],
  },
  {
    name: "Jeane",
    img: "images/jeane.svg",
    hair: "brown",
    eyes: "green",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jed",
    img: "images/jed.svg",
    hair: "orange",
    eyes: "green",
    accessories: ["glasses", "hat"],
    other: ["smoker"],
  },
  {
    name: "Jenni",
    img: "images/jenni.svg",
    hair: "white",
    eyes: "covered",
    accessories: ["hat"],
    other: [],
  },
  {
    name: "Jeri",
    img: "images/jeri.svg",
    hair: "orange",
    eyes: "green",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jerry",
    img: "images/jerry.svg",
    hair: "covered",
    eyes: "blue",
    accessories: ["hat"],
    other: [],
  },
  {
    name: "Jess",
    img: "images/jess.svg",
    hair: "black",
    eyes: "blue",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jocelyn",
    img: "images/jocelyn.svg",
    hair: "black",
    eyes: "brown",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jon",
    img: "images/jon.svg",
    hair: "brown",
    eyes: "green",
    accessories: ["glasses"],
    other: [],
  },
  {
    name: "Jordan",
    img: "images/jordan.svg",
    hair: "yellow",
    eyes: "covered",
    accessories: ["glasses", "hat"],
    other: [],
  },
  {
    name: "Josephine",
    img: "images/josephine.svg",
    hair: "grey",
    eyes: "brown",
    accessories: [],
    other: [],
  },
  {
    name: "Josh",
    img: "images/josh.svg",
    hair: "yellow",
    eyes: "green",
    accessories: [],
    other: [],
  },
  {
    name: "Jude",
    img: "images/jude.svg",
    hair: "black",
    eyes: "green",
    accessories: [],
    other: [],
  },
  {
    name: "Julie",
    img: "images/julie.svg",
    hair: "black",
    eyes: "brown",
    accessories: ["glasses", "hat"],
    other: [],
  },
];

// Global variables
let secret;
let currentQuestion;
let charactersInPlay;
let numberOfGuesses = 0;

// Draw the game board
const generateBoard = () => {
  board.innerHTML = "";
  charactersInPlay.forEach((person) => {
    board.innerHTML += `
      <div class="card">
        <p>${person.name}</p>
        <img src=${person.img} alt=${person.name}>
        <div class="guess">
          <span>Guess on ${person.name}?</span>
          <button class="filled-guess-button small" onclick="guess('${person.name}')">Guess</button>
        </div>
      </div>
    `;
  });
};

/* I thought getting popup alerts with every guess was annoying, 
so I made a container in the HTML for a log, styled it in CSS,
and used this addToLog-function instead of alert() to put the messages there instead */

const addToLog = (message) => {
  log.innerHTML += `<p class="log-entry">${message}</p>`;
  logWrapper.scrollTop = -log.scrollHeight;
  // above function will keep the scrollbar scrolled UP because we want the newest message to be at the top
  // please note the negative sign!
};

const updateGuessCounter = () => {
  guessCounter.innerHTML = `Guesses: ${parseInt(numberOfGuesses)}`; // converting the int numberOfGuesses to a string. not sure this is needed actually?
};

// Randomly select a person from the characters array and set as the value of the variable called secret
const setSecret = () => {
  secret =
    charactersInPlay[Math.floor(Math.random() * charactersInPlay.length)];
  console.log("the person is set to " + secret.name);
};

// This function to start (and restart) the game
const start = () => {
  // Here we're setting charactersInPlay array to be all the characters to start with
  charactersInPlay = CHARACTERS;
  // making the board visible and the winOrLose-part not visible
  board.style.display = "flex";
  winOrLose.style.display = "none";
  // making sure the question section is visible because its hidden when you win or lose
  questionSection.style.display = "flex";

  // resetting the select element to the one we saved before because during the game we have removed elements from it
  questions.innerHTML = oldQuestions;

  // clearing the log
  log.innerHTML = "";

  // reset the number of guesses showing
  numberOfGuesses = 0;
  updateGuessCounter();

  // showing the game board on the screen
  generateBoard();

  // randomizing the person you're looking for
  setSecret();
};

// setting the currentQuestion object when you select something in the dropdown
const selectQuestion = () => {
  const category = questions.options[questions.selectedIndex].parentNode.label;
  const value = questions.options[questions.selectedIndex].value;

  // This variable stores what option group (category) the question belongs to.
  // We also need a variable that stores the actual value of the question we've selected.

  currentQuestion = {
    category: category,
    value: value,
  };
};

// This function should be invoked when you click on 'Find Out' button.
const checkQuestion = () => {
  // if the "make a guess" option (it's the first one so it has index 0) is selected, pressing "find out" should not do anything
  if (questions.options[questions.selectedIndex].index === 0) {
    return;
  }

  const { category, value } = currentQuestion;
  numberOfGuesses++; // update the number of guesses
  updateGuessCounter(); // and make sure to update the guess counter showing on the page also :)

  // Compare the currentQuestion details with the secret person details in a different manner based on category (hair/eyes or accessories/others).
  // See if we should keep or remove people based on that
  // Then invoke filterCharacters
  if (category === "hair") {
    if (value === secret.hair) {
      filterCharacters(true);
    } else {
      filterCharacters(false);
    }
  } else if (category === "eyes") {
    if (value === secret.eyes) {
      filterCharacters(true);
    } else {
      filterCharacters(false);
    }
  } else if (category === "accessories" || category === "other") {
    if (secret.accessories.includes(value) || secret.other.includes(value)) {
      filterCharacters(true);
    } else {
      filterCharacters(false);
    }
  }
};

// It'll filter the characters array and redraw the game board.
const filterCharacters = (keep) => {
  const { category, value } = currentQuestion;
  // Show the correct alert message for different categories
  if (category === "hair") {
    if (keep) {
      addToLog(`The person has ${value} ${category}!`);
      charactersInPlay = charactersInPlay.filter(
        (person) => person[category] === value
      );
    } else {
      addToLog(`The person doesn't have ${value} ${category}!`);
      charactersInPlay = charactersInPlay.filter(
        (person) => person[category] !== value
      );
    }
  } else if (category === "eyes") {
    if (keep) {
      addToLog(`The person has ${value} ${category}!`);
      charactersInPlay = charactersInPlay.filter(
        (person) => person[category] === value
      );
    } else {
      addToLog(`The person doesn't have ${value} ${category}!`);
      charactersInPlay = charactersInPlay.filter(
        (person) => person[category] !== value
      );
    }
  } else if (category === "accessories") {
    if (keep) {
      addToLog(`The person wears ${value == "hat" ? "a" : ""} ${value}!`);
      charactersInPlay = charactersInPlay.filter((person) =>
        person[category].includes(value)
      );
    } else {
      addToLog(`The person does not wear ${value == "hat" && "a"} ${value}!`);
      charactersInPlay = charactersInPlay.filter(
        (person) => !person[category].includes(value)
      );
    }
  } else if (category === "other") {
    if (keep) {
      addToLog(`The person is a ${value}! `);
      charactersInPlay = charactersInPlay.filter((person) =>
        person[category].includes(value)
      );
    } else {
      addToLog(`The person isn't a ${value}! `);
      charactersInPlay = charactersInPlay.filter(
        (person) => !person[category].includes(value)
      );
    }
  }

  // remove the guessed option from the select element, because we don't want the player to be able to guess it again
  // this code is from https://stackoverflow.com/questions/41112624/remove-select-option-with-specific-value
  // and also https://stackoverflow.com/questions/55062159/find-select-index-by-valuetext
  const optionsToRemove = questions.querySelectorAll(
    "option[value=" + value + "]" // using a query selector to get all options with the same value, for example "covered"
  );

  optionsToRemove.forEach((option) => {
    // since both the hair and eyes have the same value in the select element we need to make sure to remove the correct one
    if (questions.options[option.index].parentNode.label === category) {
      option.remove();
    }
  });

  //automatically select the first option in the select element after removing option
  questions.options[0].selected = true;

  // Invoke a function to redraw the board with the remaining people.
  generateBoard();
};

// when clicking guess, the player first have to confirm that they want to make a guess.
const guess = (personToConfirm) => {
  // store the interaction from the player in a variable.
  // remember the confirm() ?
  // If the player wants to guess, invoke the checkMyGuess function.
  if (confirm(`You sure you want to guess ${personToConfirm}?`) == true) {
    checkMyGuess(personToConfirm);
  } else {
    return;
  }
};

// If you confirm, this function is invoked
const checkMyGuess = (personToCheck) => {
  // 1. Check if the personToCheck is the same as the secret person's name
  // 2. Set a Message to show in the win or lose section accordingly
  // 3. Show the win or lose section
  // 4. Hide the game board
  winOrLose.style.display = "flex";
  board.style.display = "none";

  // hiding the entire question section because it was still visible when scrolling down
  // during the winOrLose event
  questionSection.style.display = "none";

  if (personToCheck === secret.name) {
    winOrLoseText.innerHTML = `Congratulations! It was ${personToCheck}!`;
  } else {
    winOrLoseText.innerHTML = `Too bad! The correct answer was ${secret.name}!`;
  }
};

// Invokes the start function when website is loaded
start();

// All the event listeners
restartButton.addEventListener("click", start);
playAgainButton.addEventListener("click", start);
filterButton.addEventListener("click", checkQuestion);
questions.addEventListener("change", selectQuestion);
