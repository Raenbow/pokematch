
(function(){

$(document).ready(initializeGame);

//-------------------------------------------------------------------------------------------------------

var gameState = {
    mute: true,
    stats: {
        attempts: 0,
        accuracy: 0,
        gamesPlayed: 0,
        matchCounter: 0
    },
    totalPossibleMatches: 9,
    firstCardClicked: null,
    secondCardClicked: null,
    thisCard1: null,
    thisCard2: null
}

var cardArray = [".cardImg1-1", ".cardImg1-2", ".cardImg1-3", ".cardImg1-4", ".cardImg1-5", ".cardImg1-6", ".cardImg2-1", ".cardImg2-2", ".cardImg2-3", ".cardImg2-4", ".cardImg2-5", ".cardImg2-6", ".cardImg3-1", ".cardImg3-2", ".cardImg3-3", ".cardImg3-4", ".cardImg3-5", ".cardImg3-6"];
var pokemonArray1 = ["images/pmans1.jpg", "images/pmans2.jpg", "images/pmans3.jpg", "images/pmans4.jpg", "images/pmans5.jpg", "images/pmans6.jpg", "images/pmans7.jpg", "images/pmans8.jpg", "images/pmans9.jpg"];
var pokemonArray2 = ["images/pmans1.jpg", "images/pmans2.jpg", "images/pmans3.jpg", "images/pmans4.jpg", "images/pmans5.jpg", "images/pmans6.jpg", "images/pmans7.jpg", "images/pmans8.jpg", "images/pmans9.jpg"];

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
   attachClickHandler();
   $(window).on("resize", resizeTransitionStop);
   backgroundMusic.play();
   shuffle();
   mewBlink();
}
function attachClickHandler(){
    $(".card").on("click", cardClicks);
    $(".resetButton").on("click", resetButton);
    $(".winModal").on("click", winModalClose);
    $(".soundToggleButton").on("click", toggleSounds);
    $(".pokedexOpenButton").on("click", pokedexExpand);
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
//-------------------------------------------------------------------------------------------------------

function shuffle(array){
    var pokemonArrayx18 = pokemonArray1.concat(pokemonArray2);
    var randomPokemon = [];
    while (pokemonArrayx18.length > 0){
        var randomIndex = Math.floor(Math.random() * pokemonArrayx18.length);
        randomPokemon.push(pokemonArrayx18[randomIndex]);
        pokemonArrayx18.splice(randomIndex, 1);
    }
    for(i=0;i<=18;i++){
        $(cardArray[i]).attr('src', randomPokemon[i]);
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
            } else {
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
        if(gameState.stats.matchCounter === gameState.totalPossibleMatches){
            $(".winModal").css("display", "block");
             backgroundMusic.pause();
             if (gameState.mute === false){
                 winSound.play();
             }
        }
        displayStats();
        } 
    }
}
function winModalClose(){
    $(".winModal").css("display", "none");
        winSound.pause();
     if (gameState.mute === false){
         backgroundMusic.play();
     };
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
