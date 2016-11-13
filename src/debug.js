    var dispMessage = function(scene, value) {
        var label = new Label(value);
        label.x = 10;
        label.y = 10;
        scene.addChild(label);
        label.tl.delay(10).then(function() {
            label.remove();
        });
        core.pause();
        setTimeout(function() {
            core.resume();
        }, 1000);
    };
