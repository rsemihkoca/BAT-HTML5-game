function CHelpPanel(){
    var _oFade;
    var _oShadow;
    var _oBg;
    var _oGroup;

    this._init = function(){
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_help');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF + 5;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.85;
        _oFade.on("mousedown",function(){});

        _oGroup = new createjs.Container();
        _oGroup.addChild(_oFade, _oBg);
        s_oStage.addChild(_oGroup);
        
        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExitHelp()});

        this.initHelpPageText();        
        this.initHelpControls();

        if (!s_bMobile) {
            _oGroup.cursor = "pointer";
        };
        
        _oShadow = new createjs.Shape();
        _oShadow.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oShadow);

        createjs.Tween.get(_oShadow).to({alpha: 0}, 1000).call(function () {
            _oShadow.visible = false;
        });
    };

    this.initHelpPageText = function() {
        var iFirstRow = CANVAS_HEIGHT_HALF - 160;
        var iSecondRow = iFirstRow + 90;
        var iThirdRow = iFirstRow + 160;

        var iWidth = 500;
        var iHeight = FONT_SIZE_HELP_TEXT +10;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = iFirstRow;
        var oHelpTextBack = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );
        oHelpTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oHelpText = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('help_coin');
        var oCoinSprite = createBitmap(oSprite);
        oCoinSprite.x = CANVAS_WIDTH_HALF - 160;
        oCoinSprite.y = iSecondRow;
        oCoinSprite.regX = oSprite.width * 0.5;
        oCoinSprite.regY = oSprite.height * 0.5;
        _oGroup.addChild(oCoinSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('help_fuel');
        var oFuelSprite = createBitmap(oSprite);
        oFuelSprite.x = CANVAS_WIDTH_HALF;
        oFuelSprite.y = iSecondRow;
        oFuelSprite.regX = oSprite.width * 0.5;
        oFuelSprite.regY = oSprite.height * 0.5;
        _oGroup.addChild(oFuelSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('help_boost');
        var oBoostSprite = createBitmap(oSprite);
        oBoostSprite.x = CANVAS_WIDTH_HALF + 160;
        oBoostSprite.y = iSecondRow;
        oBoostSprite.regX = oSprite.width * 0.5;
        oBoostSprite.regY = oSprite.height * 0.5;
        _oGroup.addChild(oBoostSprite);

        
        var iWidth = 150;
        var iHeight = FONT_SIZE_HELP_TEXT +10;
        var iTextX = oCoinSprite.x;
        var iTextY = iThirdRow;
        var oTextCoinBack = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP_COIN,
                    true, true, true,
                    false );
        oTextCoinBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTextCoin = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP_COIN,
                    true, true, true,
                    false );
                    
       
        var iWidth = 150;
        var iHeight = FONT_SIZE_HELP_TEXT +10;
        var iTextX = oFuelSprite.x;
        var iTextY = iThirdRow;
        var oTextFuelBack = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP_FUEL,
                    true, true, true,
                    false );
        oTextFuelBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTextFuel = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP_FUEL,
                    true, true, true,
                    false );

       
        var iWidth = 150;
        var iHeight = FONT_SIZE_HELP_TEXT +10;
        var iTextX = oBoostSprite.x;
        var iTextY = iThirdRow;
        var oTextBoostBack = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP_BOOST,
                    true, true, true,
                    false );
        oTextBoostBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTextBoost = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP_BOOST,
                    true, true, true,
                    false );
    };
    
    this.initHelpControls = function(){
        var oSprite;
        var szText1;
        var szText2;
        if (s_bMobile) {
            oSprite = s_oSpriteLibrary.getSprite('help_pedals');
            szText1 = TEXT_HELP_MOBILE1;
            szText2 = TEXT_HELP_MOBILE2;
        } else {
            oSprite = s_oSpriteLibrary.getSprite('help_keys');
            szText1 = TEXT_HELP_DESKTOP1;
            szText2 = TEXT_HELP_DESKTOP2;
        }
        var oControlsImage = createBitmap(oSprite);
        oControlsImage.x = CANVAS_WIDTH_HALF - 120;
        oControlsImage.y = CANVAS_HEIGHT_HALF + 110;
        oControlsImage.regX = oSprite.width * 0.5;
        oControlsImage.regY = oSprite.height * 0.5;
        _oGroup.addChild(oControlsImage);
        
        var iTextControlsX = CANVAS_WIDTH_HALF + 120;
        var iTextControlsY = CANVAS_HEIGHT_HALF + 66;

       
        var iWidth = 250;
        var iHeight = FONT_SIZE_HELP_TEXT*2;
        var iTextX = iTextControlsX;
        var iTextY = iTextControlsY;
        var oTextHelpControlsBack1 = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szText1,
                    true, true, true,
                    false );
        oTextHelpControlsBack1.setOutline(GUI_TEXT_OUTLINE);            
        var oTextHelpControls1 = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szText1,
                    true, true, true,
                    false );

        var iWidth = 250;
        var iHeight = FONT_SIZE_HELP_TEXT*2;
        var iTextX = iTextControlsX;
        var iTextY = iTextControlsY + 78;
        var oTextHelpControlsBack2 = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szText2,
                    true, true, true,
                    false );
        oTextHelpControlsBack2.setOutline(GUI_TEXT_OUTLINE);            
        var oTextHelpControls2 = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szText2,
                    true, true, true,
                    false );
    };
    
    this.unload = function(){
        var oParent = this;
        _oGroup.removeAllEventListeners();
        
        createjs.Tween.removeTweens(_oShadow);
        s_oStage.removeChild(_oShadow);
        s_oStage.removeChild(_oGroup);
    };

    this._onExitHelp = function(){
        this.unload();
                
        setTimeout( s_oGame._onExitHelp, 200);
    };

    this._init();

}