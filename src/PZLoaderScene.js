/**
 * Created by gt60 on 13-11-15.
 */
var PZLoaderScene = cc.Scene.extend({
    resources:null,
    callback:null,

    _dirt:null,
    _grass: null,
    _cap:null,

    _bgLayer: null,
    _label: null,

    _winSize:null,
    _centerPos:null,

    _number:0,
    _count:0,
    _totalNum:0,
    ctor: function () {
        cc.Scene.prototype.ctor.call(this);
        this._winSize = cc.director.getWinSize();
        this._centerPos = cc.p(this._winSize.width / 2, this._winSize.height / 2);
    },
    init:function(){
        cc.Scene.prototype.init.call(this);

        //logo
        var logoHeight = 200;

        var _this = this;
        var dirt = new Image();
        dirt.addEventListener("load", function () {
            _this._initDirt(dirt);
            this.removeEventListener('load', arguments.callee, false);
        });
        dirt.src = 'res/Layer/LoadBar_dirt.png';
        dirt.width = 321;
        dirt.height = 53;

        var grass = new Image();
        grass.addEventListener("load", function () {
            _this._initGrass(grass);
            this.removeEventListener('load', arguments.callee, false);
        });
        grass.src = 'res/Layer/LoadBar_grass.png';
        grass.width = 314;
        grass.height = 33;

        var cap = new Image();
        cap.addEventListener("load", function () {
            _this._initCap(cap);
            this.removeEventListener('load', arguments.callee, false);
        });
        cap.src = 'res/Layer/SodRollCap.png';
        cap.width = 73;
        cap.height = 71;

        // bg
        this._bgLayer = cc.LayerColor.create(cc.color(32, 32, 32, 255));
        this._bgLayer.x = 0;
        this._bgLayer.y = 0;
        this.addChild(this._bgLayer, 0);

        //loading percent
        this._label = cc.LabelTTF.create("Loading... 0%", "Arial", 14);
        this._label.color = cc.color(180, 180, 180);
        this._label.opacity = 0;
        this._label.x = this._centerPos.x;
        this._label.y = this._centerPos.y + -logoHeight / 2 - 10;
        this._bgLayer.addChild(this._label, 10);
    },
    _initDirt:function (texture) {
        var tex2d = new cc.Texture2D();
        tex2d.initWithElement(texture);
        tex2d.handleLoadedTexture();

        this._dirt = cc.Sprite.create(tex2d);
        this._dirt.setPosition(this._centerPos);
        this._bgLayer.addChild(this._dirt, 1);
        this._number++;
        this._initStage();
    },
    _initGrass:function (texture) {
        var tex2d = new cc.Texture2D();
        tex2d.initWithElement(texture);
        tex2d.handleLoadedTexture();

        this._grass = cc.ProgressTimer.create(cc.Sprite.create(tex2d));
        this._grass.setType(cc.ProgressTimer.TYPE_BAR);
        this._grass.setMidpoint(cc.p(0, 0));
        this._grass.setBarChangeRate(cc.p(1, 0));
        this._grass.setPosition(cc.pAdd(this._centerPos, cc.p(-7, 26)));
        this._bgLayer.addChild(this._grass, 2);
        this._number++;
        this._initStage();
    },
    _initCap:function (texture) {
        var tex2d = new cc.Texture2D();
        tex2d.initWithElement(texture);
        tex2d.handleLoadedTexture();

        this._cap = cc.Sprite.create(tex2d);
        this._cap.setPosition(cc.pAdd(this._centerPos, cc.p(-150, 45)));
        this._cap.setScale(0.8);
        this._bgLayer.addChild(this._cap, 3);
        this._number++;
        this._initStage();
    },
    _initStage: function () {
        if (this._number >= 3) {
            this._logoFadeIn();
        }
    },
    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.scheduleOnce(this._startLoading, 0.5);
    },
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
    },
    initWithResources: function (resources, callback) {
        this._resources = resources;
        this._callback = callback;
        this._totalNum = resources.length;
    },
    _startLoading: function () {
        var _this = this;
        var countFun = function (result, count) {
            _this._count = count;
        };

        cc.loader.load(this._resources, countFun, this._callback);
        this.schedule(this._updatePercent);
    },
    _logoFadeIn: function () {
        var logoAction = cc.Spawn.create(
            cc.EaseBounce.create(cc.MoveBy.create(0.25, cc.p(0, 10))),
            cc.FadeIn.create(0.5));

        var labelAction = cc.Sequence.create(
            cc.DelayTime.create(0.15),
            logoAction.clone());

        this._dirt.runAction(logoAction);
        this._grass.runAction(logoAction.clone());
        this._cap.runAction(logoAction.clone());
        this._label.runAction(labelAction);
    },
    _updatePercent: function () {
        var percent = this._count / this._totalNum * 100 | 0;

        var tmpStr = "Loading... " + percent + "%";
        this._label.setString(tmpStr);

        this._grass.percentage = percent;
        this._cap.rotation = 360 * percent / 100;
        this._cap.x = this._centerPos.x + -150 + 300 * percent / 100;

        if (percent >= 100) this.unschedule(this._updatePercent);
    }
});

PZLoaderScene.preload = function (resources, callback) {
    if (!this._instance) {
        this._instance = new PZLoaderScene();
        this._instance.init();
    }
    this._instance.initWithResources(resources, callback);

    cc.director.runScene(this._instance);

};