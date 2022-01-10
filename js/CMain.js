function CMain(oData){

    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;
    var _oLevelChoose;

    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
	s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);

        s_bMobile = isMobile();              // This will check if we are on mobile 
        
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
    
    this.preloaderReady = function () {
        this._loadImages();
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        _bUpdate = true;
    };

    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

         if(_iCurResource === RESOURCE_TO_LOAD){
            //this._onRemovePreloader();
         }
    };

    this._initSounds = function () {
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'select',loop:false,volume:1, ingamename: 'select'});
        s_aSoundsInfo.push({path: './sounds/',filename:'timer',loop:false,volume:1, ingamename: 'timer'});
        s_aSoundsInfo.push({path: './sounds/',filename:'brake',loop:false,volume:1, ingamename: 'brake'});
        s_aSoundsInfo.push({path: './sounds/',filename:'explosion',loop:false,volume:1, ingamename: 'explosion'});
        s_aSoundsInfo.push({path: './sounds/',filename:'resetcar',loop:false,volume:1, ingamename: 'resetcar'});
        s_aSoundsInfo.push({path: './sounds/',filename:'money',loop:false,volume:1, ingamename: 'money'});
        s_aSoundsInfo.push({path: './sounds/',filename:'fuel',loop:false,volume:1, ingamename: 'fuel'});
        s_aSoundsInfo.push({path: './sounds/',filename:'outoffuel',loop:false,volume:1, ingamename: 'outoffuel'});
        s_aSoundsInfo.push({path: './sounds/',filename:'honk',loop:false,volume:1, ingamename: 'honk'});
        s_aSoundsInfo.push({path: './sounds/',filename:'engine',loop:false,volume:1, ingamename: 'engine'});
        s_aSoundsInfo.push({path: './sounds/',filename:'boost',loop:false,volume:1, ingamename: 'boost'});
        s_aSoundsInfo.push({path: './sounds/',filename:'upgrade_car',loop:false,volume:1, ingamename: 'upgrade_car'});
        s_aSoundsInfo.push({path: './sounds/',filename:'ignition',loop:false,volume:1, ingamename: 'ignition'});
        s_aSoundsInfo.push({path: './sounds/',filename:'wrong',loop:false,volume:1, ingamename: 'wrong'});
        s_aSoundsInfo.push({path: './sounds/',filename:'low_gas',loop:false,volume:1, ingamename: 'low_gas'});
        s_aSoundsInfo.push({path: './sounds/',filename:'arrive_lose',loop:false,volume:1, ingamename: 'arrive_lose'});
        s_aSoundsInfo.push({path: './sounds/',filename:'arrive_win',loop:false,volume:1, ingamename: 'arrive_win'});

        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
    };

    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
    };

    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("bg", "./sprites/bg.jpg");
        s_oSpriteLibrary.addSprite("logo_menu", "./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_settings", "./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("but_help", "./sprites/but_help.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");
        s_oSpriteLibrary.addSprite("but_explode", "./sprites/but_explode.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_reset", "./sprites/but_reset.png");
        s_oSpriteLibrary.addSprite("level_sprite", "./sprites/level_sprite.png");
        s_oSpriteLibrary.addSprite("but_confirm", "./sprites/but_confirm.png");        
        s_oSpriteLibrary.addSprite("but_upgrade1", "./sprites/but_upgrade1.png");
        s_oSpriteLibrary.addSprite("but_upgrade2", "./sprites/but_upgrade2.png");
        s_oSpriteLibrary.addSprite("but_upgrade3", "./sprites/but_upgrade3.png");
        s_oSpriteLibrary.addSprite("bg_screens", "./sprites/bg_screens.jpg");
        s_oSpriteLibrary.addSprite("bg_help", "./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("player", "./sprites/player.png");
        s_oSpriteLibrary.addSprite("clock", "./sprites/clock.png");
        s_oSpriteLibrary.addSprite("msg_box_big", "./sprites/msg_box_big.png");
        s_oSpriteLibrary.addSprite("msg_box_small", "./sprites/msg_box_small.png");
        s_oSpriteLibrary.addSprite("accelerator", "./sprites/accelerator.png");
        s_oSpriteLibrary.addSprite("coin", "./sprites/coin.png");
        s_oSpriteLibrary.addSprite("boost", "./sprites/boost.png");
        s_oSpriteLibrary.addSprite("fuel", "./sprites/fuel.png");
        s_oSpriteLibrary.addSprite("brake", "./sprites/brake.png");
        s_oSpriteLibrary.addSprite("wheel", "./sprites/wheel.png");
        s_oSpriteLibrary.addSprite("car_panel", "./sprites/car_panel.png");
        s_oSpriteLibrary.addSprite("indicator", "./sprites/indicator.png");
        s_oSpriteLibrary.addSprite("flag", "./sprites/flag.png");
        s_oSpriteLibrary.addSprite("nitro_icon", "./sprites/nitro_icon.png");
        s_oSpriteLibrary.addSprite("fuel_light", "./sprites/fuel_light.png");
        s_oSpriteLibrary.addSprite("starbox", "./sprites/starbox.png");
        s_oSpriteLibrary.addSprite("star", "./sprites/star.png");
        s_oSpriteLibrary.addSprite("smoke", "./sprites/smoke.png");
        s_oSpriteLibrary.addSprite("minimap_bg", "./sprites/minimap_bg.png");
        s_oSpriteLibrary.addSprite("minimap_car", "./sprites/minimap_car.png");
        s_oSpriteLibrary.addSprite("arrow_select_level", "./sprites/arrow_select_level.png");
        s_oSpriteLibrary.addSprite("help_keys", "./sprites/help_keys.png");
        s_oSpriteLibrary.addSprite("help_boost", "./sprites/help_boost.png");
        s_oSpriteLibrary.addSprite("help_coin", "./sprites/help_coin.png");
        s_oSpriteLibrary.addSprite("help_fuel", "./sprites/help_fuel.png");
        s_oSpriteLibrary.addSprite("help_pedals", "./sprites/help_pedals.png");
        s_oSpriteLibrary.addSprite("light_yellow", "./sprites/light_yellow.png");
        s_oSpriteLibrary.addSprite("light_violet", "./sprites/light_violet.png");
        s_oSpriteLibrary.addSprite("headlight", "./sprites/headlight.png");

        for (var i = 0; i < 45; i++) {
            s_oSpriteLibrary.addSprite("crowd"+i, "./sprites/crowd/crowd_"+i+".png");
        }        
        for (var i = 0; i < 22; i++) {
            s_oSpriteLibrary.addSprite("nitro"+i, "./sprites/nitro/nitro"+i+".png");
        }
        for (var i = 0; i < 30; i++) {
            s_oSpriteLibrary.addSprite("explosion"+i, "./sprites/explosion/explosion"+i+".png");
        }        
        for (var i = 0; i < 7; i++) {
            s_oSpriteLibrary.addSprite("bg_game"+i, "./sprites/roads/bg_game"+i+".jpg");
            s_oSpriteLibrary.addSprite("terrain"+i, "./sprites/roads/terrain"+i+".png");        
            for (var j = 0; j < 3; j++) {
                s_oSpriteLibrary.addSprite("parallax"+i+j, "./sprites/roads/parallax"+i+"_"+j+".png");
            };
            s_oSpriteLibrary.addSprite("road_pattern_"+i, "./sprites/roads/road_pattern_"+i+".png");
        };

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            //this._onRemovePreloader();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onRemovePreloader = function(){
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }
        
        _oPreloader.unload();
            
        s_oSoundtrack = playSound('soundtrack', 1, true);
        
        this.gotoMenu();
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    }; 

    this.gotoLevelChoose = function () {
        _oLevelChoose = new CLevelChoose();
        _iState = STATE_LEVEL;
    };
    
    this.gotoGame = function (iLevel) {
        _oGame = new CGame(iLevel);
        _iState = STATE_GAME;
        $("#canvas").trigger("game_start");
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }        
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);
    };
    
    CREDITS_START = oData.credits_start;
    COIN_VALUE = oData.coin_value;
    ALL_LEVELS_UNLOCKED = oData.all_levels_unlocked,
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    
    s_bAudioActive = oData.audio_enable_on_startup;
    
    _oData = oData;
    
    s_oMain = this;
    
    this.initContainer();  
};

var s_bMobile;
var s_bAudioActive = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_iBestScore = 0;
var s_bFullscreen = false;
var s_bStorageAvailable = true;
var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack = null;
var s_aSoundsInfo;
var s_aSounds;
var s_oCanvas;
var s_iMaxSpeedUpgradeLevel = 0;
var s_iAccelerationUpgradeLevel = 0;
var s_iNitroUpgradeLevel = 0;
var s_iTotalCredits = 0;
var s_iLastLevel = 1;
var s_aScores;
var s_aStars;