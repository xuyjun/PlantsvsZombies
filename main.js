cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    cc.view.setDesignResolutionSize(900, 600, cc.ResolutionPolicy.SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    PZLoaderScene.preload(g_resources, function () {
        cc.director.runScene(LogoLayer.scene());
    });
};
cc.game.run();