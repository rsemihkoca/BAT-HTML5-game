function CPhysicObjectsCreator(oWorld){
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    var b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJointDef;

    var _iLevel;

    var _oWorld;

    var _oFrontWheel;
    var _oBackWheel;
    var _oFrontDamper;
    var _oBackDamper;
    var _oBackPrismaticJoint;
    var _oFrontPrismaticJoint;

    this.init = function(){
        _iLevel = s_oGame.getLevel();
        _oWorld = oWorld;
    };

    this.addFloor = function(aPoints, oContainer){
        for (var i = 0; i < aPoints.length-1; i++) {
            var vVec1 = new b2Vec2(aPoints[i].x + MAPS_X_OFFSET, aPoints[i].y + MAPS_Y_OFFSET[_iLevel]);
            var vVec2 = new b2Vec2(aPoints[i+1].x + MAPS_X_OFFSET, aPoints[i+1].y + MAPS_Y_OFFSET[_iLevel]);
            var oPhysic = this.addEdge(vVec1, vVec2, 0, FLOOR_DENSITY, FLOOR_FRICTION, FLOOR_RESTITUTION);
        };

        var oFloor = new CFloor(oPhysic, aPoints, oContainer);
        return oFloor;
    };

    this.addEdge = function(v1, v2, iAngle, density, friction, restitution){
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;

        var oBodyDef = new b2BodyDef;
        oBodyDef.type = b2Body.b2_staticBody;
        oFixDef.shape = new b2PolygonShape;

        var oPos1 = new b2Vec2(v1.x/ WORLD_SCALE,v1.y/ WORLD_SCALE);
        var oPos2 = new b2Vec2(v2.x/ WORLD_SCALE,v2.y/ WORLD_SCALE);

        oFixDef.shape.SetAsEdge(oPos1, oPos2);
        oBodyDef.angle = iAngle*Math.PI/180;
        oFixDef.userData = {id:"edge"};

        var oBody = _oWorld.CreateBody(oBodyDef);
        oBody.CreateFixture(oFixDef);

        return oBody;
    };

    this.addPlayerCar = function(oContainer){
        // WE'LL CREATE A CAR, MADE OF THE CHASSIS, TWO WHEELS, TWO DAMPERS
        var iFilterIndex = -1;
        var iAngle = 0;
        var iX = CAR_START_X;
        var iY = CAR_START_Y;

        // CREATE THE PHYSIC SETTINGS FOR THE CHASSIS OF THE CAR
        // CLONE THE COORDINATES TO AVOID MODIFYING THE ORIGINAL ONES (I USE "0" INDEX BECAUSE THERE'S ONLY ONE POLYGON)
        var aClonedCoordinates = [];
        var aPlayerCoordinates = CAR_DATA.rigidBodies[0].polygons;
        for (var i = 0; i < aPlayerCoordinates.length; i++ ) {
            for (var j = 0; j < aPlayerCoordinates[i].length; j++) {
                aClonedCoordinates[j] = {x: aPlayerCoordinates[i][j].x, y: aPlayerCoordinates[i][j].y};
            };
        };
        var oPhysicWorld = s_oGame.getPhysicWorld();
        oPhysicWorld.centerToScreen(aClonedCoordinates);

        // CREATE THE PHYSIC SETTINGS FOR THIS POLYGON AND CREATE THE PLAYER
        var oChassisPhysic = this.addPolygon(aClonedCoordinates.reverse(), iX, iY, iAngle, CHASSIS_DENSITY, CHASSIS_FRICTION, CHASSIS_RESTITUTION, DYNAMIC_BODY, iFilterIndex);

        // ADD DAMPERS
        var iFrontWheelX = iX + 52;
        var iBackWheelX = iX - 50;
        var iWheelsY = iY + 25;

        _oFrontDamper = this.addDamper(DAMPER_WIDTH,DAMPER_HEIGHT,iFrontWheelX,iWheelsY,DAMPER_DENSITY,DAMPER_FRICTION,DAMPER_RESTITUTION,iFilterIndex);
        _oBackDamper = this.addDamper(DAMPER_WIDTH,DAMPER_HEIGHT,iBackWheelX,iWheelsY,DAMPER_DENSITY,DAMPER_FRICTION,DAMPER_RESTITUTION,iFilterIndex);

        // ADD WHEELS
        _oFrontWheel = this.addCircle(WHEEL_SIZE, iFrontWheelX, iWheelsY, WHEEL_DENSITY, WHEEL_FRICTION, WHEEL_RESTITUTION, iFilterIndex);
        _oBackWheel = this.addCircle(WHEEL_SIZE, iBackWheelX, iWheelsY, WHEEL_DENSITY, WHEEL_FRICTION, WHEEL_RESTITUTION, iFilterIndex);

        // ADD REVOLUTION JOINTS TO WHEELS AND DAMPERS
        var oBackWheelRevolJoint = new b2RevoluteJointDef;
        oBackWheelRevolJoint.Initialize(_oBackWheel, _oBackDamper, _oBackWheel.GetWorldCenter());
        oBackWheelRevolJoint.enableMotor = true;
        oBackWheelRevolJoint.maxMotorTorque = MAX_MOTOR_TORQUE;
        oBackWheelRevolJoint.motorSpeed = 0.0;
        oBackWheelRevolJoint = _oWorld.CreateJoint(oBackWheelRevolJoint);

        var oFrontWheelRevolJoint = new b2RevoluteJointDef;
        oFrontWheelRevolJoint.Initialize(_oFrontWheel, _oFrontDamper, _oFrontWheel.GetWorldCenter());
        oFrontWheelRevolJoint.enableMotor = true;
        oFrontWheelRevolJoint.maxMotorTorque = MAX_MOTOR_TORQUE;
        oFrontWheelRevolJoint.motorSpeed = 0.0;
        oFrontWheelRevolJoint = _oWorld.CreateJoint(oFrontWheelRevolJoint);

        // ADD PRISMATIC JOINTS TO CHASSIS AND DAMPERS
        var oDamperPrismaticJoint = new b2PrismaticJoint;
        oDamperPrismaticJoint.lowerTranslation = PRISMATIC_JOINT_LOWER_TRANSLATION;
        oDamperPrismaticJoint.upperTranslation = PRISMATIC_JOINT_UPPER_TRANSLATION;
        oDamperPrismaticJoint.enableLimit = true;
        oDamperPrismaticJoint.enableMotor = true;

        oDamperPrismaticJoint.Initialize(oChassisPhysic.GetBody(), _oBackDamper,_oBackDamper.GetWorldCenter(), new b2Vec2(0,1));
        _oBackPrismaticJoint = _oWorld.CreateJoint(oDamperPrismaticJoint);

        oDamperPrismaticJoint.Initialize(oChassisPhysic.GetBody(), _oFrontDamper,_oFrontDamper.GetWorldCenter(), new b2Vec2(0,1));
        _oFrontPrismaticJoint = _oWorld.CreateJoint(oDamperPrismaticJoint);

        var oPlayer = new CPlayer(oChassisPhysic,_oFrontWheel,_oBackWheel,oFrontWheelRevolJoint,oBackWheelRevolJoint,_oFrontPrismaticJoint,_oBackPrismaticJoint,oContainer);
        return oPlayer;
    };

    this.addDamper = function(iWidth,iHeight,iX,iY,density,friction,restitution,filter){
        var oBodyDef = new b2BodyDef;
        oBodyDef.type = b2Body.b2_dynamicBody;
        oBodyDef.allowSleep = false;

        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.filter.groupIndex = filter;
        oFixDef.userData = {id:"damper"};

        oFixDef.shape.SetAsBox(iWidth/WORLD_SCALE,iHeight/WORLD_SCALE)

        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);

        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        return oBody;
    };

    this.addPolygon = function(aPoints,iX,iY,iAngle,density,friction,restitution,iType,filter) {
        var oBodyDef = new b2BodyDef;
        oBodyDef.type = b2Body.b2_dynamicBody;
        if (iType === STATIC_BODY) {
            oBodyDef.type = b2Body.b2_staticBody;
        };
        oBodyDef.allowSleep = false;
        oBodyDef.bullet = true;

        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.filter.groupIndex = filter;
        oFixDef.userData = {id:"polygon"};

        var points = [];
        for (var i = 0; i < aPoints.length; i++) {
            var vec = new b2Vec2();
            vec.Set(aPoints[i].x/WORLD_SCALE, aPoints[i].y/WORLD_SCALE);
            points.push(vec);
        }
        oFixDef.shape.SetAsArray(points, points.length);

        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;

        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        oCrateFixture.GetBody().SetActive(false);
        return oCrateFixture;
    };

    this.addRectangle = function(iX,iY,iWidth,iHeight,iAngle,density,friction,restitution,filter) {
        var oBodyDef = new b2BodyDef;
        oBodyDef.type = b2Body.b2_kinematicBody;    // THIS WILL BE A KINEMATIC FLOOR, TO MOVE IT VERTICALLY

        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.filter.groupIndex = filter;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.shape.SetAsBox(iWidth/WORLD_SCALE, iHeight/WORLD_SCALE);
        oFixDef.userData = {id:"rectangle"};

        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;

        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        oCrateFixture.GetBody().SetActive(false);
        return oCrateFixture;
    };

    this.addCircle = function(iRadius,iX,iY,density,friction,restitution,filter) {
        var oBodyDef = new b2BodyDef;
        oBodyDef.type = b2Body.b2_dynamicBody;

        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.filter.groupIndex = filter;
        oFixDef.shape = new b2CircleShape(iRadius/WORLD_SCALE );
        oFixDef.userData = {id:"circle"};

        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);

        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        oBody.SetActive(false);
        return oBody;
   };

    this.init();
}
