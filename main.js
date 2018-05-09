
$(document).ready(initializeGame);


var matches = 0;
var attempts = 0;
var accuracy = 0;
var gamesPlayed = 0;

function initializeGame(){
    $(".cardTop").click(cardClicks);
    bushToggle();
}
function displayStats(){

}
function resetStats(){

}
function cardClicks(){
    if( $(this).hasClass("cardClick")){
        $(this).removeClass("cardClick");
        $(".bushStill").removeClass("hiddenBush");
    } else {
        $(this).addClass("cardClick");
        $(".bushStill").addClass("hiddenBush");
    }
}
function bushToggle(){
    $(".bushStill").mouseenter(shakeyBush);
    $(".bushStill").mouseout(stillBush);
}
function shakeyBush(){
    $(this).attr("src", "images/shakeybush.gif");
}
function stillBush(){
    $(this).attr("src", "images/stillbush.gif");
}
