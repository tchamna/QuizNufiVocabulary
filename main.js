
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const totalRounds = 3;
const timePerRound = 60; // Timer duration
let wordDatabase = []; // This will be initialized with data from Firestore
let usedWords = [];
let currentWordPrefix = '';
let validWordSubset = [];
let score = 0;
let round = 1;
let timer;
let timeLeft = timePerRound;
let gameOver = false;
////////////////////////////////////////////////////////////////////////

const backgroundMusic = document.getElementById('backgroundMusic');
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
let feedbackSoundsEnabled = true;

// Play/Stop Background Music
function toggleBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}

// Toggle Feedback Sounds
function toggleFeedbackSounds() {
    feedbackSoundsEnabled = !feedbackSoundsEnabled;
    alert("Feedback sounds are " + (feedbackSoundsEnabled ? "enabled" : "disabled"));
}

// Adjust Background Volume with Slider
function adjustBackgroundVolume(value) {
    backgroundMusic.volume = value;
}


// Decrease or Increase Background Volume
function decreaseBackgroundVolume() {
    if (backgroundMusic.volume > 0.1) {
        backgroundMusic.volume -= 0.1;
    } else if (backgroundMusic.volume === 0) {
        backgroundMusic.volume += 0.1; // Start increasing the volume if it hits zero
    }
}

// Increase Background Volume
function increaseBackgroundVolume() {
    backgroundMusic.volume += 0.1;

   
}

// Play feedback sound based on answer correctness
function playFeedbackSound(isCorrect) {
    if (feedbackSoundsEnabled) {
        if (isCorrect) {
            correctSound.play();
        } else {
            incorrectSound.play();
        }
    }
}

// Input mapping dictionary
const Clafrica = {
    "*n": "ɲ",
    "..a": "ä",
    "..af": "ɑ̈",
    "..ai": "ɛ̈",
    "..b": "b̈",
    "..c": "c̈",
    "..d": "d̈",
    "..e": "ë",
    "..eu": "ə̈",
    "..f": "f̈",
    "..g": "g̈",
    "..h": "ḧ",
    "..i": "ï",
    "..j": "j̈",
    "..k": "k̈",
    "..l": "l̈",
    "..m": "m̈",
    "..n": "n̈",
    "..o": "ö",
    "..o*": "ɔ̈",
    "..p": "p̈",
    "..q": "q̈",
    "..r": "r̈",
    "..s": "s̈",
    "..t": "ẗ",
    "..u": "ü",
    "..uu": "ʉ̈",
    "..v": "v̈",
    "..w": "ẅ",
    "..x": "ẍ",
    "..y": "ÿ",
    "..z": "z̈",
    ".?": "ʔ",
    ".a": "ȧ",
    ".af": "ɑ̇",
    ".ai": "ε̇",
    ".b": "ḃ",
    ".c": "ċ",
    ".d": "ḋ",
    ".e": "ė",
    ".eu": "ə̇",
    ".f": "ḟ",
    ".g": "ġ",
    ".h": "ḣ",
    ".i": "i̇",
    ".j": "j̇",
    ".k": "k̇",
    ".l": "l̇",
    ".m": "ṁ",
    ".n": "ṅ",
    ".o": "ȯ",
    ".o*": "ɔ̇",
    ".p": "ṗ",
    ".q": "q̇",
    ".r": "ṙ",
    ".s": "ṡ",
    ".t": "ṫ",
    ".u": "u̇",
    ".uu": "ʉ̇",
    ".v": "v̇",
    ".w": "ẇ",
    ".x": "ẋ",
    ".y": "ẏ",
    ".z": "ż",
    "12c": "č",
    "12s": "š",
    "1a_": "à̠",
    "1af_": "ɑ̠̀",
    "1ai_": "ὲ̠",
    "1c": "c̀",
    "1e_": "è̠",
    "1eu_": "ə̠̀",
    "1h": "h̀",
    "1i_": "ì̠",
    "1o*_": "ɔ̠̀",
    "1o_": "ò̠",
    "1s": "s̀",
    "1u_": "ù̠",
    "1uu_": "ʉ̠̀",
    "21c": "ĉ",
    "21s": "ŝ",
    "2a_": "á̠",
    "2af_": "ɑ̠́",
    "2ai_": "έ̠",
    "a1": "à",
    "a13": "a᷅",
    "a2": "á",
    "a23": "a᷇",
    "a3": "ā",
    "a32": "a᷄",
    "a5": "â",
    "a7": "ǎ",
    "ae+": "æ",
    "af ": "ɑ",
    "af1": "ɑ̀",
    
    "af13": "ɑ᷅",
    "af2": "ɑ́",
    "af23": "ɑ᷇",
    "af3": "ɑ̄",
    "af32": "ɑ᷄",
    "af5": "ɑ̂",
    "af7": "ɑ̌",
    "af~": "ɑ̃",
    "ai  ": "ε",
    "ai1": "ɛ̀",
    "ai13": "ɛ᷅",
    "ai2": "έ",
    "ai23": "ɛ᷇",
    "ai3": "ɛ̄",
    "ai32": "ɛ᷄",
    "ai5": "ɛ̂",
    "ai7": "ɛ̌",
    "ai~": "ɛ̃",
    "a~": "ã",
    "b*": "ɓ",
    "c_": "ç",
    "d*": "ɗ",
    "e1": "è",
    "e13": "e᷅",
    "e2": "é",
    "e23": "e᷇",
    "e3": "ē",
    "e32": "e᷄",
    "e3_": "ē̠",
    "e5": "ê",
    "e7": "ě",
    "e_": "e̠",
    "eq.": "=",
    "eu ": "ə",
    "eu1": "ə̀",
    "eu13": "ə᷅",
    "eu2": "ə́",
    "eu23": "ə᷇",
    "eu3": "ə̄",
    "eu32": "ə᷄",
    "eu5": "ə̂",
    "eu7": "ə̌",
    "e~": "ẽ",
    "g+": "ɣ",
    "i-": "ɨ",
    "i-1": "ɨ̀",
    "i-2": "ɨ́",
    "i-3": "ɨ̄",
    "i-5": "ɨ̂",
    "i-7": "ɨ̌",
    "i1": "ì",
    "i13": "i᷅",
    "i2": "í",
    "i23": "i᷇",
    "i3": "ī",
    "i32": "i᷄",
    "i5": "î",
    "i7": "ǐ",
    "ia1": "ìà",
    "iaf": "iɑ",
    "i~": "ĩ",
    "m1": "m̀",
    "m2": "ḿ",
    "m3": "m̄",
    "m5": "m̂",
    "m7": "m̌",
    "n*": "ŋ",
    "n*1": "ŋ̀",
    "n*2": "ŋ́",
    "n*3": "ŋ̄",
    "n*5": "ŋ̂",
    "n*7": "ŋ̌",
    "n1": "ǹ",
    "n2": "ń",
    "n3": "n̄",
    "n5": "n̂",
    "n7": "ň",
    "o* ": "ɔ",
    "o*1": "ɔ̀",
    "o*12": "ɔ̌",
    "o*13": "ɔ᷅",
    "o*2": "ɔ́",
    "o*23": "ɔ᷇",
    "o*3": "ɔ̄",
    "o*32": "ɔ᷄",
    "o*5": "ɔ̂",
    "o*7": "ɔ̌",
    "o*~": "ɔ̃",
    "o/": "ø",
    "o1": "ò",
    "o13": "o᷅",
    "o2": "ó",
    "o23": "o᷇",
    "o3": "ō",
    "o32": "o᷄",
    "o5": "ô",
    "o7": "ǒ",
    "oe+": "œ",
    "o~": "õ",
    "pluss": "+",
    "sh+": "ʃ",
    "uu ": "ʉ",
    "u- ": "ʉ",
    "uu1": "ʉ̀",
    "uu2": "ʉ́",
    "uu3": "ʉ̄",
    "uu5": "ʉ̂",
    "uu7": "ʉ̌",
    "u-1": "ʉ̀",
    "u-2": "ʉ́",
    "u-3": "ʉ̄",
    "u-5": "ʉ̂",
    "u-7": "ʉ̌",
    "u1": "ù",
    "u13": "u᷅",
    "u2": "ú",
    "u23": "u᷇",
    "u3": "ū",
    "u32": "u᷄",
    "u5": "û",
    "u7": "ǔ",
    "ua1": "ùà",
    "uu13": "ʉ᷅",
    "uu23": "ʉ᷇",
    "uu32": "ʉ᷄",
    "u~": "ũ",
    "oe+1": "œ̀",
    "oe+2": "œ́",
    "oe+3": "œ̄",
    "oe+5": "œ̂",
    "oe+7": "œ̌",
    // Double
        "a11": "àà",
        "a22": "áá",
        "a33": "āā",
        "a55": "ââ",
        "a77": "ǎǎ",
      
        "aff  ": "ɑɑ",
        "aff1": "ɑ̀ɑ̀",
        "aff2": "ɑ́ɑ́",
        "aff3": "ɑ̄ɑ̄",
        "aff5": "ɑ̂ɑ̂",
        "aff7": "ɑ̌ɑ̌",
      
        "ai11": "ɛ̀ɛ̀",
        "ai22": "έέ",
        "ai33": "ɛ̄ɛ̄",
        "ai55": "ɛ̂ɛ̂",
        "ai77": "ɛ̌ɛ̌",
      
        "e11": "èè",
        "e22": "éé",
        "e33": "ēē",
        "e55": "êê",
        "e77": "ěě",
      
        "eu11": "ə̀ə̀",
        "eu22": "ə́ə́",
        "eu33": "ə̄ə̄",
        "eu55": "ə̂ə̂",
        "eu77": "ə̌ə̌",
      
        "i11": "ìì",
        "i22": "íí",
        "i33": "īī",
        "i55": "îî",
        "i77": "ǐǐ",
      
        "ia1": "ìà",
        "ia2": "íá",
        "ia3": "īā",
        "ia5": "îâ",
        "ia7": "ǐǎ",
      
        "iaf1": "ìɑ̀",
        "iaf2": "íɑ́",
        "iaf3": "īɑ̄",
        "iaf5": "îɑ̂",
        "iaf7": "ǐɑ̌",
      
        "ie1": "ìè",
        "ie2": "íé",
        "ie3": "īē",
        "ie5": "îê",
        "ie7": "ǐě",
      
        "o*11": "ɔ̀ɔ̀",
        "o*22": "ɔ́ɔ́",
        "o*33": "ɔ̄ɔ̄",
        "o*55": "ɔ̂ɔ̂",
        "o*77": "ɔ̌ɔ̌",
      
        "oo1": "òò",
        "oo2": "óó",
        "oo3": "ōō",
        "o55": "ôô",
        "o77": "ǒǒ",

        "o11": "òò",
        "o22": "óó",
        "o33": "ōō",
        "o55": "ôô",
        "o77": "ǒǒ",
      
        "u-11": "ʉ̀ʉ̀",
        "u-22": "ʉ́ʉ́",
        "u-33": "ʉ̄ʉ̄",
        "u-55": "ʉ̂ʉ̂",
        "u-77": "ʉ̌ʉ̌",
      
        "u11": "ùù",
        "u22": "úú",
        "u33": "ūū",
        "u55": "ûû",
        "u77": "ǔǔ",
      
        "ua1": "ùà",
        "ua2": "úá",
        "ua3": "ūā",
        "ua5": "ûâ",
        "ua7": "ǔǎ",
      
        "uaf1": "ùɑ̀",
        "uaf2": "úɑ́",
        "uaf3": "ūɑ̄",
        "uaf5": "ûɑ̂",
        "uaf7": "ǔɑ̌",
      
        "uuaf ": "ʉɑ",
        "uuaf1": "ʉ̀ɑ̀",
        "uuaf2": "ʉ́ɑ́",
        "uuaf3": "ʉ̄ɑ̄",
        "uuaf5": "ʉ̂ɑ̂",
        "uuaf7": "ʉ̌ɑ̌"
      
   
};


function mapInput(input) {
    const mapping = Clafrica;
    const keys = Object.keys(mapping);

    // Sort keys by length descending
    keys.sort((a, b) => b.length - a.length);

    let result = '';
    let i = 0;
    while (i < input.length) {
        let matched = false;
        // At each position, try to match the longest key
        for (let key of keys) {
            if (input.startsWith(key, i)) {
                result += mapping[key];
                i += key.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            result += input[i];
            i++;
        }
    }
    return result;
}

// Update the input event listener
const userInputElement = document.getElementById('userInput');

userInputElement.addEventListener('input', function () {
    const cursorPosition = userInputElement.selectionStart;
    const originalValue = userInputElement.value;
    const newValue = mapInput(originalValue);

    if (originalValue !== newValue) {
        userInputElement.value = newValue;
        userInputElement.setSelectionRange(cursorPosition, cursorPosition);
    }
});

// Event listener for submitting word via 'Enter' key
userInputElement.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        submitWord();
    }
});

// Add a start button event listener to start the game
document.getElementById('startButton').addEventListener('click', function () {
    startRound(); // Start the first round
});

// Function to generate a random prefix from the provided set
function generateRandomPrefix() {
    const knownPrefixes = ["cw", "cà", "cá", "cò", "có", "cô", "cā", "cō", "cǎ", "cɑ", "cə", "dh", "dì", "dī", "fh", "fà", "fá", "fì", "fí", "fā", "fī", "fɑ", "fə", "fʉ", "gh", "hw", "hè", "hā", "hī", "hǔ", "hɑ", "kh", "kw", "kà", "ká", "kè", "kò", "kó", "kù", "kā", "kō", "kū", "kǎ", "kǒ", "kɑ", "kə", "kʉ", "là", "lì", "lí", "lò", "ló", "lā", "lē", "lě", "lō", "lǎ", "lǒ", "lɑ", "lə", "lʉ", "mb", "mf", "mm", "mv", "mà", "mê", "mò", "mó", "mē", "mī", "mō", "mɑ", "mʉ", "nc", "nd", "ng", "nh", "nj", "nk", "nn", "ns", "nt", "nz", "nà", "ná", "nì", "nù", "nā", "nē", "nī", "nŋ", "nǔ", "nɑ", "nə", "pà", "pè", "pì", "pí", "pò", "pó", "pú", "pā", "pē", "pě", "pī", "pō", "pū", "pǎ", "pɑ", "pə", "pʉ", "sh", "sà", "sá", "sì", "sò", "sā", "sē", "sī", "sō", "sǎ", "sɑ", "sə", "sʉ", "th", "tà", "tá", "tè", "té", "tì", "tò", "tó", "tú", "tā", "tē", "tě", "tī", "tō", "tū", "tɑ", "tə", "tʉ", "vh", "và", "vā", "vɑ", "və", "vʉ", "wè", "wú", "wā", "wū", "wɑ", "yw", "yà", "yá", "yò", "yā", "yū", "yǒ", "yɑ", "yə", "zh", "zà", "zú", "zā", "zǎ", "zɑ", "zə", "zʉ", "ŋw", "ŋà", "ŋɑ"]

    return knownPrefixes[Math.floor(Math.random() * knownPrefixes.length)];
}

// Function to start a round
function startRound() {
    if (round > totalRounds) {
        endGame();
        return;
    }

    // Hide the start button when the game starts
    document.getElementById("startButton").style.display = 'none';

    document.getElementById("userInput").value = ''; // Clear input


    document.getElementById("definition").innerText = ''; // Clear definition
    document.getElementById("userInput").disabled = true; // Disable input until data is fetched

    const prefix = generateRandomPrefix();
    console.log("Generated Prefix for this round:", prefix);

    // Fetch words starting with the generated prefix
    db.collection("words")
      .where("Word", ">=", prefix)
      .where("Word", "<", prefix + "\uf8ff")
      .get()
      .then((querySnapshot) => {
        wordDatabase = []; // Reset word database for this round

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.Word && data.Definition) {
            wordDatabase.push({
              word: data.Word.toLowerCase().trim(),
              definition: data.Definition,
            });
          }
        });

        console.log("Filtered Words loaded for prefix", prefix, ":", wordDatabase);

        if (wordDatabase.length === 0) {
            alert("No words found for prefix " + prefix + ". Starting new round...");
            startRound(); // Retry with a new round if no words found
            return;
        }

        // Set up game for the current round
        currentWordPrefix = prefix;
        validWordSubset = wordDatabase;
        document.getElementById("userInput").disabled = false;
        document.getElementById("startString").innerText = currentWordPrefix.toUpperCase();
        document.getElementById("feedback").innerText = '';
        document.getElementById("rounds").innerText = "🔄 Kàm (Round): " + round + " / " + totalRounds;
        
        usedWords = []; // Reset used words for this round
        resetTimer();
      })
      .catch((error) => {
        console.error("Error fetching words from Firestore:", error);
        alert("Failed to load word data for this round.");
      });
}

// Function to submit a word

function submitWord() {
    if (gameOver) return;

    let userWord = document.getElementById("userInput").value.toLowerCase().trim();
    userWord = mapInput(userWord);

    if (userWord.length === 0) return;

    if (!userWord.startsWith(currentWordPrefix)) {
        document.getElementById("feedback").innerText = "❌ Ngǎ'! Njâ'wú ghʉ̌ làh ntō' pí '" + currentWordPrefix.toUpperCase() + "'.";
        playFeedbackSound(false);
        document.getElementById("definition").innerHTML = '';
    } else if (usedWords.includes(userWord)) {
        document.getElementById("feedback").innerText = "⚠️ Ǒ yá' hɑ̄ béé njâ'wū lě!";
        playFeedbackSound(false);
        document.getElementById("definition").innerHTML = '';
    } else {
        const foundEntry = validWordSubset.find(entry => entry.word === userWord);
        if (foundEntry) {
            score += userWord.length;
            usedWords.push(userWord);
            document.getElementById("score").innerText = score;
            document.getElementById("feedback").innerText = "✅ Fà'á bɑ́ sēn à! Mvǎk pìì " + userWord.length + " points.";
            document.getElementById("definition").innerHTML = "📖 Pàhsì: <br>" + foundEntry.definition;
            playFeedbackSound(true);
        } else {
            document.getElementById("feedback").innerText = "❌ Béé njâ'wū lè sī ntám ŋwɑ̀'nǐpàhsì bɑ̄!";
            playFeedbackSound(false);
            document.getElementById("definition").innerHTML = '';
        }
    }

    document.getElementById("userInput").value = '';
}


// Function to reset the timer
function resetTimer() {
    clearInterval(timer);
    timeLeft = timePerRound;
    document.getElementById("timeRemaining").innerText = timeLeft;

    timer = setInterval(function() {
        timeLeft--;
        document.getElementById("timeRemaining").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("feedback").innerText = "⏰ Ndɑ̌h mìè! Mǒ' kǎm nzhì nsɑ́'...";
            document.getElementById("definition").innerText = '';
            nextRound();
        }
    }, 1000);
}

// Function to move to the next round
function nextRound() {
    round++;

    // Identify remaining words not found by the user
    const missedWords = validWordSubset.filter(entry => !usedWords.includes(entry.word));
    
    if (missedWords.length > 0) {
        let missedWordsList = "<strong>Mó' njá'zū yì ǒ nsɑ̄h lɑ́ béè:</strong><br>";
        missedWords.forEach(entry => {
            missedWordsList += `${entry.word}<br>`;
        });

        // Display missed words and set a 15-second timeout
        document.getElementById("definition").innerHTML = missedWordsList;
        document.getElementById("feedback").innerText = "⏳ Mó' mvǎk njá'zū yì ǒ nsə̄ə̄ lɑ́ béè. \nMǒ' kǎm ìntō' nɑ́ nǔ nshì' 15.";

        setTimeout(() => {
            if (round <= totalRounds) {
                startRound();
            } else {
                endGame();
            }
        }, 15000); // 15000ms = 15 seconds

    } else {
        // No missed words, move directly to the next round
        if (round <= totalRounds) {
            startRound();
        } else {
            endGame();
        }
    }
}

// Function to end the game
function endGame() {
    gameOver = true;
    document.getElementById("feedback").innerText = "🎉 Sʉ̀ɑ́ mìè! Yò mvǎkpìì béè: " + score;
    document.getElementById("definition").innerText = '';
    document.getElementById("userInput").disabled = true;
    document.getElementById("startString").innerText = '';
    document.getElementById("rounds").innerText = '';
    document.getElementById("timeRemaining").innerText = '0';
    clearInterval(timer);
    document.getElementById("playAgainContainer").style.display = 'block';
}

// Function to restart the game
function playAgain() {
    score = 0;
    round = 1;
    gameOver = false;
    document.getElementById("score").innerText = score;
    document.getElementById("feedback").innerText = '';
    document.getElementById("definition").innerText = '';
    document.getElementById("playAgainContainer").style.display = 'none';

    // Show the start button again on game restart
    document.getElementById("startButton").style.display = 'block';

    startRound();
}
