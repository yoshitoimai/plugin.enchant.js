/**
 * @fileOverview
 * ex.enchant.js
 * @version 2.0.0 (2017/11/22)
 * @requires enchant.js v0.8.0 or later
 * @author Yoshito Imai
 *
 * @description
 * Action Game plugin for enchant.js
 *
 */

/**
 * @namespace
 */
enchant.Event = enchant.Event || {};

/**
 * 衝突が発生する前に発生するイベント。
 */
enchant.Event.BEFORE_COLLISION = 'beforecollision';
/**
 * 衝突が開始したとき発生するイベント。
 */
enchant.Event.COLLISION = 'collision';
/**
 * 衝突が開始したとき発生するイベント。
 */
enchant.Event.COLLISION_START = 'collisionstart';
/**
 * 衝突が終了したとき発生するイベント。
 */
enchant.Event.COLLISION_END = 'collisionend';
/**
 * 衝突している間、１フレーム毎に発生するイベント。
 */
enchant.Event.COLLISION_TICK = 'collisiontick';
/**
 * 左側が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_LEFT = 'collisionleft';
/**
 * 右側が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_RIGHT = 'collisionright';
/**
 * 下端が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_BOTTOM = 'collisionbottom';
/**
 * 上端が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_TOP = 'collisiontop';
/**
 * 左側が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_TO_LEFT = 'collisiontoleft';
/**
 * 右側が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_TO_RIGHT = 'collisiontoright';
/**
 * 下端が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_TO_BOTTOM = 'collisiontobottom';
/**
 * 上端が衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_TO_TOP = 'collisiontotop';
/**
 * 左から衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_FROM_LEFT = 'collisionfromleft';
/**
 * 右から衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_FROM_RIGHT = 'collisionfromright';
/**
 * 下から衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_FROM_BOTTOM = 'collisionfrombottom';
/**
 * 上から衝突したとき発生するイベント。
 */
enchant.Event.COLLISION_FROM_TOP = 'collisionfromtop';

/**
 * Action Game
 * Base class of enchant.Sprite
 * @scope enchant.ex.ExSprite.prototype
 */
// enchant.ex.ExSprite2 = enchant.ex.ExSprite;
// enchant.ex.ExSprite2.prototype._initialize = enchant.ex.ExSprite2.prototype.initialize;
// enchant.ex.ExSprite2.prototype.initialie = function(width, height) {
enchant.Sprite.prototype._initialize = enchant.Sprite.prototype.initialize;
enchant.Sprite.prototype.initialize = function(width, height) {
    this._initialize(width, height);
    // collision
    this._oldX = this._x;
    this._oldY = this._y;
    this._collisionRect;
    this._isCollisionState = false;
    this._isCollision = false;
    this._isCollisionLeft = false;
    this._isCollisionRight = false;
    this._isCollisionTop = false;
    this._isCollisionBottom = false;
    this._collisionObjects = new Array();
    this._collisionIgnoreObjects = new Array();
    this._collisionDuplicateObjects = new Array();
    this._isCollisionIgnore = false;
    // moved
    this._moved = [];
    // history
    this._history = [];
    this._historyOffset = [];
    // collision Based
    this.COLLISION = {
        INTERSECT_BASED: "intersect",
        WITHIN_BASED: "within"
    };
    this._collisionBased = this.COLLISION.INTERSECT_BASED;

    // Event Added to scene
    this.addEventListener(Event.ADDED_TO_SCENE, function(){
        this._oldX = this.x;
        this._oldY = this.y;
        var _rect = this.getOrientedBoundingRect();
        this._historyOffset[0] = _rect.leftTop;
        this._historyOffset[1] = _rect.leftTop;
        this._history[0] = {x:this.x, y:this.y};
        this._history[1] = {x:this.x, y:this.y};
    });

    // for follow
    this.addEventListener(Event.ENTER_FRAME, function(){
        var _rect = this.getOrientedBoundingRect();
        this._moved[0] = _rect.leftTop[0] - this._historyOffset[0][0];
        this._moved[1] = _rect.leftTop[1] - this._historyOffset[0][1];
        //this._historyOffset[0] = _rect.leftTop;
        if (this._historyOffset[0] != _rect.leftTop) {
            this._historyOffset[1] = this._historyOffset[0];
            this._historyOffset[0] = _rect.leftTop;
        }
        if (this._history[0].x != this.x || this._history[0].y != this.y) {
            this._history[1] = this._history[0];
            this._history[0] = {x:this.x, y:this.y};
        }
    });

    // judge collision Target
    this.addEventListener(Event.ENTER_FRAME, function () {
        // collision Sprite
        this.judgeCollision();

        this._oldX = this.x;
        this._oldY = this.y;
    });
};
Object.defineProperty(enchant.Sprite.prototype, "history", {
    get: function() {
        return {
            x: this._history[1].x,
            y: this._history[1].y,
            offsetX: this._historyOffset[1][0],
            offsetY: this._historyOffset[1][1]
        };
    }
});
Object.defineProperty(enchant.Sprite.prototype, "moved", {
    get: function() {
        return {
            x: this.x - this._oldX,
            y: this.y - this._oldY
        };
    }
});
/**
 * 衝突判定の対象を設定します。
 * @type enchant.Sprite | enchant.Group | Array
 */
 Object.defineProperty(enchant.Sprite.prototype, "collision", {
    set: function(value) {
        this._collisionObjects = new Array();
        this._collisionObjects.push(value);
    }
});
/**
 * 衝突の状態を取得します。
 */
 Object.defineProperty(enchant.Sprite.prototype, "isCollision", {
    get: function() {
        return this._isCollision;
    }
});
Object.defineProperty(enchant.Sprite.prototype, "isCollisionLeft", {
    get: function() {
        return this._isCollisionLeft;
    }
});
Object.defineProperty(enchant.Sprite.prototype, "isCollisionRight", {
    get: function() {
        return this._isCollisionRight;
    }
});
Object.defineProperty(enchant.Sprite.prototype, "isCollisionTop", {
    get: function() {
        return this._isCollisionTop;
    }
});
Object.defineProperty(enchant.Sprite.prototype, "isCollisionBottom", {
    get: function() {
        return this._isCollisionBottom;
    }
});
enchant.Node.prototype._isCollisionIgnore = false;
/**
 * 衝突を無視するか取得、設定します
 */
Object.defineProperty(enchant.Node.prototype, "isCollisionIgnore", {
    get: function () {
        return this._isCollisionIgnore;
    },
    set: function (value) {
        this._isCollisionIgnore = value;
    }
});

/**
 * 衝突判定を行うSpriteを追加します。
 * @param {enchant.Sprite | enchant.Group | Array} value 追加するSprite、またはそれを含むオブジェクト。
 */
enchant.Sprite.prototype.addCollision = function(value) {
    this._collisionObjects.push(value);
};
enchant.Sprite.prototype.removeCollision = function(value) {
    if ((i = this._collisionObjects.indexOf(value)) !== -1) {
        this._collisionObjects.splice(i, 1);
    }
};
enchant.Sprite.prototype.addCollisionIgnore = function (value) {
    this._collisionIgnoreObjects.push(value);
};
enchant.Sprite.prototype.removeCollisionIgnore = function(value) {
    if ((i = this._collisionIgnoreObjects.indexOf(value)) !== -1) {
        this._collisionIgnoreObjects.splice(i, 1);
    }
};
enchant.Sprite.prototype._addChildCollisionRect = function(sprite) {
    // remove
    this.addEventListener(Event.REMOVE_TO_SCENE, function(){
        this.removeCollisionRect();
    });
    // add
    if (this.parentNode) {
        this.parentNode.addChild(sprite);
    } else {
        this.addEventListener(Event.ADDED_TO_SCENE, function(){
            this.parentNode.addChild(sprite);
        });
    }
};
enchant.Sprite.prototype._addCollisionRect = function(offsetX, offsetY) {
    this.addEventListener(Event.ENTER_FRAME, function(){
        this._collisionRect._followArg = arguments.callee;
        this._collisionRect.x = this.x + offsetX;
        this._collisionRect.y = this.y + offsetY;
    });
};
enchant.Sprite.prototype.removeCollisionRect = function() {
    if (this._collisionRect) {
        if (this._collisionRect._followArg) {
            this.removeEventListener(Event.ENTER_FRAME, this._collisionRect._followArg);
            this._collisionRect._followArg = null;
        }
        this._collisionRect.remove();
    }
};
enchant.Sprite.prototype.addCollisionRectScale = function(scaleX, scaleY) {
    this.removeCollisionRect();
    this._collisionRect = new Sprite(this.width * scaleX, this.height * scaleY);
    this._collisionRect.isCollisionIgnore = true;
    this._addChildCollisionRect(this._collisionRect);
    this._addCollisionRect(this.width / 2 - this.width * scaleX / 2, this.height / 2 - this.height * scaleY / 2);
};
enchant.Sprite.prototype.addCollisionRectSize = function(width, height, x, y) {
    this.removeCollisionRect();
    this._collisionRect = new Sprite(width, height);
    this._collisionRect.isCollisionIgnore = true;
    this._addChildCollisionRect(this._collisionRect);
    this._addCollisionRect(x || this.width / 2 - width / 2, y || this.height / 2 - height / 2);
};
enchant.Sprite.prototype.judgeCollision = function () {
    this._isCollision = false;
    this._isCollisionLeft = false;
    this._isCollisionRight = false;
    this._isCollisionTop = false;
    this._isCollisionBottom = false;
    if (this._collisionObjects.length > 0) {
        for (var i = 0; i < this._collisionObjects.length; i++) {
            (function (_this, value) {
                if (value instanceof Sprite && value._isContainedInCollection && !value._isCollisionIgnore && !_this._isCollisionIgnore || value instanceof Map) {
                    if (_this._collisionIgnoreObjects.length > 0) {
                        if (_this._collisionIgnoreObjects.some(function (obj) {
                            return obj == value;
                        })) {
                            return;
                        }
                    }
                    _this._judgeCollision(value);
                    var x = _this.x - _this._oldX;
                    var y = _this.y - _this._oldY;
                    var e = new Event(enchant.Event.BEFORE_COLLISION);
                    e.cancel = false;
                    if (x < 0) {
                        for (var i = 0; i >= x; i--) {
                            if (_this._judgeCollision(value, i, 0)) {
                                _this.dispatchEvent(e);
                                if (e.cancel == true) _this.x = _this._oldX + i + 1;
                                break;
                            }
                        }
                    }
                    if (x > 0) {
                        for (var i = 0; i <= x; i++) {
                            if (_this._judgeCollision(value, i, 0)) {
                                _this.dispatchEvent(e);
                                if (e.cancel == true) _this.x = _this._oldX + i - 1;
                                break;
                            }
                        }
                    }
                    if (y < 0) {
                        for (var i = 0; i >= y; i--) {
                            if (_this._judgeCollision(value, 0, i)) {
                                _this.dispatchEvent(e);
                                if (e.cancel == true) _this.y = _this._oldY + i + 1;
                                break;
                            }
                        }
                    }
                    if (y > 0) {
                        for (var i = 0; i <= y; i++) {
                            if (_this._judgeCollision(value, 0, i)) {
                                _this.dispatchEvent(e);
                                if (e.cancel == true) _this.y = _this._oldY + i - 1;
                                break;
                            }
                        }
                    }
                } else if (value instanceof Array) {
                    for (var i = 0; i < value.length; i++) {
                        arguments.callee(_this, value[i]);
                    }
                } else if (value && value.childNodes && value.isCollisionIgnore !== true) {
                    for (var i = 0; i < value.childNodes.length; i++) {
                        arguments.callee(_this, value.childNodes[i]);
                    }
                }
            })(this, this._collisionObjects[i]);
        }
    }
    return this.isCollision;
};
enchant.Sprite.prototype._judgeCollision = function(target, moveX, moveY) {
    if (this === target) return;
    var _moveX = 0;
    var _moveY = 0;
    if (moveX!==undefined) _moveX = moveX;
    if (moveY!==undefined) _moveY = moveY;
    var result = false;
    var thisRect = this._collisionRect ? this._collisionRect : this;
    var targetRect = target._collisionRect ? target._collisionRect : target;
    var _addRect = function(_rect) {
        _rect.center = [
            _rect.leftTop[0] + (_rect.rightTop[0] - _rect.leftTop[0]) / 2,
            _rect.leftTop[1] + (_rect.leftBottom[1] - _rect.leftTop[1]) / 2
        ];
        _rect.left = [
            _rect.leftTop[0],
            _rect.leftTop[1] + (_rect.leftBottom[1] - _rect.leftTop[1]) / 2
        ];
        _rect.right = [
            _rect.rightTop[0],
            _rect.rightTop[1] + (_rect.rightBottom[1] - _rect.rightTop[1]) / 2
        ];
        _rect.top = [
            _rect.leftTop[0] + (_rect.rightTop[0] - _rect.leftTop[0]) / 2,
            _rect.leftTop[1]
        ];
        _rect.bottom = [
            _rect.leftBottom[0] + (_rect.rightBottom[0] - _rect.leftBottom[0]) / 2,
            _rect.leftBottom[1]
        ];
        return _rect;
    };
    var _thisRect = thisRect.getOrientedBoundingRect();
    _thisRect.leftTop[0] += _moveX;
    _thisRect.rightTop[0] += _moveX;
    _thisRect.leftBottom[0] += _moveX;
    _thisRect.rightBottom[0] += _moveX;
    _thisRect.leftTop[1] += _moveY;
    _thisRect.rightTop[1] += _moveY;
    _thisRect.leftBottom[1] += _moveY;
    _thisRect.rightBottom[1] += _moveY;
    _thisRect = _addRect(_thisRect);
    var _targetRect = targetRect.getOrientedBoundingRect();
    _targetRect = _addRect(_targetRect);

    if (target instanceof Map) {
        result = true;
        var _offsetX = targetRect._offsetX;
        var _offsetY = targetRect._offsetY;

        var pos = {};
        pos.center = false;
        if (targetRect.hitTest(_thisRect.center[0] - _offsetX, _thisRect.center[1] - _offsetY)) pos.center = true;
        pos.left = false;
        if (targetRect.hitTest(_thisRect.left[0] - _offsetX, _thisRect.left[1] - _offsetY)) pos.left = true;
        pos.right = false;
        if (targetRect.hitTest(_thisRect.right[0] - _offsetX, _thisRect.right[1] - _offsetY)) pos.right = true;
        pos.top = false;
        if (targetRect.hitTest(_thisRect.top[0] - _offsetX, _thisRect.top[1] - _offsetY)) pos.top = true;
        pos.bottom = false;
        if (targetRect.hitTest(_thisRect.bottom[0] - _offsetX, _thisRect.bottom[1] - _offsetY)) pos.bottom = true;
        pos.topleft = false;
        if (targetRect.hitTest(_thisRect.leftTop[0] - _offsetX, _thisRect.leftTop[1] - _offsetY)) pos.topleft = true;
        pos.topright = false;
        if (targetRect.hitTest(_thisRect.rightTop[0] - _offsetX, _thisRect.rightTop[1] - _offsetY)) pos.topright = true;
        pos.bottomleft = false;
        if (targetRect.hitTest(_thisRect.leftBottom[0] - _offsetX, _thisRect.leftBottom[1] - _offsetY)) pos.bottomleft = true;
        pos.bottomright = false;
        if (targetRect.hitTest(_thisRect.rightBottom[0] - _offsetX, _thisRect.rightBottom[1] - _offsetY)) pos.bottomright = true;

        target.collisionTile = null;
        // Center
        if (pos.center) {
            target.collisionTile = targetRect.checkTile(_thisRect.leftTop[0] - _offsetX, _thisRect.leftTop[1] - _offsetY);
        // TopLeft
        } else if (pos.topleft) {
            target.collisionTile = targetRect.checkTile(_thisRect.leftTop[0] - _offsetX, _thisRect.leftTop[1] - _offsetY);
        // TopRight
        } else if (pos.topright) {
            target.collisionTile = targetRect.checkTile(_thisRect.rightTop[0] - _offsetX, _thisRect.rightTop[1] - _offsetY);
        // BottomLeft
        } else if (pos.bottomleft) {
            target.collisionTile = targetRect.checkTile(_thisRect.leftBottom[0] - _offsetX, _thisRect.leftBottom[1] - _offsetY);
        // BottomRight
        } else if (pos.bottomright) {
            target.collisionTile = targetRect.checkTile(_thisRect.rightBottom[0] - _offsetX, _thisRect.rightBottom[1] - _offsetY);
        } else {
            result = false;
        }
        if (result) {
            this._isCollision = true;
            target._isCollisionState = true;
            this._dispatchEventCollision(target, true);
            // Left
            if (pos.left) {
                this._isCollisionLeft = true;
                this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_LEFT);
            }
            // Right
            if (pos.right) {
                this._isCollisionRight = true;
                this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_RIGHT);
            }
            // Top
            if (pos.top) {
                this._isCollisionTop = true;
                this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TOP);
            }
            // Bottom
            if (pos.bottom) {
                this._isCollisionBottom = true;
                this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_BOTTOM);
            }
            return true;
        }
    } else {
        if (this._collisionBased == this.COLLISION.INTERSECT_BASED) {
            result = thisRect.intersectStrict(targetRect);
        } else {
            result = thisRect.within(targetRect, (thisRect.width + thisRect.height) / 4 + (targetRect.width + targetRect.height) / 4);
        }
        if (result) {
            this._isCollision = true;
            target._isCollisionState = true;
            this._dispatchEventCollision(target, true);
            // left
            if (_targetRect.leftTop[0] < _thisRect.left[0] && _thisRect.left[0] < _targetRect.rightTop[0] &&
                _targetRect.leftBottom[1] < _thisRect.left[1] && _thisRect.left[1] < _targetRect.rightBottom[1]) {
                    this._isCollisionLeft = true;
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_LEFT);
                }
            // right
            if (_targetRect.leftTop[0] < _thisRect.right[0] && _thisRect.right[0] < _targetRect.rightTop[0] &&
                _targetRect.leftBottom[1] < _thisRect.right[1] && _thisRect.right[1] < _targetRect.rightBottom[1]) {
                    this._isCollisionRight = true;
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_RIGHT);
                }
            // top
            if (_targetRect.leftTop[0] < _thisRect.top[0] && _thisRect.top[0] < _targetRect.rightTop[0] &&
                _targetRect.leftBottom[1] < _thisRect.top[1] && _thisRect.top[1] < _targetRect.rightBottom[1]) {
                    this._isCollisionTop = true;
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TOP);
                }
            // bottom
            if (_targetRect.leftTop[0] < _thisRect.bottom[0] && _thisRect.bottom[0] < _targetRect.rightTop[0] &&
                _targetRect.leftBottom[1] < _thisRect.bottom[1] && _thisRect.bottom[1] < _targetRect.rightBottom[1]) {
                    this._isCollisionBottom = true;
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_BOTTOM);
                }
            if (this._moved[0] < 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TO_LEFT);
            if (this._moved[0] > 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TO_RIGHT);
            if (this._moved[1] < 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TO_TOP);
            if (this._moved[1] > 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TO_BOTTOM);
            if (target._moved) {
                if (target._moved[0] > 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_FROM_LEFT);
                if (target._moved[0] < 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_FROM_RIGHT);
                if (target._moved[1] > 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_FROM_TOP);
                if (target._moved[1] < 0) this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_FROM_BOTTOM);
            }
            return true;
        }
    }
    target._isCollisionState = false;
    this._dispatchEventCollision(target, false);
    return false;
};
enchant.Sprite.prototype._dispatchEventCollision = function(target, isCollision) {
    var e;
    var existCount = this._collisionDuplicateObjects.indexOf(target);
    if (isCollision) {
        if (existCount < 0) {
            this._dispatchEventMakeCollision(target, enchant.Event.COLLISION);
            this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_START);
            this._collisionDuplicateObjects.push(target);
        }
        this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TICK);
    } else {
        if (existCount >= 0) {
            //ターゲットとの衝突がなくなったとき
            this._collisionDuplicateObjects.splice(existCount);
            this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_END);
        }
    }
};
enchant.Sprite.prototype._dispatchEventMakeCollision = function(target, collisionName) {
    e = new Event(collisionName);
    e.collision = {};
    e.collision.target = target;
    e.collisionTarget = target;
    this.dispatchEvent(e);
};
enchant.Sprite.prototype.setCollisionIntersectBased = function() {
    this._collisionBased = this.COLLISION.INTERSECT_BASED;
};
enchant.Sprite.prototype.setCollisionWithinBased = function() {
    this._collisionBased = this.COLLISION.WITHIN_BASED;
};
enchant.ex = {};
enchant.ex.ExSprite = enchant.Sprite;

/**
 * ActionSprite
 */
enchant.ActionSprite = enchant.Class.create(enchant.Sprite, {
    initialize: function (width, height) {
        this.childNodes = [];
        enchant.Sprite.call(this, width, height);
        // gravity
        this._gx = this._gy = 0;
        // velocity
        this._vx = this._vy = 0;
        // max velocity
        this._max = this._may = null;
        // damping
        this._dx = this._dy = null;

        this._sensorWidth = this.width - 4;
        this._sensorHeight = this.height - 4;

        var colliderGroup = new Group();
        colliderGroup.isCollisionIgnore = true;
        var bounds = {
            inner: {},
            outer: {},
        }
        bounds.outer.top = new Sprite(this._sensorWidth, 1);
        bounds.outer.top.centerX = this.width / 2;
        bounds.outer.top.y = -bounds.outer.top.height;
        colliderGroup.addChild(bounds.outer.top);
        bounds.inner.top = new Sprite(this._sensorWidth, 1);
        bounds.inner.top.centerX = this.width / 2;
        bounds.inner.top.y = 0;
        bounds.inner.top.addCollisionIgnore(this);
        colliderGroup.addChild(bounds.inner.top);
        bounds.outer.bottom = new Sprite(this._sensorWidth, 1);
        bounds.outer.bottom.centerX = this.width / 2;
        bounds.outer.bottom.y = this.height;
        colliderGroup.addChild(bounds.outer.bottom);
        bounds.inner.bottom = new Sprite(this._sensorWidth, 1);
        bounds.inner.bottom.centerX = this.width / 2;
        bounds.inner.bottom.y = this.height - bounds.inner.bottom.height;
        bounds.inner.bottom.addCollisionIgnore(this);
        colliderGroup.addChild(bounds.inner.bottom);
        bounds.outer.left = new Sprite(1, this._sensorHeight);
        bounds.outer.left.x = -bounds.outer.left.width;
        bounds.outer.left.centerY = this.height / 2;
        colliderGroup.addChild(bounds.outer.left);
        bounds.inner.left = new Sprite(1, this._sensorHeight);
        bounds.inner.left.x = 0;
        bounds.inner.left.centerY = this.height / 2;
        bounds.inner.left.addCollisionIgnore(this);
        colliderGroup.addChild(bounds.inner.left);
        bounds.outer.right = new Sprite(1, this._sensorHeight);
        bounds.outer.right.x = this.width;
        bounds.outer.right.centerY = this.height / 2;
        colliderGroup.addChild(bounds.outer.right);
        bounds.inner.right = new Sprite(1, this._sensorHeight);
        bounds.inner.right.x = this.width - bounds.inner.right.width;
        bounds.inner.right.centerY = this.height / 2;
        bounds.inner.right.addCollisionIgnore(this);
        colliderGroup.addChild(bounds.inner.right);
        this.bounds = bounds;
        this._colliderGroup = colliderGroup;
        [enchant.Event.ADDED_TO_SCENE, enchant.Event.REMOVED_FROM_SCENE]
            .forEach(function (event) {
                this.addEventListener(event, function (e) {
                    this.childNodes.forEach(function (child) {
                        child.scene = this.scene;
                        child.dispatchEvent(e);
                    }, this);
                });
            }, this);
        this.addChild(this._colliderGroup);
        var core = enchant.Core.instance;
        this._updateMotionBound = this._updateMotion.bind(this);
        this._adjustOverlapBound = this._adjustOverlap.bind(this);
        // 速度に応じて移動
        core.on(Event.EXIT_FRAME, this._updateMotionBound);
        // めり込み補正
        core.on(Event.EXIT_FRAME, this._adjustOverlapBound);
        // 削除されたとき
        this.addEventListener(Event.REMOVED, function () {
            core.removeEventListener(Event.EXIT_FRAME, this._updateMotionBound);
            core.removeEventListener(Event.EXIT_FRAME, this._adjustOverlapBound);
        });
    },
    _updateMotion() {
        // X軸方向加速度加算
        if (this._max === null ||
            this._gx > 0 && this._vx < this._max ||
            this._gx < 0 && this._vx < this._max
        ) this._vx += this._gx;
        // Y軸方向加速度加算
        if (this._may === null ||
            this._gy > 0 && this._vy < this._may ||
            this._gy < 0 && this._vy < this._may
        ) this._vy += this._gy;
        // X軸方向の速度加算（左右非接触時）
        if (this._vx < 0 && !this.bounds.outer.left.judgeCollision()) {
            for (var i = 0; i < Math.abs(this._vx) * 2; i++) {
                this.x += Math.sign(this._vx) * 0.5;
                if (this.bounds.outer.left.judgeCollision()) break;
            }
        }
        else if (this._vx > 0 && !this.bounds.outer.right.judgeCollision()) {
            for (var i = 0; i < Math.abs(this._vx) * 2; i++) {
                this.x += Math.sign(this._vx) * 0.5;
                if (this.bounds.outer.right.judgeCollision()) break;
            }
        } else {
            this._vx = 0;
        }
        // Y軸方向の速度加算（上下非接触時）
        if (this._vy < 0 && !this.bounds.outer.top.judgeCollision()) {
            for (var i = 0; i < Math.abs(this._vy) * 2; i++) {
                this.y += Math.sign(this._vy) * 0.5;
                if (this.bounds.outer.top.judgeCollision()) break;
            }
        }
        else if (this._vy > 0 && !this.bounds.outer.bottom.judgeCollision()) {
            for (var i = 0; i < Math.abs(this._vy) * 2; i++) {
                this.y += Math.sign(this._vy) * 0.5;
                if (this.bounds.outer.bottom.judgeCollision()) break;
            }
        } else {
            this._vy = 0;
        }
        // 減衰
        if (this._gx === 0) this._vx = this._damping(this._vx, this._dx);
        if (this._gy === 0) this._vy = this._damping(this._vy, this._dy);
    },
    _adjustOverlap() {
        if (this.age == 0) return;
        var maxIterations = 200;
        var iterations = 0;
        var lastPosition = { x: this.x, y: this.y };
        var stuckCount = 0;
        while (iterations < maxIterations) {
            iterations++;
            if (Math.abs(this.x - lastPosition.x) < 0.01 && Math.abs(this.y - lastPosition.y) < 0.01) {
                stuckCount++;
                if (stuckCount > 10) break;
            } else {
                stuckCount = 0;
                lastPosition = { x: this.x, y: this.y };
            }
            var c = {
                i: {
                    t: this.bounds.inner.top.judgeCollision(),
                    b: this.bounds.inner.bottom.judgeCollision(),
                    l: this.bounds.inner.left.judgeCollision(),
                    r: this.bounds.inner.right.judgeCollision(),
                },
                o: {
                    t: this.bounds.outer.top.judgeCollision(),
                    b: this.bounds.outer.bottom.judgeCollision(),
                    l: this.bounds.outer.left.judgeCollision(),
                    r: this.bounds.outer.right.judgeCollision(),
                }
            }
            if (c.i.t && !c.o.b) this.y += 0.5;
            if (c.i.b && !c.o.t) this.y -= 0.5;
            if (c.i.l && !c.o.r) this.x += 0.5;
            if (c.i.r && !c.o.l) this.x -= 0.5;
            if (this.x === lastPosition.x && this.y === lastPosition.y) break;
        }
    },
    _dirty: {
        get: function () {
            return this.__dirty;
        },
        set: function (dirty) {
            dirty = !!dirty;
            this.__dirty = dirty;
            if (dirty) {
                for (var i = 0, l = this.childNodes.length; i < l; i++) {
                    this.childNodes[i]._dirty = true;
                }
            }
        }
    },
    addChild: function (node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        this.childNodes.push(node);
        node.parentNode = this;
        var childAdded = new enchant.Event('childadded');
        childAdded.node = node;
        childAdded.next = null;
        this.dispatchEvent(childAdded);
        node.dispatchEvent(new enchant.Event('added'));
        if (this.scene) {
            node.scene = this.scene;
            var addedToScene = new enchant.Event('addedtoscene');
            node.dispatchEvent(addedToScene);
        }
    },
    removeChild: function (node) {
        var i;
        if ((i = this.childNodes.indexOf(node)) !== -1) {
            this.childNodes.splice(i, 1);
            node.parentNode = null;
            var childRemoved = new enchant.Event('childremoved');
            childRemoved.node = node;
            this.dispatchEvent(childRemoved);
            node.dispatchEvent(new enchant.Event('removed'));
            if (this.scene) {
                node.scene = null;
                var removedFromScene = new enchant.Event('removedfromscene');
                node.dispatchEvent(removedFromScene);
            }
        }
    },
    _damping(v, d) {
        if (d === null) {
            v = 0;
        }
        else {
            if (v > 0) {
                v = Math.max(v - d, 0);
            } else if (v < 0) {
                v = Math.min(v + d, 0);
            }
        }
        return v;
    },
    gx: {
        get: function () { return this._gx; },
        set: function (gx) { this._gx = gx; }
    },
    gy: {
        get: function () { return this._gy; },
        set: function (gy) { this._gy = gy; }
    },
    vx: {
        get: function () { return this._vx; },
        set: function (vx) { this._vx = vx; }
    },
    vy: {
        get: function () { return this._vy; },
        set: function (vy) { this._vy = vy; }
    },
    setGravityX(gravityX) {
        this._gx = gravityX;
    },
    setGravityY(gravityY) {
        this._gy = gravityY;
    },
    setGravity(gravityX, gravityY) {
        this.setGravityX(gravityX);
        this.setGravityY(gravityY);
    },
    setMaxAccelerationX(maxAccelerationX) {
        this._max = maxAccelerationX;
    },
    setMaxAccelerationY(maxAccelerationY) {
        this._may = maxAccelerationY;
    },
    setMaxAcceleration(maxAccelerationX, maxAccelerationY) {
        this.setMaxAccelerationX(maxAccelerationX);
        this.setMaxAccelerationY(maxAccelerationY);
    },
    setDampingX(dampingX = null) {
        this._dx = dampingX;
    },
    setDampingY(dampingY = null) {
        this._dy = dampingY;
    },
    setDamping(dampingX = null, dampingY = null) {
        this.setDampingX(dampingX);
        this.setDampingY(dampingY);
    },
    addPhysicsObject(target) {
        this._colliderGroup.childNodes.forEach(function (child) {
            child.addCollision(target);
        });
    },
});