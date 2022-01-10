function CMiniMap(oParentContainer, iLevelIndex){
    var _oMapContainer;
    var _oCarIndicator;
    var _oParentContainer;
    
    var _iLevelIndex;
    
    this._init = function(){
        _iLevelIndex = iLevelIndex;
        _oMapContainer = new createjs.Container();
        _oParentContainer.addChild(_oMapContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('minimap_bg');
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width * 0.5;
        oBg.regY = oSprite.height * 0.5;
        oBg.cache(0, 0, oSprite.width, oSprite.height);
        _oMapContainer.addChild(oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('minimap_car');
        _oCarIndicator = createBitmap(oSprite);
        _oCarIndicator.regX = oSprite.width * 0.5;
        _oCarIndicator.regY = oSprite.height * 0.5;
        _oCarIndicator.x = MINI_MAP_CAR_START_X;
        _oCarIndicator.y = oBg.y + 12;
        _oMapContainer.addChild(_oCarIndicator);
        
        _oMapContainer.x = MINI_MAP_POS_X;
        _oMapContainer.y = MINI_MAP_POS_Y;
    };
    
    this.updateCarPosition = function(iX){
        _oCarIndicator.x = MINI_MAP_CAR_START_X + (iX / MINI_MAP_DIVIDER[_iLevelIndex]);
    };
    
    this.updateMapPosition = function(iX, iY){
        _oMapContainer.x = MINI_MAP_POS_X + iX;
        _oMapContainer.y = MINI_MAP_POS_Y + iY;
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oMapContainer);
    };
    
    _oParentContainer = oParentContainer;
    
    this._init();
};