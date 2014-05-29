/**
 * Created by gt60 on 13-10-21.
 */
var CardSprite = cc.MenuItemSprite.extend({
    _description:"",
    _price:0,
    _CD:0,
    _tickTime:0,
    _plantType:{},

    _normalSprite:null,
    _selectedSprite:null,
    _disabledSprite:null,

    _state:null,
    _descLabel:null,
    _descLayer:null,
    _CDLabel:null,
    _topParent:null,
    ctor:function (type) {
        this._super();

        this.initCard(type);
        this._plantType = type;
        this.initWithNormalSprite(this._normalSprite, this._selectedSprite, this._disabledSprite, null, this);

        //说明文字
        this._descLabel = cc.LabelTTF.create(this._description, "微软雅黑", 15, null, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this._descLabel.setColor(cc.color(0, 0, 0));
        var ContentSize = this._descLabel.getContentSize();
        var size = cc.size(ContentSize.width + 30, ContentSize.height + 15);
        this._descLabel.setPosition(cc.p(size.width / 2, size.height / 2));

        //文字背景框
        this._descLayer = cc.LayerColor.create(cc.color(240, 240, 110, 255));
        this._descLayer.setContentSize(size);
        this._descLayer.ignoreAnchorPointForPosition(false);
        this._descLayer.setAnchorPoint(cc.p(0, 1));
        this._descLayer.addChild(this._descLabel);

        //标价
        var priceLabel = cc.LabelTTF.create(this._price);
        priceLabel.setPosition(cc.p(75, 10));
        priceLabel.setColor(cc.color(0, 0, 0));
        this.addChild(priceLabel);

        //冷却时间倒数
        this._CDLabel = cc.LabelTTF.create(this._tickTime + '', "", 25);
        this._CDLabel.setColor(cc.color(0, 0, 0));
        this._CDLabel.setPosition(cc.p(this.getContentSize().width / 2, this.getContentSize().height / 2));
        this._CDLabel.setVisible(false);
        this.addChild(this._CDLabel);

        //this.addChild(this._descLayer, 1, 1);
    },
    getPrice:function () {
        return this._price;
    },
    setPrice:function (price) {
        this._price = price;
    },
    getState:function () {
        return this._state;
    },
    setState:function (state) {
        this._state = state;
    },
    initCard:function (type) {
        this._description = type.DESCRIPTION;
        this._price = type.PRICE;
        this._CD = type.CD;
        this._tickTime = 0;
        this._normalSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(type.ENABLE));
        this._selectedSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(type.ENABLE));
        this._disabledSprite = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(type.DISABLE));
        this.getPlant = type.getPlant;
    },
    onEnter:function () {
        this._super();
        if (this._topParent == null) {
            for (var p = this.getParent(); p != null; p = p.getParent()) {
                this._topParent = p;
            }
            this._topParent.addChild(this._descLayer, 999);
        }
    },
    onExit:function () {
        this._super();
        this._topParent.removeChild(this._descLayer);
    },
    selected:function (touch) {
        var pos = this.getParent().convertToWorldSpace(this.getPosition());
        pos.x += this.getBoundingBox().width >> 1;
        pos.y += (this.getBoundingBox().height >> 1) - 5;
        this._descLayer.setPosition(pos);
    },
    unselected:function () {
        this._descLayer.setPosition(cc.p(-1000, -1000));
    },
    select:function () {
        PZ.SUN -= this._price;
        this.scheduleOnce(this.recover, this._CD);
        this.schedule(this.checkCD, 0.5);
        this.setState(PZ.CARD_STATE.CD | this.getState());
        this.setState(~PZ.CARD_STATE.SELECTED & this.getState());
        this._tickTime = this._CD;
        this.checkCD(0);
        this.updateUI();
    },
    recover:function () {
        this.setState(~PZ.CARD_STATE.CD & this.getState());
        this.updateUI();
    },
    updateUI:function () {
        this.checkSun();
        switch (this.getState()) {
            case PZ.CARD_STATE.SELECTED:
                this.setEnabled(false);
                break;
            case PZ.CARD_STATE.CD:
                this._descLabel.setString(this._description + "\n冷却中...");
                this.setEnabled(false);
                break;
            case PZ.CARD_STATE.NO_SUN:
                this._descLabel.setString(this._description + "\n阳光不足");
                this.setEnabled(false);
                break;
            case PZ.CARD_STATE.CD | PZ.CARD_STATE.NO_SUN:
                this._descLabel.setString(this._description + "\n冷却中...\n阳光不足");
                this.setEnabled(false);
                break;
            default:
                this._descLabel.setString(this._description);
                this.setEnabled(true);
                break;
        }
        var ContentSize = this._descLabel.getContentSize();
        var size = cc.size(ContentSize.width + 30, ContentSize.height + 15);
        this._descLabel.setPosition(cc.p(size.width / 2, size.height / 2));
        this._descLayer.setContentSize(size);
    },
    checkSun:function () {
        if (PZ.SUN < this.getPrice()) {
            this.setState(PZ.CARD_STATE.NO_SUN | this.getState());
        } else {
            this.setState(~PZ.CARD_STATE.NO_SUN & this.getState());
        }
    },
    checkCD:function (dt) {
        if (this._tickTime > 0.5) {
            this._tickTime -= dt;
            this._CDLabel.setString(this._tickTime.toFixed(1));
            this._CDLabel.setVisible(true);
        } else {
            this._CDLabel.setVisible(false);
            this.unschedule(this.checkCD);
        }
    },
    getPlant:function () {
        //initialized in initCard()
    }
});