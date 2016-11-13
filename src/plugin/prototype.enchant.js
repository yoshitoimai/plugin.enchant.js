/**
 * 表示枠矩形のＸ座標の中心を設定します。
 * @return {Number} Ｘ座標の中心座標
 * @example
 * var sprite = new ExSprite(32, 32);
 * core.rootScene.addChild(sprite);
 * console.log(sprite.getCenterX());
 */
enchant.Entity.prototype.getCenterX = function() {
    return this.x + this.width / 2;
};
/**
 * 表示枠矩形のＹ座標の中心を取得します。
 * @return {Number} Ｙ座標の中心座標
 * @example
 * var sprite = new ExSprite(32, 32);
 * core.rootScene.addChild(sprite);
 * console.log(sprite.getCenterY());
 */
enchant.Entity.prototype.getCenterY = function() {
    return this.y + this.height / 2;
};
/**
 * 表示枠矩形のＸ座標の最大値を取得します。
 * @return {Number} Ｘ座標の最大値
 * @example
 * var sprite = new ExSprite(32, 32);
 * core.rootScene.addChild(sprite);
 * console.log(sprite.getMaxX());
 */
enchant.Entity.prototype.getMaxX = function() {
    return this.x + this.width;
};
/**
 * 表示枠矩形のＹ座標の最大値を取得します。
 * @return {Number} Ｙ座標の最大値
 * @example
 * var sprite = new ExSprite(32, 32);
 * core.rootScene.addChild(sprite);
 * console.log(sprite.getMaxY());
 */
enchant.Entity.prototype.getMaxY = function() {
    return this.y + this.height;
};
/**
 * 表示枠矩形の座標の中心を設定します。
 * @param {Number} x Ｘ座標の中心座標
 * @param {Number} y Ｙ座標の中心座標
 * @example
 * var sprite = new ExSprite(32, 32);
 * sprite.setCenter(window.width / 2, window.height / 2);
 * core.rootScene.addChild(sprite);
 */
enchant.Entity.prototype.setCenter = function(x, y) {
    this.setCenterX(x);
    this.setCenterY(y);
};
/**
 * 表示枠矩形のＸ座標の中心を設定します。
 * @param {Number} x Ｘ座標の中心座標
 * @example
 * var sprite = new ExSprite(32, 32);
 * sprite.setCenterX(window.width / 2);
 * core.rootScene.addChild(sprite);
 */
enchant.Entity.prototype.setCenterX = function(x) {
    this.x = x - this.width / 2;
};
/**
 * 表示枠矩形のＹ座標の中心を設定します。
 * @param {Number} y Ｙ座標の中心座標
 * @example
 * var sprite = new ExSprite(32, 32);
 * sprite.setCenterY(window.height / 2);
 * core.rootScene.addChild(sprite);
 */
enchant.Entity.prototype.setCenterY = function(y) {
    this.y = y - this.height / 2;
};
/**
 * 表示枠矩形の座標の最大値を設定します。
 * @param {Number} x Ｘ座標の最大値
 * @param {Number} y Ｙ座標の最大値
 * @example
 * var sprite = new ExSprite(32, 32);
 * sprite.setMax(window.width, window.height);
 * core.rootScene.addChild(sprite);
 */
enchant.Entity.prototype.setMax = function(x, y) {
    this.setMaxX(x);
    this.setMaxY(y);
};
/**
 * 表示枠矩形のＸ座標の最大値を設定します。
 * @param {Number} x Ｘ座標の最大値
 * @example
 * var sprite = new ExSprite(32, 32);
 * sprite.setMaxX(window.width);
 * core.rootScene.addChild(sprite);
 */
enchant.Entity.prototype.setMaxX = function(x) {
    this.x = x - this.width;
};
/**
 * 表示枠矩形のＹ座標の最大値を設定します。
 * @param {Number} y Ｙ座標の最大値
 * @example
 * var sprite = new ExSprite(32, 32);
 * sprite.setMaxY(window.height);
 * core.rootScene.addChild(sprite);
 */
enchant.Entity.prototype.setMaxY = function(y) {
    this.y = y - this.height;
};
/**
 * 指定オブジェクト内でx方向の中央寄せを行う。
 * @param {Object} [another] 基準となるオブジェクト。（省略時は親Nodeとなる）
 */
enchant.Node.prototype.alignHorizontalCenterIn = function(another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.x = parentNode.x + ~~(parentNode.width / 2) - ~~(this.width / 2);
    }
};
/**
 * 指定オブジェクト内でy方向の中央寄せを行う。
 * @param {Object} [another] 基準となるオブジェクト。（省略時は親Nodeとなる）
 */
enchant.Node.prototype.alignVerticalCenterIn = function(another) {
    var parentNode = this.parentNode;
    if (another) parentNode = another;
    if (parentNode) {
        this.y = parentNode.y + ~~(parentNode.height / 2) - ~~(this.height / 2);
    }
};

/**
 * Nodeの可動域を設定する
 * @param {Object} [target] 可動域の中心となるオブジェクト。
 * @param {Object} [rangeTop] 上部の可動域
 * @param {Object} [rangeBottom] 下部の可動域
 * @param {Object} [rangeLeft] 左側の可動域
 * @param {Object} [rangeRight] 右側の可動域
 */
enchant.Node.prototype._rangeOfMotionArg = null;
enchant.Node.prototype.setRangeOfMotion = function(target, rangeTop, rangeBottom, rangeLeft, rangeRight) {
    if (rangeTop==null)  throw new Error("rangeTop is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeBottom==null)  throw new Error("rangeBottom is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeLeft==null)  throw new Error("rangeLeft is undefined (enchant.Node.setRangeOfMotion)");
    if (rangeRight==null)  throw new Error("rangeRight is undefined (enchant.Node.setRangeOfMotion)");
    this._rangeOfMotion = {
        target: target,
        rangeTop: rangeTop,
        rangeBottom: rangeBottom,
        rangeLeft: rangeLeft,
        rangeRight: rangeRight
    };
    this.addEventListener(Event.ENTER_FRAME, function() {
        this._rangeOfMotionArg = arguments.callee;
        var target = this._rangeOfMotion.target;
        if (target._offsetY < this._rangeOfMotion.rangeTop) {
            this.y += this._rangeOfMotion.rangeTop - target._offsetY;
        }
        if (target._offsetY > this._rangeOfMotion.rangeBottom - target.height) {
            this.y += this._rangeOfMotion.rangeBottom - target._offsetY - target.height;
        }
        if (target._offsetX < this._rangeOfMotion.rangeLeft) {
            this.x += this._rangeOfMotion.rangeLeft - target._offsetX;
        }
        if (target._offsetX > this._rangeOfMotion.rangeRight - target.width) {
            this.x += this._rangeOfMotion.rangeRight - target._offsetX - target.width;
        }
    });
};
enchant.Node.prototype.removeRangeOfMotion = function(origin, rangeTop, rangeBottom, rangeLeft, rangeRight) {
    if (this._rangeOfMotionArg) {
        this.removeEventListener(Event.ENTER_FRAME, this._rangeOfMotionArg);
        this._rangeOfMotionArg = null;
    }
};
enchant.Sprite.prototype.border = function(width, color, radius) {
    var surface = new Surface(this.width, this.height);
    if (this.image) surface.draw(this.image);
    this.image = surface;
    surface.context.lineWidth = width;
    surface.context.strokeStyle = color;
    roundedRect(surface, 0, 0, surface.width, surface.height, radius);
    function roundedRect(surface, x, y, width, height, radius){
        var ctx = surface.context;
        var image = surface.clone();
        surface.clear();
        var margin = ctx.lineWidth / 2;
        //x += margin; y += margin; width -= margin*2; height -= margin*2;
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.closePath();
        ctx.clip();
        surface.draw(image);
        ctx.stroke();
    }
};

enchant.Label.prototype.setText = function(text) {
    if (!text) return;
    if (!this.arrayText) this.arrayText = [];
    if (this.arrayText.length == 0) this.text = "";
    this.arrayText = this.arrayText.concat(text.split(""));
    if (!this.setTextArg) {
        this.addEventListener(Event.ENTER_FRAME, function() {
            this.setTextArg = arguments.callee;
            this.text += this.arrayText.shift();
            if (this.arrayText.length == 0) {
                this.removeEventListener(Event.ENTER_FRAME, this.setTextArg );
                this.setTextArg = null;
            }
        });
    }
}

