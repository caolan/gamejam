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

function cropImage(img, x, y, w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    return c;
}

function scaleImage(img, ratio) {
    var c = document.createElement('canvas');
    var w = img.width * ratio;
    var h = img.height * ratio;
    c.width = w;
    c.height = h;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
    return c;
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
    {name: 'sun', url: 'resources/environment/bg1.png'},
    {name: 'farcloud', url: 'resources/environment/bg2.png'},
    {name: 'bg3', url: 'resources/environment/bg3.png'},
    {name: 'nearcloud', url: 'resources/environment/bg4.png'},
    {name: 'bg5', url: 'resources/environment/bg5.png'},
    {name: 'bg6', url: 'resources/environment/bg6.png'},
    {name: 'talk', url: 'resources/sprites/display/talk.png'}
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

function getImage(images, name) {
    return _.findWhere(images, {name: name}).image;
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
            image: scaleImage(getImage(images, 'sun'), 2)
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
            image: scaleImage(getImage(images, 'farcloud'), 2)
        },
        {
            name: 'bg3',
            animate: function () {},
            x: 0,
            y: 0,
            z: 3,
            image: scaleImage(getImage(images, 'bg3'), 2)
        },
        {
            name: 'bg6',
            animate: function () {},
            x: 0,
            y: 0,
            z: 4,
            image: scaleImage(getImage(images, 'bg6'), 2)
        },
        {
            name: 'nearcloud',
            animate: function () {
               this.x += 4;
               if (this.x > ctx.canvas.width) {
                   this.x = 0;
               }
            },
            x: 0,
            y: 0,
            z: 5,
            image: scaleImage(getImage(images, 'nearcloud'), 2)
        },
        {
            name: 'nearcloudoffset',
            animate: function () {
               this.x += 4;
               if (this.x > 0) {
                   this.x = -ctx.canvas.width;
               }
            },
            x: -ctx.canvas.width,
            y: 0,
            z: 5,
            image: scaleImage(getImage(images, 'nearcloud'), 2)
        },
        {
            name: 'bg5',
            animate: function () {},
            x: 0,
            y: 0,
            z: 6,
            image: scaleImage(getImage(images, 'bg5'), 2)
        }
    ];

    var talking = {
        name: 'talking',
        counter: 0,
        animate: function () {
            if (speech.speech_detected) {
                this.image = this.frames[Math.floor(this.counter/10)];
                this.counter++;
                if (this.counter >= 20) {
                    this.counter = 0;
                }
            }
            else {
                this.image = this.frames[0];
            }
        },
        x: 1280 - 123,
        y: 0,
        z: 100,
        frames: [
            cropImage(getImage(images, 'talk'), 0, 0, 123, 96),
            cropImage(getImage(images, 'talk'), 123, 0, 123, 96)
        ]
    };

    window.sprites = sprites;

    speech.onstartrecording = function () {
        sprites.push(talking);
    };

    speech.onstoprecording = function () {
        sprites = _.filter(sprites, function (s) {
            return s.name !== 'talking';
        });
    };

    function animationLoop() {
        clear(ctx);
        sprites = _.sortBy(sprites, 'z');
        sprites.forEach(function (s) {
            s.animate();
            //ctx.drawImage(s.image, s.x, s.y, s.w, s.h);
            ctx.drawImage(s.image, s.x, s.y);
        });
    }

    var interval = setInterval(function () {
        animationLoop();
    }, 1000/40);

    animationLoop();

});

