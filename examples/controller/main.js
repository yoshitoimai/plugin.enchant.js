// Main
console.log("Hello EnchantJS!!");
var assets = [
];

function gameStart(){// ゲーム画面
    var scene = new Scene();
    core.replaceScene(scene); core.resume();


    // コントローラー
    var ctrl = new Pad(96, 96);
    ctrl.backgroundColor = "blue";
    ctrl.x = scene.width / 2 - ctrl.width / 2;
    ctrl.y = scene.height - ctrl.height - 20;
    scene.addChild(ctrl);

    var centerX = scene.width / 2;
    var centerY = scene.height / 2;
    ctrl.addEventListener(Event.INPUT_UP, function() {
        var labelUp = new Label("↑");
        labelUp.x = centerX;
        labelUp.y = centerY - 10;
        scene.addChild(labelUp);
        labelUp.tl.delay(1);
        labelUp.tl.removeFromScene();
    });
    ctrl.addEventListener(Event.INPUT_LEFT, function() {
        var labelLeft = new Label("←");
        labelLeft.x = centerX - 20;
        labelLeft.y = centerY;
        scene.addChild(labelLeft);
        labelLeft.tl.delay(1);
        labelLeft.tl.removeFromScene();
    });
    ctrl.addEventListener(Event.INPUT_RIGHT, function() {
        var labelRight = new Label("→");
        labelRight.x = centerX + 20;
        labelRight.y = centerY;
        scene.addChild(labelRight);
        labelRight.tl.delay(1);
        labelRight.tl.removeFromScene();
    });
    ctrl.addEventListener(Event.INPUT_DOWN, function() {
        var labelDown = new Label("↓");
        labelDown.x = centerX;
        labelDown.y = centerY + 10;
        scene.addChild(labelDown);
        labelDown.tl.delay(1);
        labelDown.tl.removeFromScene();
    });


}


//==========
//EnchantJS
var core;
enchant();
window.onload = function() {
core = new Core(320, 480);
core.preload(assets);
core.onload = function(){gameStart();};
core.start();
};
