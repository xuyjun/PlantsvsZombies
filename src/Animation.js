/**
 * Created by gt60 on 13-10-25.
 */
var createRepeatAnimate = function (spriteName, framesNum, delay) {
    var animFrame = [];
    for (var j = 1; j <= framesNum; ++j) {
        var str = spriteName +"_" + j + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
    }
    var animation = cc.Animation.create(animFrame, delay);
    var animate = cc.RepeatForever.create(cc.Animate.create(animation));
    return animate;
};

var createAnimate = function (spriteName, framesNum, delay) {
    var animFrame = [];
    for (var j = 1; j <= framesNum; ++j) {
        var str = spriteName +"_" + j + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
    }
    var animation = cc.Animation.create(animFrame, delay);
    var animate = cc.Animate.create(animation);
    return animate;
};

//Zombies Action
var NormalAction = function () {
    var animFrame = [];
    for (var i = 1; i <= 22; ++i) {
        var str = "Zombie_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
        if (i % 2 == 0) {
            animFrame.push(frame);
        }
    }
    var animation = cc.Animation.create(animFrame, 0.09);
    var animate = cc.Animate.create(animation);
    return cc.RepeatForever.create(animate);
};

var NormalAction2 = function () {
    return createRepeatAnimate("Zombie3", 18, 0.2);
};

var NoHeadAction = function () {
    var animFrame = [];
    for (var i = 1; i <= 18; ++i) {
        var str = "ZombieLostHead_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
        if (i % 2 == 0) {
            animFrame.push(frame);
        }
    }
    var animation = cc.Animation.create(animFrame, 0.1);
    var animate = cc.Animate.create(animation);
    return cc.RepeatForever.create(animate);
};

var LostHeadAction = function () {
    var animFrame = [];
    for (var i = 1; i <= 12; ++i) {
        var str = "ZombieHead_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
        switch (i) {
            case 6:
            case 16:
                animFrame.push(frame);
            case 1:
                animFrame.push(frame);
                break;
        }
    }
    var animation = cc.Animation.create(animFrame, 0.04);
    var animate = cc.Animate.create(animation);
    return animate;
};

var BombDieAction = function () {
    var animFrame = [];
    for (var i = 1; i <= 20; ++i) {
        var str = "BombDie_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
        if (i == 10 || i == 11) {
            animFrame.push(frame);
        }
    }
    var animation = cc.Animation.create(animFrame, 0.1);
    var animate = cc.Animate.create(animation);
    return animate;
};

var DieAction = function () {
    var animFrame = [];
    for (var i = 1; i <= 10; ++i) {
        var str = "ZombieDie_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
        if (i == 3) {
            animFrame.push(frame);
        }
    }
    var animation = cc.Animation.create(animFrame, 0.1);
    var animate = cc.Animate.create(animation);
    return animate;
};

var AttackAction = function () {
    return createRepeatAnimate("ZombieAttack", 21, 0.1);
}

var NoHeadAttackAction = function () {
    return createRepeatAnimate("ZombieLostHeadAttack", 11, 0.1);
};


/**
 * ConeHatZombie
 */
var ConeHatAction = function () {
    return createRepeatAnimate("ConeheadZombie", 21, 0.18);
};

var ConeHatAttackAction = function () {
    return createRepeatAnimate("ConeheadZombieAttack", 11, 0.09);
};

/**
 * BucketZombie
 */
var BucketHatAction = function () {
    return createRepeatAnimate("BucketheadZombie", 15, 0.18);
};

var BucketHatAttackAction = function () {
    return createRepeatAnimate("BucketheadZombieAttack", 11, 0.09);
};

/**
 * FlagZombie
 */
var FlagNormalAction = function () {
    return createRepeatAnimate("FlagZombie", 12, 0.18);
};

var FlagAttackAction = function () {
    return createRepeatAnimate("FlagZombieAttack", 11, 0.09);
};

var FlagNoHeadAction = function () {
    return createRepeatAnimate("FlagZombieLostHead", 12, 0.2);
};

var FlagNoHeadAttackAction = function () {
    return createRepeatAnimate("FlagZombieLostHeadAttack", 11, 0.09);
};

/**
 * NewspaperZombie
 */
var PaperSlowWalkAction = function () {
    return createRepeatAnimate("HeadWalk1", 19, 0.2);
};

var PaperFastWalkAction = function () {
    return createRepeatAnimate("HeadWalk0", 14, 0.1);
};

var PaperSlowAttackAction = function () {
    return createRepeatAnimate("HeadAttack1", 8, 0.1);
};

var PaperFastAttackAction = function () {
    return createRepeatAnimate("HeadAttack0", 7, 0.1);
};

/**
 * NewspaperZombie no head
 */
var NoHeadSlowWalkAction = function () {
    return createRepeatAnimate("LostHeadWalk1", 38, 0.1);
};

var NoHeadFastWalkAction = function () {
    return createRepeatAnimate("LostHeadWalk0", 16, 0.1);
};

var NoHeadSlowAttackAction = function () {
    return createRepeatAnimate("LostHeadAttack1", 8, 0.1);
};

var NoHeadFastAttackAction = function () {
    return createRepeatAnimate("LostHeadAttack0", 7, 0.1);
};

/**
 * NewspaperZombie die, lost head and lost newspaper
 */
var PaperDieAction = function () {
    return createAnimate("Die", 11, 0.1);
};

var PaperLostHeadAction = function () {
    return createAnimate("Head", 10, 0.1);
};

var PaperLostPaperAction = function () {
    return createAnimate("LostNewspaper", 11, 0.1);
};

/**
 * PoleVaultingZombie
 */
var PoleSlowWalkAction = function () {
    return createRepeatAnimate("PoleVaultingZombieWalk", 25, 0.2);
};

var PoleFastWalkAction = function () {
    return createRepeatAnimate("PoleVaultingZombie", 10, 0.1);
};

var PoleAttackAction = function () {
    return createRepeatAnimate("PoleVaultingZombieAttack", 14, 0.1);
};

/**
 * PoleVaultingZombie no head
 */
var PoleNoHeadWalkAction = function () {
    return createRepeatAnimate("PoleVaultingZombieLostHeadWalk", 29, 0.2);
};

var PoleNoHeadAttackAction = function () {
    return createRepeatAnimate("PoleVaultingZombieLostHeadAttack", 14, 0.1);
};

/**
 * PoleVaultingZombie die, lost head and jump
 */
var PoleDieAction = function () {
    return createAnimate("PoleVaultingZombieDie", 9, 0.1);
};

var PoleLostHeadAction = function () {
    var animFrame = [];
    for (var i = 1; i <= 8; ++i) {
        var str = "PoleVaultingZombieHead_" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrame.push(frame);
        if (i == 2) {
            animFrame.push(frame);
        }
    }
    var animation = cc.Animation.create(animFrame, 0.1);
    var animate = cc.Animate.create(animation);
    return animate;
};

//todo modify this action
var PoleJumpAction = function () {
    var action1 = createAnimate("PoleVaultingZombieJump", 10, 0.1);
    var action2 = createAnimate("PoleVaultingZombieJump2", 7, 0.1);

    return cc.Sequence.create(
        action1,
        cc.CallFunc.create(function (sender) {
            sender.setPosition(cc.pAdd(sender.getPosition(), cc.p(-115, 0)));
        }, this),
        action2
    );
};

var createAnimaeByStage = function (tag) {
    switch (tag) {
        case PZ.ZOMBIE_STAGE.DIE                 : return DieAction();

        case PZ.ZOMBIE_STAGE.NORMAL              : return NormalAction();
        case PZ.ZOMBIE_STAGE.NORMAL_ATTACK       : return AttackAction();
        case PZ.ZOMBIE_STAGE.NO_HEAD             : return NoHeadAction();
        case PZ.ZOMBIE_STAGE.NO_HEAD_ATTACK      : return NoHeadAttackAction();

        case PZ.ZOMBIE_STAGE.CONE_HAT            : return ConeHatAction();
        case PZ.ZOMBIE_STAGE.CONE_HAT_ATTACK     : return ConeHatAttackAction();

        case PZ.ZOMBIE_STAGE.BUCKET_HAT          : return BucketHatAction();
        case PZ.ZOMBIE_STAGE.BUCKET_HAT_ATTACK   : return BucketHatAttackAction();

        case PZ.ZOMBIE_STAGE.FLAG_NORMAL         : return FlagNormalAction();
        case PZ.ZOMBIE_STAGE.FLAG_ATTACK         : return FlagAttackAction();
        case PZ.ZOMBIE_STAGE.FLAG_NO_HEAD        : return FlagNoHeadAction();
        case PZ.ZOMBIE_STAGE.FLAG_NO_HEAD_ATTACK : return FlagNoHeadAttackAction();

        case PZ.ZOMBIE_STAGE.PAPER_DIE                  : return PaperDieAction();

        case PZ.ZOMBIE_STAGE.PAPER_SLOW                 : return PaperSlowWalkAction();
        case PZ.ZOMBIE_STAGE.PAPER_SLOW_ATTACK          : return PaperSlowAttackAction();
        case PZ.ZOMBIE_STAGE.PAPER_FAST                 : return PaperFastWalkAction();
        case PZ.ZOMBIE_STAGE.PAPER_FAST_ATTACK          : return PaperFastAttackAction();
        case PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_SLOW         : return NoHeadSlowWalkAction();
        case PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_SLOW_ATTACK  : return NoHeadSlowAttackAction();
        case PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_FAST         : return NoHeadFastWalkAction();
        case PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_FAST_ATTACK  : return NoHeadFastAttackAction();

        case PZ.ZOMBIE_STAGE.POLE_DIE                   : return PoleDieAction();

        case PZ.ZOMBIE_STAGE.POLE_SLOW                  : return PoleSlowWalkAction();
        case PZ.ZOMBIE_STAGE.POLE_ATTACK                : return PoleAttackAction();
        case PZ.ZOMBIE_STAGE.POLE_FAST                  : return PoleFastWalkAction();
        case PZ.ZOMBIE_STAGE.POLE_NO_HEAD               : return PoleNoHeadWalkAction();
        case PZ.ZOMBIE_STAGE.POLE_NO_HEAD_ATTACK        : return PoleNoHeadAttackAction();
        default : return null;
    }
};

/**
 * Bullet Animation
 */
var FumeBulletAnimation = function () {
    var texture = cc.textureCache.addImage(res.FumeShroomBullet);
    var animation = cc.Animation.create();
    for (var j = 0; j < 8; ++j) {
        animation.addSpriteFrameWithTexture(texture, cc.rect(0, 62 * j, 343, 62))
    }
    animation.setDelayPerUnit(0.08);
    var animate = cc.Animate.create(animation);
    return animate;
};

var GloomBulletAnimation = function () {
    var texture = cc.textureCache.addImage(res.GloomShroomBullet);
    var animation = cc.Animation.create();
    for (var j = 1; j <= 12; ++j) {
        animation.addSpriteFrameWithTexture(texture, cc.rect(0, 200 * (12 - j), 210, 200))
    }
    animation.setDelayPerUnit(0.1);
    var animate = cc.Animate.create(animation);
    return animate;
};