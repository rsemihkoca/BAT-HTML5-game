function CWinPanel(iLevel, iScore, oContainer, bNewHighScore) {
    var _iScore;
    var _iLevel;

    var _aStars;
    var _aLights;
    
    var _oMessageBoxGroup;
    var _oBg;    
    var _oGroup;
    var _oLightsContainer;
    var _oButMenu;
    var _oButRetry;
    var _oButContinue;
    var _oFade;
    var _oContainer;
    var _oCrowd;
    
    var _bNewHighScore;

    this._init = function () {
        _iScore = iScore;
        _iLevel = iLevel;
        _bNewHighScore = bNewHighScore;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_small");
        
        $("#canvas").trigger("share_event", _iScore);
        $("#canvas").trigger("save_score", _iScore);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 1;
        _oGroup.visible = false;

        this._addCrowd();
        this._addLights();

        _oMessageBoxGroup = new createjs.Container();
        _oMessageBoxGroup.y = CANVAS_HEIGHT;
        _oGroup.addChild(_oMessageBoxGroup);

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oMessageBoxGroup.addChild(_oBg);

        var iWidth = 500;
        var iHeight = FONT_SIZE_WIN_PANEL_TITLE +10;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = 200;
        var oTitleTextBack = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, true,
                    false );
        oTitleTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTitleText = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, true,
                    false );
        
        var iWidth = 500;
        var iHeight = FONT_SIZE_WIN_PANEL_TITLE +10;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = 240;
        var oScoreTextBack = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_SCORE + ": " + _iScore,
                    true, true, true,
                    false );
        oScoreTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oScoreText = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_SCORE + ": " + _iScore,
                    true, true, true,
                    false );
        
        // ADD A BEST SCORE TEXT
        var szBestScoreText;
        if (_bNewHighScore === true){
            szBestScoreText = TEXT_NEW_BEST_SCORE;
        } else {
            szBestScoreText = TEXT_BEST_SCORE;
        }
        var iWidth = 500;
        var iHeight = FONT_SIZE_WIN_PANEL_TITLE +10;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = 280;
        var oBestScoreTextBack = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    szBestScoreText + ": " + s_iBestScore,
                    true, true, true,
                    false );
        oBestScoreTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oBestScoreText = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    szBestScoreText + ": " + s_iBestScore,
                    true, true, true,
                    false );
        
        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);
        
        this.initStars();
        
        var iButtonsOffsetX = 180;
        var iButtonsY = CANVAS_HEIGHT_HALF + 110;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        var oSpriteButRetry = s_oSpriteLibrary.getSprite("but_restart");
        _oButRetry = new CGfxButton(CANVAS_WIDTH_HALF, iButtonsY, oSpriteButRetry, _oMessageBoxGroup);
        _oButRetry.addEventListener(ON_MOUSE_DOWN, this._onTryAgain, this);
        
        var oSpriteButContinue = s_oSpriteLibrary.getSprite("but_continue");
        _oButContinue = new CGfxButton(CANVAS_WIDTH_HALF + iButtonsOffsetX, iButtonsY, oSpriteButContinue, _oMessageBoxGroup);
        _oButContinue.addEventListener(ON_MOUSE_DOWN, this._onContinue, this);
        _oButContinue.pulseAnimation();
    };
    
    this.initStars = function(){
        _aStars = [];
        
        var oSprite = s_oSpriteLibrary.getSprite("starbox");
        var oStar1 = createBitmap(oSprite);
        var oStar2 = createBitmap(oSprite);
        var oStar3 = createBitmap(oSprite);
        oStar1.regX = oStar2.regX = oStar3.regX = oSprite.width * 0.5;
        oStar1.regY = oStar2.regY = oStar3.regY = oSprite.height * 0.5;
        
        var oSprite = s_oSpriteLibrary.getSprite("star");
        var oFullStar1 = createBitmap(oSprite);
        _aStars.push(oFullStar1);
        var oFullStar2 = createBitmap(oSprite);
        _aStars.push(oFullStar2);
        var oFullStar3 = createBitmap(oSprite);
        _aStars.push(oFullStar3);
        oFullStar1.regX = oFullStar2.regX = oFullStar3.regX = oSprite.width * 0.5;
        oFullStar1.regY = oFullStar2.regY = oFullStar3.regY = oSprite.height * 0.5;
        
        oFullStar1.scaleX = oFullStar1.scaleY = oFullStar2.scaleX = 
            oFullStar2.scaleY = oFullStar3.scaleX = oFullStar3.scaleY = 0;
        
        oStar1.x = oFullStar1.x = CANVAS_WIDTH_HALF - 70;        
        oStar2.x = oFullStar2.x = CANVAS_WIDTH_HALF;
        oStar3.x = oFullStar3.x = CANVAS_WIDTH_HALF + 70;
        oStar1.y = oStar2.y = oStar3.y = oFullStar1.y = oFullStar2.y = oFullStar3.y = 330;
        
        _oMessageBoxGroup.addChild(oStar1, oStar2, oStar3);
        _oMessageBoxGroup.addChild(oFullStar1, oFullStar2, oFullStar3);
    };
    
    this.showStars = function(){
        for (var i = 0; i < LS_STARS[_iLevel]; i++) {
            createjs.Tween.get(_aStars[i])
                .wait(300*i)
                .to({scaleX: 1, scaleY: 1}, 1500, createjs.Ease.elasticOut);
        };
    };
    
    this._addCrowd = function(){        
        var iWidth = 1360;
        var iHeight = 362;
        
        var aImages = [];
        for (var i = 0; i < 45; i++) {
            var oImage = s_oSpriteLibrary.getSprite("crowd"+i);
            aImages.push(oImage);
        };
    
        var oData = {
            images: aImages, 
            framerate: 15,
            frames: {width: iWidth, height: iHeight, regX: 0, regY: 0}, 
            animations: {idle:[0, 44, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCrowd = createSprite(oSpriteSheet, "idle", 0, 0, iWidth, iHeight);
        _oCrowd.regX = iWidth * 0.5;
        _oCrowd.regY = iHeight * 0.5;
        _oCrowd.x = CANVAS_WIDTH_HALF;
        _oCrowd.y = CANVAS_HEIGHT + 200;
        _oGroup.addChild(_oCrowd);
    };
    
    this._addLights = function(){
        _oLightsContainer = new createjs.Container();
        _oGroup.addChild(_oLightsContainer);
        
        var aHeadLights = [];
        _aLights = [];
        
        var oHeadlight = this.addHeadlightSprite(CANVAS_WIDTH_HALF - 400, 50, -1);
        aHeadLights.push(oHeadlight);
        var oHeadlight = this.addHeadlightSprite(CANVAS_WIDTH_HALF - 180, 50, -1);
        aHeadLights.push(oHeadlight);
        var oHeadlight = this.addHeadlightSprite(CANVAS_WIDTH_HALF + 180, 50, 1);
        aHeadLights.push(oHeadlight);
        var oHeadlight = this.addHeadlightSprite(CANVAS_WIDTH_HALF + 400, 50, 1);
        aHeadLights.push(oHeadlight);
        
        for (var i = 0; i < aHeadLights.length; i++) {
            var oLight;
            if (i < 2) {
                oLight = this.addLightSprite(aHeadLights[i].x, aHeadLights[i].y, -1);
            } else {
                oLight = this.addLightSprite(aHeadLights[i].x, aHeadLights[i].y, 1);
            }
            _aLights.push(oLight);
        };
        
        _oLightsContainer.y = -100;
    };
    
    this.addHeadlightSprite = function(iX, iY, iScaleX){
        var oSpriteLight = s_oSpriteLibrary.getSprite("headlight");
        var oLight = createBitmap(oSpriteLight);
        oLight.regX = oSpriteLight.width * 0.5;
        oLight.regY = oSpriteLight.height * 0.5;
        oLight.x = iX;
        oLight.y = iY;
        oLight.scaleX = iScaleX;
        _oLightsContainer.addChild(oLight);
        return oLight;
    };
    
    this.addLightSprite = function(iX, iY, iScaleX){
        var oSpriteLight;
        var iRandomN = Math.floor(Math.random()*2);
        if (iRandomN === 0) {
            oSpriteLight = s_oSpriteLibrary.getSprite("light_yellow");
        } else {
            oSpriteLight = s_oSpriteLibrary.getSprite("light_violet");
        };
        var oLight = createBitmap(oSpriteLight);
        oLight.regX = oSpriteLight.width - 20;
        oLight.regY = 10;
        oLight.x = iX;
        oLight.y = iY;
        oLight.scaleX = iScaleX;
        oLight.alpha = 0;
        _oLightsContainer.addChild(oLight);
        return oLight;
    };
    
    this.startLights = function(){
        for (var i = 0; i < _aLights.length; i++) {
            createjs.Tween.get(_aLights[i], {loop: true})
            .wait((Math.random()*200)+50)
            .to({alpha: 1}, 100, createjs.Ease.cubicOut)
            .wait((Math.random()*500)+100)
            .to({alpha: 0}, 100, createjs.Ease.cubicOut);
        };
    };
    
    this.onFadeOut = function(){
        var oParent = this;
        
        createjs.Tween.get(_oMessageBoxGroup)
            .wait(500)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut);

        createjs.Tween.get(_oGroup)
            .wait(500)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function () {
                oParent.removeTweens();
                oParent.unload();
            });
    };
    
    this.removeTweens = function(){
        for (var i = 0; i < _aStars.length; i++) {
            createjs.Tween.removeTweens(_aStars[i]);
        };
        for (var i = 0; i < _aLights.length; i++) {
            createjs.Tween.removeTweens(_aLights[i]);
        };
        
        createjs.Tween.removeTweens(_oMessageBoxGroup);        
        createjs.Tween.removeTweens(_oGroup);        
        createjs.Tween.removeTweens(_oFade);        
    };
    
    this.unload = function () {
        _oFade.removeAllEventListeners();
        
        _oButMenu.unload();
        _oButMenu = null;
        _oButContinue.unload();
        _oButContinue = null;
        _oButRetry.unload();
        _oButRetry = null;
        _oContainer.removeChild(_oMessageBoxGroup);
        _oContainer.removeChild(_oFade);
        _oContainer.removeChild(_oGroup);
    };
    
    this._onContinue = function () {
        this.bounceContainerOffScreen();
        
        createjs.Tween.get(_oFade)
            .to({alpha:0},1000)
            .call(function () {
                if (_iLevel+1 < NUM_LEVELS) {
                    s_oGame.onNextLevel(_iLevel);
                } else {
                    s_oGame.unload();
                    s_oMain.gotoLevelChoose();
                }

                _oContainer.removeChild(_oFade);                                
            });        
    };
    
    this.show = function () {
        var oParent = this;
        _oGroup.visible = true;

        createjs.Tween.get(_oCrowd)
            .to({y: CANVAS_HEIGHT_HALF + 200}, 500, createjs.Ease.cubicOut)
            .call(function(){
                createjs.Tween.removeTweens(_oCrowd);
            });
        createjs.Tween.get(_oLightsContainer)
            .to({y: 0}, 500, createjs.Ease.cubicOut)
            .call(function(){
                createjs.Tween.removeTweens(_oLightsContainer);
                oParent.startLights();
            });
    
        createjs.Tween.get(_oMessageBoxGroup)
            .wait(WIN_PANEL_POPUP_DELAY)
            .to({y: 0}, 1000, createjs.Ease.elasticOut)
            .call(this.showStars);

        createjs.Tween.get(_oFade)
            .wait(WIN_PANEL_POPUP_DELAY)
            .to({alpha: 0.9}, 500, createjs.Ease.cubicOut)
            .call(function () {
                $("#canvas").trigger("show_interlevel_ad");
            });

        _oFade.on("click", function () {});
    };
    
    this.bounceContainerOffScreen = function(){
        var oParent = this;
        
        createjs.Tween.get(_oMessageBoxGroup)
            .to({y: CANVAS_HEIGHT},400, createjs.Ease.backIn)
            .call(function(){
                oParent.onFadeOut();
            });
    };
    
    this.getContainer = function(){
        return _oGroup;
    };
    
    this._onTryAgain = function(){
        this.bounceContainerOffScreen();
        
        s_iTotalCredits -= _iScore;
        s_oGame.removeLastScore();
        
        createjs.Tween.get(_oFade)
            .to({alpha: 0},500)
            .call(function () {
                s_oGame.restartGame(iLevel);
                _oContainer.removeChild(_oFade);
            });
    };

    this._onExit = function () {
        this.onFadeOut();
        s_oGame.onExit();
    };
    
    _oContainer = oContainer;

    this._init();

    return this;
}