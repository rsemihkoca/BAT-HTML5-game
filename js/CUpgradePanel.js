function CUpgradePanel(oParentContainer) {
    var _oParentContainer;
    
    var _iMaxSpeedUpgradeLevel;
    var _iAccelerationUpgradeLevel;
    var _iNitroUpgradeLevel;
    var _iCredits;
    
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosConfirm;
    var _pStartPosExit;
    
    var _oBg;
    var _oFade;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButConfirm;
    var _oButExit;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _oCreditsText;
    var _oCreditsTextBack;
    var _oMaxSpeedUpgradeBut;
    var _oMaxSpeedUpgradeText;
    var _oMaxSpeedLevelText;
    var _oMaxSpeedCostText;
    var _oMaxSpeedUpgradeTextBack;
    var _oMaxSpeedLevelTextBack;
    var _oMaxSpeedCostTextBack;
    var _oAccelerationUpgradeBut;
    var _oAccelerationUpgradeTextBack;
    var _oAccelerationLevelTextBack;
    var _oAccelerationCostTextBack;
    var _oAccelerationUpgradeText;
    var _oAccelerationLevelText;
    var _oAccelerationCostText;
    var _oAccelerationUpgradeTextBack;
    var _oAccelerationLevelTextBack;
    var _oAccelerationCostTextBack;
    var _oNitroUpgradeBut;
    var _oNitroUpgradeText;
    var _oNitroLevelText;
    var _oNitroCostText;
    var _oNitroUpgradeTextBack;
    var _oNitroLevelTextBack;
    var _oNitroCostTextBack;
    
    this._init = function(){
        _iMaxSpeedUpgradeLevel = s_iMaxSpeedUpgradeLevel;
        _iAccelerationUpgradeLevel = s_iAccelerationUpgradeLevel;
        _iNitroUpgradeLevel = s_iNitroUpgradeLevel;
        _iCredits = s_iTotalCredits;
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_screens'));
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oParentContainer.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box_big');
        var oBgScreen = createBitmap(oSprite);
        oBgScreen.regX = oSprite.width * 0.5;
        oBgScreen.regY = oSprite.height * 0.5;
        oBgScreen.x = CANVAS_WIDTH_HALF;
        oBgScreen.y = CANVAS_HEIGHT_HALF;
        _oParentContainer.addChild(oBgScreen);

        var iWidth = 500;
        var iHeight = FONT_SIZE_TITLES+10;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = 100;
        var oTitleTextBack = new CTLText(_oParentContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_TITLES, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_UPGRADE,
                    true, true, true,
                    false );
        oTitleTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTitleText = new CTLText(_oParentContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_TITLES, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_UPGRADE,
                    true, true, true,
                    false );
        
        var oData = {   
                images: [s_oSpriteLibrary.getSprite("coin")], 
                framerate: 30,
                frames: {width: COIN_SIZE, height: COIN_SIZE, regX: 0, regY: 0}, 
                animations: {idle:[0, 19, "idle"]}
            };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oCreditsIcon = createSprite(oSpriteSheet, "idle", 0, 0, COIN_SIZE, COIN_SIZE);
        oCreditsIcon.regX = COIN_SIZE * 0.5;
        oCreditsIcon.regY = COIN_SIZE * 0.5;
        oCreditsIcon.x = CANVAS_WIDTH_HALF - 290;
        oCreditsIcon.y = CANVAS_HEIGHT - 160;
        _oParentContainer.addChild(oCreditsIcon);  


        var iWidth = 300;
        var iHeight = FONT_SIZE_TITLES+10;
        var iTextX = oCreditsIcon.x + 40;
        var iTextY = oCreditsIcon.y - 10;
        _oCreditsTextBack = new CTLText(_oParentContainer, 
                    iTextX, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_TITLES, "left", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    _iCredits,
                    true, true, true,
                    false );
        _oCreditsTextBack.setOutline(GUI_TEXT_OUTLINE);            
        _oCreditsText = new CTLText(_oParentContainer, 
                    iTextX, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_TITLES, "left", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    _iCredits,
                    true, true, true,
                    false );

        var oSprite = s_oSpriteLibrary.getSprite('but_confirm');
        _pStartPosConfirm = {x: CANVAS_WIDTH_HALF + 260, y: CANVAS_HEIGHT - 160};
        _oButConfirm = new CGfxButton(_pStartPosConfirm.x, _pStartPosConfirm.y, oSprite, _oParentContainer);
        _oButConfirm.addEventListener(ON_MOUSE_UP, this._onButConfirmRelease, this);
        _oButConfirm.pulseAnimation();
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2)-10,y:(oSprite.height/2)+10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,_oParentContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_oButExit.getX() - oSprite.width-10,y:(oSprite.height/2)+10 }
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive,_oParentContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: (oSprite.height  * 0.5) + 20, y: (oSprite.height  * 0.5) + 20};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oParentContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this._initUpgradeButtons();

        _oParentContainer.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this._initUpgradeButtons = function(){
        // MAX SPEED UPGRADE BUTTON
        var pMaxSpeedUpgradePos = {x: CANVAS_WIDTH_HALF - 250, y: CANVAS_HEIGHT_HALF - 100};
        
        var oSprite = s_oSpriteLibrary.getSprite('but_upgrade1');
        _oMaxSpeedUpgradeBut = new CUpgradeButton(pMaxSpeedUpgradePos.x, pMaxSpeedUpgradePos.y, oSprite, true, _oParentContainer);
        _oMaxSpeedUpgradeBut.addEventListener(ON_MOUSE_UP, this._onEngineUpgrade, this);
        
        var iFirstRow = 85;
        var iSecondRow = 115;
        var iThirdRow = 145;
        
        _oMaxSpeedUpgradeTextBack = this.addText(TEXT_MAXSPEED, SECONDARY_FONT_COLOR, pMaxSpeedUpgradePos.x, pMaxSpeedUpgradePos.y + iFirstRow, "center");
        _oMaxSpeedUpgradeTextBack.setOutline( GUI_TEXT_OUTLINE );
        _oMaxSpeedUpgradeText = this.addText(TEXT_MAXSPEED, PRIMARY_FONT_COLOR, pMaxSpeedUpgradePos.x, pMaxSpeedUpgradePos.y + iFirstRow, "center");

        _oMaxSpeedLevelTextBack = this.addText(TEXT_LEVEL + " " + (_iMaxSpeedUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE, SECONDARY_FONT_COLOR, pMaxSpeedUpgradePos.x, pMaxSpeedUpgradePos.y + iSecondRow, "center");
        _oMaxSpeedLevelTextBack.setOutline( GUI_TEXT_OUTLINE );
        _oMaxSpeedLevelText = this.addText(TEXT_LEVEL + " " + (_iMaxSpeedUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE, PRIMARY_FONT_COLOR, pMaxSpeedUpgradePos.x, pMaxSpeedUpgradePos.y + iSecondRow, "center");
        
        var oCoin = this.addCoin(pMaxSpeedUpgradePos.x - 40, pMaxSpeedUpgradePos.y + 150);
        _oMaxSpeedCostTextBack = this.addText(UPGRADE_COST_MAXSPEED[_iMaxSpeedUpgradeLevel], SECONDARY_FONT_COLOR, pMaxSpeedUpgradePos.x + 80, pMaxSpeedUpgradePos.y + iThirdRow, "left");
        _oMaxSpeedCostTextBack.setOutline( GUI_TEXT_OUTLINE );
        _oMaxSpeedCostText = this.addText(UPGRADE_COST_MAXSPEED[_iMaxSpeedUpgradeLevel], PRIMARY_FONT_COLOR, pMaxSpeedUpgradePos.x + 80, pMaxSpeedUpgradePos.y + iThirdRow, "left");

        // ACCELERATION UPGRADE BUTTON
        var pAccelerationUpgradePos = {x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF - 100};

        var oSprite = s_oSpriteLibrary.getSprite('but_upgrade2');
        _oAccelerationUpgradeBut = new CUpgradeButton(pAccelerationUpgradePos.x, pAccelerationUpgradePos.y, oSprite, true, _oParentContainer);
        _oAccelerationUpgradeBut.addEventListener(ON_MOUSE_UP, this._onGripUpgrade, this);

        _oAccelerationUpgradeTextBack = this.addText(TEXT_ACCELERATION, SECONDARY_FONT_COLOR, pAccelerationUpgradePos.x, pAccelerationUpgradePos.y + iFirstRow, "center");
        _oAccelerationUpgradeTextBack.setOutline( GUI_TEXT_OUTLINE );        
        _oAccelerationUpgradeText = this.addText(TEXT_ACCELERATION, PRIMARY_FONT_COLOR, pAccelerationUpgradePos.x, pAccelerationUpgradePos.y + iFirstRow, "center");
        
        _oAccelerationLevelTextBack = this.addText(TEXT_LEVEL + " " + (_iAccelerationUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE, SECONDARY_FONT_COLOR, pAccelerationUpgradePos.x, pAccelerationUpgradePos.y + iSecondRow, "center");
        _oAccelerationLevelTextBack.setOutline( GUI_TEXT_OUTLINE );
        _oAccelerationLevelText = this.addText(TEXT_LEVEL + " " + (_iAccelerationUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE, PRIMARY_FONT_COLOR, pAccelerationUpgradePos.x, pAccelerationUpgradePos.y + iSecondRow, "center");
        
        var oCoin = this.addCoin(pAccelerationUpgradePos.x - 40, pAccelerationUpgradePos.y + 150);
        _oAccelerationCostTextBack = this.addText(UPGRADE_COST_ACCELERATION[_iAccelerationUpgradeLevel], SECONDARY_FONT_COLOR, pAccelerationUpgradePos.x + 80, pAccelerationUpgradePos.y + iThirdRow, "left");
        _oAccelerationCostTextBack.setOutline( GUI_TEXT_OUTLINE );
        _oAccelerationCostText = this.addText(UPGRADE_COST_ACCELERATION[_iAccelerationUpgradeLevel], PRIMARY_FONT_COLOR, pAccelerationUpgradePos.x + 80, pAccelerationUpgradePos.y + iThirdRow, "left");
        
        // NITRO UPGRADE BUTTON
        var pNitroUpgradePos = {x: CANVAS_WIDTH_HALF + 250, y: CANVAS_HEIGHT_HALF - 100};
        
        var oSprite = s_oSpriteLibrary.getSprite('but_upgrade3');
        _oNitroUpgradeBut = new CUpgradeButton(pNitroUpgradePos.x, pNitroUpgradePos.y, oSprite, true, _oParentContainer);
        _oNitroUpgradeBut.addEventListener(ON_MOUSE_UP, this._onSuspensionUpgrade, this);

        _oNitroUpgradeTextBack = this.addText(TEXT_NITRO, SECONDARY_FONT_COLOR, pNitroUpgradePos.x, pNitroUpgradePos.y + iFirstRow, "center");
        _oNitroUpgradeTextBack.setOutline( GUI_TEXT_OUTLINE );
        _oNitroUpgradeText = this.addText(TEXT_NITRO, PRIMARY_FONT_COLOR, pNitroUpgradePos.x, pNitroUpgradePos.y + iFirstRow, "center");

        _oNitroLevelTextBack = this.addText(TEXT_LEVEL + " " + (_iNitroUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE, SECONDARY_FONT_COLOR, pNitroUpgradePos.x, pNitroUpgradePos.y + iSecondRow, "center");
        _oNitroLevelTextBack.setOutline( GUI_TEXT_OUTLINE );                
        _oNitroLevelText = this.addText(TEXT_LEVEL + " " + (_iNitroUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE, PRIMARY_FONT_COLOR, pNitroUpgradePos.x, pNitroUpgradePos.y + iSecondRow, "center");
        
        var oCoin = this.addCoin(pNitroUpgradePos.x - 40, pNitroUpgradePos.y + 150);
        _oNitroCostTextBack = this.addText(UPGRADE_COST_NITRO[_iNitroUpgradeLevel], SECONDARY_FONT_COLOR, pNitroUpgradePos.x + 80, pNitroUpgradePos.y + iThirdRow, "left");
        _oNitroCostTextBack.setOutline( GUI_TEXT_OUTLINE );
        _oNitroCostText = this.addText(UPGRADE_COST_NITRO[_iNitroUpgradeLevel], PRIMARY_FONT_COLOR, pNitroUpgradePos.x + 80, pNitroUpgradePos.y + iThirdRow, "left");
        
        this.checkUpdateButton();
    };
    
    this.addCoin = function(iX, iY) {
        var oData = {   
                images: [s_oSpriteLibrary.getSprite("coin")], 
                framerate: 30,
                frames: {width: COIN_SIZE, height: COIN_SIZE, regX: 0, regY: 0}, 
                animations: {idle:[0, 19, "idle"]}
            };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oCostIcon = createSprite(oSpriteSheet, "idle", 0, 0, COIN_SIZE, COIN_SIZE);
        oCostIcon.regX = COIN_SIZE * 0.5;
        oCostIcon.regY = COIN_SIZE * 0.5;
        oCostIcon.scaleX = oCostIcon.scaleY = 0.5;
        oCostIcon.x = iX;
        oCostIcon.y = iY;
        _oParentContainer.addChild(oCostIcon);
    };
    
    this.addText = function(szText, iColor, iX, iY, szAlign) {

        var iWidth = 180;
        var iHeight = FONT_SIZE_UPGRADE_PANEL+6;
        var iTextX = iX;
        var iTextY = iY;
        var oText = new CTLText(_oParentContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_UPGRADE_PANEL, szAlign, iColor, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szText,
                    true, true, true,
                    false );
       
        return oText;
    };
    
    this.checkUpdateButton = function(){
        _oMaxSpeedUpgradeBut.setActive(true);
        _oAccelerationUpgradeBut.setActive(true);
        _oNitroUpgradeBut.setActive(true);
        
        if (_iCredits < UPGRADE_COST_MAXSPEED[_iMaxSpeedUpgradeLevel] || _iMaxSpeedUpgradeLevel+1 >= MAX_LEVEL_UPGRADE) {
            _oMaxSpeedUpgradeBut.setActive(false);
        }
        if (_iCredits < UPGRADE_COST_ACCELERATION[_iAccelerationUpgradeLevel] || _iAccelerationUpgradeLevel+1 >= MAX_LEVEL_UPGRADE) {
            _oAccelerationUpgradeBut.setActive(false);
        }
        if (_iCredits < UPGRADE_COST_NITRO[_iNitroUpgradeLevel] || _iNitroUpgradeLevel+1 >= MAX_LEVEL_UPGRADE) {
            _oNitroUpgradeBut.setActive(false);
        }
    };
    
    this._onEngineUpgrade = function(){
        if (_iCredits < UPGRADE_COST_MAXSPEED[_iMaxSpeedUpgradeLevel] || _oMaxSpeedUpgradeBut.isActive() === false) {
            // NOT ENOUGH CREDITS!
            if (soundPlaying("wrong") === false) {
                playSound("wrong", 1, 0);
            }
            return;
        } else {
            if (soundPlaying("upgrade_car") === false) {
                playSound("upgrade_car", 1, 0);
            }
            // BUY UPGRADE
            _iCredits -= UPGRADE_COST_MAXSPEED[_iMaxSpeedUpgradeLevel];
            _iMaxSpeedUpgradeLevel += 1;
            _oCreditsTextBack.refreshText( _iCredits );
            _oCreditsText.refreshText( _iCredits );
            _oMaxSpeedLevelTextBack.refreshText( TEXT_LEVEL + " " + (_iMaxSpeedUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE );
            _oMaxSpeedLevelText.refreshText( TEXT_LEVEL + " " + (_iMaxSpeedUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE );
            _oMaxSpeedCostTextBack.refreshText( UPGRADE_COST_MAXSPEED[_iMaxSpeedUpgradeLevel] );
            _oMaxSpeedCostText.refreshText( UPGRADE_COST_MAXSPEED[_iMaxSpeedUpgradeLevel] );
            this.checkUpdateButton();
            this.saveNewSettings();
            return;
        }
    };
    
    this._onGripUpgrade = function(){
        if (_iCredits < UPGRADE_COST_ACCELERATION[_iAccelerationUpgradeLevel] || _oAccelerationUpgradeBut.isActive() === false) {
            // NOT ENOUGH CREDITS!
            if (soundPlaying("wrong") === false) {
                playSound("wrong", 1, 0);
            }
            return;
        } else {
            if (soundPlaying("upgrade_car") === false) {
                playSound("upgrade_car", 1, 0);
            }
            // BUY UPGRADE
            _iCredits -= UPGRADE_COST_ACCELERATION[_iAccelerationUpgradeLevel];
            _iAccelerationUpgradeLevel += 1;
            _oCreditsTextBack.refreshText( _iCredits );
            _oCreditsText.refreshText( _iCredits );
            _oAccelerationLevelTextBack.refreshText( TEXT_LEVEL + " " + (_iAccelerationUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE );
            _oAccelerationLevelText.refreshText( TEXT_LEVEL + " " + (_iAccelerationUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE );
            _oAccelerationCostTextBack.refreshText( UPGRADE_COST_ACCELERATION[_iAccelerationUpgradeLevel] );
            _oAccelerationCostText.refreshText( UPGRADE_COST_ACCELERATION[_iAccelerationUpgradeLevel] );
            this.checkUpdateButton();
            this.saveNewSettings();
            return;
        }
    };
    
    this._onSuspensionUpgrade = function(){
        if (_iCredits < UPGRADE_COST_NITRO[_iNitroUpgradeLevel] || _oNitroUpgradeBut.isActive() === false) {
            // NOT ENOUGH CREDITS!
            if (soundPlaying("wrong") === false) {
                playSound("wrong", 1, 0);
            }
            return;
        } else {
            if (soundPlaying("upgrade_car") === false) {
                playSound("upgrade_car", 1, 0);
            }
            // BUY UPGRADE
            _iCredits -= UPGRADE_COST_NITRO[_iNitroUpgradeLevel];
            _iNitroUpgradeLevel += 1;
            _oCreditsTextBack.refreshText( _iCredits );
            _oCreditsText.refreshText( _iCredits );
            _oNitroLevelTextBack.refreshText( TEXT_LEVEL + " " + (_iNitroUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE );
            _oNitroLevelText.refreshText( TEXT_LEVEL + " " + (_iNitroUpgradeLevel+1) + "/" + MAX_LEVEL_UPGRADE );
            _oNitroCostTextBack.refreshText( UPGRADE_COST_NITRO[_iNitroUpgradeLevel] );
            _oNitroCostText.refreshText( UPGRADE_COST_NITRO[_iNitroUpgradeLevel] );
            this.checkUpdateButton();
            this.saveNewSettings();
            return;
        }
    };
    
    this.refreshButtonPos = function (iNewX, iNewY) {
        _oButConfirm.setPosition(_pStartPosConfirm.x, _pStartPosConfirm.y - iNewY);
        _oButExit.setPosition(_pStartPosExit.x - iNewX,_pStartPosExit.y + iNewY);
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };
    
    this.unload = function () {        
        _oButConfirm.unload();
        _oButExit.unload();
        _oMaxSpeedUpgradeBut.unload();
        _oAccelerationUpgradeBut.unload();
        _oNitroUpgradeBut.unload();
        _oButConfirm = null;
        _oMaxSpeedUpgradeBut = null;
        _oAccelerationUpgradeBut = null;
        _oNitroUpgradeBut = null;
        _oButExit = null;
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        createjs.Tween.removeTweens(_oFade);
        _oParentContainer.removeAllChildren();        
    };
    
    this._onExit = function(){
        this.unload();
        s_oGame.onExit();
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
	}else{
            _fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
	};
    };
    
    this.saveNewSettings = function(){
        s_iMaxSpeedUpgradeLevel = _iMaxSpeedUpgradeLevel;
        s_iAccelerationUpgradeLevel = _iAccelerationUpgradeLevel;
        s_iNitroUpgradeLevel = _iNitroUpgradeLevel;
        s_iTotalCredits = _iCredits;
        setItemJson("rocking_wheels_maxspeed_level", s_iMaxSpeedUpgradeLevel);
        setItemJson("rocking_wheels_acceleration_level", s_iAccelerationUpgradeLevel);
        setItemJson("rocking_wheels_nitro_level", s_iNitroUpgradeLevel);
        setItemJson("rocking_wheels_credits", s_iTotalCredits);
    };
    
    this._onButConfirmRelease = function () {
        if (soundPlaying("ignition") === false) {
            playSound("ignition", 1, 0);
        }
        
        this.saveNewSettings();
        
        // UNLOAD AND GO TO GAME
        this.unload();
        s_oGame.onExitUpgradePanel();
    };

    _oParentContainer = oParentContainer;
    
    this._init();
}