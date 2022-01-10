function CCreditsPanel() {
    var _oBg;
    var _oFade;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    var _oMsgTextBack;
    var _oHitArea;
    var _oLink;
    var _oLinkBack;
    var _oContainer;

    var _pStartPosExit;
    var _pStartPosYContainer;

    this._init = function () {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oFade.on("mousedown", function () {
        });
        s_oStage.addChild(_oFade);

        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box_small');
        _pStartPosYContainer = CANVAS_HEIGHT + oSpriteMsgBox.height * 0.5;
        _oContainer = new createjs.Container();
        _oContainer.y = _pStartPosYContainer;
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width * 0.5;
        _oBg.regY = oSpriteMsgBox.height * 0.5;
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oBg);


        var iWidth = 350;
        var iHeight = 40;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = CANVAS_HEIGHT/2 - 80;
        _oMsgTextBack = new CTLText(_oContainer,
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight,
                    36, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_CREDITS_DEVELOPED,
                    true, true, true,
                    false );
        _oMsgTextBack.setOutline(GUI_TEXT_OUTLINE);
        _oMsgText = new CTLText(_oContainer,
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight,
                    36, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_CREDITS_DEVELOPED,
                    true, true, true,
                    false );

        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width * 0.5;
        _oButLogo.regY = oSprite.height * 0.5;
        _oButLogo.x = CANVAS_WIDTH_HALF;
        _oButLogo.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oButLogo);


        var szLink = "/Riza Semih Koca";
        var iWidth = 350;
        var iHeight = 40;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = CANVAS_HEIGHT/2 +80;
        _oLinkBack = new CTLText(_oContainer,
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight,
                    32, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    szLink,
                    true, true, true,
                    false );
        _oLinkBack.setOutline(GUI_TEXT_OUTLINE);
        _oLink = new CTLText(_oContainer,
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight,
                    32, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    szLink,
                    true, true, true,
                    false );

        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);

        if (!s_bMobile) {
            _oHitArea.cursor = "pointer";
        };

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH_HALF + 250, y: CANVAS_HEIGHT_HALF - 140};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

        new createjs.Tween.get(_oContainer).to({y:0},1000, createjs.Ease.backOut);
    };

    this.unload = function () {
        createjs.Tween.get(_oFade).to({alpha:0},500);

        createjs.Tween.get(_oContainer).to({y:_pStartPosYContainer},400, createjs.Ease.backIn).call(function(){
            _oHitArea.removeAllEventListeners();

            _oButExit.unload();
            _oButExit = null;

            createjs.Tween.removeTweens(_oContainer);
            createjs.Tween.removeTweens(_oFade);
            s_oStage.removeChild(_oContainer, _oFade);
        });
    };

    this._onLogoButRelease = function () {
        window.open("https://batkazananlardunyasi.com/", "_blank");
    };

    this._init();
}
