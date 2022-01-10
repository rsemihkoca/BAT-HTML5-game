function CLevelSettings(){
    var _iCurrentLevel;

    this._init = function(){
        _iCurrentLevel = 0;
        NUM_LEVELS = LEVEL_DATA.length;
    };
    
    this.loadLevel = function(iLevel){
        _iCurrentLevel = iLevel;        
    };

    this.nextLevel = function(){
        if (_iCurrentLevel < NUM_LEVELS){
            _iCurrentLevel++;
            this.loadLevel(_iCurrentLevel);
        } 
    };
    
    this.getNextLevel = function(){
        if (_iCurrentLevel < NUM_LEVELS){
             return _iCurrentLevel+2;
        } else {
            return _iCurrentLevel+1;
        }
    };
    
    this.getCurrentLevel = function(){
        return _iCurrentLevel; 
    };
    
    this.getNumLevel = function(){
        return NUM_LEVELS; 
    };
    
    this._init();
    
    s_oLevelSettings = this;
};

var s_oLevelSettings;