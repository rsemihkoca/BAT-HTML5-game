function CMenu() {
    var _pStartPosAudio;
    var _pStartPosPlay;
    var _pStartPosReset;
    var _pStartPosCredits;
    var _pStartPosFullscreen;

    var _oBg;
    var _oButPlay;
    var _oMenuLogo;
    var _oButInfo;
    var _oFade;
    var _oAudioToggle;
    var _oButReset;
    var _oButFullscreen;
    var _oBestScoreTextBack;
    var _oBestScoreText;
    var _oMenuContainer;
    var _oCarContainer;
    var _oConfirmResetPanel;

    var _fRequestFullScreen;
    var _fCancelFullScreen;

    this._init = function () {
        //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE
        _fRequestFullScreen = null;
        _fCancelFullScreen = null;
        _oConfirmResetPanel = null;

        _oMenuContainer = new createjs.Container()
        s_oStage.addChild(_oMenuContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game0'));
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oMenuContainer.addChild(_oBg);

        this.addMenuGraphics();

        var oSprite = s_oSpriteLibrary.getSprite('logo_menu');
        _oMenuLogo = createBitmap(oSprite);
        _oMenuLogo.regX = oSprite.width * 0.5;
        _oMenuLogo.regY = oSprite.height * 0.5;
        _oMenuLogo.x = CANVAS_WIDTH_HALF;
        _oMenuLogo.y = -50;
        _oMenuContainer.addChild(_oMenuLogo);

        new createjs.Tween.get(_oMenuLogo)
            .to({ y: CANVAS_HEIGHT_HALF - 50 }, 500, createjs.Ease.linear);
        new createjs.Tween.get(_oMenuLogo, {loop: true})
            .to({ scaleX: 1.1, scaleY: 1.1 }, 850, createjs.Ease.quadOut)
            .to({ scaleX: 1, scaleY: 1 }, 650, createjs.Ease.quadIn);

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _pStartPosPlay = {x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT - 100};
        _oButPlay = new CGfxButton(_pStartPosPlay.x, _pStartPosPlay.y, oSprite, _oMenuContainer);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();

        var oSprite = s_oSpriteLibrary.getSprite('but_reset');
        _pStartPosReset = {x: (oSprite.height*0.5)+20, y: CANVAS_HEIGHT - ((oSprite.height*0.5)+20)};
        _oButReset = new CGfxButton(_pStartPosReset.x, _pStartPosReset.y, oSprite, _oMenuContainer);
        _oButReset.addEventListener(ON_MOUSE_UP, this._onButResetRelease, this);

        _oBestScoreTextBack = new createjs.Text(TEXT_BEST_SCORE + ": " + 0, "36px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oBestScoreTextBack.textAlign = "center";
        _oBestScoreTextBack.textBaseline = "alphabetic";
	_oBestScoreTextBack.x = CANVAS_WIDTH_HALF;
        _oBestScoreTextBack.y = CANVAS_HEIGHT - 20;
        _oBestScoreTextBack.lineWidth = 450;
        _oBestScoreTextBack.outline = GUI_TEXT_OUTLINE;
        _oBestScoreTextBack.visible = false;

        _oBestScoreText = new createjs.Text(TEXT_BEST_SCORE + ": " + 0, "36px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oBestScoreText.textAlign = "center";
        _oBestScoreText.textBaseline = "alphabetic";
	_oBestScoreText.x = _oBestScoreTextBack.x;
        _oBestScoreText.y = _oBestScoreTextBack.y;
        _oBestScoreText.lineWidth = 450;
        _oBestScoreText.visible = false;
	_oMenuContainer.addChild(_oBestScoreTextBack, _oBestScoreText);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height*0.5)-20, y: (oSprite.height*0.5)+20};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, _oMenuContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var oSpriteInfo = s_oSpriteLibrary.getSprite("but_credits");
        _pStartPosCredits = {x: (oSprite.height*0.5)+20, y: (oSprite.height*0.5)+20};
        _oButInfo = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSpriteInfo, _oMenuContainer);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onButInfoRelease, this);

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width * 0.5 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oMenuContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        _oMenuContainer.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });

        this.resetVariables();

        s_oLevelSettings = new CLevelSettings();

        if(!s_bStorageAvailable){
            new CMsgBox(TEXT_ERR_LS, s_oStage);
        }else{
            // SET LAST LEVEL PLAYED
            var iLastLevel = getItem("rocking_wheels_lastlevel");
            if (iLastLevel !== null){
                s_iLastLevel = Number(iLastLevel);
                s_bFirstTime = false;
            };

            this.resetStarsAndScores();

            // SET LEVEL SCORES
            var aScores = getItemJson("rocking_wheels_scores");
            if(aScores !== null && aScores !== undefined){
                s_aScores = aScores;
                LS_SCORES = s_aScores;
            }

            // SET LEVEL STARS
            var aLevelStars = getItemJson("rocking_wheels_stars");
            if (aLevelStars !== null && s_aStars !== undefined) {
                s_aStars = aLevelStars;
                LS_STARS = s_aStars;
            };

            // SET SAVED CREDITS
            var iCredits = getItemJson("rocking_wheels_credits");
            if (iCredits !== null) {
                s_iTotalCredits = iCredits;
            }

            // SET SAVED UPGRADE LEVELS
            var iUpdateLevel = getItemJson("rocking_wheels_maxspeed_level");
            if (iUpdateLevel !== null) {
                s_iMaxSpeedUpgradeLevel = iUpdateLevel;
            }
            var iUpdateLevel = getItemJson("rocking_wheels_acceleration_level");
            if (iUpdateLevel !== null) {
                s_iAccelerationUpgradeLevel = iUpdateLevel;
            }
            var iUpdateLevel = getItemJson("rocking_wheels_nitro_level");
            if (iUpdateLevel !== null) {
                s_iNitroUpgradeLevel = iUpdateLevel;
            }

            _oBestScoreTextBack.text = _oBestScoreText.text = TEXT_BEST_SCORE + ": " + s_iBestScore;
            _oBestScoreTextBack.visible = _oBestScoreText.visible = false;

            // SET BEST SCORE
            var iBestScore = getItem("rocking_wheels_best_score");
            if (iBestScore !== null && iBestScore > 0) {
                s_iBestScore = iBestScore;
                _oBestScoreTextBack.text = _oBestScoreText.text = TEXT_BEST_SCORE + ": " + s_iBestScore;
                _oBestScoreTextBack.visible = _oBestScoreText.visible = true;
            };

            _oButReset.setVisible(_oBestScoreText.visible);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.addMenuGraphics = function(){
        var iRoadTopY = CANVAS_HEIGHT_HALF+50;
        var aPoints = [{x: 0, y: iRoadTopY},{x: CANVAS_WIDTH, y: iRoadTopY}];

        // ADD ROAD
        var oSprite = s_oSpriteLibrary.getSprite('terrain0');
        var oShape = new createjs.Shape();
        _oMenuContainer.addChild(oShape);

        oShape.graphics.clear();
        oShape.graphics.beginBitmapFill(oSprite);
        oShape.graphics.moveTo(aPoints[0].x, aPoints[0].y);
        for (var i = 1; i < 2; i++) {
            oShape.graphics.lineTo(aPoints[i].x, aPoints[i].y);
        };

        oShape.graphics.lineTo(aPoints[1].x, aPoints[1].y + 500);
        oShape.graphics.lineTo(aPoints[0].x, aPoints[0].y + 500);
        oShape.graphics.lineTo(aPoints[0].x, aPoints[0].y);
        oShape.graphics.endFill();

        var iWidth = (aPoints[1].x - aPoints[0].x)*1.2;
        oShape.cache(aPoints[0].x,0,iWidth,CANVAS_HEIGHT);

        // ADD ROAD TOP
        var oSpritePattern = s_oSpriteLibrary.getSprite('road_pattern_0');
        var vLight = new CVector2(-1,-1);
        vLight.normalize();

        var iOffsetY = 20;
        for (var i = 0; i < aPoints.length-1; i++) {
            var oEdge = new CEdgeModel(aPoints[i+1].x, aPoints[i+1].y,aPoints[i].x, aPoints[i].y);
            // GENERATE COLOR SHADES
            var vCurSegmentNormal = oEdge.getNormal();
            var fDotProduct = vCurSegmentNormal.dotProduct(vLight);
            var szFinalcolor = this.shadeBlend(fDotProduct*ROAD_LIGHT_OFFSET, ROAD_START_COLORS[0]);

            // ADD ROAD SHADES
            var oShape = new createjs.Shape();
            _oMenuContainer.addChild(oShape);
            oShape.graphics.clear();
            oShape.graphics.beginFill(szFinalcolor);
            oShape.graphics.moveTo(aPoints[i].x, aPoints[i].y + iOffsetY);
            oShape.graphics.lineTo(aPoints[i+1].x, aPoints[i+1].y + iOffsetY);
            oShape.graphics.lineTo(aPoints[i+1].x, aPoints[i+1].y + iOffsetY*-1);
            oShape.graphics.lineTo(aPoints[i].x, aPoints[i].y + iOffsetY*-1);
            oShape.graphics.lineTo(aPoints[i].x, aPoints[i].y + iOffsetY);
            oShape.graphics.endFill();
            // CACHE
            var iWidth = (aPoints[i+1].x - aPoints[i].x)*1.2;
            oShape.cache(aPoints[i].x,0,iWidth,CANVAS_HEIGHT);

            // ADD ROAD PATTERN
            var oShape = new createjs.Shape();
            _oMenuContainer.addChild(oShape);
            oShape.graphics.clear();
            oShape.graphics.beginBitmapFill(oSpritePattern);
            oShape.alpha = 1;
            oShape.compositeOperation = "multiply";
            oShape.graphics.moveTo(aPoints[i].x, aPoints[i].y + iOffsetY);
            oShape.graphics.lineTo(aPoints[i+1].x, aPoints[i+1].y + iOffsetY);
            oShape.graphics.lineTo(aPoints[i+1].x, aPoints[i+1].y + iOffsetY*-1);
            oShape.graphics.lineTo(aPoints[i].x, aPoints[i].y + iOffsetY*-1);
            oShape.graphics.lineTo(aPoints[i].x, aPoints[i].y + iOffsetY);
            oShape.graphics.endFill();
            // CACHE
            var iWidth = (aPoints[i+1].x - aPoints[i].x)*1.2;
            oShape.cache(aPoints[i].x,0,iWidth,CANVAS_HEIGHT);

            var szFinalBorderColor = this.shadeBlend(fDotProduct*ROAD_BORDER_LIGHT_OFFSET, ROAD_BORDER_TOP_START_COLORS[0]);
            var oTopLine = this.addRoadBorder(aPoints, i, -1*iOffsetY, szFinalBorderColor);
            var szFinalBorderColor = this.shadeBlend(fDotProduct*ROAD_BORDER_LIGHT_OFFSET, ROAD_BORDER_BOTTOM_START_COLORS[0]);
            var oBottomLine = this.addRoadBorder(aPoints, i, iOffsetY, szFinalBorderColor);
        };

        // ADD CAR
        _oCarContainer = new createjs.Container()
        _oMenuContainer.addChild(_oCarContainer);

        var oData = {
            images: [s_oSpriteLibrary.getSprite('player')],
            framerate: 30,
            frames: {width: 344, height: 148, regX: 0, regY: 0},
            animations: {idle:[0, 9, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oCarSprite = createSprite(oSpriteSheet, "idle", 0, 0, 344, 148);
        oCarSprite.scaleX = oCarSprite.scaleY = 0.5;
        oCarSprite.regX = 344 * 0.5;
        oCarSprite.regY = 148 * 0.5;
        oCarSprite.x = -100;
        oCarSprite.y = iRoadTopY - 50;
        _oCarContainer.addChild(oCarSprite);

        var oSprite = s_oSpriteLibrary.getSprite('wheel');
        var oWheelFrontSprite = createBitmap(oSprite);
        var oWheelBackSprite = createBitmap(oSprite);

        oWheelFrontSprite.regX = oSprite.width * 0.5;
        oWheelFrontSprite.regY = oSprite.height * 0.5;
        oWheelFrontSprite.scaleX = oWheelFrontSprite.scaleY = 0.5;
        oWheelFrontSprite.x = oCarSprite.x - 50;
        oWheelFrontSprite.y = oCarSprite.y + 35;
        _oCarContainer.addChild(oWheelFrontSprite);

        oWheelBackSprite.regX = oSprite.width * 0.5;
        oWheelBackSprite.regY = oSprite.height * 0.5;
        oWheelBackSprite.scaleX = oWheelBackSprite.scaleY = 0.5;
        oWheelBackSprite.x = oCarSprite.x + 52;
        oWheelBackSprite.y = oCarSprite.y + 35;
        _oCarContainer.addChild(oWheelBackSprite);

        this.addCarAnimation();

        // ADD CROWD
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
        var oCrowd = createSprite(oSpriteSheet, "idle", 0, 0, iWidth, iHeight);
        oCrowd.regX = iWidth * 0.5;
        oCrowd.regY = iHeight * 0.5;
        oCrowd.x = CANVAS_WIDTH_HALF;
        oCrowd.y = CANVAS_HEIGHT - 150;
        _oMenuContainer.addChild(oCrowd);

        // ADD LIGHTS
        var aHeadLights = [];
        var aLights = [];

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
            aLights.push(oLight);
        };
    };


    this.addHeadlightSprite = function(iX, iY, iScaleX){
        var oSpriteLight = s_oSpriteLibrary.getSprite("headlight");
        var oLight = createBitmap(oSpriteLight);
        oLight.regX = oSpriteLight.width * 0.5;
        oLight.regY = oSpriteLight.height * 0.5;
        oLight.x = iX;
        oLight.y = iY;
        oLight.scaleX = iScaleX;
        _oMenuContainer.addChild(oLight);
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
        _oMenuContainer.addChild(oLight);

        createjs.Tween.get(oLight, {loop: true})
            .wait((Math.random()*200)+50)
            .to({alpha: 1}, 100, createjs.Ease.cubicOut)
            .wait((Math.random()*500)+100)
            .to({alpha: 0}, 100, createjs.Ease.cubicOut);

        return oLight;
    };

    this.addCarAnimation = function(){
        new createjs.Tween.get(_oCarContainer)
            .to({x: CANVAS_WIDTH+100}, 10000, createjs.Ease.linear)
            .call(function(){
                _oCarContainer.x = -100;
                s_oMenu.addCarAnimation();
            });
    };

    this.shadeBlend = function(p,c0,c1) {
        var n=p<0?p*-1:p,u=Math.round,w=parseInt;
        if(c0.length>7){
            var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
            return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")";
        }else{
            var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
            return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1);
        }
    };

    this.addRoadBorder = function(aPoints, iIndex, iOffsetY, szColor){
        var oLine = new createjs.Shape();
        _oMenuContainer.addChild(oLine);
        oLine.graphics.setStrokeStyle(ROAD_BORDER_SIZE, "round").beginStroke(szColor);
        oLine.graphics.moveTo(aPoints[iIndex].x, aPoints[iIndex].y + iOffsetY);
        oLine.graphics.lineTo(aPoints[iIndex+1].x, aPoints[iIndex+1].y + iOffsetY);
        oLine.graphics.endStroke();
        // CACHE
        var iWidth = (aPoints[iIndex+1].x - aPoints[iIndex].x)*1.2;
        oLine.cache(aPoints[iIndex].x,0,iWidth,CANVAS_HEIGHT);

        return oLine;
    };
    // END OF GRAPHICS SETTINGS

    this.refreshButtonPos = function (iNewX, iNewY) {
        _oButPlay.setPosition(_pStartPosPlay.x, _pStartPosPlay.y - iNewY);
        _oButInfo.setPosition(_pStartPosCredits.x + iNewX, _pStartPosCredits.y + iNewY);
        _oButReset.setPosition(_pStartPosReset.x + iNewX, _pStartPosReset.y - iNewY);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };

    this.unload = function () {
        _oButPlay.unload();
        _oButInfo.unload();
        _oButPlay = null;
        _oButInfo = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }

        createjs.Tween.removeAllTweens();
        _oMenuContainer.removeAllChildren();
        s_oStage.removeAllChildren();
        s_oMenu = null;
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButInfoRelease = function () {
        var oCreditsPanel = new CCreditsPanel();
    };

    this._onButPlayRelease = function () {
        this.unload();
        s_oMain.gotoLevelChoose();
    };

    this._onButResetRelease = function(){
        if (_oConfirmResetPanel !== null) {
            return;
        }

        _oConfirmResetPanel = new CConfirmResetPanel();
    };

    this.onExitConfirmationPanel = function(){
        _oConfirmResetPanel = null;
    };

    this.onResetStats = function(){
        localStorage.clear();

        this.resetVariables();
        saveItem("rocking_wheels_lastlevel", s_iLastLevel);
        saveItem("rocking_wheels_best_score", s_iTotalCredits);
        setItemJson("rocking_wheels_credits", s_iTotalCredits);
        setItemJson("rocking_wheels_scores", s_aScores);
        setItemJson("rocking_wheels_stars", s_aStars);
        setItemJson("rocking_wheels_maxspeed_level", s_iMaxSpeedUpgradeLevel);
        setItemJson("rocking_wheels_acceleration_level", s_iAccelerationUpgradeLevel);
        setItemJson("rocking_wheels_nitro_level", s_iNitroUpgradeLevel);

        s_oMain.gotoMenu();
    };

    this.resetVariables = function(){
        s_bFirstTime = true;
        s_iAccelerationUpgradeLevel = 0;
        s_iNitroUpgradeLevel = 0;
        s_iMaxSpeedUpgradeLevel = 0;
        s_iLastLevel = 0;
        s_iBestScore = 0;
        s_iTotalCredits = CREDITS_START;

        this.resetStarsAndScores();
    };

    this.resetStarsAndScores = function(){
        s_aScores = [];
        LS_SCORES = [];
        s_aStars = [];
        LS_STARS = [];

        for (var i=0; i < NUM_LEVELS; i++){
            s_aScores.push(0);
            s_aStars.push(0);
        };

        LS_SCORES = s_aScores;
        LS_STARS = s_aStars;
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

    s_oMenu = this;

    this._init();
}

var s_oMenu = null;
