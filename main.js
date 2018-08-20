
(function(){

$(document).ready(initializeGame);

//-------------------------------------------------------------------------------------------------------

var gameState = {
    difficulty: "regular",
    cardArray: [],
    imageArray: [],
    soundArray: [],
    cardBackNum: Math.floor(Math.random() * 6) + 1,
    eeveeCardBackNum: Math.floor(Math.random() * 5) + 1,
    mute: true,
    stats: {
        attempts: 0,
        accuracy: 0,
        gamesPlayed: 0,
        matchCounter: 0
    },
    totalPossibleMatches: 12,
    firstCardClicked: null,
    secondCardClicked: null,
    thisCard1: null,
    thisCard2: null,
    winImageNum: Math.floor(Math.random() * 9) + 1,
    eeveeWinImageNum: Math.floor(Math.random() * 6) + 1,
    pikaWinImageNum: Math.floor(Math.random() * 3) + 1,
    winMsg: ["Way to go!", "You did it!", "Hooray!", "You got this!", "Keep it up!", "Awesome job!"],
    mewNum: 1
}

//-------------------------------------------------------------------------------------------------------

var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "sounds/pallettetown.mp3";
backgroundMusic.loop = true;

var missSound = document.createElement("audio");
missSound.src = "sounds/pokeball_tick.mp3";
missSound.volume = 0.5;

var catchSound = document.createElement("audio");
catchSound.src = "sounds/pokeballcatch.mp3";
catchSound.volume = 0.5;

var pokemonCrySound = document.createElement("audio");

var winSound = document.createElement("audio");
winSound.src = "sounds/victory.mp3";
winSound.volume = 0.7;

var pikachuWinSound = document.createElement("audio");
pikachuWinSound.src = "sounds/pikachu_remix.mp3";
// pikachuWinSound.loop = true;

var eeveeSound = document.createElement("audio");
eeveeSound.src = "sounds/eevee.mp3";

//-------------------------------------------------------------------------------------------------------

function initializeGame(){
   $(window).on("resize", resizeTransitionStop);
   renderGameBoard();
   shuffle();
   attachClickHandler();
   mewBlink();
}
function attachClickHandler(){
    $(".card").on("click", cardClicks);
    $(".resetButton").on("click", resetButton);
    $(".winModal").on("click", winModalClose);
    $(".soundToggleButton").on("click", toggleSounds);
    $(".pokedexOpenButton").on("click", pokedexExpand);
    $(".settingsButton").on("click", settingsMenuOpen);
    $(".statsButton").on("click", statsMenuOpen);
    $(".easy").on("click", difficultySwitch_Easy);
    $(".reg").on("click", difficultySwitch_Reg);
    $(".hard").on("click", difficultySwitch_Hard);
    $(".challenge").on("click", difficultySwitch_Challenge);
}
function resizeTransitionStop(){
    $(".pokedex").css("transition-property", "none");
    setTimeout(function(){
        $(".pokedex").css("transition-property", "");
    }, 10);
    $(".gameBoardContainer").css("transition-property", "none");
    setTimeout(function(){
        $(".gameBoardContainer").css("transition-property", "");
    }, 10);
}
//-------------------------------------------------------------------------------------------------------
function pokedexExpand(){
    if ( !$(".pokedex").hasClass("expanded") ){
        $(".pokedex").addClass("expanded");
        $(".gameBoardContainer").addClass("faded");
        $(".pokedexOpenButton > i").addClass("fa-times").removeClass("fa-angle-up");
        $(".pokedexOpenButton").addClass("switched");
    } else if ( $(".pokedex").hasClass("expanded") ){
        $('.pokedex').removeClass('expanded');
        $(".gameBoardContainer").removeClass("faded");
        $(".pokedexOpenButton > i").addClass("fa-angle-up").removeClass("fa-times");
        $(".pokedexOpenButton").removeClass("switched");
    }
}
function settingsMenuOpen(){
    $(".screenMiddle").css("display", "none");
    $(".settingsDisplay").css("display","flex");
    $(".settingsButton").css("display", "none");
    $(".statsButton").css("display", "unset");
}
function statsMenuOpen(){
    $(".screenMiddle").css("display", "flex");
    $(".settingsDisplay").css("display","none");
    $(".settingsButton").css("display", "unset");
    $(".statsButton").css("display", "none");
}
function toggleSounds(){
    if ($(".soundToggleButton").hasClass("soundoff")){
        $(".soundToggleButton").removeClass("soundoff").addClass("soundon");
        backgroundMusic.play();
        $(".soundToggleIcon").attr("src", "./images/soundon.png");
        return gameState.mute = false;
    } else if ($(".soundToggleButton").hasClass("soundon")){
        $(".soundToggleButton").removeClass("soundon").addClass("soundoff");
        backgroundMusic.pause();
        $(".soundToggleIcon").attr("src", "./images/soundoff.png");
        return gameState.mute = true;
    }
}
function difficultySwitch_Easy(){
    gameState.difficulty = "easy";
    gameState.totalPossibleMatches = 8;
    resetBoard();
    renderGameBoard();
    shuffle();
    $(".card").addClass("easySize").removeClass("hardSize, regSize, challengeSize");
    $(".card").on("click", cardClicks);
    
    if (!$(".mew").hasClass("img-sylveon")){
        $(".mew").removeClass("img-mew img-mewshape").addClass("img-sylveon");
    }
    
    resetStats();
    winModalChange();
}
function difficultySwitch_Reg(){
    gameState.difficulty = "regular";
    gameState.totalPossibleMatches = 12;
    resetBoard();
    renderGameBoard();
    shuffle();
    $(".card").addClass("regSize").removeClass("hardSize, easySize, challengeSize");
    $(".card").on("click", cardClicks);
    
    if (!$(".mew").hasClass("img-mew")){
        $(".mew").removeClass("img-sylveon img-mewshape").addClass("img-mew");
    }
    resetStats();
    winModalChange();
}
function difficultySwitch_Hard(){
    gameState.difficulty = "hard";
    gameState.totalPossibleMatches = 18;
    resetBoard();
    renderGameBoard();
    shuffle();
    $(".card").addClass("hardSize").removeClass("regSize, easySize, challengeSize");
    $(".card").on("click", cardClicks);

    if (!$(".mew").hasClass("img-mew")){
        $(".mew").removeClass("img-sylveon img-mewshape").addClass("img-mew");
    }
    resetStats();
    winModalChange();
}
function difficultySwitch_Challenge(){
    gameState.difficulty = "challenge";
    gameState.totalPossibleMatches = 25;
    resetBoard();
    renderGameBoard();
    shuffle();
    $(".card").addClass("challengeSize").removeClass("regSize, easySize, hardSize");
    $(".card").on("click", cardClicks);

    if (!$(".mew").hasClass("img-mewshape")){
        $(".mew").removeClass("img-sylveon img-mew").addClass("img-mewshape");
    }
    resetStats();
    winModalChange();
}
function resetButton(){
    gameState.stats.gamesPlayed++;
    shuffle();
    resetStats();
    $('.card').css("opacity","1");
    $('.cardTop img').css("opacity","1");
    winModalChange();
    return gameState.stats;
}
function resetStats(){
    gameState.stats.accuracy = 0;
    gameState.stats.matchCounter = 0;
    gameState.stats.attempts = 0;
    displayStats();
    return gameState.stats;
}
function resetBoard(){
    $(".gameBoard").empty();
    gameState.cardArray = [];
}
function displayStats(){
    $(".gamesPlayed .value").text(gameState.stats.gamesPlayed);
    $(".attempts .value").text(gameState.stats.attempts);
    if(gameState.stats.attempts >= 1){
        gameState.stats.accuracy = gameState.stats.matchCounter/gameState.stats.attempts*100;
    }else {
        gameState.stats.attempts = 0;
    }
    $(".accuracy .value").text(Math.floor(gameState.stats.accuracy) + "%");
    return gameState.stats;
}
function displayDifficulty(){
    if (gameState.difficulty === "easy"){
        $(".easy > i").removeClass("far fa-star").addClass("fas fa-star");
        $(".reg > i, .hard > i, .challenge > i").removeClass("fas fa-star").addClass("far fa-star");
    } else if (gameState.difficulty === "regular"){
        $(".reg > i").removeClass("far fa-star").addClass("fas fa-star");
        $(".easy > i, .hard > i, .challenge > i").removeClass("fas fa-star").addClass("far fa-star");
    } else if (gameState.difficulty === "hard"){
        $(".hard > i").removeClass("far fa-star").addClass("fas fa-star");
        $(".easy > i, .reg > i, .challenge > i").removeClass("fas fa-star").addClass("far fa-star");
    } else if (gameState.difficulty === "challenge"){
        $(".challenge > i").removeClass("far fa-star").addClass("fas fa-star");
        $(".easy > i, .reg > i, .hard > i").removeClass("fas fa-star").addClass("far fa-star");
    }
}
//-------------------------------------------------------------------------------------------------------

function renderGameBoard(){
    if (gameState.difficulty === "easy"){
        createEasyBoard();
    } else if (gameState.difficulty === "regular"){
        createRegularBoard();
    } else if (gameState.difficulty === "hard"){
        createHardBoard();
    } else if (gameState.difficulty === "challenge"){
        createChallengeBoard();
    }
    displayDifficulty();
}
function createEasyBoard(){

    if (gameState.eeveeCardBackNum > 5){
        gameState.eeveeCardBackNum = 1;
    }

    for( numOfRows=1; numOfRows<=4; numOfRows++ ){
        $(".gameBoard").append(
            $("<div>", {"class": `row${numOfRows}`})
        );

        for( cardsPerRow=1; cardsPerRow<=4; cardsPerRow++ ){
            $(`.row${numOfRows}`)
            .append(
                $("<div>", {"class": "card"})
                .append(
                    $("<div>", {"class": "cardBottom"})
                    .append(
                        $("<img>", {"src": "images/pokemon8/image1.jpg", "class": `cardImg${numOfRows}-${cardsPerRow}`})
                    ),
                    $("<div>", {"class": "cardTop"})
                    .append(
                        $("<img>", {"src": `images/cardBacks/eevee${gameState.eeveeCardBackNum}.jpg`})
                    )
                )
            );

            gameState.cardArray.push(`.cardImg${numOfRows}-${cardsPerRow}`);
        }
    }
            gameState.eeveeCardBackNum++;
}
function createRegularBoard(){
    
    if (gameState.cardBackNum > 6){
        gameState.cardBackNum = 1;
    }

    for( numOfRows=1; numOfRows<=4; numOfRows++ ){
        $(".gameBoard").append(
            $("<div>", {"class": `row${numOfRows}`})
        );

        for( cardsPerRow=1; cardsPerRow<=6; cardsPerRow++ ){
            $(`.row${numOfRows}`)
            .append(
                $("<div>", {"class": "card"})
                .append(
                    $("<div>", {"class": "cardBottom"})
                    .append(
                        $("<img>", {"src": "images/pokemon12/image1.jpg", "class": `cardImg${numOfRows}-${cardsPerRow}`})
                    ),
                    $("<div>", {"class": "cardTop"})
                    .append(
                        $("<img>", {"src": `images/cardBacks/pattern${gameState.cardBackNum}.jpg`})
                    )
                )
            );

            gameState.cardArray.push(`.cardImg${numOfRows}-${cardsPerRow}`);
        }
    }
            gameState.cardBackNum++;
}
function createHardBoard(){
    
    if (gameState.cardBackNum > 6){
        gameState.cardBackNum = 1;
    }

    for( numOfRows=1; numOfRows<=4; numOfRows++ ){
        $(".gameBoard").append(
            $("<div>", {"class": `row${numOfRows}`})
        );

        for( cardsPerRow=1; cardsPerRow<=9; cardsPerRow++ ){
            $(`.row${numOfRows}`)
            .append(
                $("<div>", {"class": "card"})
                .append(
                    $("<div>", {"class": "cardBottom"})
                    .append(
                        $("<img>", {"src": "images/pokemon18/image1.jpg", "class": `cardImg${numOfRows}-${cardsPerRow}`})
                    ),
                    $("<div>", {"class": "cardTop"})
                    .append(
                        $("<img>", {"src": `images/cardBacks/pattern${gameState.cardBackNum}.jpg`})
                    )
                )
            );

            gameState.cardArray.push(`.cardImg${numOfRows}-${cardsPerRow}`);
        }
    }
            gameState.cardBackNum++;
}
function createChallengeBoard(){
    
    if (gameState.cardBackNum > 6){
        gameState.cardBackNum = 1;
    }

    for( numOfRows=1; numOfRows<=5; numOfRows++ ){
        $(".gameBoard").append(
            $("<div>", {"class": `row${numOfRows}`})
        );

        for( cardsPerRow=1; cardsPerRow<=10; cardsPerRow++ ){
            $(`.row${numOfRows}`)
            .append(
                $("<div>", {"class": "card"})
                .append(
                    $("<div>", {"class": "cardBottom"})
                    .append(
                        $("<img>", {"src": "images/challenge/image132.png", "class": `cardImg${numOfRows}-${cardsPerRow}`})
                    ),
                    $("<div>", {"class": "cardTop"})
                    .append(
                        $("<img>", {"src": `images/cardBacks/pattern${gameState.cardBackNum}.jpg`})
                    )
                )
            );

            gameState.cardArray.push(`.cardImg${numOfRows}-${cardsPerRow}`);
        }
    }
            gameState.cardBackNum++;
}
function createImageArray(){
    if (gameState.difficulty === "regular"){
        for (doubleIt=1; doubleIt<=2; doubleIt++){
            for (pokemonImgNum=1; pokemonImgNum<=12; pokemonImgNum++){
                gameState.imageArray.push(`images/pokemon12/image${pokemonImgNum}.png`)
            }
        }
    } else if (gameState.difficulty === "easy"){
        for (doubleIt=1; doubleIt<=2; doubleIt++){
            for (pokemonImgNum=1; pokemonImgNum<=8; pokemonImgNum++){
                gameState.imageArray.push(`images/pokemon8/image${pokemonImgNum}.jpg`)
            }
        }
    } else if (gameState.difficulty === "hard"){
        for (doubleIt=1; doubleIt<=2; doubleIt++){
            for (pokemonImgNum=1; pokemonImgNum<=18; pokemonImgNum++){
                gameState.imageArray.push(`images/pokemon18/image${pokemonImgNum}.jpg`)
            }
        }
    } else if (gameState.difficulty === "challenge"){
        var pokemonNumCheck = [];
        var challengeImageArray = [];
        var pokemonNum = null;

        function notSame(currentValue){
            return pokemonNum !== currentValue;
        }

        while (challengeImageArray.length < 25){
            pokemonNum = [Math.floor(Math.random() * 151) + 1];

            if (pokemonNumCheck.every(notSame)){
                pokemonNumCheck.push(pokemonNum);
                challengeImageArray.push(`images/challenge/image${pokemonNum}.png`);
            }
        }
        
        gameState.imageArray = challengeImageArray.concat(challengeImageArray);
    }
}
function shuffle(){
    createImageArray();
    var randomPokemon = [];
    while (gameState.imageArray.length > 0){
        var randomIndex = Math.floor(Math.random() * gameState.imageArray.length);
        randomPokemon.push(gameState.imageArray[randomIndex]);
        gameState.imageArray.splice(randomIndex, 1);
    }
    for(i=0;i<=randomPokemon.length;i++){
        $(gameState.cardArray[i]).attr('src', randomPokemon[i]);
    }
}
function cardClicks(){
    if ($(this).find('.cardTop img').css("opacity") === "1"){
        if (gameState.firstCardClicked === null){
            gameState.firstCardClicked = $(this).find('.cardBottom img').attr('src');
            gameState.thisCard1 = $(this);
            $(this).find('.cardTop img').css("opacity", "0");
        } else {
            gameState.secondCardClicked = $(this).find('.cardBottom img').attr('src');
            gameState.thisCard2 = $(this);
            $(this).find('.cardTop img').css("opacity", "0");
            gameState.stats.attempts++;
            if (gameState.firstCardClicked === gameState.secondCardClicked){
                cardMatch();
            } else {
                cardMismatch();
            }
        if(gameState.stats.matchCounter === gameState.totalPossibleMatches){
            if (gameState.difficulty === "easy"){
                setTimeout(function(){
                    winModalChange();
                    winModalOpen();
                }, 1500)
            } else {
                winModalChange();
                winModalOpen();
            }
            
        }
        displayStats();
        } 
    }
}
function cardMatch(){
    $(".card").off("click");
    setTimeout(function(){
        gameState.thisCard1.css("opacity", "0");
        gameState.thisCard2.css("opacity", "0");
        $(".card").on("click", cardClicks);
    }, 1000);
    if (gameState.mute === false){
        matchSound();
    }
    gameState.stats.matchCounter++;
    gameState.firstCardClicked = null;
    gameState.secondCardClicked = null;
}
function cardMismatch(){
    $(".card").off("click");
    if (gameState.mute === false){
            mismatchSound();
        }
    setTimeout(function(){
        if (gameState.thisCard1.find('.cardTop img').css("opacity") === "0" ){
            gameState.thisCard1.find('.cardTop img').css("opacity", "1");
        }
        if (gameState.thisCard2.find('.cardTop img').css("opacity") === "0" ){
            gameState.thisCard2.find('.cardTop img').css("opacity", "1");
        }
        gameState.firstCardClicked = null;
        gameState.secondCardClicked = null;
        $(".card").on("click", cardClicks);
    }, 2000);
}
function matchSound(){
    if (gameState.difficulty === "easy"){
        for (eeveeNum=1; eeveeNum<=8; eeveeNum++){
            if (gameState.firstCardClicked === `images/pokemon8/image${eeveeNum}.jpg`){
                pokemonCrySound.src = `sounds/eeveelutions/cry${eeveeNum}.mp3`;
                pokemonCrySound.play();
            }
        }
    } else {
        catchSound.play();
    }
}
function mismatchSound(){
    if (gameState.difficulty === "challenge"){
        pokemonCrySound.src = `sounds/cries/cry${Math.floor(Math.random() * 31) + 1}.mp3`
        pokemonCrySound.play();
    } else {
        missSound.play();
    }
}
//-------------------------------------------------------------------------------------------------------

function winModalChange(){
    if (gameState.difficulty === "easy") {
        if (gameState.eeveeWinImageNum > 6) {
            gameState.eeveeWinImageNum = 1;
        }
        $(".winImg").attr("src", `images/victory/eeveelutions/eevee${gameState.eeveeWinImageNum}.png`);
        gameState.eeveeWinImageNum++;
    } else if (gameState.difficulty === "challenge") {
        if (gameState.pikaWinImageNum > 3) {
            gameState.pikaWinImageNum = 1;
        }
        $(".winImg").attr("src", `images/victory/pikachu/pikachu${gameState.pikaWinImageNum}.png`);
        gameState.pikaWinImageNum++;
    } else {
        if (gameState.winImageNum > 9) {
            gameState.winImageNum = 1;
        }
        $(".winImg").attr("src", `images/victory/image${gameState.winImageNum}.png`);
        gameState.winImageNum++;
    };

    $(".winText").text(gameState.winMsg[Math.floor(Math.random() * 6)]);
}
function winMusicChange(){
    if (gameState.difficulty === "easy"){
        eeveeSound.play();
        winSound.play();
    } else if ($(".winImg").attr("src") === "images/victory/image2.png"){
        pokemonCrySound.src = "sounds/oshawott.mp3";
        pokemonCrySound.play();
        winSound.play();
    } else if (gameState.difficulty === "challenge"){
        pikachuWinSound.play();
    } else {
        winSound.play();
    }
}
function winModalOpen(){
    $(".headerLogo").css("display", "none");
    $(".winModal").css("display", "block");
    if (gameState.mute === false){
        backgroundMusic.pause();
        winMusicChange(); 
    }
}
function winModalClose(){
    $(".winModal").css("display", "none");
        pikachuWinSound.pause();
        pikachuWinSound.currentTime = 0;
        winSound.pause();
        winSound.currentTime = 0;
     if (gameState.mute === false){
         backgroundMusic.play();
     };
     resetButton();
}
//-------------------------------------------------------------------------------------------------------

function mewBlink(){
    var mewTimeout = setTimeout(showMew, 5000);

    function mewShowMath() {
        return Math.floor(Math.random() * 12000) + 8001;
    };
    function mewHideMath() {
        return Math.floor(Math.random() * 2000) + 1501;
    };
    function showMew(){
        $(".mew").css("opacity", "1");
        
        if (gameState.difficulty === "challenge"){
            $(".img-mewshape").css("background-image", `url("images/mewshape${gameState.mewNum}.png")`);
        }

        setTimeout(hideMew, mewHideMath());
    }
    function hideMew(){
        $(".mew").css("opacity", "0");

        if (gameState.difficulty === "challenge"){
            gameState.mewNum++
            if (gameState.mewNum > 3){
                gameState.mewNum = 1;
            }
        }

        clearTimeout(mewTimeout);
        mewTimeout = setTimeout(showMew, mewShowMath());
    }

    $(window).mousemove(function(mouseLocation){
        hideMew();
    })

}

})()
