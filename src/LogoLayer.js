/**
 * Created by gt60 on 13-10-18.
 */
var LogoLayer = cc.Layer.extend({
    _bg:null,
    _logo:null,
    init:function () {
        var bRet = false;
        if (this._super()) {
            //背景
            this._bg = cc.Sprite.create(res.logo);
            this._bg.setAnchorPoint(cc.p(0, 0));
            this.addChild(this._bg);

            //进入游戏
            this._logo = cc.MenuItemImage.create(
                res.logoLine,
                res.logoLine,
                this.onStartGame,
                this
            );
            this._logo.x = 250;
            this._logo.y = 100;

            var label = cc.LabelTTF.create("点击进入游戏", "宋体", 20);
            var size = this._logo.getContentSize();
            label.x = size.width / 2;
            label.y = size.height / 2 - 8;
            this._logo.addChild(label, 1);

            var menu = cc.Menu.create(this._logo);
            menu.setPosition(cc.visibleRect.bottomLeft);
            this.addChild(menu);

            bRet = true;
        }
        return bRet;
    },
    onStartGame:function () {
        cc.director.runScene(cc.TransitionFade.create(1, WelcomeLayer.scene()));
    }
});

LogoLayer.create = function () {
    var layer = new LogoLayer();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};

LogoLayer.scene = function () {
    var scene = cc.Scene.create();
    scene.addChild(LogoLayer.create());
    scene.addChild(GameController.create());
    return scene;
};
