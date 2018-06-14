/**
 * box2d
 */
Object.defineProperty(enchant.box2d.PhySprite.prototype, "linearDamping", {
    get: function linearDamping() {
        return this.body.m_body.m_linearDamping;
    },
    set: function linearDamping(number) {
        this.body.m_body.m_linearDamping = number;
    }
});
Object.defineProperty(enchant.box2d.PhySprite.prototype, "angularDamping", {
    get: function angularDamping() {
        return this.body.m_body.m_angularDamping;
    },
    set: function angularDamping(number) {
        this.body.m_body.m_angularDamping = number;
    }
});
enchant.box2d.PhySprite.prototype.remove = function() {
    this.destroy();
};
enchant.box2d.PhySprite.prototype.addForce = function(x, y) {
    this.applyForce(new b2Vec2(x, y));
};
enchant.box2d.PhySprite.prototype.addImpulse = function(x, y) {
    this.applyImpulse(new b2Vec2(x, y));
};
enchant.box2d.PhySprite.prototype.addTorque = function(torque) {
    this.applyTorque(torque);
};
enchant.box2d.PhySprite.prototype._judgeCollision = function(target, moveX, moveY) {
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

    result = false;
    this.contact(function(_target){
        if (_target === target) {
            result = true;
        }
    });
    if (result) {
        this._isCollision = true;
        target._isCollisionState = true;
        this._dispatchEventCollision(target, true);
        return true;
    }
    target._isCollisionState = false;
    this._dispatchEventCollision(target, false);
    return false;
};
