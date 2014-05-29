/**
 * Created by gt60 on 13-11-12.
 */
var ZorderTouchMenu = cc.Menu.extend({
    ctor:function (){
        cc.Menu.prototype.ctor.call(this);
        this.initWithItems();
    },
    _itemForTouch:function (touch) {
        var touchLocation = touch.getLocation();
        var itemChildren = this.children, locItemChild;
        if (itemChildren && itemChildren.length > 0) {
            for (var i = itemChildren.length - 1; i >= 0; i--) {
                locItemChild = itemChildren[i];
                if (locItemChild.isVisible() && locItemChild.isEnabled()) {
                    var local = locItemChild.convertToNodeSpace(touchLocation);
                    var r = locItemChild.rect();
                    r.x = 0;
                    r.y = 0;
                    if (cc.rectContainsPoint(r, local))
                        return locItemChild;
                }
            }
        }
        return null;
    }
});

var MouseOverMenu = ZorderTouchMenu.extend({
    _mouseOverItem:null,
    _mouseListener:null,
    ctor:function () {
        ZorderTouchMenu.prototype.ctor.call(this);

        this._mouseListener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: this.onMouseMove
        });

        if ('mouse' in cc.sys.capabilities && !this._mouseListener._isRegistered()) {
            cc.eventManager.addListener(this._mouseListener, this);
        }
    },
    onMouseMove:function (event) {
        var target = event.getCurrentTarget();
        var currentItem = target._itemForOver(event.getLocation());
        if (currentItem != target._mouseOverItem) {
            if (target._mouseOverItem) {
                target._mouseOverItem.unselected();
            }
            target._mouseOverItem = currentItem;
            if (target._mouseOverItem) {
                target._mouseOverItem.selected(event.getLocation());
            }
        }
    },
    _itemForOver:function (touchLocation) {
        var itemChildren = this.children, locItemChild;
        if (itemChildren && itemChildren.length > 0) {
            for (var i = itemChildren.length - 1; i >= 0; i--) {
                locItemChild = itemChildren[i];
                if (locItemChild && locItemChild.isVisible()) {
                    var local = locItemChild.convertToNodeSpace(touchLocation);
                    var r = locItemChild.rect();
                    r.x = 0;
                    r.y = 0;
                    if (cc.rectContainsPoint(r, local))
                        return locItemChild;
                }
            }
        }
        return null;
    }
});

var CardMenu = MouseOverMenu.extend({
    _downCallBack:null,
    _movedCallback:null,
    _targetLayer:null,
    ctor:function (callback1, callback2, targrt) {
        MouseOverMenu.prototype.ctor.call(this);
        this._downCallBack = callback1;
        this._movedCallback = callback2;
        this._targetLayer = targrt;
    },
    _onTouchBegan:function (touch, event) {
        var target = event.getCurrentTarget();
        target._selectedItem = target._itemForTouch(touch);
        if (target._selectedItem) {
            target._selectedItem.unselected();
            target._selectedItem.activate();
            return true;
        }
        return false;
    },
    _onTouchMoved:function (touch, event) {
        var target = event.getCurrentTarget();
        target._state = cc.MENU_STATE_TRACKING_TOUCH;
        event._currentTarget = target._targetLayer;
        target._movedCallback([touch], event);
    },
    _onTouchEnded:function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state == cc.MENU_STATE_TRACKING_TOUCH) {
            target._state = cc.MENU_STATE_WAITING;
            event._currentTarget = target._targetLayer;
            target._downCallBack([touch], event);
        }
    }
});

var CARD_TAG = 100;
var SelectDialog = cc.Sprite.extend({
    _maxNum:8,
    _list:[],
    _callback:null,
    _targetLayer:null,
    _menu:null,
    _finishBtn:null,
    ctor:function (list, callback, target, max) {
        this._super(res.PlantSelect);
        this._list = list;
        this._callback = callback;
        this._targetLayer = target;
        this._maxNum = max || this._maxNum;

        this._menu = new MouseOverMenu();
        this._menu.setPosition(cc.p(-100, 0));
        this.addChild(this._menu);

        var title = cc.LabelTTF.create("请选择您的植物,最大数量:" + this._maxNum, "宋体", 20);
        title.setColor(cc.color.YELLOW);
        title.setPosition(cc.p(230, 535));
        this.addChild(title);

        for (var i in this._list) {
            var plant = this._list[i];
            var card = new CardSprite(plant);
            var row = i % 5;
            var col = parseInt(i / 5, 10);

            card.initWithCallback(this.onCardSelect, this);
            card.setColor(cc.color.WHITE);
            card.setScale(0.85);
            card.setPosition(cc.p(155 + row * 89, 490 + col * -55));
            this._menu.addChild(card, 1, CARD_TAG + i);
        }

        cc.MenuItemFont.setFontName("宋体");
        cc.MenuItemFont.setFontSize(25);
        var reset = cc.MenuItemFont.create("重选", this.onReset, this);
        reset.setColor(cc.color.YELLOW);
        reset.setPosition(cc.p(-300, -250));
        this._finishBtn = cc.MenuItemFont.create("完成", this.onFinish, this);
        this._finishBtn.setColor(cc.color.YELLOW);
        this._finishBtn.setPosition(cc.p(-150, -250));
        this._finishBtn.setEnabled(false);

        var menu = cc.Menu.create(reset, this._finishBtn);
        this.addChild(menu);
    },
    onCardSelect:function (sender) {
        var cards = PZ.CONTAINER.CARDS;
        if (sender.getState() == PZ.CARD_STATE.SELECTED) {
            sender.setState(0);
            sender.setColor(cc.color.WHITE);
            this.removeCard(sender._plantType);
        } else if (cards.length < this._maxNum) {
            sender.setState(PZ.CARD_STATE.SELECTED);
            sender.setColor(cc.color.GRAY);
            this.addCard(sender._plantType);
        }
    },
    addCard:function (cardType) {
        this._finishBtn.setEnabled(true);
        var cards = PZ.CONTAINER.CARDS;
        var len = cards.length;
        cards.push(cardType);
        var card = new CardSprite(cardType);
        card.setPosition(card.rect().width / 2, cc.visibleRect.height - card.rect().height * (0.5 + len));
        this._menu.addChild(card, 1, len);
    },
    removeCard:function (cardType) {
        var cards = PZ.CONTAINER.CARDS;
        var id;
        for (var i = 0; i < cards.length; ++i) {
            if (cardType == cards[i]) {
                id = i;
                break;
            }
        }
        this._menu.removeChildByTag(id);

        for (var i = id + 1; i < cards.length; ++i) {
            var nextCard = this._menu.getChildByTag(i);
            nextCard.setTag(i - 1);
            nextCard.setPosition(cc.pAdd(nextCard.getPosition(), cc.p(0, nextCard.rect().height)));
        }
        cards.splice(id, 1);

        if (cards.length <= 0) {
            this._finishBtn.setEnabled(false);
        }
    },
    onReset:function () {
        for (var i in PZ.CONTAINER.CARDS) {
            this._menu.removeChildByTag(i);
        }
        PZ.CONTAINER.CARDS = [];

        for (var i in this._list) {
            var card = this._menu.getChildByTag(CARD_TAG + i);
            card.setState(0);
            card.setColor(cc.color.WHITE);
        }

    },
    onFinish:function () {
        this.removeFromParent(true);
        this._callback.call(this._targetLayer, this);
    }
});

var OptionMenu = cc.Menu.extend({
    _menuOfParent:null,
    _OptionBtn:null,
    ctor:function (menu) {
        cc.Menu.prototype.ctor.call(this);
        this.initWithItems(null, null);
        if (menu) {
            this._menuOfParent = menu;
        }

        var OptionsMenuback = cc.MenuItemImage.create(res.OptionsMenuback);
        OptionsMenuback.setEnabled(false);
        this.addChild(OptionsMenuback);

        var btnNormal = cc.Sprite.create(res.OptionsBackButton, cc.rect(0, 0, 360, 100));
        var label = cc.LabelTTF.create("回  到  游  戏", "微软雅黑", 35);
        label.setPosition(cc.p(180, 55));
        btnNormal.addChild(label);

        var btnSelected = cc.Sprite.create(res.OptionsBackButton, cc.rect(0, 100, 360, 100));
        var label2 = cc.LabelTTF.create("回  到  游  戏", "微软雅黑", 35);
        label2.setPosition(cc.p(180, 53));
        btnSelected.addChild(label2);

        this._OptionBtn = cc.MenuItemSprite.create(
            btnNormal,
            btnSelected,
            function (sender) {
                if (this._menuOfParent) {
                    var blank = this._menuOfParent.getChildByTag(BLANK_ZORDER);
                    blank.removeFromParent(true);
                }
                cc.director.resume();
                this.removeFromParent(true);
            }, this);
        this._OptionBtn.setPosition(cc.p(0, -190));
        this.addChild(this._OptionBtn);
    },
    onEnter:function () {
        cc.Menu.prototype.onEnter.call(this);
        if (this._menuOfParent) {
            var blank = new BlankItem();
            this._menuOfParent.addChild(blank, BLANK_ZORDER, BLANK_ZORDER);
        }
        cc.director.pause();
    },
    onExit:function () {
        cc.Menu.prototype.onExit.call(this);
        cc.director.resume();
    }
});

var MusicOption = OptionMenu.extend({
    ctor:function (menu) {
        OptionMenu.prototype.ctor.call(this, menu);

        cc.MenuItemFont.setFontName("幼圆");
        cc.MenuItemFont.setFontSize(20);
        var bgmLabel = cc.MenuItemFont.create("背景音乐");
        bgmLabel.setDisabledColor(cc.color.WHITE);
        bgmLabel.setEnabled(false);
        bgmLabel.setPosition(cc.p(-50, 70));
        var effecfLabel = cc.MenuItemFont.create("音  效");
        effecfLabel.setDisabledColor(cc.color.WHITE);
        effecfLabel.setEnabled(false);
        effecfLabel.setPosition(cc.p(-50, 20));

        var bgmOption = cc.MenuItemToggle.create(
            cc.MenuItemImage.create(res.checkBox_empty),
            cc.MenuItemImage.create(res.checkBox_selected),
            this.onBGMOption, this
        );
        bgmOption.setSelectedIndex(PZ.MUSIC ? 1 : 0);
        bgmOption.setScale(1.2);
        bgmOption.setPosition(cc.p(50, 70));

        var effectOption = cc.MenuItemToggle.create(
            cc.MenuItemImage.create(res.checkBox_empty),
            cc.MenuItemImage.create(res.checkBox_selected),
            this.onEffectOption, this
        );
        effectOption.setSelectedIndex(PZ.EFFECT_SOUND ? 1 : 0);
        effectOption.setScale(1.2);
        effectOption.setPosition(cc.p(50, 20));

        this.addChild(bgmLabel);
        this.addChild(bgmOption);
        this.addChild(effecfLabel);
        this.addChild(effectOption);
    },
    onBGMOption:function (sender) {
        PZ.MUSIC = sender.getSelectedIndex() == 1;
    },
    onEffectOption:function (sender) {
        PZ.EFFECT_SOUND = sender.getSelectedIndex() == 1;
    }
});

var GameOption = MusicOption.extend({
    _layer:null,
    _oldState:null,
    ctor:function (menu, layer) {
        MusicOption.prototype.ctor.call(this, menu);
        this._layer = layer;
        this._oldState = layer._state;

        cc.MenuItemFont.setFontName("幼圆");
        cc.MenuItemFont.setFontSize(20);
        var restart = cc.MenuItemFont.create(
            "重新开始",
            function () {
                cc.director.resume();
                cc.director.runScene(cc.TransitionFade.create(0.5, layer.constructor.scene()));
            }, layer
        );
        restart.setPosition(cc.p(0, -30));

        var back = cc.MenuItemFont.create(
            "返回菜单",
            function () {
                cc.director.resume();
                cc.director.runScene(cc.TransitionFade.create(1, WelcomeLayer.scene()));
            }, layer
        );
        back.setPosition(cc.p(0, -70));

        this.addChild(restart);
        this.addChild(back);
    },
    onEnter:function () {
        this._super();
        this._layer._state = PZ.GAME_STATE.PAUSING;
    },
    onExit:function () {
        this._super();
        this._layer._state = this._oldState;
    }
});

var SelectMenu = OptionMenu.extend({
    ctor:function (menu) {
        OptionMenu.prototype.ctor.call(this, menu);

        cc.MenuItemFont.setFontName("幼圆");
        cc.MenuItemFont.setFontSize(20);

        var stage1 = cc.MenuItemFont.create("第一关", this.onStageSelect);
        stage1.stage = GameStage.Stage1_1;
        stage1.setPosition(cc.p(-50, 90));
        var stage2 = cc.MenuItemFont.create("第二关", this.onStageSelect);
        stage2.stage = GameStage.Stage1_2;
        stage2.setPosition(cc.p(50, 90));
        var stage3 = cc.MenuItemFont.create("第三关", this.onStageSelect);
        stage3.stage = GameStage.Stage1_3;
        stage3.setPosition(cc.p(-50, 60));
        var stage4 = cc.MenuItemFont.create("第四关", this.onStageSelect);
        stage4.stage = GameStage.Stage1_4;
        stage4.setPosition(cc.p(50, 60));
        var stage5 = cc.MenuItemFont.create("第五关", this.onStageSelect);
        stage5.stage = GameStage.Stage1_5;
        stage5.setPosition(cc.p(-50, 30));
        var stage6 = cc.MenuItemFont.create("第六关", this.onStageSelect);
        stage6.stage = GameStage.Stage1_6;
        stage6.setPosition(cc.p(50, 30));
        var stage7 = cc.MenuItemFont.create("第七关", this.onStageSelect);
        stage7.stage = GameStage.Stage1_7;
        stage7.setPosition(cc.p(-50, 0));
        var stage8 = cc.MenuItemFont.create("第八关", this.onStageSelect);
        stage8.stage = GameStage.Stage1_8;
        stage8.setPosition(cc.p(50, 0));
        var stage9 = cc.MenuItemFont.create("第九关", this.onStageSelect);
        stage9.stage = GameStage.Stage1_9;
        stage9.setPosition(cc.p(-50, -30));
        var stage10 = cc.MenuItemFont.create("第十关", this.onStageSelect);
        stage10.stage = GameStage.Stage1_10;
        stage10.setPosition(cc.p(50, -30));
        var test = cc.MenuItemFont.create("测试关", this.onStageSelect);
        test.stage = GameStage.Test;
        test.setPosition(cc.p(0, -60));

        this.addChild(stage1);
        this.addChild(stage2);
        this.addChild(stage3);
        this.addChild(stage4);
        this.addChild(stage5);
        this.addChild(stage6);
        this.addChild(stage7);
        this.addChild(stage8);
        this.addChild(stage9);
        this.addChild(stage10);
        this.addChild(test);
    },
    onStageSelect:function (label) {
        cc.director.resume();
        cc.director.runScene(cc.TransitionFade.create(1, GameLayer.scene(label.stage)));
    }
});