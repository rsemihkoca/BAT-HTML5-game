function CConfirmationButton(iXPos, iYPos, iID, oParentContainer){
    
    var _bDisabled;
    
    var _iScaleFactor;
	
    var _aParams = [];
    var _iListenerIDMouseDown;
    var _iListenerIDPressUp;
    var _iListenerIDMouseOver;
    
    var _iID;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oButton;
    var _oParent;
    
    this._init =function(iXPos, iYPos, iID, oParentContainer){
        _bDisabled = false;        
        _iScaleFactor = 1;
        _iID = iID;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var oSprite = s_oSpriteLibrary.getSprite("but_scoreboard");
        _oButton = createBitmap(oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.scaleX = _oButton.scaleY = _iScaleFactor;                         
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
       
        oParentContainer.addChild(_oButton);        
        
        this._initListener();
    };
    
    this.unload = function(){
        _oButton.removeAllEventListeners();
        
        oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setClickable = function(bVal){
        _bDisabled = !bVal;
    };
    
    this._initListener = function(){
        if(s_bMobile){
            _iListenerIDMouseDown   = _oButton.on("mousedown", this.buttonDown);
            _iListenerIDPressUp     = _oButton.on("pressup" , this.buttonRelease);
        } else {
            _iListenerIDMouseDown   = _oButton.on("mousedown", this.buttonDown);
            _iListenerIDMouseOver   = _oButton.on("mouseover", this.buttonOver);
            _iListenerIDPressUp     = _oButton.on("pressup" , this.buttonRelease);
        }     
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
	
    this.buttonRelease = function(){
        if(_bDisabled){
            return;
        }
        _oButton.scaleX = _iScaleFactor;
        _oButton.scaleY = _iScaleFactor;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisabled){
            return;
        }
        _oButton.scaleX = _iScaleFactor*0.9;
        _oButton.scaleY = _iScaleFactor*0.9;
        
        if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
        }
    };
    
    this.buttonOver = function(evt){
        if(!s_bMobile){
            if(_bDisabled){
                return;
            }
            evt.target.cursor = "pointer";
        }  
    };
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    _oParent = this;
    
    this._init(iXPos,iYPos,iID,oParentContainer);
    
    return this;
}