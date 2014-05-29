/**
 * Created by gt60 on 13-10-18.
 */
var dirCard = "res/Card/";
var dirImg  = "res/Image/";
var dirLay  = "res/Layer/";
var dirPla  = "res/Plant/";
var dirZom  = "res/Zombie/";

var res = {      
    //layer
    logo        : dirLay + "Logo.jpg",
    surface     : dirLay + "Surface.png",
    bg_day      : dirLay + "background_day.jpg",
    bg_night    : dirLay + "background_night.jpg",
    
    //plant
    Peashooter_plist      : dirPla + "Peashooter.plist",
    SnowPea_plist         : dirPla + "SnowPea.plist",
    Repeater_plist        : dirPla + "Repeater.plist",
    Threepeater_plist     : dirPla + "Threepeater.plist",
    GatlingPea_plist      : dirPla + "GatlingPea.plist",
    Jalapeno_plist        : dirPla + "Jalapeno.plist",
    CherryBomb_plist      : dirPla + "CherryBomb.plist",
    SunFlower_plist       : dirPla + "SunFlower.plist",
    TwinSunflower_plist   : dirPla + "TwinSunflower.plist",
    WallNut_plist         : dirPla + "WallNut.plist",
    TallNut_plist         : dirPla + "TallNut.plist",
    Chomper_plist         : dirPla + "Chomper.plist",
    DoomShroom_plist      : dirPla + "DoomShroom.plist",
    FumeShroom_plist      : dirPla + "FumeShroom.plist",
    Garlic_plist          : dirPla + "Garlic.plist",
    GloomAndCoffee_plist  : dirPla + "GloomAndCoffee.plist",
    IceShroom_plist       : dirPla + "IceShroom.plist",
    PotatoMine_plist      : dirPla + "PotatoMine.plist",
    Pumpkin_plist         : dirPla + "Pumpkin.plist",
    ScaredyAndPuff_plist  : dirPla + "ScaredyAndPuff.plist",
    Spikeweed_plist       : dirPla + "Spikeweed.plist",
    SunShroom_plist       : dirPla + "SunShroom.plist",
    Torchwood_plist       : dirPla + "Torchwood.plist",
    SplitPeaAndSquash_plist : dirPla + "SplitPeaAndSquash.plist",
    SpikerockAndHypno_plist : dirPla + "SpikerockAndHypno.plist",
    Starfruit_plist       : dirPla + "Starfruit.plist",
    
    //zombie
    Zombie_plist           : dirZom + "Zombie.plist",
    BucketheadZombie_plist : dirZom + "BucketheadZombie.plist",
    ConeheadZombie_plist   : dirZom + "ConeheadZombie.plist",
    FlagZombie_plist       : dirZom + "FlagZombie.plist",
    BombDie_plist          : dirZom + "BombDie.plist",
    NewspaperZombie_plist  : dirZom + "NewspaperZombie.plist",
    PoleVaultingZombie_plist : dirZom + "PoleVaultingZombie.plist",
    
    
    //image
    scrStart              : dirImg + "SelectorScreenStartAdventur.png",
    scrSurvival           : dirImg + "SelectorScreenSurvival.png",
    logoLine              : dirImg + "LogoLine.png",
    closeNoraml           : dirImg + "CloseNormal.png",
    closeSelected         : dirImg + "CloseSelected.png",
    help                  : dirImg + "Help.png",
    gameLayer_plist       : dirImg + "GameLayer.plist",
    sun_plist             : dirImg + "Sun.plist",
    GloomShroomBullet     : dirImg + "GloomShroomBullet.png",
    FumeShroomBullet      : dirImg + "FumeShroomBullet.png",
    OptionsMenuback       : dirImg + "OptionsMenuback.png",
    OptionsBackButton     : dirImg + "OptionsBackButton.png",
    checkBox_empty        : dirImg + "options_checkbox0.png",
    checkBox_selected     : dirImg + "options_checkbox1.png",
    button                : dirImg + "Button.png",
    PlantSelect           : dirImg + "SeedChooser_Background.png",
    DoomExplosion         : dirImg + "DoomShroom_Explosion.png",
    DoomExplosion_top     : dirImg + "DoomShroom_Explosion_Top.png",
    Snow1                 : dirImg + "SnowFlakes1.png",
    Snow2                 : dirImg + "SnowFlakes2.png",
    Snow3                 : dirImg + "SnowFlakes3.png",
    progressFull          : dirImg + "FlagMeterFull.png",
    ZombiesWon            : dirImg + "ZombiesWon.png",
    
    //card
    dayCards_plist      : dirCard + "DayCards.plist",
    nightCards_plist    : dirCard + "NightCards.plist"
};

var g_resources = [
    //layer
    res.logo,
    res.surface,
    res.bg_day,
    res.bg_night,

    //plant
    res.Peashooter_plist,
    res.SnowPea_plist,
    res.Repeater_plist,
    res.Threepeater_plist,
    res.GatlingPea_plist,
    res.Jalapeno_plist,
    res.CherryBomb_plist,
    res.SunFlower_plist,
    res.TwinSunflower_plist,
    res.WallNut_plist,
    res.TallNut_plist,
    res.Starfruit_plist,

    res.Chomper_plist,
    res.DoomShroom_plist,
    res.FumeShroom_plist,
    res.Garlic_plist,
    res.GloomAndCoffee_plist,
    res.IceShroom_plist,
    res.PotatoMine_plist,
    res.Pumpkin_plist,
    res.ScaredyAndPuff_plist,
    res.Spikeweed_plist,
    res.SunShroom_plist,
    res.Torchwood_plist,
    res.SplitPeaAndSquash_plist,
    res.SpikerockAndHypno_plist,

    //zombie
    res.Zombie_plist,
    res.BucketheadZombie_plist,
    res.ConeheadZombie_plist,
    res.FlagZombie_plist,
    res.BombDie_plist,
    res.NewspaperZombie_plist,
    res.PoleVaultingZombie_plist,

    //audio

    //image
    res.scrStart,
    res.scrSurvival,
    res.logoLine,
    res.closeNoraml,
    res.closeSelected,
    res.help,
    res.gameLayer_plist,
    res.sun_plist,
    res.GloomShroomBullet,
    res.FumeShroomBullet,
    res.OptionsMenuback,
    res.OptionsBackButton,
    res.checkBox_empty,
    res.checkBox_selected,
    res.button,
    res.PlantSelect,
    res.DoomExplosion,
    res.DoomExplosion_top,
    res.Snow1,
    res.Snow2,
    res.Snow3,
    res.progressFull,
    res.ZombiesWon,

    //card
    res.dayCards_plist,
    res.nightCards_plist
];