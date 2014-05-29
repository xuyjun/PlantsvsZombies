/**
 * Created by gt60 on 13-11-11.
 */
var ZombieType = {
    Zombie_n:{
        HP:8,
        VELOCITY:10,
        STAGE:[
            {HP:8, ACTION:PZ.ZOMBIE_STAGE.NORMAL},
            {HP:4, ACTION:PZ.ZOMBIE_STAGE.NO_HEAD},
            {HP:0, ACTION:PZ.ZOMBIE_STAGE.DIE}
        ]
    },
    ConeheadZombie:{
        HP:20,
        VELOCITY:10,
        STAGE:[
            {HP:20, ACTION:PZ.ZOMBIE_STAGE.CONE_HAT},
            {HP:8,  ACTION:PZ.ZOMBIE_STAGE.NORMAL},
            {HP:4,  ACTION:PZ.ZOMBIE_STAGE.NO_HEAD},
            {HP:0,  ACTION:PZ.ZOMBIE_STAGE.DIE}
        ]
    },
    BucketheadZombie:{
        HP:30,
        VELOCITY:10,
        STAGE:[
            {HP:30, ACTION:PZ.ZOMBIE_STAGE.BUCKET_HAT},
            {HP:12, ACTION:PZ.ZOMBIE_STAGE.NORMAL},
            {HP:4,  ACTION:PZ.ZOMBIE_STAGE.NO_HEAD},
            {HP:0,  ACTION:PZ.ZOMBIE_STAGE.DIE}
        ]
    },
    NewspaperZombie:{
        HP:30,
        VELOCITY:10,
        STAGE:[
            {HP:30, ACTION:PZ.ZOMBIE_STAGE.PAPER_SLOW},
            {HP:12, ACTION:PZ.ZOMBIE_STAGE.PAPER_NO_HEAD_SLOW},
            {HP:0,  ACTION:PZ.ZOMBIE_STAGE.PAPER_DIE}
        ]
    },
    PoleZombie:{
        HP:30,
        VELOCITY:20,
        STAGE:[
            {HP:30, ACTION:PZ.ZOMBIE_STAGE.POLE_FAST},
            {HP:12, ACTION:PZ.ZOMBIE_STAGE.POLE_NO_HEAD},
            {HP:0,  ACTION:PZ.ZOMBIE_STAGE.POLE_DIE}
        ]
    },
    FlagZombie:{
        HP:12,
        VELOCITY:10,
        STAGE:[
            {HP:12, ACTION:PZ.ZOMBIE_STAGE.FLAG_NORMAL},
            {HP:4,  ACTION:PZ.ZOMBIE_STAGE.FLAG_NO_HEAD},
            {HP:0,  ACTION:PZ.ZOMBIE_STAGE.DIE}
        ]
    }
};
