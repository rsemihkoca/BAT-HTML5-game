function CPause (oParentContainer){
    var _oShape;
    var _oText;
    var _oContainer;
    var _oParentContainer;
    
    this.init = function(oParentContainer){
        s_oGame.pause(true);
        
        _oContainer = new createjs.Container();
        _oParentContainer = oParentContainer;
        _oParentContainer.addChild(_oContainer);
        
        var oParent = this;
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oShape.alpha = 0.9;
        _oShape.on("mousedown", function(){ oParent.exitPause() });
        
        _oText = new createjs.Text(TEXT_PAUSE, FONT_SIZE_PAUSE+"px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oText.textBaseline = "alphabetic";
        _oText.textAlign = "center";
        _oText.x = CANVAS_WIDTH_HALF;
        _oText.y = CANVAS_HEIGHT_HALF + 10;
        
        _oContainer.addChild(_oShape, _oText);
        _oText.alpha = 1;
    };
    
    this.exitPause = function(){
        s_oInterface.closePanel();
        this.unload();
        s_oGame.pause(false);
    };
    
    this.onExit = function(){
        _oShape.alpha = 0;
        _oText.alpha = 0;
        this.unload();
        s_oGame.pause(false);        
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.init(oParentContainer);
}

