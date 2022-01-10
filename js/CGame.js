function CGame(iLevel) {
    var _aBonusObjects;
    var _aParallaxes;
    
    var _bCarMovement;
    var _bStartGame;
    var _bPaused;
    var _bBoostActive;
    var _bAccelerator;
    var _bBrake;
    var _bTimesUp;

    var _iTimer;
    var _iTotalCredits;
    var _iLevelScore;
    var _iMotorSpeed;
    var _iFuelTimer;
    var _iLevel;
    var _iBoostTimer;
    var _iLevelStars;
    var _iLevelDifficultyIndex;

    var _oFloor;
    var _oUpgradePanel;
    var _oLowGas;
    var _oLowGasBack;
    var _oAccelerator;
    var _oArrivalPosX;
    var _oBrake;
    var _oPhysicWorld;
    var _oPhysicObjectsCreator;
    var _oGameContainer;
    var _oParallaxBgContainer;
    var _oParallaxContainer;
    var _oTrackContainer;
    var _oGUIContainer;
    var _oPopupContainer;
    var _oHelpPanel;
    var _oMiniMap;
    var _oInterface;
    var _oWinPanel;
    var _oLosePanel;
    var _oPlayerCar;
    var _oBg;
    var _oArrivalArea;
    var _oAcceleratorStartPos;
    var _oBrakeStartPos;
    
    this._init = function() {
        this._resetVariables();       
        $("#canvas").trigger("start_session");        
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);        
        this.addParallax();
        
        // A CONTAINER WILL HAVE ALL THE OBJECTS IN IT (TO MOVE THE CAMERA)
        _oTrackContainer = new createjs.Container();
        s_oStage.addChild(_oTrackContainer);        
        this._initPhysicObjects();

        // A CONTAINER WILL HAVE ALL THE GUI IN IT
        _oGUIContainer = new createjs.Container;
        s_oStage.addChild(_oGUIContainer);

        if (s_bMobile) {
            this._initPedals();
        }
        
        _oMiniMap = new CMiniMap(_oGUIContainer, _iLevelDifficultyIndex);
        _oMiniMap.updateCarPosition(_oPlayerCar.getX());
        _oInterface = new CInterface(_iLevel, _oGUIContainer);
        _oInterface.refreshTimer( Math.floor(_iTimer) );
        _oPopupContainer = new createjs.Container;
        s_oStage.addChild(_oPopupContainer);        
        _oUpgradePanel = new CUpgradePanel(_oPopupContainer);
        
        this.updateCamera();
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
    };
    
    this.updateMapPosition = function(iNewX,iNewY){
        _oMiniMap.updateMapPosition(iNewX,iNewY);
    };
    
    this.addParallax = function(){
        _oParallaxBgContainer = new createjs.Container();
        _oGameContainer.addChild(_oParallaxBgContainer);

        var oSprite = s_oSpriteLibrary.getSprite("bg_game"+LEVEL_ROAD_INDEX[_iLevel]);
        _oBg = createBitmap(oSprite);
        _oParallaxBgContainer.addChild(_oBg);
        
        _oParallaxContainer = new createjs.Container();
        _oGameContainer.addChild(_oParallaxContainer);
        
        var iStartX = -200;
        var iOffsetX = 500;
        
        for (var i = 0; i < 13; i++) {
            var iRandomOffsetY;
            if (LEVEL_ROAD_INDEX[_iLevel] !== 4 && LEVEL_ROAD_INDEX[_iLevel] !== 5) {
                iRandomOffsetY = Math.floor(Math.random()*150)-50;   // GET A RANDOM OFFSET BETWEEN THOSE TWO LIMITS
            } else {
                iRandomOffsetY = Math.floor(Math.random()*10)-30;    // GET A RANDOM OFFSET BETWEEN THOSE TWO LIMITS
            };
            var iRandomImage = Math.floor(Math.random()*3);
            var szSpriteName = "parallax" + LEVEL_ROAD_INDEX[_iLevel] + iRandomImage;
            
            var oSprite = s_oSpriteLibrary.getSprite(szSpriteName);
            var oBgParallax = createBitmap(oSprite);
            oBgParallax.regX = oSprite.width * 0.5;
            oBgParallax.regY = oSprite.height;
            oBgParallax.x = iStartX + (i*iOffsetX);
            oBgParallax.y = CANVAS_HEIGHT - iRandomOffsetY;
            _oParallaxContainer.addChild(oBgParallax);
            _aParallaxes.push(oBgParallax);
        };
        
        // CACHE THE BACKGROUND TO IMPROVE PERFORMANCES
        var oBounds = _oParallaxBgContainer.getBounds();
        _oParallaxBgContainer.cache(oBounds.x, oBounds.y, oBounds.width, oBounds.height);
        var oBounds = _oParallaxContainer.getBounds();
        _oParallaxContainer.cache(oBounds.x, oBounds.y, oBounds.width, oBounds.height);
    };
    
    this._resetVariables = function(){
        _aBonusObjects = [];
        _aParallaxes = [];
        
        _iLevel = iLevel;
        _iTotalCredits = s_iTotalCredits;        
        _iMotorSpeed = MOTOR_SPEED_START + (MOTOR_SPEED_INCREMENT[s_iAccelerationUpgradeLevel]);
        _iBoostTimer = 0;
        _iFuelTimer = 0;
        _iLevelScore = 0;        
        _iTimer = LEVEL_TIMER_START[_iLevel];
        
        if (_iLevel < 10) {
            _iLevelDifficultyIndex = LEVEL_EASY_INDEX;
        } else if (_iLevel < 20 && _iLevel > 9) {
            _iLevelDifficultyIndex = LEVEL_MEDIUM_INDEX;
        } else {
            _iLevelDifficultyIndex = LEVEL_HARD_INDEX;
        }
        
        _oWinPanel = null;
        _oLosePanel = null;
        _oLowGas = null;
        _oLowGasBack = null;
        
        _bTimesUp = false;
        _bAccelerator = false;
        _bBrake = false;
        _bStartGame = false;
        _bCarMovement = false;
        _bPaused = false;
        _bBoostActive = false;
    };
    
    this._addLevelBonus = function(){
        // INIT COIN BONUS
        for (var i = 0; i < LEVEL_BONUS[_iLevel].coins.length; i++) {        
            var oBonusPos = {x: LEVEL_BONUS[_iLevel].coins[i].x, y: LEVEL_BONUS[_iLevel].coins[i].y};
            this._addBonus(oBonusPos, BONUS_COIN);
        };
        // INIT FUEL BONUS
        for (var i = 0; i < LEVEL_BONUS[_iLevel].fuel.length; i++) {
            var oBonusPos = {x: LEVEL_BONUS[_iLevel].fuel[i].x, y: LEVEL_BONUS[_iLevel].fuel[i].y};
            this._addBonus(oBonusPos, BONUS_FUEL);
        };
        // INIT BOOST BONUS
        for (var i = 0; i < LEVEL_BONUS[_iLevel].boost.length; i++) {
           var oBonusPos = {x: LEVEL_BONUS[_iLevel].boost[i].x, y: LEVEL_BONUS[_iLevel].boost[i].y};
           this._addBonus(oBonusPos, BONUS_BOOST);
        };    
    };
    
    this._addPlayerCarAndFlags = function(){
        var iFlagRetroOffsetY = 17;
        var iFlagRetroOffsetX = 30;
        var iFlagFrontOffset = 15;
        
        // ADD START/ARRIVAL FLAGS
        var iStartFlagX = LEVEL_BONUS[_iLevel].startflag[0].x;
        var iStartFlagY = LEVEL_BONUS[_iLevel].startflag[0].y + MAPS_OBJECTS_Y_OFFSET[_iLevel];
        var iEndFlagX = LEVEL_BONUS[_iLevel].arrivalflag[0].x;
        var iEndFlagY = LEVEL_BONUS[_iLevel].arrivalflag[0].y + MAPS_OBJECTS_Y_OFFSET[_iLevel];
        this.addFlag(iStartFlagX - iFlagRetroOffsetX, iStartFlagY - iFlagRetroOffsetY);
        this.addFlag(iEndFlagX - iFlagRetroOffsetX, iEndFlagY - iFlagRetroOffsetY);

        _oPlayerCar = _oPhysicObjectsCreator.addPlayerCar(_oTrackContainer);
        
        this.addFlag(iStartFlagX, iStartFlagY + iFlagFrontOffset);
        this.addFlag(iEndFlagX, iEndFlagY + iFlagFrontOffset);
                
        // CREATE ARRIVAL AREA TO CHECK IF THE CAR HAS FINISHED THE RACE
        _oArrivalArea = _oPhysicObjectsCreator.addRectangle(iEndFlagX, iEndFlagY, 10, 300, 0, 0, 0, 0, -1);
    };
    
    this._initPhysicObjects = function(){
        s_oPhysicsController = new CPhysicsController();
        _oPhysicObjectsCreator = new CPhysicObjectsCreator(s_oPhysicsController.getWorld());
        _oPhysicWorld = new CPhysicWorld(_oPhysicObjectsCreator, _oTrackContainer);
        
        _oFloor = _oPhysicObjectsCreator.addFloor(LEVEL_DATA[_iLevel].polyline, _oTrackContainer);        
        this._addLevelBonus();             
        this._addPlayerCarAndFlags();
        _oArrivalPosX = s_oPhysicsController.getElementPosition(_oArrivalArea).x;                
    };
    
    this.addFlag = function(iX, iY) {
        var oSprite= s_oSpriteLibrary.getSprite("flag");
        var oFlag = createBitmap(oSprite);
        oFlag.regX = 0;
        oFlag.regY = -5;
        oFlag.x = iX;
        oFlag.y = iY;
        _oTrackContainer.addChild(oFlag);        
        return oFlag;
    };
    
    this.getLevel = function(){
        return _iLevel;
    };

    this._addBonus = function(oBonusPos, iBonus){
        var oBonus = new CBonusObject(oBonusPos.x, oBonusPos.y + MAPS_BONUS_Y_OFFSET[_iLevel], iBonus, _oTrackContainer);
        _aBonusObjects.push(oBonus);
    };
    
    this._initPedals = function(){
        _oAcceleratorStartPos = {x: CANVAS_WIDTH_HALF + 350,y: CANVAS_HEIGHT - 150};
        _oAccelerator = this.addPedalButton("accelerator", _oAcceleratorStartPos.x, _oAcceleratorStartPos.y);
        _oAccelerator.on('mousedown', this.onAcceleratorPressed);
        _oAccelerator.on('pressup', this.onAcceleratorRelease);
        
        _oBrakeStartPos = {x: CANVAS_WIDTH_HALF - 350,y: CANVAS_HEIGHT - 150};
        _oBrake = this.addPedalButton("brake", _oBrakeStartPos.x, _oBrakeStartPos.y);
        _oBrake.on('mousedown', this.onBrakePressed);
        _oBrake.on('pressup', this.onBrakeRelease);
        
        _oGUIContainer.addChild(_oAccelerator, _oBrake);
    };

    this.addPedalButton = function(szSprite, iX, iY){
        var oSprite = s_oSpriteLibrary.getSprite(szSprite);
        var oData = {images: [oSprite], 
                    frames: {width: oSprite.width/2, height: oSprite.height, 
                            regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                    animations: {state_true:[1],state_false:[0]}};
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oPedal = createSprite(oSpriteSheet, "state_"+false,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        oPedal.x = iX;
        oPedal.y = iY;
        
        return oPedal;
    };

    this.onExitUpgradePanel = function(){
        _iTotalCredits = s_iTotalCredits;
        _oInterface.updateCreditsText(s_iTotalCredits);
        
        if (_iLevel === 0) {
            _oHelpPanel = CHelpPanel();
        } else {
            this._onExitHelp();
        }                
    };

    this.updateTimer = function(){        
        if (this._bDisableEvents) {
            return;
        }
        _iTimer -= s_iTimeElaps;
        _oInterface.refreshTimer( Math.floor(_iTimer) );
    };
    
    this.timesUp = function(){
        _oInterface.onTimeOut();
        
        // A "HURRY UP!" REMINDER, TO BE SHOWN WHEN THE TIME IS ALMOST OVER
        var oHurryUpBack = new createjs.Text(TEXT_HURRYUP, FONT_SIZE_TEXT_MESSAGE+"px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        oHurryUpBack.textAlign = "center";
        oHurryUpBack.lineWidth = 500;
        oHurryUpBack.textBaseline = "middle";
        oHurryUpBack.x = CANVAS_WIDTH_HALF;
        oHurryUpBack.y = CANVAS_HEIGHT_HALF - 180;
        oHurryUpBack.outline = GUI_TEXT_OUTLINE;
        _oGUIContainer.addChild(oHurryUpBack);
        
        var oHurryUp = new createjs.Text(TEXT_HURRYUP, FONT_SIZE_TEXT_MESSAGE+"px " + PRIMARY_FONT, THIRD_FONT_COLOR);
        oHurryUp.textAlign = "center";
        oHurryUp.lineWidth = 500;
        oHurryUp.textBaseline = "middle";
        oHurryUp.x = oHurryUpBack.x;
        oHurryUp.y = oHurryUpBack.y;
        _oGUIContainer.addChild(oHurryUp);
        
        createjs.Tween.get(oHurryUpBack)
            .to({alpha: 0}, 5000, createjs.Ease.cubicIn);
        createjs.Tween.get(oHurryUp)
            .to({alpha: 0}, 5000, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(oHurryUpBack);
                createjs.Tween.removeTweens(oHurryUp);
                _oGUIContainer.removeChild(oHurryUpBack);
                _oGUIContainer.removeChild(oHurryUp);
            });
    };
    
    this.onLowGas = function(){
        if (_oLowGas) {
            return;
        }        
        if (soundPlaying("low_gas") === false) {
            playSound("low_gas", 1, 0);
        }
        
        // A "LOW GAS!" REMINDER, TO BE SHOWN WHEN THE FUEL IS ALMOST OVER
        _oLowGasBack = new createjs.Text(TEXT_LOWGAS, FONT_SIZE_TEXT_MESSAGE+"px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oLowGasBack.textAlign = "center";
        _oLowGasBack.lineWidth = 500;
        _oLowGasBack.textBaseline = "middle";
        _oLowGasBack.x = CANVAS_WIDTH_HALF;
        _oLowGasBack.y = CANVAS_HEIGHT_HALF - 180;
        _oLowGasBack.outline = GUI_TEXT_OUTLINE;
        _oGUIContainer.addChild(_oLowGasBack);
        
        _oLowGas = new createjs.Text(TEXT_LOWGAS, FONT_SIZE_TEXT_MESSAGE+"px " + PRIMARY_FONT, THIRD_FONT_COLOR);
        _oLowGas.textAlign = "center";
        _oLowGas.lineWidth = 500;
        _oLowGas.textBaseline = "middle";
        _oLowGas.x = _oLowGasBack.x;
        _oLowGas.y = _oLowGasBack.y;
        _oGUIContainer.addChild(_oLowGas);
        
        createjs.Tween.get(_oLowGasBack)
            .to({alpha: 0}, 5000, createjs.Ease.cubicIn);
        createjs.Tween.get(_oLowGas)
            .to({alpha: 0}, 5000, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(_oLowGas);
                createjs.Tween.removeTweens(_oLowGasBack);
                _oGUIContainer.removeChild(_oLowGas);
                _oGUIContainer.removeChild(_oLowGasBack);
                _oLowGas = null;
                _oLowGasBack = null;
            });
    };

    function onKeyUp(evt){ 
        if (!_bStartGame) {
            return;
        }
        if (!evt) {
            evt = window.event; 
        } 
        evt.preventDefault();
        
        switch(evt.keyCode) {    
            case KEY_DOWN:
            case KEY_LEFT: {
                _bBrake = false;                
                break;
            };
            case KEY_UP:
            case KEY_RIGHT: {
                _bAccelerator = false;
                break;
            };
        }
    };

    function onKeyDown(evt){
        if (!_bStartGame) {
            return;
        }
        if (!evt) {
            evt = window.event; 
        } 
        evt.preventDefault();
        
        switch(evt.keyCode) {
            case KEY_DOWN:
            case KEY_LEFT: {
                _bBrake = true;
                s_oGame.onBrake();
                break;
            };
            case KEY_UP:
            case KEY_RIGHT: {
                _bAccelerator = true;
                s_oGame.onAccelerate();
                break;
            };
        }
    };
    
    this.getPhysicWorld = function(){
        return _oPhysicWorld;
    };
    
    this.onAcceleratorPressed = function(){
        if (!_bStartGame) {
            return;
        }
        if (_bBrake === true) {
            return;
        } else {
            _bAccelerator = true;
            playSound("click",1,0);
            _oAccelerator.gotoAndPlay("state_true");
            _oAccelerator.scaleX = _oAccelerator.scaleY = 0.9;
        };
    };
    
    this.onAcceleratorRelease = function(){
        _bAccelerator = false;
        _oAccelerator.gotoAndPlay("state_false");
        _oAccelerator.scaleX = _oAccelerator.scaleY = 1;
    };
    
    this.onBrakePressed = function(){
        if (!_bStartGame) {
            return;
        }
        _bBrake = true;
        playSound("click",1,0);
        _oBrake.gotoAndPlay("state_true");
        _oBrake.scaleX = _oBrake.scaleY = 0.9;
    };
    
    this.onBrakeRelease = function(){
        _bBrake = false;
        _oBrake.gotoAndPlay("state_false");
        _oBrake.scaleX = _oBrake.scaleY = 1;
    };
    
    this.onBrake = function(){
        _oPlayerCar.reduceSpeed();
    };
    
    this.onAccelerate = function(){
        if (_bBrake === true) {
            return;
        } else {
            if (_bBoostActive) {
                _iMotorSpeed *= BOOST_BONUS_VALUE[s_iNitroUpgradeLevel];
            }
            _oPlayerCar.addSpeed(_iMotorSpeed);
        };
    };
    
    this.addScore = function(iValue){
        _iTotalCredits += iValue;
        _oInterface.updateCreditsText(_iTotalCredits);
        
        _iLevelScore += iValue;
        _oInterface.updateScoreText(_iLevelScore);
    };
    
    this._unloadMobileControls = function(){
        _oAccelerator.removeAllEventListeners();
        _oBrake.removeAllEventListeners();
    };
    
    this._unloadEndPanels = function(){
        if (_oWinPanel !== null) {
            _oWinPanel.unload(); 
            _oWinPanel = null;
        }
        if (_oLosePanel !== null) {
            _oLosePanel.unload(); 
            _oLosePanel = null;
        }        
    };

    this.unload = function() {
        _bStartGame = false;        
        createjs.Tween.removeAllTweens();        
        this._unloadEndPanels();
        
        if (s_bMobile) {
            this._unloadMobileControls();            
        }
        
        for (var i = 0; i < _aBonusObjects.length; i++) {
            _aBonusObjects[i].unload();
        };
        
        _oInterface.unload();
        _oMiniMap.unload();
        _oTrackContainer.removeAllChildren();
        s_oStage.removeChild(_oTrackContainer);
        _oGUIContainer.removeAllChildren();
        s_oStage.removeChild(_oGUIContainer);
        _oGameContainer.removeAllChildren();
        s_oStage.removeChild(_oGameContainer);
        _oPopupContainer.removeAllChildren();
        s_oStage.removeChild(_oPopupContainer);
        s_oStage.removeAllChildren();
        this.destroyPhysicsEngine();
        
        if (!s_bMobile) {
            document.onkeydown = null;
            document.onkeyup = null;
        }
        
        s_oGame = null;
    };
    
    this.destroyPhysicsEngine = function () {
        _oPlayerCar.unload();
        _oFloor.unload();
        _oPhysicWorld.unload();
        s_oPhysicsController.destroyWorld();
        _oPlayerCar = null;        
        _oFloor = null;        
        _oPhysicWorld = null;
        _oPhysicObjectsCreator = null;        
        s_oPhysicsController = null;
    };

    this.onExit = function(){
        s_oGame.stopLoopSounds();
        s_oGame.unload();
        $("#canvas").trigger("show_interlevel_ad");
        $("#canvas").trigger("end_session");
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu();
    };

    this._onExitHelp = function(){
        _bStartGame = true;
        _bCarMovement = true;
        _oPlayerCar.activateCar(true);
        
        if (!s_bMobile) {
            document.onkeydown = onKeyDown; 
            document.onkeyup   = onKeyUp; 
        }
    };
    
    this.pause = function(bValue){
        _bCarMovement = !bValue;
        _bStartGame = !bValue;
        _bPaused = bValue;        
    };
    
    this._gameWin = function(){
        // UNLOCK NEXT LEVEL IF NEEDED
        if (_iLevel+1 > s_iLastLevel) {
            s_iLastLevel = _iLevel+1;
            saveItem("rocking_wheels_lastlevel", s_iLastLevel);
        }
        
        _bStartGame = false;
        this.stopLoopSounds();
        stopSound("soundtrack");
        setTimeout(function () {
            playSound("soundtrack", SOUNDTRACK_VOLUME_IN_GAME, false);
        }, 2000);        
        
        if (_oWinPanel !== null) {
            return;
        }
        
        _oPlayerCar.reduceSpeed();
        
        // SAVE NEW SCORE
        if (s_aScores[_iLevel] < _iLevelScore) {
            s_aScores[_iLevel] = _iLevelScore;
            LS_SCORES = s_aScores;
            setItemJson("rocking_wheels_scores", s_aScores);
        }
        // IF THERE'S A NEW HIGH SCORE
        var bNewHighScore = false;
        if (_iLevelScore > s_iBestScore) {
            s_iBestScore = _iLevelScore;
            saveItem("rocking_wheels_best_score", _iLevelScore);
            bNewHighScore = true;
        }

        this._calculateStars();

        s_iTotalCredits = _iTotalCredits;
        setItemJson("rocking_wheels_credits", s_iTotalCredits);

        playSound("arrive_win",1,false);
        _oWinPanel = CWinPanel(_iLevel, _iLevelScore, _oPopupContainer, bNewHighScore);
        _oWinPanel.show();       
    };
    
    this._calculateStars = function(){
        // CHECK HOW MANY STARS THE PLAYER WILL HAVE FOR THIS LEVEL, ACCORDING TO THE TIME LEFT
        if (_iTimer > LEVEL_TIMER_START[_iLevel] / TIMER_VAR_MIN) {
            _iLevelStars = 3;
        } else if (_iTimer > LEVEL_TIMER_START[_iLevel] / TIMER_VAR_MAX && 
                   _iTimer <= LEVEL_TIMER_START[_iLevel] / TIMER_VAR_MIN) {
            _iLevelStars = 2;
        } else {
            _iLevelStars = 1;
        }
        
        // SAVE NEW STAR SCORE
        if (s_aStars[_iLevel] < _iLevelStars) {
            s_aStars[_iLevel] = _iLevelStars;
            LS_STARS = s_aStars;
            setItemJson("rocking_wheels_stars", s_aStars);
        }
    };

    this.removeLastScore = function(){
        s_aScores[_iLevel] = 0;
    };

    this.stopLoopSounds = function(){
        stopSound("timer");
        stopSound("ignition");
        stopSound("engine");
    };

    this._gameOver = function(iGameOverType){
        if (s_bMobile) {
            this.onAcceleratorRelease();
            this.onBrakeRelease();
        }

        _oPlayerCar.reduceSpeed();
        _bStartGame = false;
        this.stopLoopSounds();
        stopSound("soundtrack");
        setTimeout(function () {
            playSound("soundtrack", SOUNDTRACK_VOLUME_IN_GAME, false);
        }, 2000);
        
        if (_oLosePanel !== null) {
            return;
        }
        
        playSound("arrive_lose",1,false);
        _oLosePanel = CLosePanel(_iLevel, iGameOverType, _oPopupContainer);
        _oLosePanel.show();        
    };
    
    this.restartGame = function(iLevel){
        s_oGame.stopLoopSounds();
        s_oGame.unload();
        $("#canvas").trigger("restart_level", iLevel);
        s_oMain.gotoGame(iLevel);
    };
    
    this.onNextLevel = function(iLevel){
        $("#canvas").trigger("show_interlevel_ad");        
        s_oGame.unload();
        $("#canvas").trigger("end_level", iLevel);
        s_oMain.gotoGame(iLevel+1);
    };
    
    this.isStartGame = function(){
        return _bStartGame;
    };
    
    this.updatePhysics = function(){
        // KEEP THE SPRITES' POSITION ON THEIR PHYSIC OBJECTS
        _oPlayerCar.update();
        s_oPhysicsController.update();
    };
    
    this.updateCarPanel = function(){
        // UPDATE FUEL INDICATOR
        _oInterface.moveFuelIndicator(_iFuelTimer);
        
        // UPDATE SPEED INDICATOR
        var iCarSpeed = _oPlayerCar.getSpeed();
        if (soundPlaying("engine") === false && iCarSpeed > 0.5 && _bStartGame && !_bPaused) {
            playSound("engine", 0.5, 0);
        }        
        _oInterface.moveSpeedIndicator(iCarSpeed);                
    };

    this.onBoostBonusTaken = function(){
        this.setBoostActive(true);        
    };    
    
    this.onCoinBonusTaken = function(){
        _oInterface.onCreditsTaken();
        this.addScore(COIN_VALUE);
    };
    
    this.onGasBonusTaken = function(){
        _iFuelTimer = 0;
        
        if (!_oLowGas) {
            return;
        }

        createjs.Tween.removeTweens(_oLowGas);
        createjs.Tween.removeTweens(_oLowGasBack);
        createjs.Tween.get(_oLowGasBack)
            .to({alpha: 0}, 300, createjs.Ease.cubicIn);
        createjs.Tween.get(_oLowGas)
            .to({alpha: 0}, 300, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(_oLowGas);
                createjs.Tween.removeTweens(_oLowGasBack);
                _oGUIContainer.removeChild(_oLowGas);
                _oGUIContainer.removeChild(_oLowGasBack);
            });
    };
    
    this.onPlayerOutOfGas = function(){
        _oPlayerCar.reduceSpeed();
        _oPlayerCar.setSmokeActive(true);
        
        _bStartGame = false;
        
        stopSound("ignition");
        if (soundPlaying("outoffuel") === false) {
            playSound("outoffuel", 1, 0);
        }       
        
        var oParent = this;
        setTimeout(function(){ 
            oParent._gameOver(GAMEOVER_OUTOFGAS); 
        }, OUT_OF_GAS_DELAY);
    };
    
    this.updateCamera = function(){
        _oParallaxBgContainer.x = PARALLAX_OFFSET_X - _oPlayerCar.getX() * PARALLAX_MOVEMENT[_iLevelDifficultyIndex];
        _oParallaxContainer.x = CANVAS_WIDTH_HALF - (_oPlayerCar.getX() * 0.1);
        _oTrackContainer.x = CANVAS_WIDTH_HALF - _oPlayerCar.getX();
        
        if (DEBUG_BOX2D) {
            // UPDATE THE DEBUG CANVAS POSITION
            var oCanvasOffset = {x: _oTrackContainer.x, y: 0};
            s_oPhysicsController.updateDebugPosition(oCanvasOffset);
        }
    };
    
    this.checkCollisionWithBonus = function(oCarPos){
        var iCarPosX = oCarPos.x - CAR_BONUS_COLLISION_DISTANCE;
        
        // CHECK FOR ANY PRESENT BONUS IF THERE IS A COLLISION WITH THE PLAYER CAR
        for (var i = 0; i < _aBonusObjects.length; i++) {
            // CONSIDER ONLY BONUS OBJECTS ON FRONT OF THE CAR, THAT HAS NOT BEEN TAKEN YET
            if (_aBonusObjects[i].getPosition().x > iCarPosX && 
                _aBonusObjects[i].getPosition().x < iCarPosX + 200 && !_aBonusObjects[i].isTaken()) {                
                var iDistance = distanceBetweenTwoPoints(oCarPos.x, oCarPos.y, _aBonusObjects[i].getPosition().x, _aBonusObjects[i].getPosition().y);
                if (iDistance < CAR_BONUS_COLLISION_DISTANCE) {
                    _aBonusObjects[i].onBonusTaken();
                }                
            }
        };
    };
    
    this.checkForArrival = function(oCarPos){
        if (oCarPos.x < _oArrivalPosX) {
            return;
        }
        
        if (s_bMobile) {
            this.onAcceleratorRelease();
            this.onBrakeRelease();
        }
        this._gameWin();        
    };
    
    this.timerController = function(){
        // UPDATE TIMER
        if (_iTimer > 0) {
            this.updateTimer();
            // WHEN THE TIMER IS UNDER A LIMIT, A REMINDER WILL APPEAR
            if (_iTimer < TIMER_REMINDER_LIMIT && !_bTimesUp) {
                _bTimesUp = true;
                playSound("timer",1,true);
                this.timesUp();
            }
        // ON TIME OUT
        } else {
            _iTimer = 0;
            _oPlayerCar.reduceSpeed();
            this._gameOver(GAMEOVER_OUTOFTIME);
        }
    };
    
    this.onResetCar = function(){
        if (!_bStartGame) {
            return;
        }
        _oPlayerCar.onCarExplode();
    };
    
    this.turnBoost = function(bValue){
        _bBoostActive = bValue;
        _oInterface.activeBoostIndicator(bValue);
    };
    
    this.setBoostActive = function(bValue){
        this.turnBoost(bValue);
        _oPlayerCar.setBoost(_bBoostActive);
    };
    
    this.checkMobileControls = function(){
        if (_bBrake) {
            this.onBrake();
        } else {
            if (_bAccelerator){
                this.onAccelerate();
            }
        }        
    };
    
    this.checkForResetFullscreenBut = function(){
        if (s_bMobile) {
            _oAccelerator.x = _oAcceleratorStartPos.x;
            _oBrake.x = _oBrakeStartPos.x;
        }
        
        if (!_oUpgradePanel) {
            return;
        }        
        _oUpgradePanel.resetFullscreenBut();
    };
    
    this.update = function() {
        if (_bPaused) {
            if ( soundPlaying("engine") ) {
                stopSound("engine");
            }
            return;
        }
        if (_bCarMovement) {
            this.updatePhysics();
        }
        if (!_bStartGame) {
            return;        
        }
        if (s_bMobile) {
            this.checkMobileControls();
        }
        if (!_bBrake && !_bAccelerator) {
            _oPlayerCar.constantBraking();
        }
        
        _oMiniMap.updateCarPosition(_oPlayerCar.getX());
        
        this.timerController();
        
        // UPDATE FUEL CONSUMPTION
        if (_oPlayerCar.getSpeed() > 1) {
            _iFuelTimer += s_iTimeElaps;
        }
        // BOOST TIMER
        if (_bBoostActive) {
            _iBoostTimer += s_iTimeElaps;            
            if (_iBoostTimer > BOOST_BONUS_DURATION[s_iNitroUpgradeLevel]) {
                _iBoostTimer = 0;
                this.setBoostActive(false);
            }
        }

        this.updateCarPanel();
        this.checkCollisionWithBonus( _oPlayerCar.getPosition() );
        this.checkForArrival( _oPlayerCar.getPosition() );
        this.updateCamera();
    };
    
    s_oGame = this;

    this._init();
}

var s_oGame;