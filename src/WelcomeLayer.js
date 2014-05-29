/**
 * Created by gt60 on 13-10-18.
 */

var BLANK_ZORDER = 99;
var LOCK_ZORDER = 100;

var WelcomeLayer = cc.Layer.extend({
    _bg:null,
    _menu:null,
    init:function () {
        var bRet = false;
        if (this._super()) {
            //背景
            this._bg = cc.Sprite.create(res.surface);
            this._bg.setAnchorPoint(cc.p(0, 0));
            this.addChild(this._bg);

            //按钮
            var surNormal = cc.Sprite.create(res.scrSurvival, cc.rect(0, 0, 313, 131));
            var surSelected = cc.Sprite.create(res.scrSurvival, cc.rect(0, 131, 313, 131));
            var sur = cc.MenuItemSprite.create(surNormal, surSelected, this.onSurGame, this);
            sur.setPosition(cc.p(cc.visibleRect.width / 2 + 170, 330));

            var advNormal = cc.Sprite.create(res.scrStart, cc.rect(0, 0, 331, 146));
            var advSelected = cc.Sprite.create(res.scrStart, cc.rect(0, 146, 331, 146));
            var adv = cc.MenuItemSprite.create(advNormal, advSelected, this.onAdvGame, this);
            adv.setPosition(cc.p(cc.visibleRect.width / 2 + 180, 450));

            this._menu = new MouseOverMenu();
            this._menu.setPosition(cc.p(0, 0));
            this.addChild(this._menu);
            this._menu.addChild(sur, 1);
            this._menu.addChild(adv, 2);

            //选项、帮助和退出
            var optionLabel = cc.LabelTTF.create("   ", "宋体", 40);
            var helpLabel = cc.LabelTTF.create("   ", "宋体", 40);
            var quitLabel = cc.LabelTTF.create("   ", "宋体", 40);

            var option = cc.MenuItemLabel.create(optionLabel, this.onOption, this);
            option.setPosition(cc.p(680, 100));
            var help = cc.MenuItemLabel.create(helpLabel, this.onHelp, this);
            help.setPosition(cc.p(760, 70));
            var quit = cc.MenuItemLabel.create(quitLabel, this.onQuit, this);
            quit.setPosition(cc.p(840, 70));
            this._menu.addChild(option);
            this._menu.addChild(help);
            this._menu.addChild(quit);

            bRet = true;
        }
        return bRet;
    },
    onHelp:function () {
        var blank = new BlankItem();
        var help = cc.MenuItemImage.create(
            res.help,
            null,
            function (sender) {
                blank.removeFromParent(true);
                sender.removeFromParent(true);
            }, this);
        help.setPosition(cc.visibleRect.center);
        this._menu.addChild(blank, BLANK_ZORDER, BLANK_ZORDER);
        this._menu.addChild(help, LOCK_ZORDER);
    },
    onAdvGame:function () {
        var optionMenu = new SelectMenu(this._menu);
        optionMenu.setPosition(cc.visibleRect.center);
        this.addChild(optionMenu);
    },
    onSurGame:function () {
        cc.log("onSurGame");
    },
    onOption:function () {
        var optionMenu = new MusicOption(this._menu);
        optionMenu.setPosition(cc.visibleRect.center);
        this.addChild(optionMenu);
    },
    onQuit:function () {
        cc.director.runScene(cc.TransitionFade.create(1, LogoLayer.scene()));
    }

});

WelcomeLayer.create = function () {
    var layer = new WelcomeLayer();
    if (layer && layer.init()) {
        return layer;
    }
    return null;
};

WelcomeLayer.scene = function () {
    var scene = cc.Scene.create();
    scene.addChild(WelcomeLayer.create());
    return scene;
};