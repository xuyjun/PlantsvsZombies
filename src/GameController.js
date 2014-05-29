/**
 * Created by gt60 on 13-10-18.
 */
var GameController = cc.Layer.extend({
    init:function () {
        var bRet = false;
        if (this._super()) {
            //返回按钮
            var closeItem = cc.MenuItemImage.create(
                res.closeNoraml,
                res.closeSelected,
                this.onMenuClose,
                this
            );
            closeItem.setPosition(cc.p(cc.visibleRect.width - 20, 20));

            var menu = cc.Menu.create(closeItem);
            menu.setPosition(cc.visibleRect.bottomLeft);
            this.addChild(menu);

            bRet = true;
        }
        return bRet;
    },
    onMenuClose:function () {
        history.go(-1);
    }
});

GameController.create = function () {
    var layer = new GameController();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
}

var ProgressBar = cc.Sprite.extend({
    _stageNum:0,
    _progressFull:null,
    _progressHead:null,
    _percentage:0,
    ctor:function (number) {
        this._super();
        this.initWithSpriteFrameName("FlagMeterEmpty.png");
        this._stageNum = number;

        this._progressFull = cc.ProgressTimer.create(cc.Sprite.create(res.progressFull));
        this._progressFull.setType(cc.ProgressTimer.TYPE_BAR);
        this._progressFull.setMidpoint(cc.p(1, 0));
        this._progressFull.setBarChangeRate(cc.p(1, 0));
        this._progressFull.setAnchorPoint(cc.p(0, 0));
        this.addChild(this._progressFull, 1);

        this._progressHead = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("FlagMeterParts1.png"));
        this._progressHead.setPosition(cc.p(146, 13));
        this.addChild(this._progressHead, 4);

        for (var i = 0; i < this._stageNum; ++i) {
            var flag = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("FlagMeterParts2.png"));
            flag.setPosition(cc.p(16 + i * 140 / this._stageNum, 23));
            this.addChild(flag, 2);
        }

        var progressTitle = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("FlagMeterLevelProgress.png"));
        progressTitle.setPosition(cc.p(78, 3));
        this.addChild(progressTitle, 3);
    },
    setPercentage:function (percent) {
        this._percentage = percent;
        this._progressFull.setPercentage(percent);
        this._progressHead.setPosition(cc.p(11 + 1.35 * (100 - percent), 13))
    },
    getPercentage:function () {
        return this._percentage;
    }
});

var StartLabel = cc.Sprite.extend({
    ctor:function () {
        this._super(cc.spriteFrameCache.getSpriteFrame("PrepareGrowPlants_1.png"));

        var action = createAnimate("PrepareGrowPlants", 3, 0.8);
        this.runAction(cc.Sequence.create(
            action,
            cc.RemoveSelf.create(true)
        ));
    }
});


