/**
 * Created by gt60 on 13-10-18.
 */

var BlankItem = cc.MenuItemSprite.extend({
    ctor:function () {
        this._super();
        var blank = cc.Sprite.create();
        blank.setContentSize(cc.director.getWinSize());
        this.initWithNormalSprite(blank, null, null, null, null);
        this.setPosition(cc.visibleRect.center);
    }
});

var ControlBtn = cc.MenuItemToggle.extend({
    ctor:function (/*arguments*/) {
        this._super();

        if (arguments.length == 3) {
            var button = cc.MenuItemSprite.create(cc.Sprite.create(res.button), cc.Sprite.create(res.button));
            var label = cc.LabelTTF.create(arguments[0], "微软雅黑", 18);
            label.setPosition(cc.p(button.getContentSize().width >> 1, button.getContentSize().height >> 1));
            label.setColor(cc.color(0, 255, 0));
            button.addChild(label);
            arguments[0] = button;
            this.initWithItems(arguments);
        } else {
            var button1 = cc.MenuItemSprite.create(cc.Sprite.create(res.button), cc.Sprite.create(res.button));
            var label1 = cc.LabelTTF.create(arguments[0], "微软雅黑", 18);
            label1.setPosition(cc.p(button1.getContentSize().width >> 1, button1.getContentSize().height >> 1));
            label1.setColor(cc.color(0, 255, 0));
            button1.addChild(label1);
            arguments[0] = button1;

            var button2 = cc.MenuItemSprite.create(cc.Sprite.create(res.button), cc.Sprite.create(res.button));
            var label2 = cc.LabelTTF.create(arguments[1], "微软雅黑", 18);
            label2.setPosition(cc.p(button2.getContentSize().width >> 1, button2.getContentSize().height >> 1));
            label2.setColor(cc.color(0, 255, 0));
            button2.addChild(label2);
            arguments[1] = button2;
            this.initWithItems(arguments);
        }
    }
});

var Sun = cc.Sprite.extend({
    _sun:25,
    ctor:function() {
        this._super();
        this.initWithSpriteFrameName("Sun_1.png");
        this.setOpacity(230);

        var action = createRepeatAnimate("Sun", 22, 0.08);
        this.runAction(action);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:this.onTouchBegan,
            onTouchMoved:this.onTouchMoved,
            onTouchEnded:this.onTouchEnded
        }, this);
    },
    onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        if (cc.rectContainsPoint(target.getBoundingBox(), touch.getLocation())) {
            PZ.SUN += target._sun;
            target.runAction(cc.Sequence.create(
                cc.Spawn.create(cc.ScaleTo.create(0.5, 0), cc.MoveTo.create(0.5, cc.p(130, cc.visibleRect.height))),
                cc.RemoveSelf.create(true)
            ));
            return true;
        }
        return false;
    },
    onTouchMoved:function (touch) {},
    onTouchEnded:function (touch) {}
});