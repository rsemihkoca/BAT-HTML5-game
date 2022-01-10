function CToggle(iXPos,iYPos,oSprite,bActive,oParentContainer){
    var _oParentContainer = oParentContainer;
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oButton;
    var _iScaleValue = 1;
    
    this._init = function(iXPos,iYPos,oSprite,bActive){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var oData = {   
                    images: [oSprite], 
                    // width, height & registration point of each sprite
                    frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                    animations: {state_true:[0],state_false:[1]}
               };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _bActive = bActive;
        _oButton = createSprite(oSpriteSheet, "state_"+_bActive,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
         
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.stop();
        if (!s_bMobile)
            _oButton.cursor = "pointer";
        _oParentContainer.addChild(_oButton);
        
        this._initListener();
    };
    
    this.setRotation = function(iValue){
        _oButton.rotation = iValue;
    };
    
    this.unload = function(){
       _oButton.removeAllEventListeners();
	   
       _oParentContainer.removeChild(_oButton);
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.setActive = function(bActive){
        _bActive = bActive;
        _oButton.gotoAndStop("state_"+_bActive);
    };
    
    this.setScale = function(iValue){
        _iScaleValue = iValue;
        _oButton.scaleX = _iScaleValue;
        _oButton.scaleY = _iScaleValue;
    };
    
    this.buttonRelease = function(){
        _oButton.scaleX = _iScaleValue;
        _oButton.scaleY = _iScaleValue;
        
        playSound("click",1,false);
        
        _bActive = !_bActive;
        _oButton.gotoAndStop("state_"+_bActive);

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        _oButton.scaleX = _iScaleValue-0.1;
        _oButton.scaleY = _iScaleValue-0.1;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.getButtonImage = function() {
        return _oButton;
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._init(iXPos,iYPos,oSprite,bActive);
}