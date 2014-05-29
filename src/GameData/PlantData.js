/**
 * Created by gt60 on 13-11-11.
 */
var PlantType = {
    /**
     * ShootPlant
     */
    Peashooter:{
        PLIST:res.Peashooter_plist,
        HP:3,
        PRICE:100,

        DISTANCE:900,
        TIME:2.5,

        CD:5,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"Peashooter.png",
        DISABLE:"PeashooterG.png",
        getPlant:function () {
            return new Peashooter();
        }
    },
    SplitPea:{
        PLIST:res.SplitPeaAndSquash_plist,
        HP:3,
        PRICE:100,

        DISTANCE:900,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"SplitPea.png",
        DISABLE:"SplitPeaG.png",
        getPlant:function () {
            return new SplitPea();
        }
    },
    SnowPea:{
        PLIST:res.SnowPea_plist,
        HP:3,
        PRICE:150,

        DISTANCE:900,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"寒冰射手\n\"无名\"\n冷却时间8秒",
        ENABLE:"SnowPea.png",
        DISABLE:"SnowPeaG.png",
        getPlant:function () {
            return new SnowPea();
        }
    },
    Repeater:{
        PLIST:res.Repeater_plist,
        HP:3,
        PRICE:200,

        DISTANCE:900,
        TIME:2.5,

        CD:10,
        DESCRIPTION:"连发两粒\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"Repeater.png",
        DISABLE:"RepeaterG.png",
        getPlant:function () {
            return new Repeater();
        }
    },
    Threepeater:{
        PLIST:res.Threepeater_plist,
        HP:3,
        PRICE:300,

        DISTANCE:900,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"变异种\n三头龙\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"Threepeater.png",
        DISABLE:"ThreepeaterG.png",
        getPlant:function () {
            return new Threepeater();
        }
    },
    GatlingPea:{
        PLIST:res.GatlingPea_plist,
        HP:3,
        PRICE:300,

        DISTANCE:900,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"变异种\n三头龙\n机关枪与水手服\n冷却时间5秒",
        ENABLE:"GatlingPea.png",
        DISABLE:"GatlingPeaG.png",
        getPlant:function () {
            return new GatlingPea();
        }
    },
    /**
     * BoomPlant
     */
    Jalapeno:{
        PLIST:res.Jalapeno_plist,
        HP:15,
        PRICE:150,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n机关枪与水手服\n冷却时间5秒",
        ENABLE:"Jalapeno.png",
        DISABLE:"JalapenoG.png",
        getPlant:function () {
            return new Jalapeno();
        }
    },
    CherryBomb:{
        PLIST:res.CherryBomb_plist,
        HP:15,
        PRICE:150,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"CherryBomb.png",
        DISABLE:"CherryBombG.png",
        getPlant:function () {
            return new CherryBomb();
        }
    },
    /**
     * flower
     */
    SunFlower:{
        PLIST:res.SunFlower_plist,
        HP:3,
        PRICE:50,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"SunFlower.png",
        DISABLE:"SunFlowerG.png",
        getPlant:function () {
            return new SunFlower();
        }
    },
    TwinSunflower:{
        PLIST:res.TwinSunflower_plist,
        HP:6,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"TwinSunflower.png",
        DISABLE:"TwinSunflowerG.png",
        getPlant:function () {
            return new TwinSunflower();
        }
    },
    /**
     * Nut
     */
    WallNut:{
        PLIST:res.WallNut_plist,
        HP:30,
        PRICE:50,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"WallNut.png",
        DISABLE:"WallNutG.png",
        getPlant:function () {
            return new WallNut();
        }
    },
    TallNut:{
        PLIST:res.TallNut_plist,
        HP:30,
        PRICE:75,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"TallNut.png",
        DISABLE:"TallNutG.png",
        getPlant:function () {
            return new TallNut();
        }
    },
    /**
     * Spike
     */
    Spikeweed:{
        PLIST:res.Spikeweed_plist,
        HP:3,
        PRICE:50,

        ATTACK:0.5,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"Spikeweed.png",
        DISABLE:"SpikeweedG.png",
        getPlant:function () {
            return new Spikeweed();
        }
    },
    Spikerock:{
        PLIST:res.SpikerockAndHypno_plist,
        HP:3,
        PRICE:75,

        ATTACK:0.8,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"Spikerock.png",
        DISABLE:"SpikerockG.png",
        getPlant:function () {
            return new Spikerock();
        }
    },
    /**
     * Chomper
     */
    Chomper:{
        PLIST:res.Chomper_plist,
        HP:3,
        PRICE:125,

        RECOVER_CD:10,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"Chomper.png",
        DISABLE:"ChomperG.png",
        getPlant:function () {
            return new Chomper();
        }
    },
    /**
     * Torchwood
     */
    Torchwood:{
        PLIST:res.Torchwood_plist,
        HP:3,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"Torchwood.png",
        DISABLE:"TorchwoodG.png",
        getPlant:function () {
            return new Torchwood();
        }
    },
    /**
     * Squash
     */
    Squash:{
        PLIST:res.SplitPeaAndSquash_plist,
        HP:3,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"Squash.png",
        DISABLE:"SquashG.png",
        getPlant:function () {
            return new Squash();
        }
    },
    /**
     *  PotatoMine
     */
    PotatoMine:{
        PLIST:res.PotatoMine_plist,
        HP:3,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"PotatoMine.png",
        DISABLE:"PotatoMineG.png",
        getPlant:function () {
            return new PotatoMine();
        }
    },
    /**
     *  Pumpkin
     */
    Pumpkin:{
        PLIST:res.Pumpkin_plist,
        HP:30,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"PumpkinHead.png",
        DISABLE:"PumpkinHeadG.png",
        getPlant:function () {
            return new Pumpkin();
        }
    },
    /**
     * Garlic
     */
    Garlic:{
        PLIST:res.Garlic_plist,
        HP:3,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"Garlic.png",
        DISABLE:"GarlicG.png",
        getPlant:function () {
            return new Garlic();
        }
    },
    IceShroom:{
        PLIST:res.IceShroom_plist,
        HP:3,
        PRICE:100,

        ICE_TIME:5,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"IceShroom.png",
        DISABLE:"IceShroomG.png",
        getPlant:function () {
            return new IceShroom();
        }
    },
    DoomShroom:{
        PLIST:res.DoomShroom_plist,
        HP:3,
        PRICE:100,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"DoomShroom.png",
        DISABLE:"DoomShroomG.png",
        getPlant:function () {
            return new DoomShroom();
        }
    },
    Starfruit:{
        PLIST:res.Starfruit_plist,
        HP:3,
        PRICE:100,

        DISTANCE:1000,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"Starfruit.png",
        DISABLE:"StarfruitG.png",
        getPlant:function () {
            return new Starfruit();
        }
    },
    /**
     * SleepPlant
     */
    SunShroom:{
        PLIST:res.SunShroom_plist,
        HP:6,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"SunShroom.png",
        DISABLE:"SunShroomG.png",
        getPlant:function () {
            return new SunShroom();
        }
    },
    PuffShroom:{
        PLIST:res.ScaredyAndPuff_plist,
        HP:3,
        PRICE:100,

        DISTANCE:400,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"PuffShroom.png",
        DISABLE:"PuffShroomG.png",
        getPlant:function () {
            return new PuffShroom();
        }
    },
    FumeShroom:{
        PLIST:res.FumeShroom_plist,
        HP:3,
        PRICE:100,

        DISTANCE:350,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"FumeShroom.png",
        DISABLE:"FumeShroomG.png",
        getPlant:function () {
            return new FumeShroom();
        }
    },
    ScaredyShroom:{
        PLIST:res.ScaredyAndPuff_plist,
        HP:3,
        PRICE:100,

        DISTANCE:850,
        TIME:2.5,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"ScaredyShroom.png",
        DISABLE:"ScaredyShroomG.png",
        getPlant:function () {
            return new ScaredyShroom();
        }
    },
    GloomShroom:{
        PLIST:res.GloomAndCoffee_plist,
        HP:3,
        PRICE:100,

        DISTANCE:300,
        TIME:3,

        CD:1,
        DESCRIPTION:"超级豌豆射手\n攻击力无限\n一万秒攻击一次\n冷却时间5秒",
        ENABLE:"GloomShroom.png",
        DISABLE:"GloomShroomG.png",
        getPlant:function () {
            return new GloomShroom();
        }
    },
    CoffeeBean:{
        PLIST:res.GloomAndCoffee_plist,
        HP:6,
        PRICE:125,

        CD:1,
        DESCRIPTION:"豹王烈焰\n好厉害的样子！\n爆炎之锤\n冷却时间5秒",
        ENABLE:"CoffeeBean.png",
        DISABLE:"CoffeeBeanG.png",
        getPlant:function () {
            return new CoffeeBean();
        }
    }
};