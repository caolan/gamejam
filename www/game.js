var game = {};

var commands = FuzzySet();
commands.add('spellcasting');
commands.add('summoning');
commands.add('dismiss');

var spells = FuzzySet();
spells.add('penguin');
spells.add('fireball');
spells.add('burrito');
spells.add('beer');
spells.add('shoelaces');
spells.add('walrus');
spells.add('nyan cat');

var summons = FuzzySet();
summons.add('Odin');
summons.add('Thor');
summons.add('Zeus');
summons.add('Sasquatch');

function pickItem(set, str) {
    var m = set.get(str);
    var values = set.values();
    // if match, get first one, otherwise pick a random entry
    return m ? m[0][1]: values[Math.floor(Math.random()*values.length)];
}

function parseCommand(str) {
    console.log(['parseCommand', str]);
    var firstpair = str.split(' ').slice(0, 2).join(' ');
    var rest = str.split(' ').slice(1).join(' ');

    var command = pickItem(commands, firstpair);
    if (command === 'spellcasting') {
        return ['spellcasting', pickItem(spells, rest)];
    }
    else if (command === 'summoning') {
        return ['summoning', pickItem(summons, rest)];
    }
    else {
        return [command];
    }
}


document.onkeypress = function (ev) {
    // spacebar
    if (ev.keyCode === 32) {
        ev.preventDefault();
        if (speech.recording) {
            speech.stop();
        }
        else {
            speech.listen(function (err, str) {
                var cmd = parseCommand(str);
                console.log(cmd);
                cmd[0] = cmd[0].toUpperCase();
                alert(cmd);
            });
        }
        return;
    }
};


var canvas = document.getElementById('game');
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

    sun = {animate: function () {
           this.x += 1;
           if (this.x > ctx.canvas.width) {
               this.x = 0;
           }
       },
       x: 2,
       y:3,
       image: images[0]};

    var bgimages = images.slice(1, 6);
    function animationLoop() {
        var interval = setInterval(function () {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(sun.image, sun.x, sun.y);
            sun.animate();
            bgimages.forEach(function (img) {
                // execute drawImage statements here
                ctx.drawImage(img, 0, 0, 1280, 720);
            });
        }, 1000/40);

    }
    speech.onstartrecording = function () {
        clear(ctx);
        animationLoop();
        ctx.drawImage(images[6], 0, 0);
    };

    speech.onstoprecording = function () {
        clear(ctx);
        animationLoop();
    };

    clear(ctx);
    animationLoop();
});

