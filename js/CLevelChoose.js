function CLevelChoose(){
    var _iCurPage;
    var _iHeightToggle;
    
    var _aLevelButs;
    var _aPointsX;
    var _aContainerPage;
    
    var _pStartPosSelect;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oFade;
    var _oButExit;
    var _oAudioToggle;
    var _oArrowRight;
    var _oArrowLeft;
    var _oContainer;
    var _oButFullscreen;
    
    var _fRequestFullScreen;
    var _fCancelFullScreen;
    
    this._init = function(){
        _oArrowRight = null;
        _oArrowLeft = null;
        _fRequestFullScreen = null;
        _fCancelFullScreen = null;
        
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        
        _iCurPage = 0;
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_screens'));
	_oContainer.addChild(oBg);
        _oContainer.addChild(shape);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box_big');
        var oBgScreen = createBitmap(oSprite);
        oBgScreen.regX = oSprite.width * 0.5;
        oBgScreen.regY = oSprite.height * 0.5;
        oBgScreen.x = CANVAS_WIDTH_HALF;
        oBgScreen.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(oBgScreen);
        
        var pStartPosSelect = {x:CANVAS_WIDTH_HALF, y:100};
       
        var iWidth = 500;
        var iHeight = FONT_SIZE_TITLES+10;
        var iTextX = pStartPosSelect.x;
        var iTextY = pStartPosSelect.y;
        var oLevelTextBack = new CTLText(_oContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_TITLES, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_SELECT_LEVEL,
                    true, true, true,
                    false );
        oLevelTextBack.setOutline(GUI_TEXT_OUTLINE);            
        var oLevelText = new CTLText(_oContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_TITLES, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, FONT_LINEHEIGHT_FACTOR,
                    2, 2,
                    TEXT_SELECT_LEVEL,
                    true, true, true,
                    false );

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2)-10,y:(oSprite.height/2)+10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        _iHeightToggle = oSprite.height;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_oButExit.getX() - oSprite.width-10,y:(oSprite.height/2)+10 }
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive,_oContainer);
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
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2)+10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        this._checkBoundLimits();

        //FIND X COORDINATES FOR LEVEL BUTS
        _aPointsX = new Array();
        var iWidth = CANVAS_WIDTH - (EDGEBOARD_X*2) ;
        var iOffsetX = Math.floor(iWidth/NUM_COLS_PAGE_LEVEL)/2-30;
        var iXPos = 0;
        for(var i=0;i<NUM_COLS_PAGE_LEVEL;i++){
            _aPointsX.push(iXPos);
            iXPos += iOffsetX*2;
        }

        _aContainerPage = new Array();
        this._createNewLevelPage(0, s_oLevelSettings.getNumLevel());

        if(_aContainerPage.length > 1){
            //MULTIPLE PAGES
            for(var k=1;k<_aContainerPage.length;k++){
                _aContainerPage[k].visible = false;
            }

            _oArrowRight = new CGfxButton(CANVAS_WIDTH_HALF + 350,CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level'),_oContainer);
            _oArrowRight.getButtonImage().rotation = 90;
            _oArrowRight.addEventListener(ON_MOUSE_UP, this._onRight, this);
            
            _oArrowLeft = new CGfxButton(CANVAS_WIDTH_HALF - 350, CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level'),_oContainer);
            _oArrowLeft.getButtonImage().rotation = -90;
            _oArrowLeft.addEventListener(ON_MOUSE_UP, this._onLeft, this);
        }
        
        this.setArrowsVisible();
        
        this.refreshButtonPos();	
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oContainer.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
            createjs.Tween.removeTweens(_oFade);
        });
    };
    
    this.setArrowsVisible = function(){
        if (_iCurPage === 0) {            
            _oArrowRight.setVisible(true);
            _oArrowLeft.setVisible(false);
        } else if (_iCurPage === _aContainerPage.length-1) {
            _oArrowRight.setVisible(false);
            _oArrowLeft.setVisible(true);
        }
    };
    
    this.unload = function(){
        for(var i=0;i<_aLevelButs.length;i++){
            _aLevelButs[i].unload();
        }  
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        
        if(_oArrowLeft !== null){
            _oArrowLeft.unload();
            _oArrowRight.unload();
        }
        
        s_oStage.removeChild(_oContainer);
        s_oLevelMenu = null;
    };
    
    this.refreshButtonPos = function(){
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this._checkBoundLimits = function(){
        var oSprite = s_oSpriteLibrary.getSprite('level_sprite');
        var iY = 0;
        
        var iHeightBound = CANVAS_HEIGHT - (EDGEBOARD_Y*2) - (_iHeightToggle * 2);
        var iNumRows = 0;

        while(iY < iHeightBound){
            iY += oSprite.height + 20;
            iNumRows++;
        }
        if (NUM_ROWS_PAGE_LEVEL > iNumRows){
            NUM_ROWS_PAGE_LEVEL = iNumRows;
        }

        var iNumCols = 0;
        var iX = 0;
        var iWidthBounds = CANVAS_WIDTH - (EDGEBOARD_X*2);
        var oSprite = s_oSpriteLibrary.getSprite('level_sprite');

        while(iX < iWidthBounds){
            iX += (oSprite.width/2) + 5;
            iNumCols++;  
        }
        if(NUM_COLS_PAGE_LEVEL > iNumCols){
            NUM_COLS_PAGE_LEVEL = iNumCols;
        }
    };
    
    this._createNewLevelPage = function(iStartLevel,iEndLevel){
        var oContainerLevelBut = new createjs.Container();
        _oContainer.addChild(oContainerLevelBut);
        _aContainerPage.push(oContainerLevelBut);
        
        _aLevelButs = new Array();
        var iCont = 0;
        var iY = 0;
        var iNumRow = 1;
        var bNewPage = false;
        var oSprite = s_oSpriteLibrary.getSprite('level_sprite');
        for(var i=iStartLevel;i<iEndLevel;i++){
            var bActive;
            if (ALL_LEVELS_UNLOCKED === true) {
                bActive = true;
            } else {
                bActive = (i)>s_iLastLevel?false:true;
            };
            var oBut = new CLevelBut(_aPointsX[iCont] + oSprite.width/4 + 15, iY + oSprite.height/2+40, i+1, oSprite, s_aStars[i], bActive,oContainerLevelBut);
            oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onButLevelRelease, this,i);            
            _aLevelButs.push(oBut);
            
            iCont++;
            if(iCont === _aPointsX.length && i<iEndLevel-1){
                iCont = 0;
                iY += oSprite.height + 50;
                iNumRow++;
                if(iNumRow > NUM_ROWS_PAGE_LEVEL){
                    bNewPage = true;
                    break;
                }
            }
        }
        oContainerLevelBut.x = CANVAS_WIDTH_HALF ;
        oContainerLevelBut.y = CANVAS_HEIGHT_HALF;
        oContainerLevelBut.regX = oContainerLevelBut.getBounds().width/2;
        oContainerLevelBut.regY = oContainerLevelBut.getBounds().height/2;
        if(bNewPage){
            this._createNewLevelPage(i+1,iEndLevel);
        }                
    };
    
    this._onRight = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage++;
        if(_iCurPage >=  _aContainerPage.length){
            _iCurPage = 0;
        }
        
        _aContainerPage[_iCurPage].visible = true;
        this.setArrowsVisible();
    };
    
    this._onLeft = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage--;
        if(_iCurPage <  0){
            _iCurPage =_aContainerPage.length-1;
        }
        
        _aContainerPage[_iCurPage].visible = true;
        this.setArrowsVisible();
    };
    
    this._onButLevelRelease = function(iLevel){        
        s_oLevelSettings.loadLevel(iLevel);
        this.unload();
        s_oMain.gotoGame(iLevel);
    };
    
    this._onAudioToggle = function(){
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
    
    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };

    s_oLevelMenu = this;
    this._init();
}

var s_oLevelMenu = null;