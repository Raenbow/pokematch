
(function(){

$(document).ready(initializeGame);

//-------------------------------------------------------------------------------------------------------

var gameState = {
    difficulty: "regular",
    cardArray: [],
    imageArray: [],
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
    thisCard2: null
}

// var cardArray = [".cardImg1-1", ".cardImg1-2", ".cardImg1-3", ".cardImg1-4", ".cardImg1-5", ".cardImg1-6", ".cardImg2-1", ".cardImg2-2", ".cardImg2-3", ".cardImg2-4", ".cardImg2-5", ".cardImg2-6", ".cardImg3-1", ".cardImg3-2", ".cardImg3-3", ".cardImg3-4", ".cardImg3-5", ".cardImg3-6"];
// var pokemon12Array = ["images/pokemon12/image1.jpg", "images/pokemon12/image2.jpg", "images/pokemon12/image3.jpg", "images/pokemon12/image4.jpg", "images/pokemon12/image5.jpg", "images/pokemon12/image6.jpg", "images/pokemon12/image7.jpg", "images/pokemon12/image8.jpg", "images/pokemon12/image9.jpg", "images/pokemon12/image10.jpg", "images/pokemon12/image11.jpg", "images/pokemon12/image12.jpg"];
// var pokemonArray2 = ["images/image1.jpg", "images/image2.jpg", "images/image3.jpg", "images/image4.jpg", "images/image5.jpg", "images/image6.jpg", "images/image7.jpg", "images/image8.jpg", "images/image9.jpg"];

//-------------------------------------------------------------------------------------------------------

var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "sounds/pallettetown.mp3";
backgroundMusic.loop = true;

var matchSound = document.createElement("audio");
matchSound.src = "sounds/pokeballcatch.mp3";

var winSound = document.createElement("audio");
winSound.src = "sounds/victory.mp3";

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
    console.log("Ya clickety clacked that settings button man!");
    $(".screenMiddle").css("display", "none");
    $(".settingsDisplay").css("display","flex");
    $(".settingsButton").css("display", "none");
    $(".statsButton").css("display", "unset");
}
function statsMenuOpen(){
    console.log("Ya clickety clacked that STATS button man!");
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
    $(".gameBoard").empty();
    renderGameBoard();
    shuffle();
    $(".card").addClass("easySize").removeClass("hardSize, regSize");
    $(".card").on("click", cardClicks);
    console.log("Difficulty = Easy");
}
function difficultySwitch_Reg(){
    gameState.difficulty = "regular";
    gameState.totalPossibleMatches = 12;
    $(".gameBoard").empty();
    renderGameBoard();
    shuffle();
    $(".card").addClass("regSize").removeClass("hardSize, easySize");
    $(".card").on("click", cardClicks);
    console.log("Difficulty = Regular");
}
function difficultySwitch_Hard(){
    gameState.difficulty = "hard";
    gameState.totalPossibleMatches = 18;
    $(".gameBoard").empty();
    renderGameBoard();
    shuffle();
    $(".card").addClass("hardSize").removeClass("regSize, easySize");
    $(".card").on("click", cardClicks);
    console.log("Difficulty = Hard");
}
function resetButton(){
    gameState.stats.gamesPlayed++;
    shuffle();
    resetStats();
    $('.card').css("opacity","1");
    $('.cardTop img').css("opacity","1");
    return gameState.stats;
}
function resetStats(){
    gameState.stats.accuracy = 0;
    gameState.stats.matchCounter = 0;
    gameState.stats.attempts = 0;
    displayStats();
    return gameState.stats;
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
        $(".reg > i, .hard > i").removeClass("fas fa-star").addClass("far fa-star");
    } else if (gameState.difficulty === "regular"){
        $(".reg > i").removeClass("far fa-star").addClass("fas fa-star");
        $(".easy > i, .hard > i").removeClass("fas fa-star").addClass("far fa-star");
    } else if (gameState.difficulty === "hard"){
        $(".hard > i").removeClass("far fa-star").addClass("fas fa-star");
        $(".easy > i, .reg > i").removeClass("fas fa-star").addClass("far fa-star");
    }
}
//-------------------------------------------------------------------------------------------------------

function renderGameBoard(){
    if (gameState.difficulty === "easy"){
        createEasyBoard();
        displayDifficulty();
    } else if (gameState.difficulty === "regular"){
        createRegularBoard();
        displayDifficulty();
    } else if (gameState.difficulty === "hard"){
        createHardBoard();
        displayDifficulty();
    }
}
function createEasyBoard(){
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
                        $("<img>", {"src": "images/pokemon25/image1.jpg", "class": `cardImg${numOfRows}-${cardsPerRow}`})
                    ),
                    $("<div>", {"class": "cardTop"})
                    .append(
                        $("<img>", {"src": "images/greenbackground2.jpg"})
                    )
                )
            );

            gameState.cardArray.push(`.cardImg${numOfRows}-${cardsPerRow}`);
        }
    }
}
function createRegularBoard(){
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
                        $("<img>", {"src": "images/greenbackground2.jpg"})
                    )
                )
            );

            gameState.cardArray.push(`.cardImg${numOfRows}-${cardsPerRow}`);
        }
    }
}
function createHardBoard(){
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
                        $("<img>", {"src": "images/pokemon25/image1.jpg", "class": `cardImg${numOfRows}-${cardsPerRow}`})
                    ),
                    $("<div>", {"class": "cardTop"})
                    .append(
                        $("<img>", {"src": "images/greenbackground2.jpg"})
                    )
                )
            );

            gameState.cardArray.push(`.cardImg${numOfRows}-${cardsPerRow}`);
        }
    }
}
function createImageArray(){
    if (gameState.difficulty === "regular"){
        for (doubleIt=1; doubleIt<=2; doubleIt++){
            for (pokemonImgNum=1; pokemonImgNum<=12; pokemonImgNum++){
                gameState.imageArray.push(`images/pokemon12/image${pokemonImgNum}.png`)
            }
        }
    } else if (gameState.difficulty === "hard"){
        for (doubleIt=1; doubleIt<=2; doubleIt++){
            for (pokemonImgNum=1; pokemonImgNum<=25; pokemonImgNum++){
                gameState.imageArray.push(`images/pokemon25/image${pokemonImgNum}.jpg`)
            }
        }
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
            winModalOpen();
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
        matchSound.play();
    }
    gameState.stats.matchCounter++;
    gameState.firstCardClicked = null;
    gameState.secondCardClicked = null;
}
function cardMismatch(){
    $(".card").off("click");
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
//-------------------------------------------------------------------------------------------------------

function winModalOpen(){
    $(".winModal").css("display", "block");
             backgroundMusic.pause();
             if (gameState.mute === false){
                 winSound.play();
             }
}
function winModalClose(){
    $(".winModal").css("display", "none");
        winSound.pause();
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

        setTimeout(hideMew, mewHideMath());
    }
    function hideMew(){
        $(".mew").css("opacity", "0");

        clearTimeout(mewTimeout);
        mewTimeout = setTimeout(showMew, mewShowMath());
    }

    $(window).mousemove(function(mouseLocation){
        hideMew();
    })

}

})()
