/**
 * Created by gt60 on 13-10-19.
 */
var ROW_MAX = 5;
var COL_MAX = 9;

var GRID_TOP = 520;
var GRID_BOTTOM = 30;
var GRID_LEFT = 135;
var GRID_RIGHT = 850;
var GRID_WIDTH = 80;
var GRID_HEIGHT = 100;

var PROGRESS_X = 600;

var TAG_SHOVEL = 1;
var TAG_SUN    = 2;
var TAG_PAUSE  = 3;

var MENU_ZORDER = 100;

var GameLayer = cc.Layer.extend({
    _bg:null,
    _menu:null,
    _cardMenu:null,
    _progressBar:null,

    _selectedCard:null,
    _selectedPlant:null,
    _tmpPlant:null,
    _shovel:null,

    _state:null,
    _selectedState:PZ.SELECT_STATE.EMPTY,
    _row:0,
    _col:0,

    _title:'',
    _stageNum:0,
    _cardsNUm:0,
    _cardList:null,
    _zombies:null,
    _nextStage:null,

    _waveZombies:0,
    _diedZombies:0,
    _totalWave:0,
    _curWave:0,
    _curStage:0,
    _waveOfStage:0,

    _plantPlist:null,
    init:function (stage) {
        var bRet = false;
        if (this._super()) {
            stage = stage || GameStage.Test;
            PZ.SUN = stage.SUN;
            PZ.NOW_TIME = stage.TIME;
            this._title = stage.TITLE;
            this._stageNum = stage.STAGE_NUM;
            this._cardsNUm = stage.CARDS_MAX;
            this._cardList = stage.CARDS;
            this._zombies = stage.ZOMBIES;
            this._nextStage = stage.NEXT_STAGE;

            //僵尸总数
            var total = 0;
            for (var i = 0; i < this._stageNum; i++) {
                this._zombies[i].forEach(function (ary) {
                        total += 1;
                });
            }
            this._totalWave = total;

            if ('mouse' in cc.sys.capabilities) {
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    onMouseDown: this.onMouseDown,
                    onMouseUp: this.onMouseUp,
                    onMouseMove: this.onMouseMoved               
                }, this);
            } else if ('touch' in cc.sys.capabilities) {
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                    onTouchBegan: this.onTouchesBegan,
                    onTouchMoved: this.onTouchesMoved,
                    onTouchEnded: this.onTouchesEnded,
                    onTouchCancelled: this.onTouchesEnded
                }, this);
            }

            this._state = PZ.GAME_STATE.READY;
            this._menu = new MouseOverMenu();
            this._menu.setPosition(cc.visibleRect.bottomLeft);
            this._cardMenu = new CardMenu(this.onTouchesBegan, this.onTouchesMoved, this);
            this._cardMenu.setPosition(cc.visibleRect.bottomLeft);
            this.addChild(this._menu, MENU_ZORDER);
            this.addChild(this._cardMenu, MENU_ZORDER);

            //layer plist
            cc.spriteFrameCache.addSpriteFrames(res.gameLayer_plist);
            cc.spriteFrameCache.addSpriteFrames(res.sun_plist);

            //card plist
            cc.spriteFrameCache.addSpriteFrames(res.dayCards_plist);
            cc.spriteFrameCache.addSpriteFrames(res.nightCards_plist);

            //Zombie plist
            cc.spriteFrameCache.addSpriteFrames(res.FlagZombie_plist);
            cc.spriteFrameCache.addSpriteFrames(res.BombDie_plist);
            for (var i = 0; i < 5; ++i) {
                this._initZombies(i, stage.ZOMBIES_SHOW[i]);
            }

            //init
            PZ.CONTAINER.CARDS = [];
            PZ.CONTAINER.PLANTS = this.createInArray(ROW_MAX, COL_MAX, null);
            PZ.CONTAINER.ZOMBIES = this.createInArray(ROW_MAX, 0, null);
            PZ.CONTAINER.BULLET = this.createInArray(ROW_MAX, 0, null);

            //背景
            if (PZ.NOW_TIME == PZ.TIME.DAY) {
                this._bg = cc.Sprite.create(res.bg_day);
            } else if (PZ.NOW_TIME == PZ.TIME.NIGHT) {
                this._bg = cc.Sprite.create(res.bg_night);
            } else {
                cc.log("No Time!");
            }
            this._bg.setAnchorPoint(cc.p(0, 0));
            this.addChild(this._bg);

            var move = cc.MoveBy.create(1, cc.p(-500, 0));
            var delay1 = cc.DelayTime.create(2);
            var delay2 = cc.DelayTime.create(1.5);
            var move_bak = cc.MoveBy.create(1, cc.p(385, 0));
            var callback = cc.CallFunc.create(this.onReadyGame, this);
            var seq = cc.Sequence.create(delay1, move, delay2, move_bak, callback);
            this._bg.setPosition(cc.p(-115, 0));
            this.setPosition(cc.p(115, 0));
            this.runAction(seq);

            //暂停游戏，菜单
            var btn = new ControlBtn("暂停游戏", "继续游戏", this.pauseGame, this);
            btn.setPosition(cc.p(cc.visibleRect.width - 113 * 1.5, cc.visibleRect.height - 41 * 0.5));
            btn.setEnabled(false);
            this._menu.addChild(btn, MENU_ZORDER, TAG_PAUSE);
            btn = new ControlBtn("菜 单", this.mainMenu, this);
            btn.setPosition(cc.p(cc.visibleRect.width - 113 * 0.5, cc.visibleRect.height - 41 * 0.5));
            this._menu.addChild(btn, MENU_ZORDER);

            //阳光栏、铲
            var sunBack = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("SunBack.png"));
            sunBack.setAnchorPoint(cc.p(0, 1));
            sunBack.setPosition(cc.p(110, cc.visibleRect.height));
            this.addChild(sunBack);

            var sun = cc.LabelTTF.create(PZ.SUN);
            sun.setColor(cc.color(0, 0, 0));
            sun.setFontSize(25);
            sun.setPosition(cc.p(185, cc.visibleRect.height - 18));
            this.addChild(sun, 99, TAG_SUN);

            var shovelBack = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("ShovelBack.png"));
            shovelBack.setAnchorPoint(cc.p(0, 1));
            shovelBack.setPosition(cc.p(250, cc.visibleRect.height));
            this.addChild(shovelBack);

            var shovel = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("Shovel.png"));
            shovel.setPosition(cc.p(290, cc.visibleRect.height - 17));
            this.addChild(shovel, 99, TAG_SHOVEL);

            //关卡、进度
            var stageLable = cc.LabelTTF.create(this._title, "宋体", 30);
            stageLable.setColor(cc.color(0, 255, 120));
            stageLable.setAnchorPoint(cc.p(1, 0));
            stageLable.setPosition(cc.p(PROGRESS_X - 10, 0));
            this.addChild(stageLable, MENU_ZORDER);

            this._progressBar = new ProgressBar(this._stageNum);
            this._progressBar.setAnchorPoint(cc.p(0, 0));
            this._progressBar.setPosition(cc.p(PROGRESS_X, 8));
            this._progressBar.setVisible(false);
            this.addChild(this._progressBar);

            //割草机
            for (var i = 0; i < 5; ++i) {
                var l = new LawnMower(i + 1);
                l.setPosition(cc.p(100, 90 + i * 100));
                this.addChild(l);
            }
            bRet = true;
        }
        return bRet;
    },
    _initZombies:function (type, count) {
        if (count > 0) {
            var name = '';
            switch (type) {
                case 0:
                    name = "Zombie_1.png";
                    cc.spriteFrameCache.addSpriteFrames(res.Zombie_plist);
                    break;
                case 1:
                    name = "ConeheadZombie_1.png";
                    cc.spriteFrameCache.addSpriteFrames(res.ConeheadZombie_plist);
                    break;
                case 2:
                    name = "BucketheadZombie_1.png";
                    cc.spriteFrameCache.addSpriteFrames(res.BucketheadZombie_plist);
                    break;
                case 3:
                    name = "HeadWalk1_7.png";
                    cc.spriteFrameCache.addSpriteFrames(res.NewspaperZombie_plist);
                    break;
                case 4:
                    name = "PoleVaultingZombie_1.png";
                    cc.spriteFrameCache.addSpriteFrames(res.PoleVaultingZombie_plist);
                    break;
            }
            for (var i = 0; i < count; ++i) {
                var x = Math.floor(Math.random() * 7) * 30 + 1000;
                var y = Math.floor(Math.random() * 7) * 50 + 100;
                var zombie = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(name));
                zombie.setPosition(cc.p(x, y));
                this.addChild(zombie, 600 - y);
            }
        }
    },
    addZombie:function () {
        this._waveZombies++;
    },
    removeZombie:function () {
        this._diedZombies++;
    },
    createInArray:function (row, col, value) {
        var arr = [];
        for (var i = 0; i != row; ++i) {
            arr[i] = [];
            for (var j = 0; j != col; ++j) {
                arr[i][j] = value;
            }
        }
        return arr;
    },
    mainMenu:function () {
        if (this._state != PZ.GAME_STATE.PAUSING) {
            var mainMenu = new GameOption(this._menu, this);
            this.addChild(mainMenu, MENU_ZORDER);
        }
    },
    pauseGame:function () {
        if (this._state == PZ.GAME_STATE.PLAYING) {
            cc.director.pause();
            this._state = PZ.GAME_STATE.PAUSING;
        } else if (this._state == PZ.GAME_STATE.PAUSING) {
            cc.director.resume();
            this._state = PZ.GAME_STATE.PLAYING;
        }
    },
    onReadyGame:function () {
        this._state = PZ.GAME_STATE.READY;
        var dialog = new SelectDialog(this._cardList, this.onStartGame, this, this._cardsNUm);
        dialog.setAnchorPoint(cc.p(0, 0));
        dialog.setPosition(cc.p(100, 0));
        this.addChild(dialog, MENU_ZORDER - 1);
    },
    onStartGame:function () {
        this._state = PZ.GAME_STATE.PLAYING;
        this._menu.getChildByTag(TAG_PAUSE).setEnabled(true);
        this.schedule(this.comeOutSun, 20);
        this.schedule(this.comeOutZombies, 2, null, 0);//30
        this.scheduleOnce(function () {
            this._progressBar.setVisible(true);
        }, 30);
        this.scheduleUpdate();
        this.showGameStart();

        this._plantPlist = [];
        for (var i = 0; i < PZ.CONTAINER.CARDS.length; ++i) {
            var cardType = PZ.CONTAINER.CARDS[i];
            var card = new CardSprite(cardType);
            card.setPosition(card.rect().width / 2, cc.visibleRect.height - card.rect().height * (0.5 + i));
            card.initWithCallback(this.onSelectCard, this);
            this._cardMenu.addChild(card);
            PZ.CONTAINER.CARDS[i] = card;

            var bRet = true;
            for (var j in this._plantPlist) {
                if (this._plantPlist[j] == cardType.PLIST) {
                    bRet = false;
                    break;
                }
            }
            if (bRet) {
                this._plantPlist.push(cardType.PLIST);
                cc.spriteFrameCache.addSpriteFrames(cardType.PLIST);
            }
        }
    },
    comeOutSun:function () {
        var sun = new Sun();
        sun.setPosition(cc.p(Math.random() * 640 + GRID_LEFT, GRID_TOP + 100));
        var distance = Math.random() * 400 + 200;
        var down = cc.MoveBy.create(distance / 100, cc.p(0, -distance));
        sun.runAction(down);
        this.addChild(sun, MENU_ZORDER);
    },
    comeOutZombies:function () {
        if (this._state == PZ.GAME_STATE.PLAYING) {
            if (this._diedZombies >= this._waveZombies) {
                if (this._waveOfStage >= this._zombies[this._curStage].length) {
                    this._waveOfStage = 0;
                    this._curStage++;
                    if (this._curStage >= this._stageNum) {
                        this._state = PZ.GAME_STATE.GAMEOVER;
                        cc.director.runScene(cc.TransitionFade.create(1, GameLayer.scene(this._nextStage)));
                        return;
                    }
                    this.showBigWave();
                    this._produceZombies(60);
                    return;
                }

                if ((this._curWave + 1) == this._totalWave) {
                    this.showLastWave();
                    this._produceZombies(60);
                    return;
                }
                this._produceZombies(30);
            }
        }
    },
    _produceZombies:function (offset) {
        offset = offset || 0;
        this._waveZombies = 0;
        this._diedZombies = 0;
        var wave = this._zombies[this._curStage][this._waveOfStage];
        for (var j = 0; j < wave.length; j++) {
            var startPos = Math.floor(j / 6) * 100 + offset;
            this._produceOneZombies(j % 6, wave[j], startPos);
        }
        this._curWave++;
        this._waveOfStage++;
    },
    _produceOneZombies:function (type, number, startPos) {
        startPos = startPos || 0;
        for (var i = 0; i < number; i++) {
            var zombie;
            var row = parseInt(Math.random() * 5 + 1, 10);
            switch (type) {
                case 0:zombie = new NormalZombie(row, ZombieType.Zombie_n);break;
                case 1:zombie = new NormalZombie(row, ZombieType.ConeheadZombie);break;
                case 2:zombie = new NormalZombie(row, ZombieType.BucketheadZombie);break;
                case 3:zombie = new PoleZombie(row);break;
                case 4:zombie = new NewspaperZombie(row);break;
                case 5:zombie = new NormalZombie(row, ZombieType.FlagZombie);break;
            }
            var posX = parseInt(Math.floor(Math.random() * 5) * 30, 10);
            zombie.setPosition(cc.p(GRID_RIGHT + startPos + posX, 20 + 100 * row));
            this.addChild(zombie, 6 - row);
            PZ.CONTAINER.ZOMBIES[row - 1].push(zombie);
        }
    },
    onSelectCard:function (sender) {
        if (this._state == PZ.GAME_STATE.PLAYING) {
            if (this._selectedCard == null) {
                this._selectedCard = sender;
                this._selectedCard.setState(this._selectedCard.getState() | PZ.CARD_STATE.SELECTED);

                this._selectedPlant = sender.getPlant();
                this.addChild(this._selectedPlant, 10);

                this._tmpPlant = sender.getPlant();
                this._tmpPlant.setOpacity(150);
                this.addChild(this._tmpPlant);
            } else {
                this.handleDownForPlant();
                //this.onSelectCard(sender);
            }
        }
    },
    _isMouseMove:false,
    onMouseDown:function (event) {
        var target = event.getCurrentTarget();
        if (target._state == PZ.GAME_STATE.PLAYING) {
            if (target._isMouseMove) {
                target.handleDownForPlant(event);
                target._isMouseMove = false;
            }
            target.handleDownForShovel(event);
        }
    },
    onMouseMoved:function (event) {
        var target = event.getCurrentTarget();
        if (target._state == PZ.GAME_STATE.PLAYING) {
            if (target._selectedCard) {
                target._isMouseMove = true;
            }
            target.handleMoveForPlant(event);
            target.handleMoveForShovel(event);
        }
    },
    _isTouchMove:false,
    onTouchesBegan:function (touches, event) {
        var target = event.getCurrentTarget();
        var touch = touches[0];

        if (target._state == PZ.GAME_STATE.PLAYING) {
            if (target._isMouseMove) {
                target.handleDownForPlant(touch);
                target._isMouseMove = false;
            }
            target.handleDownForShovel(touch);
        }

        if (target._state == PZ.GAME_STATE.PLAYING) {
            if (target._selectedCard) {
                target._isMouseMove = true;
            }
            target.handleMoveForPlant(touch);
            target.handleMoveForShovel(touch);
        }
    },
    onTouchesMoved:function (touches, event) {
        var target = event.getCurrentTarget();
        var touch = touches[0];

        if (target._state == PZ.GAME_STATE.PLAYING) {
            if (target._selectedCard) {
                target._isMouseMove = true;
            }
            target.handleMoveForPlant(touch);
            target.handleMoveForShovel(touch);
        }

        this._isTouchMove = true;
    },
    onTouchesEnded:function (touches, event) {
        var target = event.getCurrentTarget();
        if (target._isTouchMove) {
            var touch = touches[0];
            target.handleDownForShovel(touch);
            target._isTouchMove = false;
        }
    },
    cancelCard:function () {
        this._tmpPlant.setPosition(cc.p(-1000, -1000));
        this._selectedState = PZ.SELECT_STATE.EMPTY;
    },
    handleDownForPlant:function () {
        //点击卡片后才执行
        if (this._selectedPlant) {
            //检测是否在空地上
            if (this._selectedState == PZ.SELECT_STATE.GRID) {
                this._selectedPlant.setPosition(cc.p(105 + GRID_WIDTH * this._col, -10 + GRID_HEIGHT * this._row));
                this._selectedPlant.grow(this._row, this._col);
                this._selectedPlant = null;

                this._selectedCard.select();

                this._tmpPlant.removeFromParent(true);
                this._tmpPlant = null;

                this._selectedState = PZ.SELECT_STATE.EMPTY;
            } else {
                this._selectedCard.setState(this._selectedCard.getState() & ~PZ.CARD_STATE.SELECTED);
                this._selectedPlant.removeFromParent(true);
                this._selectedPlant = null;
                this._tmpPlant.removeFromParent(true);
                this._tmpPlant = null;
            }
            this._selectedCard = null;
        }
    },
    handleDownForShovel:function (touch) {
        //点击铁铲后才执行
        if (this._shovel) {
            this._shovel.setPosition(cc.p(290, cc.visibleRect.height - 17));
            this._shovel.setRotation(0);
            this._shovel = null;
            //检测是存在植物
            if (this._selectedState == PZ.SELECT_STATE.SHOVEL) {
                this._tmpPlant.sell();
                this._tmpPlant = null;
            }
        } else if (cc.rectContainsPoint(this.getChildByTag(TAG_SHOVEL).getBoundingBox(), touch.getLocation())) {
            this._shovel = this.getChildByTag(TAG_SHOVEL);
            this._shovel.setRotation(-60);
        }
    },
    handleMoveForPlant:function (touch) {
        //点击卡片后才显示
        if (this._selectedPlant) {
            var loc = touch.getLocation();
            this._selectedPlant.setPosition(cc.p(loc.x, loc.y));

            //检测是否所指在田地区域里，否则不显示
            if (loc.x >= GRID_LEFT && loc.x <= GRID_RIGHT && loc.y >= GRID_BOTTOM && loc.y <= GRID_TOP) {
                this._col = parseInt(((loc.x - GRID_LEFT) / GRID_WIDTH), 10) + 1;
                this._row = parseInt(((loc.y - GRID_BOTTOM) / GRID_HEIGHT), 10) + 1;

                if (this._selectedPlant.canGrow(PZ.CONTAINER.PLANTS[this._row - 1][this._col - 1])) {
                    this._tmpPlant.setPosition(cc.p(105 + GRID_WIDTH * this._col, -10 + GRID_HEIGHT * this._row));
                    this.reorderChild(this._tmpPlant, 6 - this._row);
                    this._selectedState = PZ.SELECT_STATE.GRID;
                } else {
                    this.cancelCard();
                }
            } else {
                this._tmpPlant.setPosition(cc.p(-1000, -1000));
                this._selectedState = PZ.SELECT_STATE.EMPTY;
            }
        }
    },
    handleMoveForShovel:function (touch) {
        //点击铁铲后才显示
        if (this._shovel) {
            var loc = touch.getLocation();
            this._shovel.setPosition(cc.p(loc.x, loc.y));
            if (loc.x >= GRID_LEFT && loc.x <= GRID_RIGHT && loc.y >= GRID_BOTTOM && loc.y <= GRID_TOP) {
                this._col = parseInt(((loc.x - GRID_LEFT) / GRID_WIDTH), 10) + 1;
                this._row = parseInt(((loc.y - GRID_BOTTOM) / GRID_HEIGHT), 10) + 1;

                //检测是否所指在田地区域里，有则透明显示，没有则恢复不透明
                if (PZ.CONTAINER.PLANTS[this._row - 1][this._col - 1]
                    && !(PZ.CONTAINER.PLANTS[this._row - 1][this._col - 1] instanceof Crater)) {

                    //上次所选的植物恢复不透明
                    if (this._tmpPlant) {
                        this._tmpPlant.setOpacity(255);
                    }

                    //保存选中植物，透明显示
                    this._tmpPlant = PZ.CONTAINER.PLANTS[this._row - 1][this._col - 1];
                    this._tmpPlant.setOpacity(150);
                    this._selectedState = PZ.SELECT_STATE.SHOVEL;
                } else {
                    if (this._tmpPlant) {
                        this._tmpPlant.setOpacity(255);
                    }
                    this._tmpPlant = null;
                    this._selectedState = PZ.SELECT_STATE.EMPTY;
                }
            } else {
                if (this._tmpPlant) {
                    this._tmpPlant.setOpacity(255);
                }
                this._tmpPlant = null;
                this._selectedState = PZ.SELECT_STATE.EMPTY;
            }
        }
    },
    update:function (dt) {
        this.updateUI();
        if (this._state != PZ.GAME_STATE.OVER) {
            for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
                for (var j = 0; j < PZ.CONTAINER.ZOMBIES[i].length; ++j) {
                    var zombie = PZ.CONTAINER.ZOMBIES[i][j];
                    if (zombie && zombie.getPositionX() <= (GRID_LEFT - 50)) {
                        this.showLose();
                        return;
                    }
                }
            }
        }
    },
    updateUI:function () {
        //阳光
        var l = this.getChildByTag(TAG_SUN);
        var num = PZ.SUN;
        l.setString(num + '');

        //卡片
        for (var i = 0; i < PZ.CONTAINER.CARDS.length; ++i) {
            var card = PZ.CONTAINER.CARDS[i];
            if (card) {
                card.updateUI();
            }
        }

        var gamePercentage = (this._curWave - 1) / this._totalWave;
        var wavePercentage = (this._diedZombies / this._waveZombies) * (1 / this._totalWave);
        this._progressBar.setPercentage((gamePercentage + wavePercentage) * 100);
    },
    showGameStart:function () {
        var label = new StartLabel();
        label.setPosition(cc.visibleRect.center);
        this.addChild(label, MENU_ZORDER);
    },
    showBigWave:function () {
        var label = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("LargeWave.png"));
        label.setPosition(cc.visibleRect.center);
        label.setScale(0.5);
        label.runAction(cc.RotateBy.create(0.5, 360));
        label.runAction(cc.Sequence.create(
            cc.ScaleTo.create(1, 1.5),
            cc.DelayTime.create(1),
            cc.CallFunc.create(function (sender) {
                this.removeChild(sender);
            }, this)
        ));
        this.addChild(label, MENU_ZORDER);
    },
    showLastWave:function () {
        var label = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("FinalWave.png"));
        label.setPosition(cc.visibleRect.center);
        label.setScale(0.5);
        label.runAction(cc.Sequence.create(
            cc.ScaleTo.create(1, 1),
            cc.DelayTime.create(1),
            cc.CallFunc.create(function (sender) {
                this.removeChild(sender);
            }, this)
        ));
        this.addChild(label, MENU_ZORDER);
    },
    showLose:function () {
        this._state = PZ.GAME_STATE.OVER;
        var label = cc.Sprite.create(res.ZombiesWon);
        label.setPosition(cc.visibleRect.center);
        label.setOpacity(0);
        label.setScale(0.5);

        label.runAction(cc.RotateBy.create(0.5, 360));
        label.runAction(cc.ScaleTo.create(0.5, 1.3));
        label.runAction(cc.Sequence.create(
            cc.FadeIn.create(1),
            cc.CallFunc.create(function () {
                cc.director.pause();

                var blank = new BlankItem();
                blank.setTarget(function () {
                    var mainMenu = new GameOption(this._menu, this);
                    mainMenu._OptionBtn.setEnabled(false);
                    this.addChild(mainMenu, MENU_ZORDER);
                }, this);
                this._menu.addChild(blank, BLANK_ZORDER);
            }, this)
        ));
        this.addChild(label, MENU_ZORDER);
    }
});


GameLayer.create = function (stage) {
    var layer = new GameLayer();
    if (layer && layer.init(stage)) {
        return layer;
    }
    return null;
};

GameLayer.scene = function (stage) {
    var scene = cc.Scene.create();
    scene.addChild(GameLayer.create(stage));
    return scene;
};