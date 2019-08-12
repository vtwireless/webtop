// Copied and changed from:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations#An_animated_clock
//
//

function Clock() {
  
    var canvas = document.createElement('canvas');

    canvas.style.backgroundColor = "#FFF";
    canvas.className = 'clock';

    this.getElement = function() {
        return canvas;
    };

    var oldSec = -1;

    var ctx = canvas.getContext('2d');

    // If a Date object is passed in we use that Date and do
    // not request another AnimationFrame, and let the user
    // call run at regular intervals.
    function run(now_in=null) {

        if(now_in === null) {
            var now = new Date();
            requestAnimationFrame(function() {run(null); });
        } else
            var now = now_in;

        var sec = now.getSeconds();

        var w = canvas.width;
        var h = canvas.height;

        if(canvas.offsetWidth === w && canvas.offsetHeight === h
                && oldSec === sec)
            // Nothing new to draw.  We do not draw if there is no change
            // in what we would draw.
            return;
        else if(canvas.offsetWidth === 0 || canvas.offsetHeight === 0)
            // It must be hidden
            return;
        else {
            //console.log("w,h=" + w + ',' + h);
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
            oldSec = sec;
        }

        ctx.save();
        ctx.clearRect(0, 0, w, h);
        ctx.translate(w/2, h/2);
        ctx.scale(w/300,h/300);
        ctx.rotate(-Math.PI / 2);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        // Hour marks
        ctx.save();
        for (var i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.rotate(Math.PI / 6);
            ctx.moveTo(100, 0);
            ctx.lineTo(120, 0);
            ctx.stroke();
        }
        ctx.restore();

        // Minute marks
        ctx.save();
        ctx.lineWidth = 5;
        for (i = 0; i < 60; i++) {
            if (i % 5!= 0) {
                ctx.beginPath();
                ctx.moveTo(117, 0);
                ctx.lineTo(120, 0);
                ctx.stroke();
            }
            ctx.rotate(Math.PI / 30);
        }
        ctx.restore();
 
        var min = now.getMinutes();
        var hr  = now.getHours();
        hr = hr >= 12 ? hr - 12 : hr;

        ctx.fillStyle = 'black';

        // write Hours
        ctx.save();
        ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) *sec);
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(80, 0);
        ctx.stroke();
        ctx.restore();

        // write Minutes
        ctx.save();
        ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(-28, 0);
        ctx.lineTo(112, 0);
        ctx.stroke();
        ctx.restore();
 
        // Write seconds
        ctx.save();
        ctx.rotate(sec * Math.PI / 30);
        ctx.strokeStyle = '#D40000';
        ctx.fillStyle = '#D40000';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(83, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.lineWidth = 14;
        ctx.strokeStyle = '#325FA2';
        ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
        ctx.stroke();

        ctx.restore();
    }

    this.run = run;
}
