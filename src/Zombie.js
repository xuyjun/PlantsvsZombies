/**
 * Created by gt60 on 13-10-22.
 */

var ATTACK_DISTANCE = 20;
var ATTACK          = 1;

var FREEZE_COLOR = cc.color(150, 150, 255);
var NORMAL_COLOR = cc.color(255, 255, 255);

/**
 * action that zombies lose head
 */
var Head = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("ZombieHead_1.png");

        //lost head animation
        var animate = new LostHeadAction();
        this.runAction(cc.Sequence.create(
                        animate,
                        cc.DelayTime.create(1),
                        cc.CallFunc.create(this.removeFromParent, this))
        );
    }
});

var PaperHead = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("Head_1.png");

        //lost head animation
        var animate = new PaperLostHeadAction();
        this.runAction(cc.Sequence.create(
            animate,
            cc.DelayTime.create(1),
            cc.CallFunc.create(this.removeFromParent, this))
        );
    }
});

var PoleHead = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("PoleVaultingZombieHead_1.png");

        //lost head animation
        var animate = new PoleLostHeadAction();
        this.runAction(cc.Sequence.create(
            animate,
            cc.DelayTime.create(1),
            cc.CallFunc.create(this.removeFromParent, this))
        );
    }
});

/**
 * Zombies
 */
var Zombie = cc.Sprite.extend({
    _HP:0,
    _velocity:0,
    _row:0,
    _distance:0,
    _attack:0,
    _target:null,

    _stageList:null,
    _nowAction:null,
    _shadow:null,

    _freezeTime:0,
    _state:null,
    //_stage:null,
    _changeFlag:false,
    _isLive:true,
    _isNoHead:false,
    ctor:function (row, type) {
        this._super();

        //init
        this.initWithSpriteFrameName("Zombie_1.png");
        this.initData(type);
        this._row = row;
        this._target = null;
        //this._state = PZ.ZOMBIE_STATE.NORMAL;
        this._changeFlag = true;
        this._isLive = true;
        this._isNoHead = false;

        this.scheduleUpdate();

        //影子
        this._shadow = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("plantshadow32.png"));
        this._shadow.setPosition(cc.p(115, 10));
        this.addChild(this._shadow, -2);
    },
    initData:function(type) {
        this._HP = type.STAGE[0].HP;
        this._velocity = type.VELOCITY;
        this._stageList = type.STAGE.slice(0);
        this._distance = ATTACK_DISTANCE;
        this._attack = ATTACK;
    },
    setRow:function (row) {
        this._row = row;
    },
    getRow:function () {
        return this._row;
    },
    removeState:function (state) {
        this._state &= ~state;
    },
    addState:function (state) {
        this._state |= state;
    },
    getState:function () {
        return this._state;
    },
    isLive:function () {
        return this._isLive;
    },
    onEnter:function () {
        this._super();
        this.getParent().addZombie();
    },
    onExit:function () {
        this._super();
        this.getParent().removeZombie();
    },
    update:function (dt) {
        //冰冻状态监测
        if (this._freezeTime > 0) {
            this._freezeTime -= dt;
        } else {
            if (this.getState() & PZ.ZOMBIE_STATE.FREEZED) {
                this.removeState(PZ.ZOMBIE_STATE.FREEZED);
                this.setFreeze(0);
            }
        }


        if (!(this.getState() & PZ.ZOMBIE_STATE.TIED)) {
            //索敌检测
            this.searchPlant(dt);
        }
        //更新动作
        this.updateAction();
    },
    searchPlant:function (dt) {
        if (this._target == null) {
            this.unschedule(this.attack);
            this.setPosition(cc.p(this.getPositionX() - dt * this._velocity, this.getPositionY()));
            for (var i = 0; i < PZ.CONTAINER.PLANTS[this.getRow() - 1].length; ++i) {
                this._target = PZ.CONTAINER.PLANTS[this.getRow() - 1][i];
                if (this._target && this._target.isLive()
                    && Math.abs(this.getPositionX() - this._target.getPositionX()) < this._distance) {
                    this.addState(PZ.ZOMBIE_STATE.ATTACK);
                    this._changeFlag = true;
                    this.schedule(this.attack, 1);
                    break;
                } else {
                    this._target = null;
                }
            }
        }
    },
    updateAction:function () {
        this.checkStage();

        if (this._stageList.length == 1) {
            if (this._isLive) {
                this.die();
                this._changeFlag = false;
            }
        }

        if (this._changeFlag) {
            var action;
            if (this.getState() & PZ.ZOMBIE_STATE.ATTACK) {
                action = createAnimaeByStage(this._stageList[0].ACTION + 1);
            } else {
                action = createAnimaeByStage(this._stageList[0].ACTION);
            }
            this._nowAction = cc.Speed.create(action, 1);
            this.stopAllActions();
            this.runAction(this._nowAction);

            //以下逻辑是为了阶段改变时重新冰冷，即减慢帧
            if (this.getState() & PZ.ZOMBIE_STATE.FREEZED) {
                this._nowAction.setSpeed(0.5);
            }

            this._changeFlag = false;
        }
    },
    setFreeze:function (time) {
        if (time) {
            if (!(this.getState() & PZ.ZOMBIE_STATE.FREEZED)) {
                this._nowAction.setSpeed(0.5);
                this.setColor(FREEZE_COLOR);
                this._velocity /= 2;
                this._attack /= 2;
            }

            this.addState(PZ.ZOMBIE_STATE.FREEZED);
            this._freezeTime = time;
        } else {
            this._nowAction.setSpeed(1);
            this._velocity *= 2;
            this._attack *= 2;
            this.setColor(NORMAL_COLOR);
        }
    },
    attack:function () {
        if (this._target) {
            this._target.hurt(this._attack);
        }
        if (this._target && !this._target.isLive()) {
            this._target = null;
            this.removeState(PZ.ZOMBIE_STATE.ATTACK);
            this._changeFlag = true;
        }
    },
    hurt:function (value) {
        this._HP -= value;
        var action1 = cc.FadeTo.create(0.05, 120);
        var action2 = cc.FadeIn.create(0.05, 255);
        this.runAction(cc.Sequence.create(action1, action2));
    },
    _dieAndClear:function () {
        this._isLive = false;
        for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
            if (PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i] == this) {
                PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i] = null;
                break;
            }
        }
    },
    die:function () {
        this.setOpacity(255);
        this._dieAndClear();

        var animate = createAnimaeByStage(this._stageList[0].ACTION);
        var action = cc.Sequence.create(
            cc.CallFunc.create(this.unscheduleUpdate, this),
            animate,
            cc.DelayTime.create(1.5),
            cc.CallFunc.create(this.removeFromParent, this)
        );
        this.stopAllActions();
        this.runAction(action);
    },
    bombDie:function () {
        this._dieAndClear();

        var animate = new BombDieAction();
        var action = cc.Sequence.create(
            cc.CallFunc.create(this.unscheduleUpdate, this),
            animate,
            cc.DelayTime.create(1),
            cc.CallFunc.create(this.removeFromParent, this)
        );
        this.stopAllActions();
        this.runAction(action);

    },
    eaten:function () {
        this._dieAndClear();
        this.removeFromParent(true);
    },
    _isIceTied:false,
    setIceTie:function (time) {
        this.setColor(cc.color(120, 120, 255));
        this.addState(PZ.ZOMBIE_STATE.TIED);

        var ice = new IceTrap(time);
        ice.setPosition(this._shadow.getPosition());
        this.addChild(ice, 1);

        if (this._isIceTied == false) {
            this.getActionManager().pauseTarget(this);
            this._isIceTied = true;
        } else {
            this.unschedule(this.iceRecover);
        }
        this.scheduleOnce(this.iceRecover, time);
    },
    iceRecover:function () {
        if (!(this.getState() & PZ.ZOMBIE_STATE.FREEZED)) {
            this.setColor(cc.color(255, 255, 255));
        }
        this.getActionManager().resumeTarget(this);
        this._isIceTied = false;
        this.removeState(PZ.ZOMBIE_STATE.TIED)
    },
    checkStage:function () {
        //override me
    },
    lostHead:function () {
        //override me
    }
});

var NormalZombie = Zombie.extend({
    checkStage:function () {
        for (var i = 1; i < this._stageList.length; ) {
            if (this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.NO_HEAD
                || this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.FLAG_NO_HEAD) {
                if (!this._isNoHead) {
                    this.lostHead();
                }
            }
            if (this._HP <= this._stageList[0].HP && this._HP > this._stageList[1].HP) {
                break;
            } else {
                this._stageList.shift();
                this._changeFlag = true;
            }
        }
    },
    lostHead:function () {
        this._isNoHead = true;
        var head = new Head();
        head.setPosition(cc.pAdd(this.getPosition(), cc.p(80, 0)));
        this.getParent().addChild(head);
    }
});

var NewspaperZombie = Zombie.extend({
    _lostPaper:false,
    ctor:function (row) {
        this._super(row, ZombieType.NewspaperZombie);
        this.setAnchorPoint(cc.p(0.5, 0.4));
        this._lostPaper = false;
    },
    checkStage:function () {
        for (var i = 1; i < this._stageList.length; ) {
            if (this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_SLOW) {
                if (!this._isNoHead) {
                    this.lostHead();
                }
            }
            if (this._lostPaper) {
                if (this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.PAPER_SLOW) {
                    this._stageList[0] = {HP:this._stageList[0].HP, ACTION:PZ.ZOMBIE_STAGE.PAPER_FAST};
                } else if (this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_SLOW) {
                    this._stageList[0] = {HP:this._stageList[0].HP, ACTION:PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_FAST};
                }
            }
            if (this._HP <= this._stageList[0].HP && this._HP > this._stageList[1].HP) {
                break;
            } else {
                this._stageList.shift();
                this._changeFlag = true;
            }
        }
    },
    lostHead:function () {
        this._isNoHead = true;
        var head = new PaperHead();
        head.setPosition(cc.pAdd(this.getPosition(), cc.p(40, 0)));
        this.getParent().addChild(head);
    },
    hurt:function (value) {
        if (this._lostPaper) {
            this._HP -= value * 1.5;
        } else {
            this._HP -= value;
        }
        var action1 = cc.FadeTo.create(0.05, 120);
        var action2 = cc.FadeIn.create(0.05, 255);
        this.runAction(cc.Sequence.create(action1, action2));

        if (!this._lostPaper && (this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.PAPER_SLOW
            || this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.PAPER_SLOW_ATTACK)) {
            this._lostPaper = Math.random() > 0.1;
            if (this._lostPaper) {
                var oldv = this._velocity;
                var action = new PaperLostPaperAction();
                this.stopAllActions();
                this.runAction(cc.Sequence.create(
                    cc.CallFunc.create(function (sender) {
                        sender._velocity = 0;
                    }, this),
                    action,
                    cc.CallFunc.create(function (sender) {
                        sender._velocity = oldv * 2.5;
                        sender._changeFlag = true;
                    }, this)
                ));
                this._attack *= 2;
            }
        }
    },
    bombDie:function () {
        this.setPosition(cc.pAdd(this.getPosition(), cc.p(-25, -10)));
        this._super();
    }
});

var PoleZombie = Zombie.extend({
    ctor:function (row) {
        this._super(row, ZombieType.PoleZombie);
        this.setAnchorPoint(cc.p(0.5, 0.4));
        this._shadow.setPosition(cc.p(240, 20));
    },
    checkStage:function () {
        for (var i = 1; i < this._stageList.length; ) {
            if (this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.POLE_NO_HEAD) {
                if (!this._isNoHead) {
                    this.lostHead();
                }
            }
            if (this._HP <= this._stageList[0].HP && this._HP > this._stageList[1].HP) {
                break;
            } else {
                this._stageList.shift();
                this._changeFlag = true;
            }
        }
    },
    lostHead:function () {
        this._isNoHead = true;
        this._velocity /= 2;
        var head = new PoleHead();
        head.setPosition(cc.pAdd(this.getPosition(), cc.p(20, 0)));
        this.getParent().addChild(head);
    },
    searchPlant:function (dt) {
        if (this._target == null) {
            this.unschedule(this.attack);
            this.setPosition(cc.p(this.getPositionX() - dt * this._velocity, this.getPositionY()));
            for (var i = 0; i < PZ.CONTAINER.PLANTS[this.getRow() - 1].length; ++i) {
                this._target = PZ.CONTAINER.PLANTS[this.getRow() - 1][i];
                if (this._target && this._target.isLive()
                    && Math.abs(this.getPositionX() - this._target.getPositionX()) < this._distance) {
                    if (this._stageList[0].ACTION == PZ.ZOMBIE_STAGE.POLE_FAST) {
                        if (this._target.getContentSize().height <= 115) {
                            var action = new PoleJumpAction();
                            this.stopAllActions();
                            this.runAction(cc.Sequence.create(
                                action,
                                cc.CallFunc.create(function (sender) {
                                    sender._stageList[0] = {HP:sender._stageList[0].HP, ACTION:PZ.ZOMBIE_STAGE.POLE_SLOW};
                                    sender._changeFlag = true;
                                    sender._velocity /= 2;
                                    sender._target = null;
                                }, this)
                            ));
                            break;
                        } else {
                            this._stageList[0] = {HP:this._stageList[0].HP, ACTION:PZ.ZOMBIE_STAGE.POLE_SLOW};
                            this._changeFlag = true;
                            this._velocity /= 2;
                            this._target = null;
                        }
                    } else {
                        this.addState(PZ.ZOMBIE_STATE.ATTACK);
                        this._changeFlag = true;
                        this.schedule(this.attack, 1);
                        break;
                    }
                } else {
                    this._target = null;
                }
            }
        }
    },
    bombDie:function () {
        this.setPosition(cc.pAdd(this.getPosition(), cc.p(38, -25)));
        this._shadow.setPosition(cc.pAdd(this._shadow.getPosition(), cc.p(-130, -10)));
        this._super();
    }
});
