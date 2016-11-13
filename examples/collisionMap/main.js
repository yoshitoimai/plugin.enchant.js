// Main
console.log("Hello EnchantJS!!");

var assets = [
    'map_map.png'
];

function gameStart(){// ゲーム画面
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========

    // マップグループ
    var mapGroup = new Group();
    scene.addChild(mapGroup);
    var playerGroup = new Group();
    scene.addChild(playerGroup);
    // マップ
    var map = new Map(32, 32);
    var surface = new Surface(320, 320);
    map.image = core.assets["map_map.png"];
    createMap();
    mapGroup.addChild(map);

    // プレイヤー
    var warrior = new ExSprite(32, 32);
    warrior.backgroundColor = "red";
    warrior.x = scene.width / 2 - warrior.width / 2;
    warrior.y = 0;
    playerGroup.addChild(warrior);
    
    warrior.addCollision(map);
    warrior.addEventListener(enchant.Event.COLLISION_START , function(e) {
        dispMessage(scene, "COLLISION_START");
    });
    warrior.addEventListener(enchant.Event.COLLISION_END , function(e) {
        dispMessage(scene, "COLLISION_END");
    });

    var speed = 240;
    warrior.tl.moveBy(0, 480, speed);
    warrior.tl.then(function() {
        mapGroup.tl.moveBy(0, -100, 10);
    });
    warrior.tl.moveBy(0, -480, speed);
    warrior.tl.then(function() {
        playerGroup.tl.moveBy(0, 20, 10);
    });
    warrior.tl.moveBy(0, 480, speed);
    warrior.tl.then(function() {
        map.tl.moveBy(0, 50, 10);
    });
    warrior.tl.moveBy(0, -480, speed);
    warrior.tl.then(function() {
        warrior.scale(2, 2);
    });
    warrior.tl.moveBy(0, 480, speed);
    warrior.tl.then(function() {
        warrior.addCollisionRectScale(0.5, 0.5);
    });
    warrior.tl.moveBy(0, -480, speed);

    function createMap() {
        map.loadData([
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0,12, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]);
        map.collisionData = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
    }
    //==========
    // ここまで
    //==========
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
