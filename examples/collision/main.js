// Main
console.log("Hello EnchantJS!!");
var assets = [
];

function gameStart(){// ゲーム画面
    var scene = new Scene();
    core.replaceScene(scene); core.resume();


    // グループ
    var hogeGroup = new Group();
    scene.addChild(hogeGroup);
    var fugaGroup = new Group();
    scene.addChild(fugaGroup);

    var frameTime = 100;
    var moveX = 150;
    // hoge 右側に配置
    var hoge = new ExSprite(32, 32);
    hoge.backgroundColor = "red";
    hoge.x = 200;
    hoge.y = 200;
    hogeGroup.addChild(hoge);
    
    // fuga 左側に配置
    var fuga = new ExSprite(32, 32);
    fuga.backgroundColor = "blue";
    fuga.x = 100;
    fuga.y = 200;
    fugaGroup.addChild(fuga);
    fuga.collision = hogeGroup;
    fuga.addEventListener(enchant.Event.COLLISION_START , function(e) {
        dispMessage(scene, "COLLISION_START");
    });
    fuga.addEventListener(enchant.Event.COLLISION_END , function(e) {
        dispMessage(scene, "COLLISION_END");
    });
    
    scene.tl.then(function() {
        hoge.tl.moveBy(moveX * -1, 0, frameTime);
        fuga.tl.moveBy(moveX, 0, frameTime);
    });
    scene.tl.delay(frameTime);
    scene.tl.then(function() {
        hoge.x = 200;
        fuga.x = 100;
        hoge.tl.moveBy(moveX * -1, 0, frameTime);
        fuga.tl.moveBy(moveX, 0, frameTime);
        // ２倍に拡大
        hoge.scale(2, 2);
        fuga.scale(2, 2);
    });
    scene.tl.delay(frameTime);
    scene.tl.then(function() {
        hoge.x = 200;
        fuga.x = 100;
        hoge.tl.moveBy(moveX * -1, 0, frameTime);
        fuga.tl.moveBy(moveX, 0, frameTime);
        // ２倍に拡大
        hoge.scale(0.5, 0.5);
        fuga.scale(0.5, 0.5);
    });
    scene.tl.delay(frameTime);
    scene.tl.then(function() {
        hoge.x = 200;
        fuga.x = 100;
        hoge.tl.moveBy(moveX * -1, 0, frameTime);
        fuga.tl.moveBy(moveX, 0, frameTime);
        // ２倍に拡大
        hoge.addCollisionRectScale(2, 2);
        fuga.addCollisionRectScale(2, 2);
    });

    var touchTest = new ExSprite(32, 32);
    touchTest.backgroundColor = "black";
    touchTest.scale(2, 2);
    touchTest.x = 32;
    touchTest.y = 32;
    scene.addChild(touchTest);
    touchTest.addEventListener(enchant.Event.TOUCH_START , function(e) {
        dispMessage(scene, "TOUCHED");
        console.log("TOUCHED");
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
