function loadGods() {
    return $.getJSON("resources/sprites/gods/ra/ra.json").then(function (data) {
        return data;
    });
}

loadGods().done(function (data) {
    console.log(data)
});
