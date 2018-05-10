
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
   attachClickHandler()
//    bushToggle();
}

function attachClickHandler(){
    $(".card").on("click", cardClicks)
}

function resetButton(){
    gamesPlayed = gamesPlayed++;
    resetStats();
    displayStats();
    return gamesPlayed;
}
function displayStats(gamesPlayed, attempts, accuracy){
    $(".gamesPlayed .value").text(gamesPlayed);
    $(".attempts .value").text(attempts);
    accuracy = (attempts - matches) / attempts * 100;
    $(".accuracy .value").text(accuracy + "%")
}
function resetStats(){
    accuracy = 0;
    matches = 0;
    attempts = 0;
    displayStats();
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
        if (firstCardClicked === secondCardClicked){
            matchCounter++;
            firstCardClicked = null;
            secondCardClicked = null;
        } else {
            setTimeout(function(){
                console.log($("img").css("opacity") );
                if (thisCard1.find('.cardTop img').css("opacity") === "0" ){
                    thisCard1.find('.cardTop img').css("opacity", "1");
                }
                if (thisCard2.find('.cardTop img').css("opacity") === "0" ){
                    thisCard2.find('.cardTop img').css("opacity", "1");
                }
                firstCardClicked = null;
                secondCardClicked = null;
            }, 2000);
        }
    if(matchCounter === totalPossibleMatches){
        console.log("Win!");
    } else {
        ;
    }
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
