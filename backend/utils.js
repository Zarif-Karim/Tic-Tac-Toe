//removed old temp util functions
let INTERVAL_ID = null;

function startTimer(){
    INTERVAL_ID = setInterval(() => {
        player === 1 ? --rtp1 : --rtp2;
        if(rtp1 === 0 || rtp2 === 0) {

            stopTimer();
        }
    }, 1000);
}

function stopTimer(){
    if(INTERVAL_ID){
        clearInterval(INTERVAL_ID);
        INTERVAL_ID = null;
    }
}

module.exports = {
    startTimer, stopTimer
};