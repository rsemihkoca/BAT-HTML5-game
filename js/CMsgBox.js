function CMsgBox(szText,oParentContainer){
    var _oButOk;
    var _oThis;
    var _oContainer;
    var _oParentContainer;

    this._init = function (szText) {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oFade;

        oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.85;

        oFade.on("click", function () {});

        _oContainer.addChild(oFade);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box_small');
        var oBg = createBitmap(oSpriteBg);
        oBg.x = CANVAS_WIDTH_HALF;
        oBg.y = CANVAS_HEIGHT_HALF;
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oContainer.addChild(oBg);
       
        var iWidth = 500;
        var iHeight = 200;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = CANVAS_HEIGHT/2 -70;
        var oTitleBack = new CTLText(_oContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    30, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szText,
                    true, true, true,
                    false );
        oTitleBack.setOutline(GUI_TEXT_OUTLINE);            
        var oTitle = new CTLText(_oContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    30, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    szText,
                    true, true, true,
                    false );

        _oButOk = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 110, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
    };

    this._onButOk = function () {
        _oThis.unload();
    };

    this.unload = function () {
        _oButOk.unload();
        _oButOk = null;
        _oParentContainer.removeChild(_oContainer);
    };
    
    _oThis = this;
    _oParentContainer = oParentContainer;

    this._init(szText);
}