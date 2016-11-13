var label;
var dispMessage = function(scene, value) {
    if (!label) {
        label = new Label("");
        label.x = 10;
        label.y = 10;
        scene.addChild(label);
    }
    label.text = value;
    label.tl.delay(10).then(function() {
        label.text = "";
    });
    core.pause();
    setTimeout(function() {
        core.resume();
    }, 1000);
};
