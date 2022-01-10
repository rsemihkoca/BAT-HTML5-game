function CPlayer(oPlayerPhysic,oWheelFrontPhysic,oWheelBackPhysic,oFrontJoint,oBackJoint,oFrontPrismaticJoint,oBackPrismaticJoint,oParentContainer){
    var _oParentContainer;
    var _oPlayerPhysic;
    var _oWheelFrontPhysic;
    var _oWheelBackPhysic;

    var _oFrontPrismaticJoint;
    var _oBackPrismaticJoint;
    var _oCarSprite;
    var _oWheelFrontSprite;
    var _oWheelBackSprite;
    var _oFrontJoint;
    var _oBackJoint;
    var _oBoostSprite;
    var _oSmokeSprite;
    var _oExplosion;
    
    var _bBoostActive;
    var _bResetCar;
    var _bUpdate;
    var _bResetCarTimer;
    
    var _iSpeedLimit;
    var _iResetTimer;
    
    this.init = function(){
        _bBoostActive = false;
        _bResetCar = false;
        _bUpdate = true;
        _bResetCarTimer = false;
        _iResetTimer = 0;
        _iSpeedLimit = -1*MOTORSPEED_LIMIT[s_iMaxSpeedUpgradeLevel];
        
        _oExplosion = null;
        _oWheelFrontPhysic = oWheelFrontPhysic;
        _oWheelBackPhysic = oWheelBackPhysic;
        _oPlayerPhysic = oPlayerPhysic;
        _oFrontJoint = oFrontJoint;
        _oBackJoint = oBackJoint;
        _oFrontPrismaticJoint = oFrontPrismaticJoint;
        _oBackPrismaticJoint = oBackPrismaticJoint;
    
        var aImages = [];
        for (var i = 0; i < 22; i++) {
            var oImage = s_oSpriteLibrary.getSprite("nitro"+i);
            aImages.push(oImage);
        };
    
        var oData = {
            images: aImages, 
            framerate: 20,
            frames: {width: 120, height: 80, regX: 0, regY: 0}, 
            animations: {idle:[0, 21, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oBoostSprite = createSprite(oSpriteSheet, "idle", 0, 0, 120, 80);
        _oBoostSprite.regX = 190;
        _oBoostSprite.regY = 10;
        _oBoostSprite.visible = _bBoostActive;
        _oParentContainer.addChild(_oBoostSprite);
        
        var oData = {
            images: [s_oSpriteLibrary.getSprite('player')], 
            framerate: 30,
            frames: {width: 344, height: 148, regX: 0, regY: 0}, 
            animations: {idle:[0, 9, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCarSprite = createSprite(oSpriteSheet, "idle", 0, 0, 344, 148);
        _oCarSprite.scaleX = _oCarSprite.scaleY = 0.5;
        _oCarSprite.regX = 344 * 0.5;
        _oCarSprite.regY = 148 * 0.5;
        _oParentContainer.addChild(_oCarSprite);
        
        var oData = {   
            images: [s_oSpriteLibrary.getSprite("smoke")], 
            framerate: 15,
            frames: {width: 130, height: 130, regX: 65, regY: 65}, 
            animations: {idle:[0, 35, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSmokeSprite = createSprite(oSpriteSheet, "idle", 65, 65, 130, 130);
        _oSmokeSprite.regX = -65;
        _oSmokeSprite.regY = 30;
        _oSmokeSprite.visible = false;
        _oParentContainer.addChild(_oSmokeSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('wheel');
        _oWheelFrontSprite = createBitmap(oSprite);
        _oWheelBackSprite = createBitmap(oSprite);
        
        _oWheelFrontSprite.regX = oSprite.width * 0.5;
        _oWheelFrontSprite.regY = oSprite.height * 0.5;
        _oWheelFrontSprite.scaleX = _oWheelFrontSprite.scaleY = 0.5;
        _oParentContainer.addChild(_oWheelFrontSprite);
        
        _oWheelBackSprite.regX = oSprite.width * 0.5;
        _oWheelBackSprite.regY = oSprite.height * 0.5;
        _oWheelBackSprite.scaleX = _oWheelBackSprite.scaleY = 0.5;
        _oParentContainer.addChild(_oWheelBackSprite);
        
        this._moveSpritePosOnPhysicPos();
    };
    
    this.unload = function () {
        if (_oExplosion) {
            this.removeExplosion();
        };

        createjs.Tween.removeTweens(_oBoostSprite);
        _oParentContainer.removeChild(_oCarSprite);
        _oParentContainer.removeChild(_oWheelBackSprite);
        _oParentContainer.removeChild(_oWheelFrontSprite);
        _oParentContainer.removeChild(_oSmokeSprite);
        _oParentContainer.removeChild(_oBoostSprite);
        _oPlayerPhysic = null;
    };
        
    this.resetPosition = function(){
        if (_bResetCar){
            return;
        }
        _bResetCar = true;
        this.reduceSpeed();
        this.startAnimationReset();        
    };
    
    this._setVisible = function (bValue){
        _oWheelFrontSprite.visible = bValue;
        _oWheelBackSprite.visible = bValue;
        _oCarSprite.visible = bValue;
    };
    
    this.addExplosion = function(){
        if (_oExplosion){
            return;
        }
        
        var aSprites = [];
        for (var i = 0; i < 30; i++) {
            var oSprite = s_oSpriteLibrary.getSprite("explosion"+i);
            aSprites.push(oSprite);
        };
        
        var oData = {images: aSprites, 
                    frames: {width: 200, height: 200, regX: 100, regY: 100/2}, 
                    animations: {idle: [0, 29]}};
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oExplosion = createSprite(oSpriteSheet, "idle", 100,100,200,200);
        _oExplosion.x = _oCarSprite.x;
        _oExplosion.y = _oCarSprite.y;
        _oExplosion.on("animationend", this.removeExplosion);
        _oParentContainer.addChild(_oExplosion);
    };
    
    this.removeExplosion = function(){
        _oParentContainer.removeChild(_oExplosion);
        _oExplosion = null;
    };
    
    this.startAnimationReset = function(){
        _bUpdate = false;
        
        var oInfos = s_oPhysicsController.getElementPosition(_oPlayerPhysic);
        s_oPhysicsController.setElementAngle(_oPlayerPhysic, 0);
        s_oPhysicsController.setElementPosition(_oPlayerPhysic, {x: oInfos.x, y: oInfos.y-100});
        s_oPhysicsController.setElementBodyPosition(_oWheelFrontPhysic, {x: oInfos.x, y: oInfos.y-50});
        s_oPhysicsController.setElementBodyPosition(_oWheelBackPhysic, {x: oInfos.x, y: oInfos.y-50});
       
        if (soundPlaying("resetcar") === false) {
            playSound("resetcar", 1, 0);
        }
        
        this.setBoost(false);
        this._setVisible(false);
        this.activateCar(false);
        
        // START TIMER TO RESET CAR
        _bResetCarTimer = true;
    };
    
    this.restartCar = function(){
        this._moveSpritePosOnPhysicPos();
        this._setVisible(true);
        this.activateCar(true);
        _bResetCar = false; 
        _bUpdate = true;
    };
    
    this._isCarFallenUpsideDown = function(){
        var iSpeed = _oPlayerPhysic.GetBody().GetLinearVelocity().x;
        if (iSpeed > CAR_FALLEN_SPEED_LIMIT) {
            return false;
        }
        
        var oCarInfos = s_oPhysicsController.getElementPosition(_oPlayerPhysic);
        
        if (iSpeed < CAR_FALLEN_SPEED_LIMIT_MIN && oCarInfos.angle > CAR_FALLEN_ANGLE_LIMIT)  {
            return true;
        }
        if (oCarInfos.angle > CAR_FALLEN_UPSIDE_ANGLE_MIN && oCarInfos.angle < CAR_FALLEN_UPSIDE_ANGLE_MAX) {
            return true;
        }
        
        return false;
    };
    
    this._moveSpritePosOnPhysicPos = function(){
        var oCarInfos = s_oPhysicsController.getElementPosition(_oPlayerPhysic);
        _oCarSprite.x = oCarInfos.x;
        _oCarSprite.y = oCarInfos.y;
        _oCarSprite.rotation = oCarInfos.angle;
        
        var oFrontWheelInfos = s_oPhysicsController.getBodyPosition(_oWheelFrontPhysic);
        _oWheelFrontSprite.x = oFrontWheelInfos.x;
        _oWheelFrontSprite.y = oFrontWheelInfos.y;
        _oWheelFrontSprite.rotation = oFrontWheelInfos.angle;
        
        var oBackWheelInfos = s_oPhysicsController.getBodyPosition(_oWheelBackPhysic);
        _oWheelBackSprite.x = oBackWheelInfos.x;
        _oWheelBackSprite.y = oBackWheelInfos.y;
        _oWheelBackSprite.rotation = oBackWheelInfos.angle;
               
        if (_oBoostSprite.visible) {
            _oBoostSprite.x = _oCarSprite.x;
            _oBoostSprite.y = _oCarSprite.y;
            _oBoostSprite.rotation = _oCarSprite.rotation;
        }
        
        if(_oSmokeSprite.visible) {
            _oSmokeSprite.x = _oCarSprite.x;
            _oSmokeSprite.y = _oCarSprite.y;
        }
    };
    
    this.onCarExplode = function(){
        this._onCarFallenDown();
    };
    
    this._onCarFallenDown = function(){
        this.activateBoost(false);
        this.reduceSpeed();
        
        if (soundPlaying("explosion") === false) {
            playSound("explosion", 1, 0);
        }

        this.addExplosion();
        this.resetPosition();
    };
    
    this.addSpeed = function(iSpeed){
        var iMotorSpeed = _oBackJoint.GetMotorSpeed();
        iMotorSpeed -= iSpeed;

        // LIMIT THE SPEED ACCORDING TO THE PLAYER UPGRADES
        if (iMotorSpeed < _iSpeedLimit) {
            iMotorSpeed = _iSpeedLimit;
        }
        
        _oFrontJoint.SetMotorSpeed(iMotorSpeed);
        _oBackJoint.SetMotorSpeed(iMotorSpeed);
        
        this.updatePrismaticJoints();
    };
    
    this.constantBraking = function(){
        var iMotorSpeed = _oBackJoint.GetMotorSpeed();
        iMotorSpeed += CONSTANT_DECELERATION_VAR;

        if (iMotorSpeed > 0) {
            return;
        }

        _oFrontJoint.SetMotorSpeed(iMotorSpeed);
        _oBackJoint.SetMotorSpeed(iMotorSpeed);
    };
    
    this.reduceSpeed = function(){
        if (soundPlaying("brake") === false && _oBackJoint.GetMotorSpeed() < -5) {
            playSound("brake", 1, 0);
        }
        
        _oFrontJoint.SetMotorSpeed(0);
        _oBackJoint.SetMotorSpeed(0);
        
        this.updatePrismaticJoints();
    };
    
    this.getSpeed = function(){
        var iSpeed = _oPlayerPhysic.GetBody().GetLinearVelocity().x;
        return iSpeed;
    };
    
    this.updatePrismaticJoints = function(){
        _oFrontPrismaticJoint.SetMaxMotorForce(Math.abs(PRISMATIC_JOINTS_MULTIPLIER * _oFrontPrismaticJoint.GetJointTranslation()));
        _oFrontPrismaticJoint.SetMotorSpeed((_oFrontPrismaticJoint.GetMotorSpeed()-2 * _oFrontPrismaticJoint.GetJointTranslation()));
        
        _oBackPrismaticJoint.SetMaxMotorForce(Math.abs(PRISMATIC_JOINTS_MULTIPLIER * _oBackPrismaticJoint.GetJointTranslation()));
        _oBackPrismaticJoint.SetMotorSpeed((_oBackPrismaticJoint.GetMotorSpeed()-2 * _oBackPrismaticJoint.GetJointTranslation()));
    };
        
    this.activateCar = function(bValue){
        _oPlayerPhysic.GetBody().SetActive(bValue);
        _oWheelFrontPhysic.SetActive(bValue);
        _oWheelBackPhysic.SetActive(bValue);        
    };
    
    this.getBody = function(){
        return _oPlayerPhysic;
    };
    
    this.getX = function(){
        return _oCarSprite.x;
    };
    
    this.getY = function(){
        return _oCarSprite.y;
    };
    
    this.getPosition = function(){
        var oPos = {x: _oCarSprite.x, y: _oCarSprite.y};
        return oPos;
    };
    
    this.activateBoost = function(){
        _oBoostSprite.visible = _bBoostActive;
        _oBoostSprite.alpha = 0;
        new createjs.Tween.get(_oBoostSprite)
            .to({alpha: 1}, 500, createjs.Ease.cubicOut)
            .call(function(){
                createjs.Tween.removeTweens(_oBoostSprite);
            });
    };
    
    this.disactivateBoost = function(){
        s_oGame.turnBoost(false);
        _oBoostSprite.alpha = 1;
        new createjs.Tween.get(_oBoostSprite)
            .to({alpha: 0}, 100, createjs.Ease.cubicOut)
            .call(function(){
                _oBoostSprite.visible = _bBoostActive;
                createjs.Tween.removeTweens(_oBoostSprite);
            });
    };
    
    this.setBoost = function(bValue){
        _bBoostActive = bValue;
        
        if (bValue) {
            this.activateBoost();
        } else {
            this.disactivateBoost();
        }        
    };
    
    this.setSmokeActive = function(bValue){
        _oSmokeSprite.visible = bValue;
    };
    
    this.setUpdate = function(bValue){
        _bUpdate = bValue;
    };
    
    this.update = function(){
        // TIMER SETTINGS TO RESET CAR
        if (_bResetCarTimer) {
            _iResetTimer += s_iTimeElaps;
            if (_iResetTimer > CAR_RESET_DELAY) {                
                this.restartCar();
                _iResetTimer = 0;
                _bResetCarTimer = false;                
            }
        }

        if (!_bUpdate) {
            return;
        }
        
        this._moveSpritePosOnPhysicPos();

        // CHECK IF THE CAR IS FALLEN, AND IT'S UPSIDE DOWN
        if (!s_oGame.isStartGame()) {
            return;
        }
        if (this._isCarFallenUpsideDown() === true) {
            this._onCarFallenDown();
        }
    };
    
    _oParentContainer = oParentContainer;
    
    this.init();
};