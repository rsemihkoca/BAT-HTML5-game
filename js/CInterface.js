function CInterface(iLevel, oParentContainer){
    var _bLowGas;
    var _iLevel;
    var _iCredits;    
    
    var _oParentContainer;
    var _oContainer;    
    var _oPauseContainer;
    var _oHelpPanel = null;
    var _oPause;
    var _oAudioToggle;
    var _oButSettings;
    var _oButExit;
    var _oButFullscreen;
    var _oButHelp; 
    var _oButResetCar;
    var _oCarPanelContainer;
    var _oCarPanel;
    var _oLevelTextBack;
    var _oLevelText;
    var _oScoreTextBack;
    var _oScoreText;
    var _oCreditsIcon;
    var _oCreditsTextBack;
    var _oCreditsText;
    var _oTimerIcon;
    var _oTimerTextBack;
    var _oTimerText;
    var _oSpeedIndicator;
    var _oFuelIndicator;
    var _oBoostIndicator;
    var _oLowGasIndicator;
        
    var _bMobileInitialized;
    var _bOnSettings;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosCreditsText;
    var _pStartPosTimerText;
    var _pStartPosLevelText;
    var _pStartPosScoreText;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosButResetCar;
    var _pStartPosFullscreen;    
    var _pStartPosButHelp;
    var _pStartButSettings;    
    
    this._init = function(){  
        _iCredits = s_iTotalCredits;
        _iLevel = iLevel;
        _bLowGas = false;
        
        _bMobileInitialized = false;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        // ADD A CAR PANEL WITH INDICATORS FOR SPEED, FUEL, ETC
        this.addCarPanel();

        // ADD GUI TEXTS
        _pStartPosTimerText = {x: CANVAS_WIDTH_HALF, y: 50};
        var oData = {   
            images: [s_oSpriteLibrary.getSprite("clock")], 
            frames: {width: 59, height: 69, regX: 0, regY: 0}, 
            animations: {idle:[0], timeout:[1], }
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oTimerIcon = createSprite(oSpriteSheet, "idle", 0, 0, 59, 69);
        _oTimerIcon.regX = 59 * 0.5;
        _oTimerIcon.regY = 69 * 0.5;
        _oTimerIcon.x = _pStartPosTimerText.x - 40;
        _oTimerIcon.y = _pStartPosTimerText.y;
        _oContainer.addChild(_oTimerIcon);
        
        _oTimerTextBack = this.addText((LEVEL_TIMER_START[_iLevel]/1000), _pStartPosTimerText.x + 40, _pStartPosTimerText.y, SECONDARY_FONT_COLOR);
        _oTimerText = this.addText((LEVEL_TIMER_START[_iLevel]/1000), _pStartPosTimerText.x + 40, _pStartPosTimerText.y, PRIMARY_FONT_COLOR);
        
        _pStartPosScoreText = {x: CANVAS_WIDTH - 120, y: CANVAS_HEIGHT - 30};
        _oScoreTextBack = this.addText(TEXT_SCORE + ": " + 0, _pStartPosScoreText.x, _pStartPosScoreText.y, SECONDARY_FONT_COLOR);        
        _oScoreText = this.addText(TEXT_SCORE + ": " + 0, _pStartPosScoreText.x, _pStartPosScoreText.y, PRIMARY_FONT_COLOR);        
        
        _pStartPosCreditsText = {x: CANVAS_WIDTH_HALF, y: _pStartPosScoreText.y};
        
        var oData = {   
            images: [s_oSpriteLibrary.getSprite("coin")], 
            framerate: 30,
            frames: {width: COIN_SIZE, height: COIN_SIZE, regX: 0, regY: 0}, 
            animations: {idle:[0, 19, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCreditsIcon = createSprite(oSpriteSheet, "idle", 0, 0, COIN_SIZE, COIN_SIZE);
        _oCreditsIcon.regX = COIN_SIZE * 0.5;
        _oCreditsIcon.regY = COIN_SIZE * 0.5;
        _oCreditsIcon.x = _pStartPosCreditsText.x - 60;
        _oCreditsIcon.y = _pStartPosCreditsText.y;
        _oContainer.addChild(_oCreditsIcon);   
        
        _oCreditsTextBack = this.addText(_iCredits, _pStartPosCreditsText.x + 30, _pStartPosCreditsText.y, SECONDARY_FONT_COLOR);
        _oCreditsText = this.addText(_iCredits, _pStartPosCreditsText.x + 30, _pStartPosCreditsText.y, PRIMARY_FONT_COLOR);
        
        _pStartPosLevelText = {x: 100, y: _pStartPosScoreText.y};
        _oLevelTextBack = this.addText(TEXT_LEVEL + ": " + (_iLevel+1), _pStartPosLevelText.x, _pStartPosLevelText.y, SECONDARY_FONT_COLOR);
        _oLevelText = this.addText(TEXT_LEVEL + ": " + (_iLevel+1), _pStartPosLevelText.x, _pStartPosLevelText.y, PRIMARY_FONT_COLOR);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_explode');
        _pStartPosButResetCar = {x: 5+(oSprite.width * 0.5), y: 125};
        _oButResetCar = new CGfxButton(_pStartPosButResetCar.x, _pStartPosButResetCar.y, oSprite,_oContainer);
        _oButResetCar.addEventListener(ON_MOUSE_UP, this._onResetCar, this);
        
        // ADD A CONTAINER FOR PAUSE
        _oPauseContainer = new createjs.Container();
        _oContainer.addChild(_oPauseContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("but_settings");
        _pStartButSettings = {x: CANVAS_WIDTH-(oSprite.width * 0.5)-10, y: (oSprite.height * 0.5)+10};

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:_pStartButSettings.x, y: _pStartButSettings.y+oSprite.height+10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        _oButExit.setVisible(false);
        
        oSprite = s_oSpriteLibrary.getSprite("but_help");
        _pStartPosButHelp = {x:_pStartButSettings.x,y:_pStartPosExit.y+oSprite.height+10};
        _oButHelp = new CGfxButton(_pStartPosButHelp.x,_pStartPosButHelp.y,oSprite,_oContainer);
        _oButHelp.addEventListener(ON_MOUSE_UP,function(){new CHelpPanel();},this);
        _oButHelp.setVisible(false);
        
        _pStartPosAudio = {x: _pStartPosButHelp.x,y: _pStartPosButHelp.y+oSprite.height+10};
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, _oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _oAudioToggle.setVisible(false);
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            if (_oAudioToggle){
                _pStartPosFullscreen = {x:_pStartPosAudio.x,y:_pStartPosAudio.y+oSprite.height+10};
            }else{
                _pStartPosFullscreen = {x:_pStartPosAudio.x,y:_pStartPosAudio.y};
            }
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
            _oButFullscreen.setVisible(false);
        };

        oSprite = s_oSpriteLibrary.getSprite("but_settings");

        _oButSettings = new CGfxButton(_pStartButSettings.x,_pStartButSettings.y,oSprite,_oContainer);
        _oButSettings.addEventListener(ON_MOUSE_UP, this.onSettings);
        _bOnSettings = false;
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.onCreditsTaken = function(){
        if ( createjs.Tween.hasActiveTweens(_oCreditsIcon) ) {
            return;
        }
            
        createjs.Tween.get(_oCreditsIcon)
            .to({scaleX: 1.2, scaleY: 1.2}, 200, createjs.Ease.cubicOut)
            .to({scaleX: 1, scaleY: 1}, 200, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(_oCreditsIcon);
            });
    };
    
    this.addCarPanel = function(){     
        _oCarPanelContainer = new createjs.Container()
        _oContainer.addChild(_oCarPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("car_panel");
        _oCarPanel = createBitmap(oSprite);
        _oCarPanel.regX = oSprite.width * 0.5;
        _oCarPanel.regY = oSprite.height * 0.5;
        _oCarPanel.cache(0, 0, oSprite.width, oSprite.height);
        _oCarPanelContainer.addChild(_oCarPanel);
        
        _oSpeedIndicator = this.addPanelIndicator(-50, -1, INDICATOR_ANGLE_MIN);
        _oFuelIndicator = this.addPanelIndicator(50, -1, INDICATOR_ANGLE_MAX);
        
        var oSprite = s_oSpriteLibrary.getSprite("nitro_icon");
        _oBoostIndicator = this.addPanelSpecialIndicator(oSprite, -50, 40);
        
        var oSprite = s_oSpriteLibrary.getSprite("fuel_light");
        _oLowGasIndicator = this.addPanelSpecialIndicator(oSprite, 36, 28);
        
        _oCarPanelContainer.x = CANVAS_WIDTH_HALF + 250;
        _oCarPanelContainer.y = 50;
    };
    
    this.addPanelIndicator = function(iX, iY, iRotation){
        var oSprite = s_oSpriteLibrary.getSprite("indicator");
        
        var oIndicator = createBitmap(oSprite);
        oIndicator.regX = oSprite.width * 0.7;
        oIndicator.regY = oSprite.height * 0.3;
        oIndicator.x = iX;
        oIndicator.y = iY;
        oIndicator.rotation = iRotation;
        _oCarPanelContainer.addChild(oIndicator);
        
        return oIndicator;
    };
    
    this.addPanelSpecialIndicator = function(oSprite, iX, iY) {
        var oIndicator = createBitmap(oSprite);
        oIndicator.regX = oSprite.width * 0.5;
        oIndicator.regY = oSprite.height * 0.5;
        oIndicator.x = iX;
        oIndicator.y = iY;
        oIndicator.visible = false;
        _oCarPanelContainer.addChild(oIndicator);
        
        return oIndicator;
    };
    
    this.addText = function(szText, iX, iY, iColor) {
        var oText = new createjs.Text(szText, FONT_SIZE_GUI+"px " + PRIMARY_FONT, iColor);
        oText.x = iX;
        oText.y = iY;
        oText.textAlign = "center";
        oText.textBaseline = "middle";
        oText.lineWidth = 500;
        oText.lineHeight = 35;
        if (iColor === SECONDARY_FONT_COLOR) {
            oText.outline = GUI_TEXT_OUTLINE;
        };
        _oContainer.addChild(oText);
        
        return oText;
    };
    
    this.activeBoostPulse = function(){
        var oParent = this;
        createjs.Tween.get(_oBoostIndicator)
            .to({scaleX: 1.2, scaleY: 1.2}, 500, createjs.Ease.cubicOut)
            .to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.cubicIn)
            .call(function(){
                oParent.activeBoostPulse();
            });
    };
    
    this.activeLowGasPulse = function(){
        var oParent = this;
        createjs.Tween.get(_oLowGasIndicator)
            .to({scaleX: 0.9, scaleY: 0.9}, 500, createjs.Ease.cubicOut)
            .to({scaleX: 1.2, scaleY: 1.2}, 500, createjs.Ease.cubicIn)
            .call(function(){
                oParent.activeLowGasPulse();
            });
    };
    
    this.msToTime = function(duration) {
        var/* milliseconds = parseInt((duration%1000)/100)
            ,*/ seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            /*, hours = parseInt((duration/(1000*60*60))%24)*/;

        /*hours = (hours < 10) ? "0" + hours : hours;*/
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return /*hours + ":" + */minutes + ":" + seconds /*+ "." + milliseconds*/;
    };
    
    this.refreshTimer = function (iTimer) {
        if (iTimer < 0) {
            iTimer = 0;
        };
        
       _oTimerTextBack.text = _oTimerText.text = this.msToTime(iTimer);
    };
    
    this.onTimeOut = function(){
        _oTimerIcon.gotoAndPlay("timeout");
        
        createjs.Tween.get(_oTimerIcon, {loop: true})
            .to({scaleX: 1.2, scaleY: 1.2}, 500, createjs.Ease.cubicOut)
            .to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.cubicIn);            
    };
    
    this.onSettings = function(){
        if (!_bOnSettings){
            _bOnSettings = true;
            _oButExit.setX(_oButSettings.getX());
            _oButExit.setY(_oButSettings.getY());
            _oButExit.setVisible(true);
            _oButHelp.setX(_oButSettings.getX());
            _oButHelp.setY(_oButSettings.getY());
            _oButHelp.setVisible(true);
            
            if (_oAudioToggle){
               _oAudioToggle.setPosition(_oButSettings.getX(), _oButSettings.getY());
               _oAudioToggle.setVisible(true);
                new createjs.Tween.get(_oAudioToggle.getButtonImage())
                    .to({x:_pStartPosAudio.x-s_iOffsetX, y: _pStartPosAudio.y},300,createjs.Ease.cubicOut); 
            }

            if (_oButFullscreen){
               _oButFullscreen.setPosition(_oButSettings.getX(), _oButSettings.getY());
               _oButFullscreen.setVisible(true);
                new createjs.Tween.get(_oButFullscreen.getButtonImage())
                    .to({x:_pStartPosFullscreen.x-s_iOffsetX, y: _pStartPosFullscreen.y},300,createjs.Ease.cubicOut);
            }

            new createjs.Tween.get(_oButExit.getButtonImage())
                .to({x:_pStartPosExit.x-s_iOffsetX, y: _pStartPosExit.y},300,createjs.Ease.cubicOut);
            new createjs.Tween.get(_oButHelp.getButtonImage())
                .to({x:_pStartPosButHelp.x-s_iOffsetX, y: _pStartPosButHelp.y},300,createjs.Ease.cubicOut);        
        
            _oPause = new CPause(_oPauseContainer);
        } else {
            s_oInterface.closePanel();
        }
    };
    
    this.moveSpeedIndicator = function(iSpeed){
        var iAngle = INDICATOR_ANGLE_MIN;
        iAngle += (iSpeed * INDICATOR_ANGLE_SPEED_MULTIPLIER);
        
        if (iAngle > INDICATOR_ANGLE_MAX) {
            iAngle = INDICATOR_ANGLE_MAX;
        };
        if (iAngle < INDICATOR_ANGLE_MIN) {
            iAngle = INDICATOR_ANGLE_MIN;
        };
        
        createjs.Tween.get(_oSpeedIndicator).to({rotation: iAngle}, 100, createjs.Ease.cubicIn);     
    };
    
    this.moveFuelIndicator = function(iElapsedTime){
        var iAngle = INDICATOR_ANGLE_MAX;
        iAngle -= (iElapsedTime * INDICATOR_ANGLE_FUEL_MULTIPLIER);
        
        if (iAngle > INDICATOR_ANGLE_MAX) {
            iAngle = INDICATOR_ANGLE_MAX;
        }
        
        // CHECK FOR GAS INDICATIONS
        if (iAngle < INDICATOR_FUEL_LIMIT) {
            this.onLowGas();
            s_oGame.onLowGas();
        }
        if (iAngle >= INDICATOR_FUEL_LIMIT && _oLowGasIndicator.visible === true){
            this.removeLowGasIndicator();
        }
        
        if (iAngle < INDICATOR_ANGLE_MIN) {
            iAngle = INDICATOR_ANGLE_MIN;
            s_oGame.onPlayerOutOfGas();
        }
        
        createjs.Tween.get(_oFuelIndicator).to({rotation: iAngle}, 100, createjs.Ease.cubicIn);        
    };
    
    this.onLowGas = function(){
        if (_bLowGas) {
            return;
        };
        
        _bLowGas = true;
        _oLowGasIndicator.visible = true;
        _oLowGasIndicator.alpha = 0;
        this.activeLowGasPulse();
        if (soundPlaying("honk") === false) {
            playSound("honk", 1, 0);
        }
        new createjs.Tween.get(_oLowGasIndicator)
            .to({alpha: 1}, 500, createjs.Ease.cubicOut);
    };
    
    this.removeLowGasIndicator = function(){
        new createjs.Tween.get(_oLowGasIndicator)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function(){
                _oLowGasIndicator.visible = false;
                _bLowGas = false;
                createjs.Tween.removeTweens(_oLowGasIndicator);
            });        
    };
    
    this.updateCreditsText = function(iValue){
        _oCreditsTextBack.text = _oCreditsText.text = iValue;
    };
    
    this.updateScoreText = function(iValue){
        _oScoreTextBack.text = _oScoreText.text = TEXT_SCORE + ": " + iValue;
    };
    
    this.closePanel = function(){
        _oPause.onExit();
        _bOnSettings = false;
        
        new createjs.Tween.get(_oButExit.getButtonImage())
            .to({x:_oButSettings.getX(), y:_oButSettings.getY()},300,createjs.Ease.cubicIn)
            .call(function(){
                _oButExit.setVisible(false);
                _oButHelp.setVisible(false);
                if (_oAudioToggle){
                    _oAudioToggle.setVisible(false);
                }
                if (_oButFullscreen){
                    _oButFullscreen.setVisible(false);
                }
            });

        new createjs.Tween.get(_oButHelp.getButtonImage())
            .to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);

        if (_oAudioToggle){
            new createjs.Tween.get(_oAudioToggle.getButtonImage())
            .to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);
        }
        if (_oButFullscreen){
            new createjs.Tween.get(_oButFullscreen.getButtonImage())
            .to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);
        }
    };
    
    this.unloadPause = function(){
        _oPause.unload();
        _oPause = null;
    };
    
    this.unload = function(){
        if (_oPause) {
            this.unloadPause();
        };
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        _oButExit.unload();
        _oButHelp.unload();
        _oButSettings.unload();
        _oButExit = null;
        _oButHelp = null;
        _oButSettings = null;
        
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
            _oButFullscreen = null;
        }        

        createjs.Tween.removeAllTweens();
        
        _oParentContainer.removeChild(_oPauseContainer);
        _oParentContainer.removeChild(_oContainer);
        
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButSettings.setPosition(_pStartButSettings.x-iNewX,iNewY + _pStartButSettings.y);
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        _oButHelp.setPosition(_pStartPosButHelp.x - iNewX, iNewY + _pStartPosButHelp.y);
        
        _oTimerTextBack.y = _oTimerText.y = iNewY + _pStartPosTimerText.y;
        _oScoreTextBack.x = _oScoreText.x = _pStartPosScoreText.x - iNewX;
        _oScoreTextBack.y = _oScoreText.y = iNewY + _pStartPosScoreText.y;
        _oLevelTextBack.x = _oLevelText.x = iNewX + _pStartPosLevelText.x;
        _oLevelTextBack.y = _oLevelText.y = iNewY + _pStartPosLevelText.y;
        
        _oButResetCar.setPosition(_pStartPosButResetCar.x + iNewX, _pStartPosButResetCar.y + iNewY);
        
        _oCarPanelContainer.y = 50 + iNewY;
        
        s_oGame.updateMapPosition(iNewX, iNewY);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,_pStartPosAudio.y);
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y);
        }
    };

    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
        $("#canvas").trigger("restart_level");
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
        _oHelpPanel = null;
    };
    
    this._onExit = function(){
        new CAreYouSurePanel(s_oGame.onExit);
    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.activeBoostIndicator = function(bValue){
        if (bValue) {
            _oBoostIndicator.visible = bValue;
            _oBoostIndicator.alpha = 0;                    
            this.activeBoostPulse();
            new createjs.Tween.get(_oBoostIndicator)
                .to({alpha: 1}, 500, createjs.Ease.cubicOut);
        }
        if (!bValue) {            
            _oBoostIndicator.alpha = 1;
            new createjs.Tween.get(_oBoostIndicator)
                .to({alpha: 0}, 500, createjs.Ease.cubicOut)
                .call(function(){
                    _oBoostIndicator.visible = bValue;
                    createjs.Tween.removeTweens(_oBoostIndicator);
                });
        }
    };

    this._onFullscreenRelease = function(){
	if (s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
	} else {
            _fRequestFullScreen.call(window.document.documentElement);
	}
	sizeHandler();
    };

    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
	};
        
        s_oGame.checkForResetFullscreenBut();
    };
    
    this._onResetCar = function(){
        s_oGame.onResetCar();
    };
    
    this._onRestart = function(){
        s_oGame.onRestart();  
    };
    
    s_oInterface = this;
    
    _oParentContainer = oParentContainer;
    
    this._init();
    
    return this;
}

var s_oInterface = null;