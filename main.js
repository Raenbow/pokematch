
$(document).ready(initializeGame);

//-------------------------------------------------------------------------------------------------------

var menuOpened = false;
var mute = false;
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

//-------------------------------------------------------------------------------------------------------

var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "sounds/pallettetown.mp3";
backgroundMusic.loop = true;

backgroundMusic.onplaying = function(){ 
    playing = true;
} 
backgroundMusic.onpause = function(){
    playing = false;
}

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
//-------------------------------------------------------------------------------------------------------

function pokedexExpand(){
    // var portrait = window.matchMedia("(orientation: portrait)").matches;
    // var landscape = window.matchMedia("(orientation: landscape)").matches;

    // if ( window.innerWidth < 600 ){

        if ( menuOpened === false ){
            $(".pokedex").addClass("expanded");
            $(".gameBoardContainer").addClass("faded");
            $(".pokedexOpenButton > i").addClass("fa-times").removeClass("fa-angle-up");
            $(".pokedexOpenButton").addClass("switched");
            menuOpened = true;
        } else if ( menuOpened === true ){
            $('.pokedex').removeClass('expanded');
            $(".gameBoardContainer").removeClass("faded");
            $(".pokedexOpenButton > i").addClass("fa-angle-up").removeClass("fa-times");
            $(".pokedexOpenButton").removeClass("switched");
            menuOpened = false;
        }

        // if ( landscape && menuOpened === false ){
        //     $('.pokedex').addClass('expanded');
        //     $(".gameBoardContainer").addClass("faded");
        //     $(".pokedexOpenButton > i").addClass("fa-times").removeClass("fa-angle-up");
        //     $(".pokedexOpenButton").addClass("switched");
        //     menuOpened = true;
        // } else if ( landscape && menuOpened === true ){
        //     $('.pokedex').removeClass('expanded');
        //     $(".gameBoardContainer").removeClass("faded");
        //     $(".pokedexOpenButton > i").addClass("fa-angle-up").removeClass("fa-times");
        //     $(".pokedexOpenButton").removeClass("switched");
        //     menuOpened = false;
        // }
    // }

    // if ( window.innerWidth > 600 ){



    // }
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
function toggleSounds(){
    if ($(".soundToggleButton").hasClass("soundoff")){
        $(".soundToggleButton").removeClass("soundoff").addClass("soundon");
        var mute = false;
        backgroundMusic.play();
        $(".soundToggleIcon").attr("src", "./images/soundon.png");
    } else if ($(".soundToggleButton").hasClass("soundon")){
        $(".soundToggleButton").removeClass("soundon").addClass("soundoff");
        var mute = true;
        backgroundMusic.pause();
        $(".soundToggleIcon").attr("src", "./images/soundoff.png");
    }
}
// function toggleMute(){
//     if(playing){
//        backgroundMusic.pause();
//         $(".muteButton").css("background-image", "url('images/soundoff.png')");
//         mute = true;
//     } else {
//         backgroundMusic.play();
//         $(".muteButton").css("background-image", "url('images/soundon.png')")
//         mute = false;
//     }  
// }
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
                $(".card").off("click");
                setTimeout(function(){
                    thisCard1.css("opacity", "0");
                    thisCard2.css("opacity", "0");
                    $(".card").on("click", cardClicks);
                }, 1000);
                matchSound.play();
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
             backgroundMusic.pause();
            winSound.play();
        }
        displayStats();
        } 
    }
}
function winModalClose(){
    $(".winModal").css("display", "none");
        winSound.pause();
     if (mute === false){
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
