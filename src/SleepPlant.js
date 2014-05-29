/**
 * Created by gt60 on 13-11-8.
 */
var _sleepGrow = function (row, col) {
    this._super(row, col);

    if (PZ.NOW_TIME == PZ.TIME.DAY) {
        this._isSleep = true;
        this.stopAllActions();
        this.unscheduleUpdate();
        this.runAction(this._sleepAction);
        return true;
    } else {
        this.wakeUp();
        return false;
    }
};
var SunShroom = Flower.extend({
    _isGrowUp:false,
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("SunShroom2_1.png");
        this.initData(PlantType.SunShroom);


        this._sleepAction = createRepeatAnimate("SunShroomSleep", 14, 0.1);
        this._wakeAction= createRepeatAnimate("SunShroom2", 10, 0.1);
        this.runAction(this._wakeAction);
    },
    grow:function (row, col) {
        Plant.prototype.grow.call(this, row, col);
        if (PZ.NOW_TIME == PZ.TIME.DAY) {
            this._isSleep = true;
            this.stopAllActions();
            this.unscheduleUpdate();
            this.runAction(this._sleepAction);
            return true;
        } else {
            this.wakeUp();
            return false
        }
    },
    wakeUp:function () {
        this._super();
        this.schedule(this.produceSun, 10);
        this.scheduleOnce(this.growUp, 30);
    },
    produceSun:function () {
        if (!this._isGrowUp) {
            var sun = new Sun();
            sun.setPosition(this.getPosition());
            sun.setScale(0.7);
            sun._sun = 12;

            var angel = parseInt((Math.random() * 360), 10);
            var aim = cc.p(40 * Math.cos(angel), 40 * Math.sin(angel));
            sun.runAction(cc.JumpBy.create(0.8, aim, 30, 1));

            this.getParent().addChild(sun, 10);
        } else {
            this._super();
        }
    },
    growUp:function () {
        this.stopAllActions();
        var action = createRepeatAnimate("SunShroom", 10, 0.1);
        this.runAction(action);
        this._isGrowUp = true;
    }
});

var PuffShroom = ShootPlant.extend({
    ctor:function () {
        this._super();
        this._shadow.setPosition(cc.p(20, 5));
        this.initWithSpriteFrameName("PuffShroom_1.png");
        this.initData(PlantType.PuffShroom);

        this._sleepAction = createRepeatAnimate("PuffShroomSleep", 17, 0.09);
        this._wakeAction = createRepeatAnimate("PuffShroom", 14, 0.09);
        this.runAction(this._wakeAction);
    },
    grow:_sleepGrow,
    wakeUp:function () {
        this._super();
        this.scheduleUpdate();
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.x += 20;
        var bullet = new ShroomBullet(this.getRow());
        bullet.setPosition(pos);
        bullet.setAnchorPoint(cc.p(0, 1));
        this.getParent().addChild(bullet, this.getRow());
    }
});

var ScaredyShroom = ShootPlant.extend({
    _isScaredy:false,
    _scaredyAction:null,
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("ScaredyShroom_1.png");
        this.initData(PlantType.ScaredyShroom);
        this.setAnchorPoint(cc.p(0.6, 0.3));

        this._scaredyAction = createRepeatAnimate("ScaredyShroomCry", 11, 0.09);
        this._sleepAction = createRepeatAnimate("ScaredyShroomSleep", 16, 0.09);
        this._wakeAction = createRepeatAnimate("ScaredyShroom", 17, 0.09);
        this.runAction(this._wakeAction);
    },
    update:function (dt) {
        var mypos = this.getPosition();
        for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && zombie.isLive() && cc.pDistance(zombie.getPosition(), mypos) <= 200) {
                if (this._isScaredy != true) {
                    this.stopAllActions();
                    this.unschedule(this.shoot);
                    this._isScaredy = true;
                    this.runAction(this._scaredyAction);
                    return;
                } else {
                    return;
                }
            }
        }
        if (this._isScaredy != false) {
            this.stopAllActions();
            this._isScaredy = false;
            this.runAction(this._wakeAction);
        }
        this._super(dt);
    },
    grow:_sleepGrow,
    wakeUp:function () {
        this._super();
        this.scheduleUpdate();
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.x += 35;
        pos.y += 5;
        var bullet = new ShroomBullet(this.getRow());
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    }
});

var FumeShroom = ShootPlant.extend({
    ctor:function () {
        this._super();
        this._shadow.setPosition(cc.p(40, 10));
        this.initWithSpriteFrameName("FumeShroom_1.png");
        this.initData(PlantType.FumeShroom);
        this.setAnchorPoint(cc.p(0.4, 0.5));

        this._sleepAction = createRepeatAnimate("FumeShroomSleep", 14, 0.1);
        this._wakeAction = createRepeatAnimate("FumeShroom", 16, 0.1);
        this.runAction(this._wakeAction);
    },
    grow:_sleepGrow,
    wakeUp:function () {
        this._super();
        this.scheduleUpdate();
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.x += 48;
        pos.y += 12;
        var bullet = new FumeShroomBullet();
        bullet.setPosition(pos);
        bullet.setAnchorPoint(cc.p(0, 0.5));
        this.runAction(cc.Sequence.create(
            cc.CallFunc.create(function (sender) {
                sender.stopAction(this._wakeAction);
                sender.initWithSpriteFrameName("FumeShroomAttack_1.png");
                sender.getParent().addChild(bullet, this.getRow());
            }, this),
            cc.DelayTime.create(0.5),
            cc.CallFunc.create(function (sender) {
                sender.runAction(this._wakeAction);
            }, this)
        ));
    }
});

var GloomShroom = ShootPlant.extend({
    _shroom:null,
    ctor:function () {
        this._super();
        this._shadow.setPosition(cc.p(45, 5));
        this.initWithSpriteFrameName("GloomShroom_1.png");
        this.initData(PlantType.GloomShroom);

        this._sleepAction = createRepeatAnimate("GloomShroomSleep", 13, 0.1);
        this._wakeAction = createRepeatAnimate("GloomShroom", 12, 0.1);
        this.runAction(this._wakeAction);
    },
    canGrow:function (plant) {
        var bRet = false;
        if (plant) {
            if (plant instanceof FumeShroom) {
                this._shroom = plant;
                bRet = true;
            } else if (plant._target instanceof FumeShroom) {
                this._shroom = plant._target;
                bRet = true;
            }
        }
        return bRet;
    },
    grow:function (row, col) {
        this._shroom.die();
        /*this._super(row, col);*/   //这行注释不能删掉
        _sleepGrow.call(this, row, col);
    },
    wakeUp:function () {
        this._super();
        this.scheduleUpdate();
    },
    update:function (dt) {
        if (this._target == null) {
            for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
                for (var j = 0; j < PZ.CONTAINER.ZOMBIES[i].length; ++j) {
                    this._target = PZ.CONTAINER.ZOMBIES[i][j];
                    if (this._target && this._target.isLive() && this.searchZombie(this._target)) {
                        this.shoot();
                        this.schedule(this.shoot, this._attackTime);
                        return;
                    }
                }
            }
        }
        if (this._target && !(this._target.isLive() && this.searchZombie(this._target))) {
            this._target = null;
            this.unschedule(this.shoot);
        }
    },
    searchZombie:function (zombie) {
        return zombie.getPositionX() <= GRID_RIGHT + 50
            && cc.pDistance(this.getPosition(), zombie.getPosition()) < 150;
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.y += 30;
        var bullet = new GloomShroomBullet();
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    }
});

var CoffeeBean = Plant.extend({
    _target:null,
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("CoffeeBean_1.png");
        this.initData(PlantType.CoffeeBean);
        this.setAnchorPoint(cc.p(0.5, 0.2));

        var action = createRepeatAnimate("CoffeeBean", 7, 0.1);
        this.runAction(action);
    },
    canGrow:function (plant) {
        var bRet = false;
        if (plant) {
            if (plant.isSleep()) {
                this._target = plant;
                bRet = true;
            } else if (plant instanceof Pumpkin && plant._target.isSleep()) {
                this._target = plant._target;
                bRet = true;
            }
        }
        return bRet;
    },
    grow:function (row, col) {
        if (this._target) {
            this.runAction(cc.Sequence.create(
                cc.DelayTime.create(1),
                cc.CallFunc.create(function (sender) {
                    sender._target.wakeUp();
                }, this)
            ));
        }
        this.scheduleUpdate();
    },
    update:function () {
        if (!this._target.isLive()) {
            this.stopAllActions();
            var action = createAnimate("CoffeeBeanEat", 16, 0.1);
            this.runAction(cc.Sequence.create(
                action,
                cc.CallFunc.create(function (sender) {
                    sender.removeFromParent(true);
                }, this)
            ));
            this.unscheduleUpdate();
        }
    }
});
