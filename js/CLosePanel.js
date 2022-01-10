function CLosePanel(iLevel, iGameOverType, oContainer) {
    var _oMessageBoxGroup;
    var _oBg;
    var _oGroup;
    var _oButMenu;
    var _oButRestart;
    var _oFade;
    var _oContainer;
    
    this._init = function () {
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_small");
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 1;
        _oGroup.visible = false;

        _oMessageBoxGroup = new createjs.Container();
        _oMessageBoxGroup.y = CANVAS_HEIGHT;
        _oGroup.addChild(_oMessageBoxGroup);

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oMessageBoxGroup.addChild(_oBg);
        
        var szGameOverText = TEXT_LOSE + "\n" + TEXT_TRYAGAIN;
        if (iGameOverType === GAMEOVER_OUTOFGAS) {
            szGameOverText = TEXT_GAMEOVER_GAS + "\n" + TEXT_TRYAGAIN;
        } else if (iGameOverType === GAMEOVER_OUTOFTIME) {
            szGameOverText = TEXT_GAMEOVER_TIME + "\n" + TEXT_TRYAGAIN;
        };

        var iWidth = 500;
        var iHeight = 100;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = CANVAS_HEIGHT/2 - 100;
        var oTitleTextBack = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_LOSE_PANEL_TITLE, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szGameOverText,
                    true, true, true,
                    false );
        oTitleTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTitleText = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_LOSE_PANEL_TITLE, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szGameOverText,
                    true, true, true,
                    false );

        var iWidth = 500;
        var iHeight = FONT_SIZE_LOSE_PANEL_TITLE +10;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = CANVAS_HEIGHT/2 + 10;
        var oBestScoreTextBack = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_LOSE_PANEL_TITLE, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_BEST_SCORE + ": " + s_iBestScore,
                    true, true, true,
                    false );
        oBestScoreTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oBestScoreText = new CTLText(_oMessageBoxGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_LOSE_PANEL_TITLE, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_BEST_SCORE + ": " + s_iBestScore,
                    true, true, true,
                    false );
       
        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);

        var iButtonsOffsetX = 190;
        var iButtonsY = CANVAS_HEIGHT_HALF + 110;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        var oSpriteButRestart = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH_HALF + iButtonsOffsetX - 10, iButtonsY, oSpriteButRestart, _oMessageBoxGroup);
        _oButRestart.addEventListener(ON_MOUSE_DOWN, this._onRestart, this);
        _oButRestart.pulseAnimation();
    };

    this.unload = function () {
        createjs.Tween.get(_oMessageBoxGroup)
            .wait(500)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function() {
                createjs.Tween.removeTweens(_oMessageBoxGroup);                
                createjs.Tween.removeTweens(_oFade);
                _oContainer.removeChild(_oFade);
                _oContainer.removeChild(_oMessageBoxGroup);
            });
        
        createjs.Tween.get(_oGroup)
            .wait(500)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function () {
                createjs.Tween.removeTweens(_oGroup);
                _oContainer.removeChild(_oGroup);            
                _oButMenu.unload();
                _oButMenu = null;

                _oFade.removeAllEventListeners();

                _oButRestart.unload();
                _oButRestart = null;
            });
    };

    this.show = function () {
        _oGroup.visible = true;

        createjs.Tween.get(_oMessageBoxGroup)
            .wait(WIN_PANEL_POPUP_DELAY)
            .to({y: 0}, 1000, createjs.Ease.elasticOut);

        createjs.Tween.get(_oFade)
            .wait(WIN_PANEL_POPUP_DELAY)
            .to({alpha: 0.8}, 500, createjs.Ease.cubicOut)
            .call(function () {
                $("#canvas").trigger("show_interlevel_ad");
            });

        _oFade.on("click", function () {});
    };
    
    this.getContainer = function(){
        return _oGroup;
    };
    
    this.bounceContainerOffScreen = function(){
        var oParent = this;
        
        createjs.Tween.get(_oMessageBoxGroup)
            .to({y: CANVAS_HEIGHT},400, createjs.Ease.backIn)
            .call(function(){
                oParent.unload();
            });
    };

    this._onRestart = function () {
        this.bounceContainerOffScreen();

        createjs.Tween.get(_oFade)
            .to({alpha: 0},500)
            .call(function () {
                _oContainer.removeChild(_oFade);
                s_oGame.restartGame(iLevel);
            });
    };

    this._onExit = function () {
        this.bounceContainerOffScreen();

        createjs.Tween.get(_oFade)
            .to({alpha:0},500)
            .call(function () {
                _oContainer.removeChild(_oFade);
                s_oGame.onExit();
            });
    };

    _oContainer = oContainer;

    this._init();
    
    return this;
}