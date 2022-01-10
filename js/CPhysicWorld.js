function CPhysicWorld(oPhysicObjectsCreator, oContainer){
    var _oPhysicWorldSprite;
    var _oPhysicObjectsCreator;
    var _oContainer;
    
    var _iWidth;
    var _iHeight;
    
    this._init = function(){
        _oPhysicObjectsCreator = oPhysicObjectsCreator;
        
        var oSprite = s_oSpriteLibrary.getSprite('bg');
        _oPhysicWorldSprite = createBitmap(oSprite);
        _oPhysicWorldSprite.x = 0;
        _oPhysicWorldSprite.y = 0;
        _oPhysicWorldSprite.alpha = 0.0001;
        _oContainer.addChild(_oPhysicWorldSprite);
        
        _iWidth = oSprite.width;
        _iHeight = oSprite.height; 
    };

    this.centerToScreen = function(aPoints){
        ///IN "Body Editor", SCREEN TABLE WIDTH IS EGUAL TO 1, SO WE USE THE WIDTH IS TO SCALE ALL GIVEN POINTS
        var iRefSize = _iWidth;
        
        var iTranslationX = _oPhysicWorldSprite.x - _iWidth/2;
        var iTranslationY = _oPhysicWorldSprite.y - _iHeight/2;
        
        for(var i=0; i<aPoints.length; i++){
            aPoints[i].x = aPoints[i].x*iRefSize + iTranslationX;
            aPoints[i].y = _iHeight - aPoints[i].y*iRefSize + iTranslationY;
        };
    };
    
    this.unload = function(){
        _oContainer.removeChild(_oPhysicWorldSprite);
        _oPhysicWorldSprite = null;
    };
    
    _oContainer = oContainer;    
    
    this._init();
};
