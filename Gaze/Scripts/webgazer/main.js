window.onload = function () {

    //Set up the webgazer video feedback.
    var setup = function () {
        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = 'fixed';
        }
    };
    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    //start the webgazer tracker
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function (data, clock) {
            //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        })
        .beginAsync()
        .always(function (w) {
            w.showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */
            setTimeout(checkIfReady, 100);
        });

    setTimeout(checkIfReady, 100);
};

/**
 * Restart the calibration process by clearing thelocal storage and reseting the calibration point
 */
function Restart() {
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    return ClearCalibration().always(() => {
        PopUpInstruction();
    });
}
