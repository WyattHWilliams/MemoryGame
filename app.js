
const rootContainer = document.querySelector('#totalContainer');
const scoreLabel = document.querySelector('#scoreLabel');
var usedColors = [];
var count = 0;
var firstCard = undefined;
var secondCard = undefined;
var lock = false;
var previousScore = 0;
var score = 0;
var numPairs = 0;

function addCircle(color) {
    let cardContainer = document.createElement('div');
    let cardMain = document.createElement('div');
    let cardFront = document.createElement('div');
    let cardBack = document.createElement('div');

    cardContainer.classList.add('cardContainer');
    cardMain.classList.add('cardMain');
    cardFront.classList.add('cardFront');
    cardBack.classList.add('cardBack');

    cardBack.style.background = color;

    cardContainer.appendChild(cardMain);
    cardMain.appendChild(cardFront);
    cardMain.appendChild(cardBack);

    return cardContainer;
}

function randomRGB() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`
}

function makePair() {
    let color = randomRGB();

    let same = true;
    while(same === true) {
        same = false;
        for(let i = 0; i< usedColors.length; i++) {
            if(color == usedColors[i]) {
                color = randomRGB();
                same = true;
                break;
            }
        }
    }
    usedColors.push(color);

    let circle1 = addCircle(color);
    let circle2 = addCircle(color);

    rootContainer.appendChild(circle1);
    rootContainer.appendChild(circle2);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function shuffleCards() {
    var cards = document.querySelectorAll('div[class="cardBack"]');
    var containers = document.querySelectorAll('div[class="cardMain"]');
    var unshuffledDeck = [...cards];

    for(let i = 0; i < cards.length; i++) {
        cards[i].parentElement.removeChild(cards[i]);
    }

    let shuffledDeck = shuffleArray(unshuffledDeck);
    console.log(cards);
    console.log(shuffledDeck);


    for(let i = 0; i < shuffledDeck.length; i++) {
        containers[i].appendChild(shuffledDeck[i]);
    }
}

function dealCards(n) {
    for(let i = 1; i <= n; i++) {
        makePair();
    }

    numPairs += n;
    shuffleCards();
}

function updateScore(s) {
    let newScore = s + previousScore;
    var scoreText = `score: ${newScore}`;
    scoreLabel.innerText = scoreText;
}

function checkScore() {
    if(score + previousScore === numPairs + previousScore) {
        window.setTimeout(function() {
            newGame(numPairs + 2); 
        }, 500)
    }
}

function newGame(num) {
    var totalCards = document.querySelectorAll('div[class="cardContainer"]');
    for (let i = 0; i < totalCards.length; i++) {
        totalCards[i].remove();
    }
    window.setTimeout(function() {
        previousScore = score + previousScore;
        score = 0;
        updateScore(score);
        dealCards(num);
        numPairs = num;
    }, 500)
}

newGame(2);

rootContainer.addEventListener('click', function (e) {
    if(lock === false && e.target.parentElement.dataset.status != 'locked') {
        //console.log(e.target.className);
        if (e.target.className === 'cardFront') {
            e.target.parentElement.classList.toggle("cardMainRotate");
            count += 1;

            if(firstCard == undefined) {
                firstCard = e.target.parentElement;
            } else if(secondCard == undefined) {
            secondCard = e.target.parentElement;
            }

            if(count === 2) {
                lock = true;
                if(firstCard.lastElementChild.style.background === secondCard.lastElementChild.style.background) {
                    score += 1;
                    updateScore(score);
                    firstCard.dataset.status = 'locked';
                    secondCard.dataset.status = 'locked';

                    firstCard = undefined;
                    secondCard = undefined;
                    count = 0;
                    lock = false;
                    checkScore();
                } else {
                    window.setTimeout(function() {
                        firstCard.classList.toggle("cardMainRotate");
                        secondCard.classList.toggle("cardMainRotate");

                        firstCard = undefined;
                        secondCard = undefined;
                        count = 0;
                        lock = false;
                    }, 1000);
                }
            }
        }
    }
})