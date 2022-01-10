function CBonusObject(iX, iY, iType, oContainer){
    var _bTaken;
    
    var _oContainer;
    var _oSprite;
    
    var _iType;
    var _iX;
    var _iY;
        
    this._init = function(){
        _iX = iX;
        _iY = iY;
        _iType = iType;
        _bTaken = false;
        
        var iWidth;
        var iHeight;
        
        switch (_iType) {
            case BONUS_BOOST: {
                _oSprite = createBitmap( s_oSpriteLibrary.getSprite("boost") );
                iWidth = iHeight = BOOST_SIZE;
                break;
            }
            case BONUS_COIN: {
                var oData = {   
                    images: [s_oSpriteLibrary.getSprite("coin")], 
                    framerate: 30,
                    frames: {width: COIN_SIZE, height: COIN_SIZE, regX: 0, regY: 0}, 
                    animations: {idle:[0, 19, "idle"]}
                };
                var oSpriteSheet = new createjs.SpriteSheet(oData);
                _oSprite = createSprite(oSpriteSheet, "idle", 0, 0, COIN_SIZE, COIN_SIZE);
                iWidth = iHeight = COIN_SIZE;
                break;
            }
            case BONUS_FUEL: {
                _oSprite = createBitmap( s_oSpriteLibrary.getSprite("fuel") );
                iWidth = iHeight = FUEL_SIZE;
                break;
            }
        };
        
        _oSprite.regX = iWidth * 0.5;
        _oSprite.regY = iHeight * 0.5;
        _oSprite.x = _iX;
        _oSprite.y = _iY;
        _oContainer.addChild(_oSprite);        
        
        if (_iType !== BONUS_COIN) {
            this.addPulseAnimation();
        }
    };
    
    this.addPulseAnimation = function(){
        var oParent = this;
        
        new createjs.Tween.get(_oSprite)
            .to({scaleX: 1, scaleY: 1}, 850, createjs.Ease.quadOut)
            .to({scaleX: 1.2, scaleY: 1.2}, 650, createjs.Ease.quadIn)
            .call(function(){
                oParent.addPulseAnimation();
            });
    };
    
    this.getPosition = function(){
        var oPos = {x: _oSprite.x, y: _oSprite.y};
        return oPos;
    };
    
    this.isTaken = function(){
        return _bTaken;
    };
    
    this.onBonusTaken = function(){
        _bTaken = true;
        
        var szSound;
        switch (_iType) {
            case BONUS_BOOST: {
                szSound = "boost";
                break;
            }
            case BONUS_COIN: {
                szSound = "money";
                break;
            }
            case BONUS_FUEL: {
                szSound = "fuel";
                break;
            }
        };
        
        if (soundPlaying(szSound) === false) {
            playSound(szSound,1,false);
        };

        var oParent = this;
        var iDestY;
        var iDestAlpha;
        var iTime;
        if (_iType !== BONUS_COIN) {
            iDestY = 0;
            iDestAlpha = 0;
            iTime = 500;
        } else {
            iDestY = CANVAS_HEIGHT - 50;
            iDestAlpha = 1;
            iTime = 200;
        };
        
        createjs.Tween.get(_oSprite)
            .to({y: iDestY, alpha: iDestAlpha}, iTime, createjs.Ease.cubicIn)
            .call(function(){                
                oParent.getBonusTaken();
            });
    };
    
    this.getBonusTaken = function(){
        switch (_iType) {
            case BONUS_BOOST: {                        
                s_oGame.onBoostBonusTaken();
                break;
            }
            case BONUS_COIN: {
                s_oGame.onCoinBonusTaken();
                break;
            }
            case BONUS_FUEL: {
                s_oGame.onGasBonusTaken();
                break;
            }
        };
        
        this.unload();
    };
    
    this.unload = function(){        
        createjs.Tween.removeTweens(_oSprite);
        _oContainer.removeChild(_oSprite);        
    };
    
    _oContainer = oContainer;
    
    this._init();    
}