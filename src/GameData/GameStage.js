/**
 * Created by gt60 on 13-11-16.
 */
var GameStage = {};
GameStage.Test = {
    TIME:PZ.TIME.DAY,
    SUN:9999,
    TITLE:"测试关卡",
    STAGE_NUM:3,
    CARDS_MAX:10,
    CARDS:[
        PlantType.Peashooter,
        PlantType.SplitPea,
        PlantType.SnowPea,
        PlantType.Repeater,
        PlantType.Threepeater,
        PlantType.GatlingPea,
        PlantType.Jalapeno,
        PlantType.CherryBomb,
        PlantType.SunFlower,
        PlantType.TwinSunflower,
        PlantType.WallNut,
        PlantType.TallNut,
        PlantType.Spikeweed,
        PlantType.Spikerock,
        PlantType.Chomper,
        PlantType.Torchwood,
        PlantType.Squash,
        PlantType.PotatoMine,
        PlantType.Pumpkin,
        PlantType.Garlic,
        PlantType.IceShroom,
        PlantType.DoomShroom,
        PlantType.Starfruit,
        PlantType.SunShroom,
        PlantType.PuffShroom,
        PlantType.FumeShroom,
        PlantType.ScaredyShroom,
        PlantType.GloomShroom,
        PlantType.CoffeeBean
    ],
    ZOMBIES_SHOW:[2, 2, 2, 2, 2, 1],
    ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
        [[5,5,5,5,5,5],
         [3,0,0,0,0,0],
         [3,0,0,0,0,0],
         [1,1,0,0,0,0]],

        [[1,0,0,0,0,1],
         [1,0,0,0,0,0],
         [1,0,0,0,0,0],
         [1,1,1,1,1,1]],

        [[1,0,0,0,0,1],
         [1,0,0,0,0,0],
         [1,0,0,0,0,0],
         [1,1,1,1,1,1]]
    ]
};

GameStage.Stage1_1 = {
    TIME:PZ.TIME.DAY,
        SUN:7500,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
        PlantType.Peashooter,
        PlantType.SunFlower,
        PlantType.Chomper,
        PlantType.Garlic
    ],
        ZOMBIES_SHOW:[5, 1, 1, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
        [[1,0,0,0,0,0],
            //[1,0,0,0,0,0, 1,0,0,0,0,0],
            //[2,0,0,0,0,0, 2,0,0,0,0,0],
            [1,1,0,0,0,0, 1,1,0,0,0,0]],

        [[3,2,0,0,0,1],
            // [1,1,0,0,0,0, 0,0,1,0,0,0],
            //[4,0,0,0,0,0, 2,3,0,0,0,0],
            [3,2,1,0,0,1, 3,2,2,0,0,0]]
    ]
};

GameStage.Stage1_2 = {
    TIME:PZ.TIME.DAY,
    SUN:75,
    TITLE:"关卡1-1",
    STAGE_NUM:2,
    CARDS_MAX:3,
    CARDS:[
        PlantType.Peashooter,
        PlantType.SunFlower,
        PlantType.Chomper,
        PlantType.Garlic
    ],
    ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
    ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
        [[1,0,0,0,0,0],
            [1,0,0,0,0,0, 1,0,0,0,0,0],
            [2,0,0,0,0,0, 2,0,0,0,0,0],
            [1,1,0,0,0,0, 1,1,0,0,0,0]],

        [[3,2,0,0,0,1],
            [1,1,0,0,0,0, 0,0,1,0,0,0],
            [4,0,0,0,0,0, 2,3,0,0,0,0],
            [3,2,1,0,0,1, 3,2,2,0,0,0]]
    ]
};

GameStage.Test.NEXT_STAGE      = GameStage.Stage1_1;
GameStage.Stage1_1.NEXT_STAGE  = GameStage.Stage1_2;
GameStage.Stage1_2.NEXT_STAGE  = GameStage.Stage1_1;
/*
GameStage = {
    Stage1_2:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_3
    },
    Stage1_3:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_4
    },
    Stage1_4:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_
    },
    Stage1_5:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_6
    },
    Stage1_6:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_7
    },
    Stage1_7:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_8
    },
    Stage1_8:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_9
    },
    Stage1_9:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Stage1_10
    },
    Stage1_10:{
        TIME:PZ.TIME.DAY,
        SUN:75,
        TITLE:"关卡1-1",
        STAGE_NUM:2,
        CARDS_MAX:3,
        CARDS:[
            PlantType.Peashooter,
            PlantType.SunFlower,
            PlantType.Chomper,
            PlantType.Garlic
        ],
        ZOMBIES_SHOW:[5, 0, 0, 0, 0, 1],
        ZOMBIES:[   //[normal, coneHead, bucketHead, pole, newspaper, flag]
            [[1,0,0,0,0,0],
                [1,0,0,0,0,0, 1,0,0,0,0,0],
                [2,0,0,0,0,0, 2,0,0,0,0,0],
                [1,1,0,0,0,0, 1,1,0,0,0,0]],

            [[3,2,0,0,0,1],
                [1,1,0,0,0,0, 0,0,1,0,0,0],
                [4,0,0,0,0,0, 2,3,0,0,0,0],
                [3,2,1,0,0,1, 3,2,2,0,0,0]]
        ],
        NEXT_STAGE:GameStage.Test
    }
}
    */