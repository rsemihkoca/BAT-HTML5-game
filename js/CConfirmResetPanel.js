function CConfirmResetPanel() {
    var _oContainer;
    var _oButYes;
    var _oButNo;
    var _oFade;
    var _oPanelContainer;
    
    var _pStartPanelPos;

    this._init = function () {
        _oContainer = new createjs.Container();        
        s_oStage.addChild(_oContainer);

        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        _oContainer.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box_small');
        var oPanel = createBitmap(oSprite);  
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        oPanel.x = CANVAS_WIDTH_HALF;
        oPanel.y = CANVAS_HEIGHT_HALF;
        _oPanelContainer.addChild(oPanel);

        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween.get(_oPanelContainer).to({y:0},1000, createjs.Ease.backOut);

        var iWidth = 500;
        var iHeight = 200;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = CANVAS_HEIGHT/2 -70;
        var oTitleBack = new CTLText(_oPanelContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    30, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_CONFIRM_RESET,
                    true, true, true,
                    false );
        oTitleBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTitle = new CTLText(_oPanelContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    30, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_CONFIRM_RESET,
                    true, true, true,
                    false );

        _oButYes = new CGfxButton(CANVAS_WIDTH_HALF + 180, CANVAS_HEIGHT_HALF + 110, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(CANVAS_WIDTH_HALF - 180, CANVAS_HEIGHT_HALF + 110, s_oSpriteLibrary.getSprite('but_no'), _oPanelContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
    };

    this._onButYes = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        var oParent = this;
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer)
            .to({y:_pStartPanelPos.y},400, createjs.Ease.backIn)
            .call(function(){
                oParent.unload();
                s_oMenu.onResetStats();
            }); 
    };

    this._onButNo = function () {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);
        
        var oParent = this;
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer)
            .to({y:_pStartPanelPos.y},400, createjs.Ease.backIn)
            .call(function(){
                oParent.unload();
                s_oMenu.onExitConfirmationPanel();
            });
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
        
        _oContainer.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);
        _oFade.removeAllEventListeners();
    };

    this._init();
}