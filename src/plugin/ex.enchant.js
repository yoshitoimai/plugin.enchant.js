/**
 * @fileOverview
 * ex.enchant.js
 * @version 1.0.0 (2016/11/12)
 * @requires enchant.js v0.8.0 or later
 * @author Yoshito Imai
 *
 * @description
 * Action Game plugin for enchant.js
 *
 */

/**
 * ex namespace object
 * @type {Object}
 */
enchant.ex = {};

/**
 * @namespace
 */
enchant.Event = enchant.Event || {};

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
enchant.ex.ExSprite = enchant.Class.create(enchant.Sprite, {
    /**
     * @name enchant.ex.ExSprite
     * @class
     * Constructor of ExSprite
     * @param {Integer} width Spriteの横幅.
     * @param {Integer} height Spriteの高さ.
     * @constructs
     * @extends enchant.Sprite
     */
    initialize: function(width, height){
        enchant.Sprite.call(this, width, height);

        // Event arguments
        this._followArg;
        // collision
        this._collisionRect;
        this._isCollisionState = false;
        this._isCollision = false;
        this._isCollisionLeft = false;
        this._isCollisionRight = false;
        this._isCollisionTop = false;
        this._isCollisionBottom = false;
        this._collisionObjects = new Array();;
        this._collisionDuplicateObjects = new Array();
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
        // forrow Based
        this.FORROW = {
            ABSOLUTE_BASED: "absolute",
            RELATIVE_BASED: "relative"
        };
        this._forrowBased = this.FORROW.RELATIVE_BASED;

        // Event Added to scene
        this.addEventListener(Event.ADDED_TO_SCENE, function(){
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
        this.addEventListener(Event.ENTER_FRAME, function(){
            this._isCollision = false;
            this._isCollisionLeft = false;
            this._isCollisionRight = false;
            this._isCollisionTop = false;
            this._isCollisionBottom = false;
            // collision Sprite
            if (this._collisionObjects.length > 0) {
                for (var i = 0; i < this._collisionObjects.length; i++) {
                    (function(_this, value) {
                        if (value instanceof Sprite && value._isContainedInCollection && !value.isCollisionIgnore || value instanceof Map) {
                            _this._judgeCollision(value);
                        } else if (value instanceof Array) {
                            for (var i = 0; i < value.length; i++) {
                                arguments.callee(_this, value[i]);
                            }
                        } else if (value instanceof Group) {
                            for (var i = 0; i < value.childNodes.length; i++) {
                                arguments.callee(_this, value.childNodes[i]);
                            }
                        }
                    })(this, this._collisionObjects[i]);
                }
            }
        });

    },
    history: {
        get: function() {
            return {
                x: this._history[1].x,
                y: this._history[1].y,
                offsetX: this._historyOffset[1][0],
                offsetY: this._historyOffset[1][1]
            };
        }
    },
    /**
     * 衝突判定の対象を設定します。
     * @type enchant.Sprite | enchant.Group | Array
     */
    collision: {
        set: function(value) {
            this._collisionObjects = new Array();
            this._collisionObjects.push(value);
        }
    },
    /**
     * 衝突の状態を取得します。
     */
    isCollision: {
        get: function() {
            return this._isCollision;
        }
    },
    isCollisionLeft: {
        get: function() {
            return this._isCollisionLeft;
        }
    },
    isCollisionRight: {
        get: function() {
            return this._isCollisionRight;
        }
    },
    isCollisionTop: {
        get: function() {
            return this._isCollisionTop;
        }
    },
    isCollisionBottom: {
        get: function() {
            return this._isCollisionBottom;
        }
    },
    /**
     * 衝突判定を行うSpriteを追加します。
     * @param {enchant.Sprite | enchant.Group | Array} value 追加するSprite、またはそれを含むオブジェクト。
     */
    addCollision: function(value) {
        this._collisionObjects.push(value);
    },
    removeCollision: function(value) {
        if ((i = this._collisionObjects.indexOf(value)) !== -1) {
            this._collisionObjects.splice(i, 1);
        }
    },
    _addChildCollisionRect: function(sprite) {
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
    },
    _addCollisionRect: function(offsetX, offsetY) {
        this.addEventListener(Event.ENTER_FRAME, function(){
            this._collisionRect._followArg = arguments.callee;
            this._collisionRect.x = this.x + offsetX;
            this._collisionRect.y = this.y + offsetY;
        });
    },
    removeCollisionRect: function() {
        if (this._collisionRect) {
            if (this._collisionRect._followArg) {
                this.removeEventListener(Event.ENTER_FRAME, this._collisionRect._followArg);
                this._collisionRect._followArg = null;
            }
            this._collisionRect.remove();
        }
    },
    addCollisionRectScale: function(scaleX, scaleY) {
        this.removeCollisionRect();
        this._collisionRect = new Sprite(this.width * scaleX, this.height * scaleY);
        this._collisionRect.isCollisionIgnore = true;
        this._addChildCollisionRect(this._collisionRect);
        this._addCollisionRect(this.width / 2 - this.width * scaleX / 2, this.height / 2 - this.height * scaleY / 2);
    },
    addCollisionRectSize: function(width, height, x, y) {
        this.removeCollisionRect();
        this._collisionRect = new Sprite(width, height);
        this._collisionRect.isCollisionIgnore = true;
        this._addChildCollisionRect(this._collisionRect);
        this._addCollisionRect(x || this.width / 2 - width / 2, y || this.height / 2 - height / 2);
    },
    _judgeCollision: function(target) {
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
        _thisRect = _addRect(_thisRect);
        var _targetRect = targetRect.getOrientedBoundingRect();
        _targetRect = _addRect(_targetRect);        
        if (target instanceof Map) {
            result = true;
            target.collisionTile = null;
            var _offsetX = targetRect._offsetX;
            var _offsetY = targetRect._offsetY;
            // Center
            if (targetRect.hitTest(_thisRect.center[0] - _offsetX, _thisRect.center[1] - _offsetY)) {
                target.collisionTile = targetRect.checkTile(_thisRect.leftTop[0] - _offsetX, _thisRect.leftTop[1] - _offsetY);
            // TopLeft
            } else if (targetRect.hitTest(_thisRect.leftTop[0] - _offsetX, _thisRect.leftTop[1] - _offsetY)) {
                target.collisionTile = targetRect.checkTile(_thisRect.leftTop[0] - _offsetX, _thisRect.leftTop[1] - _offsetY);
            // TopRight
            } else if (targetRect.hitTest(_thisRect.rightTop[0] - _offsetX, _thisRect.rightTop[1] - _offsetY)) {
                target.collisionTile = targetRect.checkTile(_thisRect.rightTop[0] - _offsetX, _thisRect.rightTop[1] - _offsetY);
            // LeftBottom
            } else if (targetRect.hitTest(_thisRect.leftBottom[0] - _offsetX, _thisRect.leftBottom[1] - _offsetY)) {
                target.collisionTile = targetRect.checkTile(_thisRect.leftBottom[0] - _offsetX, _thisRect.leftBottom[1] - _offsetY);
            // RightBottom
            } else if (targetRect.hitTest(_thisRect.rightBottom[0] - _offsetX, _thisRect.rightBottom[1] - _offsetY)) {
                target.collisionTile = targetRect.checkTile(_thisRect.rightBottom[0] - _offsetX, _thisRect.rightBottom[1] - _offsetY);
            } else {
                result = false;
            }
            if (result) {
                this._isCollision = true;
                target._isCollisionState = true;
                this._dispatchEventCollision(target);
                if (targetRect.hitTest(_thisRect.left[0] - _offsetX, _thisRect.left[1] - _offsetY)) {
                    this._isCollisionLeft = true;
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_LEFT);
                }
                if (targetRect.hitTest(_thisRect.right[0] - _offsetX, _thisRect.right[1] - _offsetY)) {
                    this._isCollisionRight = true;
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_RIGHT);
                }
                if (targetRect.hitTest(_thisRect.top[0] - _offsetX, _thisRect.top[1] - _offsetY)) {
                    this._isCollisionTop = true;
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TOP);
                }
                if (targetRect.hitTest(_thisRect.bottom[0] - _offsetX, _thisRect.bottom[1] - _offsetY)) {
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
                this._dispatchEventCollision(target);
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
        return false;
    },
    _dispatchEventCollision: function(target) {
        var e;
        var existCount = this._collisionDuplicateObjects.indexOf(target);
        if (existCount < 0) {
            this._dispatchEventMakeCollision(target, enchant.Event.COLLISION);
            this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_START);
            this._collisionDuplicateObjects.push(target);
            //ターゲットとの衝突がなくなったときイベント生成
            this.addEventListener(Event.ENTER_FRAME, function() {
                var _arg = arguments.callee;
                if (!target._isCollisionState) {
                    this._collisionDuplicateObjects.splice(existCount);
                    this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_END);
                    this.removeEventListener(Event.ENTER_FRAME, _arg);
                }
            });
        }
        this._dispatchEventMakeCollision(target, enchant.Event.COLLISION_TICK);
    },
    _dispatchEventMakeCollision: function(target, collisionName) {
        e = new Event(collisionName);
        e.collision = {};
        e.collision.target = target;
        e.collisionTarget = target;
        this.dispatchEvent(e);
    },
    /**
     * ターゲットに指定したSpriteと一緒に移動します。
     * @param {enchant.Sprite} target ターゲットを指定します。
     * @example
     * var target = new ExSprite(32, 32);
     * core.rootScene.addChild(target);
     *
     * var sprite = new ExSprite(32, 32);
     * sprite.follow(target);
     * core.rootScene.addChild(sprite);
     *
     * target.tl.moveTo(10, 10, 10);
     * //sprite.tl.moveTo(10, 10, 10);
     *
     */
    follow: function(target) {
        this.unfollow();
        if (this._forrowBased == this.FORROW.RELATIVE_BASED) {
            this.addEventListener(Event.ENTER_FRAME, function() {
                this._followArg = arguments.callee;
                this.x += target._moved[0];
                this.y += target._moved[1];
            });
        } else {
            this.addEventListener(Event.ENTER_FRAME, function() {
                this._followArg = arguments.callee;
                this.x += target._moved[0];
                this.y += target._moved[1];
            });
        }
    },
    /**
     * followを解除します。
     */
    unfollow: function() {
        if (this._followArg) {
            this.removeEventListener(Event.ENTER_FRAME, this._followArg);
            this._followArg = null;
        }
    },
    setForrowRelativeBased: function() {
        this._forrowBased = this.FORROW.RELATIVE_BASED;
    },
    setForrowAbsoluteBased: function() {
        this._forrowBased = this.FORROW.ABSOLUTE_BASED;
    },
    setCollisionIntersectBased: function() {
        this._collisionBased = this.COLLISION.INTERSECT_BASED;
    },
    setCollisionWithinBased: function() {
        this._collisionBased = this.COLLISION.WITHIN_BASED;
    }
});
/**
 * 指定オブジェクト内でx方向の中央寄せを行う。
 * @param {Object} [another] 基準となるオブジェクト。（省略時は親Nodeとなる）
 */
enchant.ex.ExSprite.prototype.alignHorizontalCenterIn = function(another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.x = ~~(parentNode.width / 2) - ~~(this.width / 2);
    }
};
/**
 * 指定オブジェクト内でy方向の中央寄せを行う。
 * @param {Object} [another] 基準となるオブジェクト。（省略時は親Nodeとなる）
 */
enchant.ex.ExSprite.prototype.alignVerticalCenterIn = function(another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.y = ~~(parentNode.height / 2) - ~~(this.height / 2);
    }
};
