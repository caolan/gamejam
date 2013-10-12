var game = {};

var commands = FuzzySet();
commands.add('Spellcasting');
commands.add('Summoning');
commands.add('Dismiss');

var spells = FuzzySet();
spells.add('Penguin');
spells.add('Fireball');
spells.add('Burrito');
spells.add('Beer');


function parseCommand(str) {
    var first = str.split(' ')[0];
    var m = commands.get(first);
    var command = m ? m[0][1]: 'spellcasting';

    if (command === 'spellcasting') {
        var rest = str.split(' ').slice(1).join(' ');
        var m2 = spells.get(rest);
        var spell = m2 ? m2[0][1]: null;
        return ['spellcasting', spell];
    }
    else {
        return [command];
    }
}


document.onkeyup = function (ev) {
    // spacebar
    if (ev.keyCode === 32) {
        if (speech.recording) {
            speech.stop();
        }
        else {
            speech.listen(function (err, str) {
                var cmd = parseCommand(str);
                cmd[0] = cmd[0].toUpperCase();
                alert(cmd);
            });
        }
    }
};


var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var images = [
    'img/bg1.png',
    'img/bg2.png',
    'img/bg3.png',
    'img/bg6.png',
    'img/bg4.png',
    'img/bg5.png',
    'img/talk.png'
];

function loadImage(url, callback) {
    var img = new Image();   // Create new img element
    img.addEventListener("load", function() { callback(null, img); }, false);
    img.src = url; // Set source path
}

function clear(ctx, preserveTransform) {
    if (preserveTransform) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (preserveTransform) {
        ctx.restore();
    }
}

async.map(images, loadImage, function (err, images) {
    if (err) {
        return alert(err);
    }
    console.log(images);

    var bgimages = images.slice(0, 6);
    function drawBg() {
        bgimages.forEach(function (img) {
            // execute drawImage statements here
            ctx.drawImage(img, 0, 0, 1280, 720);
        });
    }

    speech.onstartrecording = function () {
        clear(ctx);
        drawBg();
        ctx.drawImage(images[6], 0, 0);
    };

    speech.onstoprecording = function () {
        clear(ctx);
        drawBg();
    };

    clear(ctx);
    drawBg();
});

