var game = {
    state: 'title'
};

var commands = FuzzySet();
commands.add('spellcasting');
//commands.add('summoning');
//commands.add('dismiss');

var spellset = FuzzySet();
/*
spells.add('arrow');
spells.add('banana');
spells.add('bees');
spells.add('brick');
spells.add('chair');
*/
spellset.add('chicken');
/*
spells.add('fireball');
spells.add('flower');
spells.add('ham');
spells.add('hands');
spells.add('ice');
spells.add('moose');
spells.add('nuke');
spells.add('octopus');
spells.add('plantpot');
spells.add('sheep');
spells.add('shoelaces');
spells.add('snakes');
spells.add('song');
spells.add('spanner');
spells.add('swords');
*/
spellset.add('walrus');
/*
spells.add('water');
*/

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
    //var firstpair = str.split(' ').slice(0, 2).join(' ');
    //var rest = str.split(' ').slice(1).join(' ');

    var words = str.split(' ');
    var last_word = words[words.length-1];

    //var command = pickItem(commands, firstpair);
    //if (command === 'spellcasting') {
        return ['spellcasting', pickItem(spellset, last_word)];
    //}
    //else if (command === 'summoning') {
    //    return ['summoning', pickItem(summons, rest)];
    //}
    //else {
    //    return [command];
    //}
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
    if (!ratio) {
        throw new Error('scaleImage with invalid ratio: ' + ratio);
    }
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


var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// TODO: title text is bg7
var images = [
    {name: 'sun', url: 'resources/environment/bg1.png'},
    {name: 'farcloud', url: 'resources/environment/bg2.png'},
    {name: 'bg3', url: 'resources/environment/bg3.png'},
    {name: 'nearcloud', url: 'resources/environment/bg4.png'},
    {name: 'bg5', url: 'resources/environment/bg5.png'},
    {name: 'bg6', url: 'resources/environment/bg6.png'},
    {name: 'level_terrain', url: 'resources/environment/level_terrain.png'},
    {name: 'talk', url: 'resources/sprites/display/talk.png'},
    {name: 'helmet1', url: 'resources/sprites/helmet1.png'},
    {name: 'spookyscaryskeleton1', url: 'resources/sprites/spookyscaryskeleton1.png'},
    {name: 'snakeguy1', url: 'resources/sprites/snakeguy1.png'},
    {name: 'lifebar', url: 'resources/sprites/display/lifebar.png'},
    {name: 'walrus', url: 'resources/sprites/spells/walrus.png'},
    {name: 'chicken', url: 'resources/sprites/spells/chicken.png'},
    {name: 'player1select', url: 'resources/sprites/display/player1select.png'},
    {name: 'player2select', url: 'resources/sprites/display/player2select.png'},
    {name: 'player1wins', url: 'resources/environment/DeathstateHelmetwin.png'},
    {name: 'player2wins', url: 'resources/environment/DeathstateSnakewin.png'}
];


function loadSpells(callback) {
    return $.getJSON("resources/sprites/spells/spells.json", function (data) {
        async.map(data.spells, loadSpell, function (err, spells) {
            if (err) {
                return alert(err);
            }
            spells.forEach(function (spell) {
                spellset.add(spell.name);
            });
            callback(err, spells);
        });
    });
}

function loadSound(url, callback) {
    var audio = document.createElement('audio');
    $(audio).on('canplaythrough', function () {
        callback(null, audio);
    });
    audio.src = url;
    audio.load();
}

var loadSpell = function (spell, callback) {
    loadSpellImage(spell, function (err, spell) {
        if (err) {
            return callback(err);
        }
        loadSpellSound(spell, function (err, spell) {
            if (err) {
                return callback(err);
            }
            return callback(null, spell);
        });
    });
};

function loadSpellSound(spell, callback) {
    if (spell.startsound) {
        var url = 'resources/sprites/spells/' + spell.startsound;
        loadSound(url, function (err, audio) {
            spell.startsound = audio;
        });
    }
    if (spell.endsound) {
        var url = 'resources/sprites/spells/' + spell.endsound;
        loadSound(url, function (err, audio) {
            spell.endsound = audio;
        });
    }
    callback(null, spell);
}

function loadSpellImage(spell, callback) {
    var img = new Image();   // Create new img element
    img.addEventListener("load", function() {
        spell.image = img;
        callback(null, spell);
    }, false);
    img.src = 'resources/sprites/spells/' + spell.image; // Set source path
}

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

function getSpellImage(spells, name) {
    return _.findWhere(spells, {name: name}).image;
}

function getVelocity(spell, fromx, tox) {
    if (spell.startsound) {
        var frames = spell.startsound.duration / 25 * 1000
        var distance = Math.abs(tox - fromx)
        var v = distance/frames
        return v
    }
    else {
        return 10
    }
}

function createSpellSprite(spells, name, fromx, fromy, tox, toy, after) {

    var spell = _.findWhere(spells, {name:name})
    var v = getVelocity(spell, fromx, tox);
    return {
        name: name,
        image: scaleImage(getSpellImage(spells, name), 4),
        x: fromx,
        y: fromy,
        after: after,
        animate: function () {
            var offset = 40;
            if (this.x === tox && this.y === toy) {
                this.destroy = true;
                if (this.after) {
                    this.after();
                }
            }
            else {
                if (this.x <= tox - offset) {
                    this.x += v;
                }
                else if (this.x >= tox + offset) {
                    this.x -= v;
                }
                else {
                    this.x = tox;
                }
                if (this.y < toy - offset) {
                    this.y += v;
                }
                else if (this.y >= toy + offset) {
                    this.y -= v;
                }
                else {
                    this.y = toy;
                }
            }
        }
    };
}


function gameInit() {
    loadSpells(function (err, spells)  {
        if (err) {
            return alert(err);
        }
        async.map(images, loadImage, function (err, images) {
            if (err) {
                return alert(err);
            }
            gameReady(images, spells);
        });
    });
}


function baseSprites(images) {
    var vscale = 0.1;

    return [
        {
            name: 'sun',
            animate: function () {
               this.x += this.vx * vscale;
               this.y += this.vy * vscale;
               if (this.y < -200) {
                   this.x = -100;
                   this.y = ctx.canvas.height/2.0;
               }
            },
            x: -100,
            y: -200,
            z: 1,
            vx: 1,
            vy: -2,
            xr: 0.0,
            yr: 0.0,
            image: scaleImage(getImage(images, 'sun'), 2)
        },
        {
            name: 'farcloud',
            animate: function () {
               this.x += this.vx * vscale;
               if (this.x > ctx.canvas.width) {
                   this.x = 0;
               }
            },
            x: 0,
            y: 0,
            z: 2,
            vx: 2,
            xr: 1.0,
            yr: 0.0,
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
               this.x += this.vx * vscale;
               if (this.x > ctx.canvas.width) {
                   this.x = 0;
               }
            },
            x: 0,
            y: 0,
            z: 5,
            vx: 4,
            xr: 1.0,
            yr: 0.0,
            image: scaleImage(getImage(images, 'nearcloud'), 2)
        },
        {
            name: 'bg5',
            animate: function () {},
            x: 0,
            y: 0,
            z: 8,
            image: scaleImage(getImage(images, 'bg5'), 2)
        },
        {
            name: 'level_terrain',
            animate: function () {},
            x: 0,
            y: 0,
            z: 9,
            image: scaleImage(getImage(images, 'level_terrain'), 2)
        }
    ];
}

function playerSprites(images, playerone, playertwo) {
    return [
        {
            name: 'playerone',
            animate: function () {},
            x: playerone.left,
            y: playerone.top,
            z: 7,
            image: scaleImage(getImage(images, 'helmet1'), 8*2)
        },
        {
            name: 'playertwo',
            animate: function () {},
            x: playertwo.left,
            y: playertwo.top,
            z: 7,
            image: scaleImage(getImage(images, 'snakeguy1'), 8*2)
        },
        {
            name: 'lifebarone',
            animate: function () {
                var i = Math.max(24 - Math.floor((playerone.health/100) * 24), 0);
                if (i > this.frames.length-1) {
                    i = this.frames.length-1;
                }
                this.image = this.frames[i];
            },
            x: 50,
            y: 20,
            z: 20,
            frames: [
                // 24 stages
                cropImage(getImage(images, 'lifebar'), 0, 0, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*2, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*3, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*4, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*5, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*6, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*7, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*8, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*9, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*10, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*11, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*12, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*13, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*14, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*15, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*16, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*17, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*18, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*19, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*20, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*21, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*22, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*23, 256, 64)
            ]
        },
        {
            name: 'lifebartwo',
            animate: function () {
                var i = Math.max(23 - Math.floor((playertwo.health/100) * 23), 0);
                if (i > this.frames.length-1) {
                    i = this.frames.length-1;
                }
                this.image = this.frames[i];
            },
            x: 1280 - 50 - 256,
            y: 20,
            z: 20,
            frames: [
                // 24 stages
                cropImage(getImage(images, 'lifebar'), 0, 0, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*2, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*3, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*4, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*5, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*6, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*7, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*8, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*9, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*10, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*11, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*12, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*13, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*14, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*15, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*16, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*17, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*18, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*19, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*20, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*21, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*22, 256, 64),
                cropImage(getImage(images, 'lifebar'), 0, 64*23, 256, 64)
            ]
        }
    ];
}


function talkingSprite(images) {
    return {
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
        y: 720 - 96,
        z: 100,
        frames: [
            cropImage(getImage(images, 'talk'), 0, 0, 123, 96),
            cropImage(getImage(images, 'talk'), 123, 0, 123, 96)
        ]
    };
}


function gameReady(images, spells) {

    $('#loading-text').hide();

    var playerone = {
        number: 1,
        top: 0,
        left: 100,
        fromx: 180,
        tox: 180 + (24 * 4),
        health: 100
    };

    var playertwo = {
        number: 2,
        top: 0,
        left: 1280 - 100 - (24 * 16),
        tox: 1280 - 180 - (24 * 6),
        fromx: 1280 - 180 - (24 * 4),
        health: 100
    };

    var currentplayer = playerone;
    var nextplayer = playertwo;

    var sprites = baseSprites(images);
    sprites = sprites.concat(playerSprites(images, playerone, playertwo));

    var talking = talkingSprite(images);

    var player1select = {
        name: 'player1select',
        image: getImage(images, 'player1select'),
        animate: function () {
           this.y += this.vy * 1;
           if (this.y > ctx.canvas.height) {
               this.y = 0;
           }
        },
        x: 0,
        y: 0,
        z: 6,
        vy: 2,
        xr: 0.0,
        yr: 1.0,
    };

    var player2select = {
        name: 'player2select',
        image: getImage(images, 'player2select'),
        animate: function () {
           this.y += this.vy * 1;
           if (this.y > ctx.canvas.height) {
               this.y = 0;
           }
        },
        x: 0,
        y: 0,
        z: 6,
        vy: 2,
        xr: 0.0,
        yr: 1.0,
    };

    var player1wins = {
        name: 'player1wins',
        image: scaleImage(getImage(images, 'player1wins'), 2),
        x: 0,
        y: 0,
        z: 1000
    };

    var player2wins = {
        name: 'player2wins',
        image: scaleImage(getImage(images, 'player2wins'), 2),
        x: 0,
        y: 0,
        z: 1000
    };

    function removeSprite(name) {
        sprites = _.filter(sprites, function (s) {
            return s.name !== name;
        });
    }

    speech.onstartrecording = function () {
        sprites.push(talking);
    };

    speech.onstoprecording = function () {
        removeSprite('talking');
    };

    var recording_disabled = true;

    function enableRecording() {
        recording_disabled = false;
        $('.speech-help').show();
    }
    function disableRecording() {
        recording_disabled = true;
        $('.speech-help').hide();
    }

    function clearPlayerSelect() {
        removeSprite('player1select');
        removeSprite('player2select');
        disableRecording();
    }

    function selectCurrentPlayer() {
        clearPlayerSelect();
        if (currentplayer.number === 1) {
            sprites.push(player1select);
        }
        else {
            sprites.push(player2select);
        }
        enableRecording();
    }

    document.onkeypress = function (ev) {
        // spacebar
        if (ev.keyCode === 32) {
            ev.preventDefault();
            if (game.state === 'finished') {
                $('#credits').show();
                game.state === 'credits';
            }
            if (game.state === 'credits') {
                return window.location.reload(false);
            }
            if (speech.recording) {
                speech.stop();
            }
            else {
                if (recording_disabled) {
                    // don't start listening for new spell yet
                    return;
                }
                speech.listen(function (err, str) {
                    var cmd = parseCommand(str);
                    if (cmd[0] === 'spellcasting') {
                        disableRecording();
                        clearPlayerSelect();
                        var spell = _.findWhere(spells, {name: cmd[1]});
                        if (spell.startsound) {
                            spell.startsound.play();
                        }
                        sprites.push(
                            createSpellSprite(
                                spells, spell.name,
                                currentplayer.fromx, currentplayer.top + 200,
                                nextplayer.tox, nextplayer.top + 200,
                                function after() {
                                    var dmg = spell.magnitude * Math.random() * 3;
                                    console.log("Damage:" + dmg);
                                    nextplayer.health -= dmg;
                                    if (spell.endsound) {
                                        spell.endsound.play();
                                    }
                                    if (nextplayer.health < 0) {
                                        nextplayer.health = 0;
                                        game.state = 'finished';
                                        disableRecording();
                                        if (currentplayer.number === 1) {
                                            sprites.push(player1wins);
                                        }
                                        else {
                                            sprites.push(player2wins);
                                        }
                                        $('#gameover-text #winner').text('Player ' + currentplayer.number + ' wins');
                                        $('#gameover-text').show();
                                        $('.speech-help').hide();
                                    }
                                    else {
                                        var tmpplayer = nextplayer;
                                        nextplayer = currentplayer;
                                        currentplayer = tmpplayer;
                                        selectCurrentPlayer();
                                    }
                                }
                            )
                        );
                    }
                });
            }
            return;
        }
    };

    function animationLoop() {
        clear(ctx);
        sprites = _.sortBy(sprites, 'z');
        sprites = _.filter(sprites, function (s) {
            return !s.destroy;
        });
        sprites.forEach(function (s) {
            if (s.animate) {
                s.animate();
            }
            ctx.drawImage(s.image, s.x, s.y);
            if (s.xr || s.yr) {
                nx = s.xr?s.x - s.image.width * s.xr : s.x;
                ny = s.yr?s.y - s.image.height * s.yr : s.y;
                ctx.drawImage(s.image, nx, ny);
            }
        });
    }

    var interval = setInterval(function () {
        animationLoop();
    }, 1000/40);

    selectCurrentPlayer();
    enableRecording();
    animationLoop();

}

gameInit();
