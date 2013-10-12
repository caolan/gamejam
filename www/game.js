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

game.handleSpeech = function (str) {
    var firstpair = str.split(' ').slice(0, 2).join(' ');
    console.log(['firstpair', firstpair]);
    console.log(['commands.get(firstpair)', commands.get(firstpair)]);
    var m = commands.get(firstpair);
    var command = m ? m[0][1]: 'Spellcasting';

    if (command === 'Spellcasting') {
        var rest = str.split(' ').slice(1).join(' ');
        console.log(['rest', rest]);
        console.log(['spells.get(rest)', spells.get(rest)]);
        var m2 = spells.get(rest);
        var spell = m2 ? m2[0][1]: 'unknown';
        alert('SPELLCASTING: ' + spell);
    }
    else {
        alert(command);
    }
};
