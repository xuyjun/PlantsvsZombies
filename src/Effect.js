/**
 * Created by gt60 on 13-10-22.
 */
var PeaHitEffect = cc.Sprite.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("PeaBulletHit.png");

        var fade = cc.FadeOut.create(0.3);
        var action = cc.Sequence.create(fade, cc.CallFunc.create(this.removeFromParent, this));
        this.runAction(action);
    }
});

var ShroomEffect = cc.Sprite.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("ShroomBulletHit.png");

        var fade = cc.FadeOut.create(0.3);
        var action = cc.Sequence.create(fade, cc.CallFunc.create(this.removeFromParent, this));
        this.runAction(action);
    }
});

var FireEffect = cc.Sprite.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("JalapenoAttack_1.png");
        var animate = createAnimate("JalapenoAttack", 8, 0.18);

        var action = cc.Sequence.create(
            animate,
            cc.CallFunc.create(this.removeFromParent, this)
        );
        this.runAction(action);
    }
});

var BombEffect = cc.Sprite.extend({
    ctor:function () {
        this._super();

        this.initWithSpriteFrameName("Boom.png");

        var action = cc.Sequence.create(
            cc.FadeTo.create(1.5, 0),
            cc.CallFunc.create(this.removeFromParent, this)
        );
        this.runAction(action);
    }
});

var CraterFading = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithSpriteFrameName("crater_fading.png");
        this.setAnchorPoint(cc.p(0.5, 1));
        this.scheduleOnce(this.disappear, 10);
    },
    disappear:function () {
        this.removeFromParent(true);
    }
});

var IceTrap = cc.Sprite.extend({
    ctor:function (time) {
        this._super();
        this.initWithSpriteFrameName("icetrap.png");
        this.scheduleOnce(this.disappear, time);
    },
    disappear:function () {
        this.removeFromParent(true);
    }
});

var DoomExplosion = cc.Sprite.extend({
    ctor:function () {
        this._super();
        this.initWithFile(res.DoomExplosion);
        this.scheduleOnce(this.disappear, 1);

        var top1 = cc.Sprite.create(res.DoomExplosion_top);
        top1.setScale(1.2);
        top1.setPosition(cc.p(150, 500));
        var top2 = cc.Sprite.create(res.DoomExplosion_top);
        top2.setScale(1.2);
        top2.setPosition(cc.p(350, 500));

        var rotate = cc.RotateBy.create(1, 180);
        top1.runAction(rotate);
        top2.runAction(rotate.reverse());
        this.addChild(top1);
        this.addChild(top2);
    },
    disappear:function () {
        this.removeFromParent(true);
    }
});

var IceExplosion = cc.LayerColor.extend({
    _action:null,
    _explosion:null,
    ctor:function (point) {
        this._super();
        this.init(cc.color(180, 255, 255, 70), cc.visibleRect.width, cc.visibleRect.height);
        this._action = cc.FadeTo.create(0.5, 0);
        this.scheduleOnce(this.disappear, 1);

        this._explosion = cc.ParticleSystem.create(30);
        this._explosion.setPosition(point);
        this.addChild(this._explosion, 10);

        this._explosion.setTexture(cc.textureCache.addImage(res.Snow2));
        if (this._explosion.setShapeType)
            this._explosion.setShapeType(cc.ParticleSystem.BALL_SHAPE);

        this._explosion.setDuration(0.5);
        this._explosion.setGravity(cc.p(0, -150));
        this._explosion.setAngle(90);
        this._explosion.setAngleVar(360);
        this._explosion.setSpeed(300);
        this._explosion.setSpeedVar(100);
        this._explosion.setRadialAccel(0);
        this._explosion.setRadialAccelVar(0);
        this._explosion.setTangentialAccel(30);
        this._explosion.setTangentialAccelVar(0);
        this._explosion.setPosVar(cc.p(0, 0));
        this._explosion.setLife(0.5);
        this._explosion.setLifeVar(0);
        this._explosion.setStartSpin(0);
        this._explosion.setStartSpinVar(0);
        this._explosion.setEndSpin(0);
        this._explosion.setEndSpinVar(0);

        this._explosion.setStartColor(cc.color(255, 255, 255, 255));
        this._explosion.setStartColorVar(cc.color(0, 0, 0, 0));
        this._explosion.setEndColor(cc.color(255, 255, 255, 255));
        this._explosion.setEndColorVar(cc.color(0.0, 0.0, 0.0, 0.0));

        this._explosion.setStartSize(20.0);
        this._explosion.setStartSizeVar(10);
        this._explosion.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);
        this._explosion.setEmissionRate(this._explosion.getTotalParticles() / this._explosion.getLife());
        this._explosion.setBlendAdditive(false);
    },
    disappear:function () {
        this.setOpacity(0);
    },
    show:function () {
        this.runAction(this._action);
    }
});

IceExplosion.create = function (point, layer) {
    if (this._instance == null) {
        this._instance = new IceExplosion(point);
        layer.addChild(this._instance, 10);
    } else {
        this._instance.setOpacity(70);
        this._instance._explosion.setPosition(point);
        this._instance._explosion.resetSystem();
    }
    this._instance.show();
};
