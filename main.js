
$(document).ready(initializeGame);


var attempts = 0;
var accuracy = 0;
var gamesPlayed = 0;

var firstCardClicked = null;
var secondCardClicked = null;
var totalPossibleMatches = 9;
var matchCounter = 0;

var thisCard1 = null;
var thisCard2 = null;

var cardArray = [".cardImg1-1", ".cardImg1-2", ".cardImg1-3", ".cardImg1-4", ".cardImg1-5", ".cardImg1-6", ".cardImg2-1", ".cardImg2-2", ".cardImg2-3", ".cardImg2-4", ".cardImg2-5", ".cardImg2-6", ".cardImg3-1", ".cardImg3-2", ".cardImg3-3", ".cardImg3-4", ".cardImg3-5", ".cardImg3-6"];
var pokemonArray1 = ["images/pmans1.jpg", "images/pmans2.jpg", "images/pmans3.jpg", "images/pmans4.jpg", "images/pmans5.jpg", "images/pmans6.jpg", "images/pmans7.jpg", "images/pmans8.jpg", "images/pmans9.jpg"];
var pokemonArray2 = ["images/pmans1.jpg", "images/pmans2.jpg", "images/pmans3.jpg", "images/pmans4.jpg", "images/pmans5.jpg", "images/pmans6.jpg", "images/pmans7.jpg", "images/pmans8.jpg", "images/pmans9.jpg"];

var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "sounds/pallettetown.mp3";
backgroundMusic.loop = true;
backgroundMusic.onplaying = function(){ 
    playing = true;
} 
backgroundMusic.onpause = function(){
    playing = false;
}

var mewTimeout = setTimeout(showMew, 5000);

function initializeGame(){
   attachClickHandler();
   backgroundMusic.play();
   shuffle();
   mewMouse();
}

function attachClickHandler(){
    $(".card").on("click", cardClicks);
    $(".reset").on("click", resetButton);
    $(".winModal").on("click", winModalClose);
    $(".muteButton").on("click", toggleMute);
}

function toggleMute(){
    if(playing){
       backgroundMusic.pause(); 
    } else {
        backgroundMusic.play();
    }  
}
function resetButton(){
    gamesPlayed++;
    shuffle();
    resetStats();
    $('.cardTop img').css("opacity","1");
    return gamesPlayed;
}
function resetStats(){
    accuracy = 0;
    matchCounter = 0;
    attempts = 0;
    displayStats();
}
function displayStats(){
    $(".gamesPlayed .value").text(gamesPlayed);
    $(".attempts .value").text(attempts);
    if(attempts >= 1){
        accuracy = matchCounter/attempts*100;
    }else {
        attempts = 0;
    }
    $(".accuracy .value").text(Math.floor(accuracy) + "%");
    return;
}
function winModalClose(){
    $(".winModal").css("display", "none");
}
function cardClicks(){
    if ($(this).find('.cardTop img').css("opacity") === "1"){
        if (firstCardClicked === null){
            firstCardClicked = $(this).find('.cardBottom img').attr('src');
            thisCard1 = $(this);
            $(this).find('.cardTop img').css("opacity", "0");
        } else {
            secondCardClicked = $(this).find('.cardBottom img').attr('src');
            thisCard2 = $(this);
            $(this).find('.cardTop img').css("opacity", "0");
            attempts++;
            if (firstCardClicked === secondCardClicked){
                matchCounter++;
                firstCardClicked = null;
                secondCardClicked = null;
            } else {
                $(".card").off("click");
                setTimeout(function(){
                    if (thisCard1.find('.cardTop img').css("opacity") === "0" ){
                        thisCard1.find('.cardTop img').css("opacity", "1");
                    }
                    if (thisCard2.find('.cardTop img').css("opacity") === "0" ){
                        thisCard2.find('.cardTop img').css("opacity", "1");
                    }
                    firstCardClicked = null;
                    secondCardClicked = null;
                    $(".card").on("click", cardClicks);
                }, 2000);
            }
        if(matchCounter === totalPossibleMatches){
            $(".winModal").css("display", "block");
        }
        displayStats();
        } 
    }
    
}
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
function mewMouse(){
    $(window).mousemove(function(mouseLocation){
        clearTimeout(mewTimeout);
        mewTimeout = setTimeout(showMew, 5000);
        hideMew();
    })
}
function showMew(){
    $(".mew").css("opacity", "1");
}
function hideMew(){
    $(".mew").css("opacity", "0");
}