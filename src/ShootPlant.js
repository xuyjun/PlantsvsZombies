/**
 * Created by gt60 on 13-11-2.
 */
var ShootPlant = Plant.extend({
    _distance:null,
    _attackTime:null,
    _target:null,
    initData:function (type) {
        this._super(type);
        this._distance = type.DISTANCE;
        this._attackTime = type.TIME;
        this._coldTime = type.TIME;
    },
    grow:function (row, col) {
        this._super(row, col);
        this.scheduleUpdate();
    },
    update:function (dt) {
        if (this._target == null) {
            for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
                this._target = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
                if (this._target && this._target.isLive() && this.searchZombie(this._target)) {
                    this.shoot();
                    this.schedule(this.shoot, this._attackTime);
                    break;
                }
            }
        }
        if (this._target && !(this._target.isLive() && this.searchZombie(this._target))) {
            this._target = null;
            this.unschedule(this.shoot);
        }
    },
    searchZombie:function (zombie) {
        var myposX = this.getPositionX();
        var zposX = zombie.getPositionX();
        return this.getRow() == zombie.getRow() && zposX <= GRID_RIGHT + 50
            && zposX - myposX <= this._distance && zposX - myposX >= 0;
    },
    shoot:function () {
        //override me
    },
    die:function () {
        this._super();
        this.unscheduleUpdate();
    }
});

var Peashooter = ShootPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Peashooter_1.png");
        this.initData(PlantType.Peashooter);

        var action = createRepeatAnimate("Peashooter", 13, 0.09);
        this.runAction(action);
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.x += 15;
        pos.y += 20;
        var bullet = new PeaBullet(this.getRow());
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    }
});

var SplitPea = ShootPlant.extend({
    _backTarget:null,
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("SplitPea_1.png");
        this.initData(PlantType.SplitPea);

        this.stopAllActions();
        var action = createRepeatAnimate("SplitPea", 14, 0.09);
        this.runAction(action);
    },
    update:function () {
        if (this._target == null/* || this._backTarget == null*/) {
            for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
                if (this._target == null) {
                    this._target = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
                    if (this._target && this._target.isLive() && this.searchZombie(this._target)) {
                        this.shoot();
                        this.schedule(this.shoot, this._attackTime);
                        break;
                    } else {
                        this._target = null;
                    }
                }
                if (this._backTarget == null) {
                    this._backTarget = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
                    if (this._backTarget && this._backTarget.isLive() && this.backSearchZombie(this._backTarget)) {
                        this.backShoot();
                        this.schedule(this.backShoot, this._attackTime);
                        break;
                    } else {
                        this._backTarget = null;
                    }
                }
            }
        }
        if (this._target && !(this._target.isLive() && this.searchZombie(this._target))) {
            this._target = null;
            this.unschedule(this.shoot);
        }
        if (this._backTarget && !(this._backTarget.isLive() && this.backSearchZombie(this._backTarget))) {
            this._backTarget = null;
            this.unschedule(this.backShoot);
        }
    },
    backShoot:function () {
        var pos = this.getPosition();
        pos.x -= 15;
        pos.y += 20;
        var bullet = new PeaBullet(this.getRow());
        bullet._velocity *= -1;
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    },
    backSearchZombie:function (zombie) {
        var myposX = this.getPositionX();
        var zposX = zombie.getPositionX();
        return this.getRow() == zombie.getRow()
            && myposX - zposX <= this._distance && myposX - zposX >= 0;
    }
});

var SnowPea = ShootPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("SnowPea_1.png");
        this.initData(PlantType.Peashooter);

        var action = createRepeatAnimate("SnowPea", 15, 0.09);
        this.runAction(action);
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.x += 15;
        pos.y += 20;
        var bullet = new SnowBullet(this.getRow());
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    }
});

var Repeater = ShootPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Repeater_1.png");
        this.initData(PlantType.Repeater);

        var action = createRepeatAnimate("Repeater", 15, 0.09);
        this.runAction(action);
    },
    shoot:function () {
        this.runAction(cc.Sequence.create(
            cc.CallFunc.create(this.repeatShoot, this),
            cc.DelayTime.create(0.15),
            cc.CallFunc.create(this.repeatShoot, this))
        );
    },
    repeatShoot:function () {
        var pos = this.getPosition();
        pos.x += 15;
        pos.y += 20;
        var bullet = new PeaBullet(this.getRow());
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    }
});

var Threepeater = ShootPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Threepeater_1.png");
        this.initData(PlantType.Threepeater);

        var action = createRepeatAnimate("Threepeater", 16, 0.09);
        this.runAction(action);
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
        var myposX = this.getPositionX();
        var zposX = zombie.getPositionX();
        return Math.abs(this.getRow() - zombie.getRow()) <= 1 && zposX <= GRID_RIGHT + 50
            && zposX - myposX <= this._distance && zposX - myposX >= 0;
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.x += 15;
        pos.y += 20;
        for (var i = 0; i < 3; ++i) {
            var row = this.getRow() + i - 1;
            row = cc.clampf(row, 1, 5);
            var bullet = new PeaBullet(row);
            bullet.setPosition(pos);
            bullet.runAction(cc.EaseExponentialOut.create(cc.MoveBy.create(0.3, cc.p(0, -GRID_HEIGHT + GRID_HEIGHT * i))));
            this.getParent().addChild(bullet, row);
        }
    }
});

var GatlingPea = ShootPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("GatlingPea_2.png");
        this.initData(PlantType.GatlingPea);

        var action = createRepeatAnimate("GatlingPea", 13, 0.09);
        this.runAction(action);
    },
    shoot:function () {
        this.runAction(cc.Sequence.create(
            cc.CallFunc.create(this.repeatShoot, this),
            cc.DelayTime.create(0.15),
            cc.CallFunc.create(this.repeatShoot, this),
            cc.DelayTime.create(0.15),
            cc.CallFunc.create(this.repeatShoot, this))
        );
    },
    repeatShoot:function () {
        var pos = this.getPosition();
        pos.x += 15;
        pos.y += 20;
        var bullet = new PeaBullet(this.getRow());
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    }
});

var Starfruit = ShootPlant.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Starfruit_1.png");
        this.setAnchorPoint(cc.p(0.5, 0.8));
        this.initData(PlantType.Starfruit);

        var action = createRepeatAnimate("Starfruit", 13, 0.09);
        this.runAction(action);
    },
    grow:function (row, col) {
        this._super(row, col);
        this._shadow.setPosition(cc.p(-1000, -1000));
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
        return cc.pDistance(this.getPosition(), zombie.getPosition()) < this._distance;
    },
    shoot:function () {
        var pos = this.getPosition();
        pos.y -= 15;
        var bullet = new StarBullet(StarBullet.UP);
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
        bullet = new StarBullet(StarBullet.DOWN);
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
        bullet = new StarBullet(StarBullet.LEFT);
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
        bullet = new StarBullet(StarBullet.RIGHT_UP);
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
        bullet = new StarBullet(StarBullet.RIGHT_DOWN);
        bullet.setPosition(pos);
        this.getParent().addChild(bullet, this.getRow());
    }
});