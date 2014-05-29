var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },
    applicationDidFinishLaunching:function () {
        if(cc.RenderDoesnotSupport()){
            //show Information to user
            alert("Browser doesn't support WebGL");
            return false;
        }
        // initialize director
        var director = cc.Director.getInstance();

        cc.EGLView.getInstance()._adjustSizeToBrowser();
        cc.EGLView.getInstance().adjustViewPort(true);
        cc.EGLView.getInstance().setDesignResolutionSize(900, 600, cc.RESOLUTION_POLICY.SHOW_ALL);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        //load resources
        PZLoaderScene.preload(g_resources, function () {
            director.replaceScene(new this.startScene());
        }, this);

        return true;
    }
});
var myApp = new cocos2dApp(LogoLayer.scene);
//var myApp = new cocos2dApp(WelcomeLayer.scene);
//var myApp = new cocos2dApp(GameLayer.scene);

/*
var winSize = null;
winSize = cc.Director.getInstance().getWinSize();

var VisibleRect = {
    rect:function () {
        return cc.Rect(0, 0, winSize.width, winSize.height);
    },
    center:function () {
        return cc.p(winSize.width / 2, winSize.height / 2);
    },
    top:function () {
        return cc.p(winSize.width / 2, winSize.height);
    },
    bottom:function () {
        return cc.p(winSize.width / 2, 0);
    },
    right:function () {
        return cc.p(0, winSize.height / 2);
    },
    left:function () {
        return cc.p(winSize.width, winSize.height / 2);
    },
    topRight:function () {
        return cc.p(winSize.width, winSize.height);
    },
    topLeft:function () {
        return cc.p(0, winSize.height);
    },
    bottomRight:function () {
        return cc.p(winSize.width, 0);
    },
    bottomLeft:function () {
        return cc.p(0, 0);
    }
};
*/