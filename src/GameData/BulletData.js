/**
 * Created by gt60 on 13-11-11.
 */
var BulletType = {
    PeaBullet:{
        ATTACK:2,
        RADIU:10,
        VELOCITY:cc.p(500, 0)
    },
    ShroomBullet:{
        ATTACK:1,
        RADIU:10,
        VELOCITY:cc.p(400, 0)
    },
    FireBullet:{
        ATTACK:3,
        RADIU:10,
        VELOCITY:cc.p(500, 0)
    },
    StarBullet:{
        ATTACK:2,
        RADIU:40,
        VELOCITY:cc.p(0, 0)
    },
    /**
     *  Range Bullet
     */
    FumeShroomBullet:{
        ATTACK:2,
        RADIU:350,
        VELOCITY:cc.p(0, 0)
    },
    GloomShroomBullet:{
        ATTACK:2,
        RADIU:200,
        VELOCITY:cc.p(0, 0)
    },
    /**
     *  割草机
     */
    LawnMower:{
        ATTACK:999,
        RADIU:50,
        VELOCITY:cc.p(700, 0)
    }
};