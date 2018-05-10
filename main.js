
$(document).ready(initializeGame);


var matches = 0;
var attempts = 0;
var accuracy = 0;
var gamesPlayed = 0;

var firstCardClicked = null;
var secondCardClicked = null;
var totalPossibleMatches = 3;
var matchCounter = 0;

var thisCard1 = null;
var thisCard2 = null;

function initializeGame(){
   attachClickHandler();
//    bushToggle();
}

function attachClickHandler(){
    $(".card").on("click", cardClicks);
    $(".reset").on("click", resetButton);
}

function resetButton(){
    gamesPlayed++;
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
function cardClicks(){
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
            //halt clicks here
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
            }, 1500);
        }
    if(matchCounter === totalPossibleMatches){
        console.log("Win!");
    } else {
        ;
    }
    displayStats();
        // if( $(this).hasClass("cardClick")){
        //     $(this).removeClass("cardClick");
        //     $(this).find(".bushStill").removeClass("hiddenBush");
        // } else {
            // $(this).addClass("cardClick");
        //     $(this).find(".bushStill").addClass("hiddenBush");
        // }
    }

}
// function bushToggle(){
//     $(".bushStill").mouseenter(shakeyBush);
//     $(".bushStill").mouseout(stillBush);
// }
// function shakeyBush(){
//     $(this).attr("src", "images/shakeybush.gif");
// }
// function stillBush(){
//     $(this).attr("src", "images/stillbush.gif");
// }
