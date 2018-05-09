
$(document).ready(initializeGame);


var matches = 0;
var attempts = 0;
var accuracy = 0;

var firstCardClicked = null;
var secondCardClicked = null;
var totalPossibleMatches = 2;
var matchCounter = 0;

function initializeGame(){
    var gamesPlayed = 0;
    $(".cardTop").click(cardClicks);
//    bushToggle();
}
function resetButton(){
    gamesPlayed = gamesPlayed++;
    return;
}
function displayStats(gamesPlayed, attempts, accuracy){
    $(".gamesPlayed .value").text(gamesPlayed);
    $(".attempts .value").text(attempts);
    accuracy = (attempts - matches) / attempts * 100;
}
function resetStats(){

}
function cardClicks(){
    if (firstCardClicked === null){
        firstCardClicked = this;
        console.log(firstCardClicked);
    } else {
        secondCardClicked = this;
        if (firstCardClicked === secondCardClicked){
            matchCounter++;
            firstCardClicked = null;
            secondCardClicked = null;
        }
        if(matchCounter === totalPossibleMatches){
            //display win!
        } else {
            ;
        }
        // if( $(this).hasClass("cardClick")){
        //     $(this).removeClass("cardClick");
        //     $(this).find(".bushStill").removeClass("hiddenBush");
        // } else {
        //     $(this).addClass("cardClick");
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
