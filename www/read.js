function loadGods() {
    return $.getJSON("resources/sprites/gods/ra/ra.json").then(function (data) {
        return data;
    });
}


function loadSpells() {
    return $.getJSON("resources/sprites/spells/fireball.json").then(function (data) {
        return data;
    });
}


loadGods().done(function (data) {
    console.log(data)
});


loadSpells().done(function (data) {
    var spells = [];
    spells.push(data);
    console.log(spells);
});

