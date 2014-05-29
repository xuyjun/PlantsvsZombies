/**
 * Created by gt60 on 13-10-22.
 */
var Bullet = cc.Sprite.extend({
    _attack:0,
    _radiu:0,
    _velocity:cc.p(0, 0),

    _row:null,
    _effect:null,
    getRow:function () {
        return this._row;
    },
    ctor:function (row) {
        this._super();
        this._row = row;
        this.scheduleUpdate();
    },
    initData:function (type) {
        this._attack = type.ATTACK;
        this._radiu = type.RADIU;
        this._velocity = type.VELOCITY;
    },
    update:function (dt) {
        this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this._velocity, dt)));
        for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && zombie.isLive() && this.collideWithZombie(zombie)) {
                zombie.hurt(this._attack);
                this.makeEffect(zombie);
                this.destroy();
                break;
            }
        }
        var posX = this.getPositionX();
        var posY = this.getPositionY();
        if (posX < GRID_LEFT - 50 || posX > GRID_RIGHT + 200 || posY < GRID_BOTTOM - 10 || posY > GRID_TOP + 30) {
            this.destroy();
        }
    },
    collideWithZombie:function (zombie) {
        var disY = Math.abs(this.getPositionY() - zombie.getPositionY());
        var disX = Math.abs(this.getPositionX() - zombie.getPositionX());
        return disY <= 30 && disX <= this._radiu;
    },
    destroy:function () {
        if (this._effect) {
            var pos = this.getPosition();
            this._effect.setPosition(pos);
            this.getParent().addChild(this._effect, 10);
        }
        this.removeFromParent(true);
    },
    makeEffect:function (zombie) {
        //override me
    }
});

var PeaBullet = Bullet.extend({
    ctor:function (row) {
        this._super(row);
        this._effect = new PeaHitEffect();

        this.initWithSpriteFrameName("PeaBullet.png");
        this.initData(BulletType.PeaBullet);

        var rotate = cc.RotateBy.create(0.5, 360);
        var action = cc.RepeatForever.create(rotate);
        this.runAction(action);

        PZ.CONTAINER.BULLET[row - 1].push(this);
    },
    destroy:function () {
        this._super();

        for (var i in PZ.CONTAINER.BULLET[this.getRow() - 1]) {
            var bullet = PZ.CONTAINER.BULLET[this.getRow() - 1][i];
            if (bullet && bullet == this) {
                PZ.CONTAINER.BULLET[this.getRow() - 1][i] = null;
                break;
            }
        }
    }
});

var SnowBullet = Bullet.extend({
    ctor:function (row) {
        this._super(row);
        this._effect = new PeaHitEffect();
        this._effect.setColor(cc.color(100, 150, 255));

        this.initWithSpriteFrameName("SnowBullet.png");
        this.initData(BulletType.PeaBullet);

        PZ.CONTAINER.BULLET[this.getRow() - 1].push(this);
    },
    makeEffect:function (zombie) {
        zombie.setFreeze(5);
    },
    destroy:function () {
        this._super();

        for (var i in PZ.CONTAINER.BULLET[this.getRow() - 1]) {
            var bullet = PZ.CONTAINER.BULLET[this.getRow() - 1][i];
            if (bullet && bullet == this) {
                PZ.CONTAINER.BULLET[this.getRow() - 1][i] = null;
                break;
            }
        }
    }
});

var ShroomBullet = Bullet.extend({
    ctor:function (row) {
        this._super(row);
        this._effect = new ShroomEffect();

        this.initWithSpriteFrameName("ShroomBullet_1.png");
        this.initData(BulletType.ShroomBullet);

        var action = createAnimate("ShroomBullet", 5, 0.09);
        this.runAction(action);
    }
});

var FireBullet = Bullet.extend({
    ctor:function (row) {
        this._super(row);
        this._effect = new PeaHitEffect();

        this.initWithSpriteFrameName("fireBullet_1.png");
        this.initData(BulletType.FireBullet);

        var action = createRepeatAnimate("fireBullet", 2, 0.1);
        this.runAction(action);
    }
});

var StarBullet = Bullet.extend({
    ctor:function (type) {
        this._super();

        this.initWithSpriteFrameName("Star.png");
        this.initData(BulletType.StarBullet);
        switch (type) {
            case StarBullet.UP          : this._velocity = cc.p(0, 300); break;
            case StarBullet.DOWN        : this._velocity = cc.p(0, -300); break;
            case StarBullet.LEFT        : this._velocity = cc.p(-500, 0); break;
            case StarBullet.RIGHT_UP    : this._velocity = cc.p(500, 300); break;
            case StarBullet.RIGHT_DOWN  : this._velocity = cc.p(500, -300); break;
            default : break;
        }

        var action = cc.RepeatForever.create(cc.RotateBy.create(1, 360));
        this.runAction(action);
    },
    collideWithZombie:function (zombie) {
        return cc.pDistance(this.getPosition(), zombie.getPosition()) < this._radiu;
    },
    update:function (dt) {
        this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this._velocity, dt)));
        for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
            for (var j = 0; j < PZ.CONTAINER.ZOMBIES[i].length; ++j) {
                var zombie = PZ.CONTAINER.ZOMBIES[i][j];
                if (zombie && zombie.isLive() && this.collideWithZombie(zombie)) {
                    zombie.hurt(this._attack);
                    this.destroy();
                    break;
                }
            }
        }
        var posX = this.getPositionX();
        var posY = this.getPositionY();
        if (posX < GRID_LEFT - 50 || posX > GRID_RIGHT + 200 || posY < GRID_BOTTOM - 10 || posY > GRID_TOP + 30) {
            this.destroy();
        }
    }
});

StarBullet.UP         = 1;
StarBullet.DOWN       = 2;
StarBullet.LEFT       = 3;
StarBullet.RIGHT_UP   = 4;
StarBullet.RIGHT_DOWN = 5;


/**
 *  Range attack
 */
var RangeBullet = Bullet.extend({
    _bulletAnimation:null,
    ctor:function (row) {
        this._super(row);
        this.unscheduleUpdate();
        this.scheduleOnce(this.update);
    },
    update:function (dt) {
        for (var i = 0; i < PZ.CONTAINER.ZOMBIES.length; ++i) {
            for (var j = 0; j < PZ.CONTAINER.ZOMBIES[i].length; ++j) {
                var zombie = PZ.CONTAINER.ZOMBIES[i][j];
                if (zombie && zombie.isLive() && this.collideWithZombie(zombie)) {
                    this.attack(zombie);
                }
            }
        }
        this.effect();
    },
    destroy:function () {
        this.setVisible(false);
        this.removeFromParent(true);
    },
    attack:function (zombie) {
        //override me
    },
    effect:function () {
        //override me
    }
});

var FumeShroomBullet = RangeBullet.extend({
    ctor:function () {
        this._super();

        this._bulletAnimation = FumeBulletAnimation();
        this.initWithFile(res.FumeShroomBullet, cc.rect(0, 0, 343, 62));
        this.initData(BulletType.FumeShroomBullet);
    },
    attack:function (zombie) {
        zombie.hurt(this._attack);
    },
    effect:function () {
        this.runAction(cc.Sequence.create(
            this._bulletAnimation,
            cc.CallFunc.create(function (sender) {
                sender.destroy();
            }, this)
        ));
    }
});

var GloomShroomBullet = RangeBullet.extend({
    ctor:function () {
        this._super();

        this._bulletAnimation = GloomBulletAnimation();
        this.initWithFile(res.GloomShroomBullet, cc.rect(0, 0, 210, 200));
        this.setAnchorPoint(cc.p(0.5, 0.7));
        this.initData(BulletType.GloomShroomBullet);
    },
    attack:function (zombie) {
        var attack = cc.CallFunc.create(function (sender) {
            zombie.hurt(sender._attack);
        }, this);
        var delay = cc.DelayTime.create(0.4);
        var attackAction = cc.Repeat.create(cc.Sequence.create(attack, delay), 3);

        this.runAction(attackAction);
    },
    effect:function () {
        this.runAction(cc.Sequence.create(
            this._bulletAnimation,
            cc.CallFunc.create(function (sender) {
                sender.destroy();
            }, this)
        ));
    },
    collideWithZombie:function (zombie) {
        return cc.pDistance(this.getPosition(), zombie.getPosition()) < this._radiu;
    }
});

/**
 *  割草机
 */
var LawnMower = Bullet.extend({
    _state:0, //0 is ready, 1 is attack
    ctor:function (row) {
        this._super(row);

        this.initWithSpriteFrameName("LawnMower.png");
        this.initData(BulletType.LawnMower);
    },
    update:function (dt) {
        for (var i = 0; i < PZ.CONTAINER.ZOMBIES[this.getRow() - 1].length; ++i) {
            var zombie = PZ.CONTAINER.ZOMBIES[this.getRow() - 1][i];
            if (zombie && zombie.isLive() && this.collideWithZombie(zombie)) {
                this._state = 1;
                zombie.hurt(this._attack);
            }
        }
        if (this._state) {
            this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this._velocity, dt)));
        }
    }
});