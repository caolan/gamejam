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
    {name: 'sun', url: 'img/bg1.png'},
    {name: 'farcloud', url: 'img/bg2.png'},
    {name: 'bg3', url: 'img/bg3.png'},
    {name: 'bg4', url: 'img/bg4.png'},
    {name: 'bg5', url: 'img/bg5.png'},
    {name: 'bg6', url: 'img/bg6.png'},
    {name: 'talk', url: 'img/talk.png'}
];

function loadImage(x, callback) {
    var img = new Image();   // Create new img element
    img.addEventListener("load", function() {
        x.image = img;
        callback(null, x);
    }, false);
    img.src = x.url; // Set source path
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

    var sprites = [
        {
            name: 'sun',
            animate: function () {
               this.x += 1;
               if (this.x > ctx.canvas.width) {
                   this.x = 0;
               }
            },
            x: 0,
            y: 0,
            z: 1,
            w: 1280,
            h: 720,
            image: _.findWhere(images, {name: 'sun'}).image
        },
        {
            name: 'farcloud',
            animate: function () {
               this.x += 2;
               if (this.x > ctx.canvas.width) {
                   this.x = 0;
               }
            },
            x: 0,
            y: 0,
            z: 2,
            w: 1280,
            h: 720,
            image: _.findWhere(images, {name: 'farcloud'}).image
        },
        {
            name: 'bg3',
            animate: function () {},
            x: 0,
            y: 0,
            z: 3,
            w: 1280,
            h: 720,
            image: _.findWhere(images, {name: 'bg3'}).image
        },
        {
            name: 'bg6',
            animate: function () {},
            x: 0,
            y: 0,
            z: 4,
            w: 1280,
            h: 720,
            image: _.findWhere(images, {name: 'bg6'}).image
        },
        {
            name: 'bg4',
            animate: function () {},
            x: 0,
            y: 0,
            z: 5,
            w: 1280,
            h: 720,
            image: _.findWhere(images, {name: 'bg4'}).image
        },
        {
            name: 'bg5',
            animate: function () {},
            x: 0,
            y: 0,
            z: 6,
            w: 1280,
            h: 720,
            image: _.findWhere(images, {name: 'bg5'}).image
        }
    ];

    function animationLoop() {
        var interval = setInterval(function () {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            sprites = _.sortBy(sprites, 'z');
            sprites.forEach(function (s) {
                ctx.drawImage(s.image, s.x, s.y, s.w, s.h);
                s.animate();
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

