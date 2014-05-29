/**
 * Created by gt60 on 13-10-21.
 */
var Plant = cc.Sprite.extend({
    _HP:0,
    _price:0,
    _isLive:true,
    _row:0,
    _col:0,
    _shadow:null,

    ctor:function () {
        this._super();
        this._shadow = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("plantshadow32.png"));
        this._shadow.setPosition(cc.p(30, 5));
        this._shadow.setVisible(false);
        this.addChild(this._shadow, -2);
    },
    initData:function(type) {
        this._HP = type.HP;
        this._price = type.PRICE / 2;
        this._row = 0;
        this._col = 0;
    },
    getRow:function () {
        return this._row;
    },
    getCol:function () {
        return this._col;
    },
    isLive:function () {
        return this._isLive;
    },
    sell:function () {
        PZ.SUN += parseInt(this._price, 10);
        this._isLive = false;
        this.removeFromParent(true);
        delete PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1];
    },
    canGrow:function (plant) {
        var bRet = true;
        if (plant instanceof Pumpkin) {
            if (plant.isEquip()) {
                bRet = false;
            }
        } else if (plant != null) {
            bRet = false;
        }
        return bRet;
    },
    grow:function (row, col) {
        this._row = row;
        this._col = col;
        this._shadow.setVisible(true);

        //泥土
        var soil = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("GrowSoil.png"));
        soil.setPosition(cc.p(30, 5));
        var fade = cc.FadeOut.create(0.5, 255);
        soil.runAction(cc.Sequence.create(fade, cc.CallFunc.create(this.removeChild, this)));
        this.addChild(soil, -1);

        if (PZ.CONTAINER.PLANTS[row - 1][col - 1] instanceof Pumpkin) {
            var pumpkin = PZ.CONTAINER.PLANTS[row - 1][col - 1];
            PZ.CONTAINER.PLANTS[row - 1][col - 1] = this;
            pumpkin.grow(row, col);
            PZ.CONTAINER.PLANTS[row - 1][col - 1] = pumpkin;
        } else {
            PZ.CONTAINER.PLANTS[row - 1][col - 1] = this;
        }

        this.getParent().reorderChild(this, 6 - row);
    },
    hurt:function (value) {
        this._HP -= value;
        if (this._HP <= 0) {
            this.die();
        }
    },
    die:function () {
        if (this._isLive != false) {
            this._isLive = false;
            if (PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1] instanceof Pumpkin) {
                PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1].target = null;
                PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1]._isEquip = false;
            } else {
                PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1] = null;
            }
            this.stopAllActions();
            this.removeFromParent(true);
        }
    },
    /**
     * For Sleep Plant
     */
    _wakeAction:null,
    _sleepAction:null,
    _isSleep:false,
    isSleep:function () {
        return this._isSleep;
    },
    wakeUp:function () {
        this._isSleep = false;
        this.stopAllActions();
        this.runAction(this._wakeAction);
    }
});

var Crater = Plant.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("crater.png");
        this.setAnchorPoint(cc.p(0.5, 1));
        this._isLive = false;
    },
    grow:function (row,col) {
        this._row = row;
        this._col = col;
        PZ.CONTAINER.PLANTS[row - 1][col - 1] = this;
        this.getParent().reorderChild(this, 6 - row);
        this.scheduleOnce(this.recover, 10);
    },
    recover:function () {
        var disappear = new CraterFading();
        disappear.setPosition(this.getPosition());
        this.getParent().addChild(disappear, 0);

        this.die();
    },
    die:function () {
        if (PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1] instanceof Pumpkin) {
            PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1].target = null;
            PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1]._isEquip = false;
        } else {
            PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1] = null;
        }
        this.stopAllActions();
        this.removeFromParent(true);
    }
});

/**
 * BombPlant
 */
var BombPlant = Plant.extend({
    _bombAction:null,
    grow:function (row, col) {
        this._super(row, col);

        this.runAction(cc.Sequence.create(
            this._bombAction,
            cc.CallFunc.create(function (sender) {
                sender.bomb();
                sender.die();
            }, this)
        ));
    },
    bomb:function () {
        //override me
    }
});

var Jalapeno = BombPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Jalapeno_1.png");
        this.initData(PlantType.Jalapeno);
        this._bombAction = createAnimate("Jalapeno", 8, 0.09);
    },
    bomb:function () {
        var row = this.getRow();
        var pos = cc.p((GRID_LEFT + GRID_WIDTH / 2 + GRID_WIDTH * 4 + 10), GRID_BOTTOM - GRID_HEIGHT / 2 + GRID_HEIGHT * row + 20);
        var effecf = new FireEffect();
        effecf.setPosition(pos);
        this.getParent().addChild(effecf, this.getRow());

        for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && this.getRow() == zombie.getRow()) {
                zombie.bombDie();
            }
        }
    }
});

var CherryBomb = BombPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("CherryBomb_1.png");
        this.initData(PlantType.CherryBomb);
        this._bombAction = createAnimate("CherryBomb", 7, 0.09);
    },
    bomb:function () {
        var pos = this.getPosition();
        var effecf = new BombEffect();
        effecf.setPosition(pos);
        this.getParent().addChild(effecf, this.getRow());

        for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
            for (var j = 0; j < PZ.CONTAINER.ZOMBIES[i].length; ++j) {
                var zombie = PZ.CONTAINER.ZOMBIES[i][j];
                if (zombie && cc.pDistance(this.getPosition(), zombie.getPosition()) <= 150) {
                    zombie.bombDie();
                }
            }
        }
    }
});

/**
 * Flower
 */
var Flower = Plant.extend({
    grow:function (row, col) {
        this._super(row, col);
        this.schedule(this.produceSun, 10);
    },
    produceSun:function () {
        var sun = new Sun();
        sun.setPosition(this.getPosition());

        var angel = parseInt((Math.random() * 360), 10);
        var aim = cc.p(80 * Math.cos(angel), 80 * Math.sin(angel));
        sun.runAction(cc.JumpBy.create(0.8, aim, 50, 1));

        this.getParent().addChild(sun, 10);
    }
});

var SunFlower = Flower.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("SunFlower_1.png");
        this.initData(PlantType.SunFlower);

        var action = createRepeatAnimate("SunFlower", 18, 0.11);
        this.runAction(action);
    },
    produceSun:function () {
        this._super();
    }
});

var TwinSunflower = Flower.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("TwinSunflower_1.png");
        this.initData(PlantType.TwinSunflower);

        var action = createRepeatAnimate("TwinSunflower", 20, 0.09);
        this.runAction(action);
    },
    produceSun:function () {
        this._super();
        this._super();
    }
});

/**
 * Nut
 */
var Nut = Plant.extend({
    _nowStage:null,
    _cracked1:null,
    _cracked2:null,
    hurt:function (value) {
        this._super(value);
        if (this._HP <= 10) {
            if (this._nowStage != this._cracked2) {
                this.stopAction(this._nowStage);
                this._nowStage = this.runAction(this._cracked2);
            }
        } else if (this._HP <= 20){
            if (this._nowStage != this._cracked1) {
                this.stopAction(this._nowStage);
                this._nowStage = this.runAction(this._cracked1);
            }
        }
    }
});

var WallNut = Nut.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("WallNut_1.png");
        this.initData(PlantType.WallNut);

        this._nowStage = createRepeatAnimate("WallNut", 16, 0.09);
        this._cracked1 = createRepeatAnimate("Wallnut_cracked1", 11, 0.1);
        this._cracked2 = createRepeatAnimate("Wallnut_cracked2", 15, 0.1);
        this.runAction(this._nowStage);
    }
});

var TallNut = Nut.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("TallNut_1.png");
        this.initData(PlantType.TallNut);
        this.setAnchorPoint(cc.p(0.5, 0.25));

        this._nowStage = createRepeatAnimate("TallNut", 14, 0.09);
        this._cracked1 = createRepeatAnimate("TallnutCracked1", 13, 0.09);
        this._cracked2 = createRepeatAnimate("TallnutCracked2", 12, 0.09);
        this.runAction(this._nowStage);
    }
});

/**
 * Spike
 */
var Spike = Plant.extend({
    _attack:0,
    _target:null,
    _isLive:false,
    grow:function (row, col) {
        this._super(row, col);
        this.removeAllChildren(true);
        this.scheduleUpdate();
    },
    initData:function (type) {
        this._super(type);
        this._attack = type.ATTACK;
    },
    update:function (dt) {
        if (this._target == null) {
            for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
                this._target = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
                if (this._target && this.searchZombie(this._target)) {
                    this.attack();
                    this.schedule(this.attack, 1);
                    break;
                }
            }
        }
        if (this._target && !(this._target.isLive() && this.searchZombie(this._target))) {
            this._target = null;
            this.unschedule(this.attack);
        }
    },
    searchZombie:function (zombie) {
        var posX = this.getPositionX();
        var zombieX = zombie.getPositionX();
        return this.getRow() == zombie.getRow()
            && (zombieX - posX >= -80 && zombieX - posX <= 40);
    },
    attack:function () {
        for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && this.searchZombie(zombie)) {
                zombie.hurt(this._attack);
            }
        }
        this.hurt(this._attack);
    }
});

var Spikeweed = Spike.extend({
    ctor:function () {
        this._super();
        this._attack = 0.5;

        this.initWithSpriteFrameName("Spikeweed_1.png");
        this.initData(PlantType.Spikeweed);
        this.setAnchorPoint(cc.p(0.5, 1));

        var action = createRepeatAnimate("Spikeweed", 19, 0.09);
        this.runAction(action);
    }
});

var Spikerock = Spike.extend({
    ctor:function () {
        this._super();
        this._attack = 1;

        this.initWithSpriteFrameName("Spikerock_1.png");
        this.initData(PlantType.Spikerock);
        this.setAnchorPoint(cc.p(0.5, 1));

        var action = createRepeatAnimate("Spikerock", 8, 0.18);
        this.runAction(action);
    }
});

/**
 * Chomper
 */
var Chomper = Plant.extend({
    _CD:0,
    _normal:null,
    _eat:null,
    _digest:null,
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Chomper_1.png");
        this.initData(PlantType.Chomper);
        this._CD = PlantType.Chomper.RECOVER_CD;
        this.setAnchorPoint(cc.p(0.3, 0.3));

        this._normal = createRepeatAnimate("Chomper", 13, 0.18);
        this._eat = createAnimate("ChomperAttack", 9, 0.09);
        this._digest = createRepeatAnimate("ChomperDigest", 6, 0.18);
        this.runAction(this._normal);
    },
    grow:function (row, col) {
        this._super(row, col);
        this.scheduleUpdate();
    },
    update:function (dt) {
        for (var i in PZ.CONTAINER.ZOMBIES[this.getRow() - 1]) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && this.searchZombie(zombie)) {
                this.stopAllActions();
                var action = cc.Sequence.create(
                    this._eat,
                    cc.CallFunc.create(function (sender) {
                        zombie.eaten();
                        sender.runAction(sender._digest);
                    }, this)
                );
                this.runAction(action);
                this.scheduleOnce(this.recover, this._CD);
                this.unscheduleUpdate();
                break;
            }
        }
    },
    searchZombie:function (zombie) {
        var posX = this.getPositionX();
        var zombieX = zombie.getPositionX()
        return this.getRow() == zombie.getRow()
            && (0 <= zombieX - posX && zombieX - posX <= 100);
    },
    recover:function () {
        this.stopAllActions();
        this.runAction(this._normal);
        this.scheduleUpdate();
    }
});

/**
 * Torchwood
 */
var Torchwood = Plant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Torchwood_1.png");
        this.initData(PlantType.Torchwood);

        var action = createRepeatAnimate("Torchwood", 9, 0.1);
        this.runAction(action);
    },
    grow:function (row, col) {
        this._super(row, col);
        this.scheduleUpdate();
    },
    update:function (dt) {
        for (var i in PZ.CONTAINER.BULLET[this.getRow() - 1]) {
            var bullet = PZ.CONTAINER.BULLET[this.getRow() - 1][i];
            if (bullet && Math.abs(bullet.getPositionX() - this.getPositionX()) <= dt * bullet._velocity.x >> 1) {
                PZ.CONTAINER.BULLET[this.getRow() - 1][i] = null;

                var newBullet;
                if (bullet instanceof PeaBullet) {
                    newBullet = new FireBullet(this.getRow());
                    newBullet.setPosition(bullet.getPosition());
                    if (bullet._velocity < 0) {
                        newBullet._velocity = bullet._velocity;
                        newBullet.setRotation(180);
                    }
                    bullet.removeFromParent(true);
                } else {
                    newBullet = new PeaBullet(this.getRow());
                    newBullet.setPosition(bullet.getPosition());
                    bullet.removeFromParent(true);
                }

                this.getParent().addChild(newBullet, 10);
            }
        }
    }
});

/**
 * Squash
 */
var Squash = Plant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Squash_1.png");
        this.initData(PlantType.Squash);
        this.setAnchorPoint(cc.p(0.5, 0.2));

        var action = createRepeatAnimate("Squash", 17, 0.09);
        this.runAction(action);
    },
    grow:function (row, col) {
        this._super(row, col);
        this._shadow.setPosition(cc.p(45, 10));
        this.scheduleUpdate();
    },
    searchZombie:function (zombie) {
        var posX = this.getPositionX();
        var zombieX = zombie.getPositionX()
        return this.getRow() == zombie.getRow()
            && (zombieX - posX >= -100 && zombieX - posX <= 100);
    },
    update:function (dt) {
        for (var i in PZ.CONTAINER.ZOMBIES[this.getRow() - 1]) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && this.searchZombie(zombie)) {
                var animFrame = [];
                for (var j = 1; j <= 4; ++j) {
                    var str = "SquashAttack_" + j + ".png";
                    var frame = cc.spriteFrameCache.getSpriteFrame(str);
                    animFrame.push(frame);
                    if (j == 1) {
                        animFrame.push(frame);
                        animFrame.push(frame);
                    } else if (j == 3) {
                        animFrame.push(frame);
                    }
                }
                var animation = cc.Animation.create(animFrame, 0.09);
                var animate = cc.Animate.create(animation);

                this.stopAllActions();
                this.unscheduleUpdate();
                this._isLive = false;
                this.runAction(cc.Sequence.create(
                    cc.EaseExponentialInOut.create(cc.MoveTo.create(0.5, cc.pAdd(zombie.getPosition(), cc.p(0, 120)))),
                    cc.CallFunc.create(function (sender) {
                        sender.setPosition(cc.pAdd(sender.getPosition(), cc.p(0, -160)));
                    }, this),
                    animate,
                    cc.DelayTime.create(0.5),
                    cc.CallFunc.create(function (sender) {
                        zombie.eaten();
                        sender._isLive = true;
                        sender.die();
                    }, this)
                ));
                break;
            }
        }
    }
});

/**
 *  PotatoMine
 */
var PotatoMine = Plant.extend({
    _readyAction:null,
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("PotatoMine_2.png");
        this.initData(PlantType.PotatoMine);

        this._readyAction = createRepeatAnimate("PotatoMine", 8, 0.2);
        this.runAction(this._readyAction);
    },
    grow:function (row, col) {
        this._super(row, col);

        this.stopAllActions();
        this.initWithSpriteFrameName("PotatoMineNotReady.png");
        this.scheduleOnce(this.ready, 1);
    },
    ready:function () {
        this._isLive = false;
        this.scheduleUpdate();
        this.runAction(this._readyAction);
    },
    update:function (dt) {
        for (var i in PZ.CONTAINER.ZOMBIES[this.getRow() - 1]) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && this.searchZombie(zombie)) {
                this.stopAllActions();

                var explode = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("ExplosionSpudow.png"));
                explode.setPosition(cc.p(70, 100));

                this.runAction(cc.Sequence.create(
                    cc.CallFunc.create(function (sender) {
                        sender.initWithSpriteFrameName("PotatoMine_mashed.png");
                        sender.addChild(explode);
                        zombie.eaten();
                    }, this),
                    cc.DelayTime.create(1.5),
                    cc.CallFunc.create(function (sender) {
                        sender.die();
                    }, this)
                ));
                break;
            }
        }
    },
    searchZombie:function (zombie) {
        var posX = this.getPositionX();
        var zombieX = zombie.getPositionX()
        return this.getRow() == zombie.getRow()
            && (zombieX - posX >= -50 && zombieX - posX <= 50);
    }
});

/**
 *  Pumpkin
 */
var Pumpkin = Plant.extend({
    _isEquip:false,
    _back:null,
    _nowSprite:null,
    _target:null,
    _tag:0,
    ctor:function () {
        this._super();

        this._nowSprite = "PumpkinHead1_1.png";
        this.initWithSpriteFrameName(this._nowSprite);
        this.setAnchorPoint(cc.p(0.5, 0.7));
        this.initData(PlantType.Pumpkin);
        this._tag = 99;

        this._back = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("Pumpkin_back.png"));
        this._back.runAction(createRepeatAnimate("PumpkinHead2", 16, 0.09));
        this._back.setPosition(cc.p(48, 33));
        this.addChild(this._back, -1);

        var action = createRepeatAnimate("PumpkinHead1", 16, 0.09);
        this.runAction(action);
    },
    setOpacity:function (value) {
        this._super(value);
        this._back.setOpacity(value);
    },
    canGrow:function (plant) {
        var bRet = true;
        if (plant instanceof Pumpkin || plant instanceof Crater) {
            bRet = false;
        }
        return bRet;
    },
    grow:function (row, col) {
        if (PZ.CONTAINER.PLANTS[row - 1][col - 1]) {
            this._isEquip = true;
            this._target = PZ.CONTAINER.PLANTS[row - 1][col - 1];
        }
        this._super(row, col);

        if (this._tag == 99) {
            this._tag = row * COL_MAX + col;
            this.removeChild(this._back, false);
            this.getParent().addChild(this._back, 5 - row, this._tag);
            this._back.setPosition(cc.pSub(this.getPosition(), cc.p(0, 15)));
        } else {
            var back = this.getParent().getChildByTag(this._tag);
            this.getParent().reorderChild(back, 5 - row);
        }

        this.getParent().reorderChild(this, 7 - row);
    },
    hurt:function (value) {
        this._super(value);
        if (this._HP <= 10) {
            if (this._nowSprite != "Pumpkin_damage2.png") {
                this._nowSprite = "Pumpkin_damage2.png";
                this.stopAllActions();
                this.initWithSpriteFrameName(this._nowSprite);
                this.setAnchorPoint(cc.p(0.5, 0.6));
            }
        } else if (this._HP <= 20){
            if (this._nowSprite != "pumpkin_damage1.png") {
                this._nowSprite = "pumpkin_damage1.png";
                this.stopAllActions();
                this._back.stopAllActions();
                this._back.initWithSpriteFrameName("Pumpkin_back.png");
                this.initWithSpriteFrameName(this._nowSprite);
                this.setAnchorPoint(cc.p(0.5, 0.7));
            }
        }
    },
    isEquip:function () {
        return this._isEquip;
    },
    die:function () {
        if (this.getParent()) {
            this.getParent().removeChildByTag(this._tag);
        }
        this._super();
        PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1] = this._target;
    },
    sell:function () {
        if (this.getParent()) {
            this.getParent().removeChildByTag(this._tag);
        }
        this._super();
        PZ.CONTAINER.PLANTS[this.getRow() - 1][this.getCol() - 1] = this._target;
    }
});

/**
 * Garlic
 */
var Garlic = Plant.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("Garlic_1.png");
        this.initData(PlantType.Garlic);

        var action = createRepeatAnimate("Garlic", 12, 0.09);
        this.runAction(action);
    },
    searchZombie:function (zombie) {
        var posX = this.getPositionX();
        var zombieX = zombie.getPositionX();
        return this.getRow() == zombie.getRow()
            && Math.abs(zombieX - posX) <= 20;
    },
    hurt:function (value) {
        var _super = this._super;
        for (var i in PZ.CONTAINER.ZOMBIES[this.getRow() - 1]) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && this.searchZombie(zombie)
                && (zombie.getState() & PZ.ZOMBIE_STATE.ATTACK)) {
                var move, row = zombie.getRow();
                if (row <= 1) {
                    move = 1;
                } else if (row >= 5) {
                    move = -1
                } else {
                    move = (Math.random() > 0.5) ? 1 : -1;
                }
                zombie.setRow(row + move);
                PZ.CONTAINER.ZOMBIES[row - 1].splice(i, 1);
                PZ.CONTAINER.ZOMBIES[row - 1 + move].push(zombie);
                zombie.runAction(cc.Sequence.create(
                    cc.MoveBy.create(0.5, cc.p(-GRID_WIDTH / 2, GRID_HEIGHT * move)),
                    cc.CallFunc.create(function (sender) {
                        sender._target = null;
                        sender.removeState(PZ.ZOMBIE_STATE.ATTACK);
                        sender._changeFlag = true;
                        _super.call(this, value);
                    }, this)
                ));
                break;
            }
        }
    }
});

var IceShroom = BombPlant.extend({
    _iceTime:0,
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("IceShroom_1.png");
        this.initData(PlantType.IceShroom);
        this._bombAction = createAnimate("IceShroom", 9, 0.2);
    },
    initData:function (type) {
        this._super(type);
        this._iceTime = type.ICE_TIME;
    },
    bomb:function () {
        IceExplosion.create(this.getPosition(), this.getParent());

        for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
            for (var j = 0; j < PZ.CONTAINER.ZOMBIES[i].length; ++j) {
                var zombie = PZ.CONTAINER.ZOMBIES[i][j];
                if (zombie) {
                    zombie.setIceTie(this._iceTime);
                    zombie.setFreeze(10);
                    zombie.hurt(0.5);
                }
            }
        }
    }
});

var DoomShroom = BombPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("DoomShroom_1.png");
        this.initData(PlantType.DoomShroom);
        this._bombAction = createAnimate("DoomShroom", 13, 0.1);
    },
    bomb:function () {
        var explosion = new DoomExplosion();
        explosion.setScale(0.5);
        explosion.setPosition(this.getPosition());
        explosion.setAnchorPoint(cc.p(0.5, 0.2))
        this.getParent().addChild(explosion, 10);

        for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
            for (var j = 0; j < PZ.CONTAINER.ZOMBIES[i].length; ++j) {
                var zombie = PZ.CONTAINER.ZOMBIES[i][j];
                if (zombie && cc.pDistance(zombie.getPosition(), this.getPosition()) <= 250) {
                    zombie.bombDie();
                }
            }
        }

        var crater = new Crater();
        crater.setPosition(this.getPosition());
        this.getParent().addChild(crater);
        crater.grow(this.getRow(), this.getCol());
    },
    die:function () {
        if (this._isLive != false) {
            this._isLive = false;
            this.stopAllActions();
            this.removeFromParent(true);
        }
    }
});