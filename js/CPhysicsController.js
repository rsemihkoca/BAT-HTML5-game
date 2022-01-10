function CPhysicsController(){
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2World = Box2D.Dynamics.b2World;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    
    var _oWorld;
    
    this.init = function(){
        var oGravity = new b2Vec2(0, GRAVITY);
        _oWorld = new b2World(oGravity, true);
        
        if (DEBUG_BOX2D) {
            this._initDebugCanvas();            
        }
    };
    
    this._initDebugCanvas = function(){
        var canv = document.createElement('canvas');
        canv.id = 'debug';
        canv.width = s_oCanvas.width;
        canv.height = s_oCanvas.height;
        canv.style.position = "fixed";
        document.body.appendChild(canv); // adds the canvas to the body element

        $( "#debug" ).css( 'pointer-events', 'none' );

        var canvas = document.getElementById("debug");
        var context = canvas.getContext("2d");

        //setup debug draw
        var oDebugDraw = new b2DebugDraw();
        oDebugDraw.SetSprite(context);
        oDebugDraw.SetDrawScale(WORLD_SCALE);
        oDebugDraw.SetFillAlpha(DEBUG_BOX2D_ALPHA);
        oDebugDraw.SetLineThickness(1.0);
        oDebugDraw.SetFlags(b2DebugDraw.e_shapeBit);
        _oWorld.SetDebugDraw(oDebugDraw);

        sizeHandler();
    };
    
    this.updateDebugPosition = function(oCanvasOffset){
        var canvas = document.getElementById("debug");
        var context = canvas.getContext("2d");
        context.save();
        context.clearRect(0, 0, s_oCanvas.width, s_oCanvas.height);
        context.translate(oCanvasOffset.x, oCanvasOffset.y); 
        _oWorld.DrawDebugData();
        context.restore();
    };
    
    this.removeDebugCanvas = function() {
        // REMOVE THE CANVAS USED FOR DEBUG DRAW
        var oCanvas = document.getElementById('debug');
        oCanvas.parentNode.removeChild(oCanvas);
    };

    this.processContactEvent = function(iContactType, oUserData, contact){ 
        if (oUserData && oUserData.contacttype === iContactType) {
            oUserData.callback(oUserData.params, contact);
        }
    };
    
    this.startComputing = function(oElement){
        oElement.GetBody().SetActive(true);
    };
        
    this.applyImpulse = function(oElement){
        oElement.GetBody().ApplyImpulse( {x:0.8,y:1}, oElement.GetBody().GetWorldCenter() );
    };
    
    this.decreaseSpeedRotation = function(oElement){
        var iNewAngularVelocity = oElement.GetBody().GetAngularVelocity()*0.99;
        oElement.GetBody().SetAngularVelocity(iNewAngularVelocity);
    };
    
    this.getSpeedRotation = function(oElement){
        return oElement.GetBody().GetAngularVelocity();
    };
    
    this.destroyBody = function(oElement){
        _oWorld.DestroyBody(oElement.GetBody());
    };
    
    this.destroyBodyVector = function(vBody){
        _oWorld.DestroyBody(vBody);
    };
    
    this.destroyAllBodies = function () {
        // GET THE FIRST BODY OF THE LIST
        var b2Bodies = _oWorld.GetBodyList();
        
        // UNTIL WE REACH THE END OF THE LIST (NULL), LOOP
        while (b2Bodies) {
            // GET THE NEXT ON THE LIST, DESTROY IT
            var b2Current = b2Bodies;
            var b2Bodies = b2Bodies.GetNext();
            _oWorld.DestroyBody(b2Current);
        }
                
        _oWorld.deleteUnusedObjects;
    };

    this.destroyAllJoints = function () {
        var b2Joints = _oWorld.GetJointList();
        
        while (b2Joints) {
            var b2Current = b2Joints;
            var b2Joints = b2Joints.GetNext();
            _oWorld.DestroyJoint(b2Current);
        }
    };

    this.destroyAllContacts = function(){
        var b2Contacts = _oWorld.GetContactList();
        
        while (b2Contacts) {
            var b2Contact = b2Contacts;
            var b2Contacts = b2Contacts.GetNext();
            _oWorld.DestroyJoint(b2Contact);
        }
    };

    this.destroyWorld = function () {
        this.destroyAllJoints();
        this.destroyAllBodies();
        this.destroyAllContacts();
        if (DEBUG_BOX2D) {            
            this.removeDebugCanvas();
        };
        _oWorld = null;
    };

    this.getWorld = function(){
        return _oWorld;
    };
    
    this.setElementPosition = function (oElement, oPosLocal) {
        var oPosWorld = {x: oPosLocal.x/WORLD_SCALE, y: oPosLocal.y/WORLD_SCALE};
        oElement.GetBody().SetPosition(oPosWorld);
    };
    
    this.setElementBodyPosition = function (oElement, oPosLocal) {
        var oPosWorld = {x: oPosLocal.x/WORLD_SCALE, y: oPosLocal.y/WORLD_SCALE};
        oElement.SetPosition(oPosWorld);
    };
    
    this.setElementAngle = function (oElement, iAngle) {
        oElement.GetBody().SetAngle( degreesToRadians(iAngle) );
    };
    
    this.getElementPosition = function(oElement) {
        var oPos = oElement.GetBody().GetPosition();
        return {x: oPos.x*WORLD_SCALE, y: oPos.y*WORLD_SCALE, angle: oElement.GetBody().GetAngle()*180/Math.PI};
    };
    
    this.getBodyPosition = function(oElement) {
        var oPos = oElement.GetPosition();
        return {x: oPos.x*WORLD_SCALE, y: oPos.y*WORLD_SCALE, angle: oElement.GetAngle()*180/Math.PI};
    };
    
    this.update = function() {
        // UPDATE THE BOX2D WORLD
        _oWorld.Step(TIMESTEP,VELOCITY_ITERATIONS,POSITION_ITERATIONS);
        
        if (DEBUG_BOX2D) {
            _oWorld.DrawDebugData();
        }
        _oWorld.ClearForces();
    };

    this.init();    
}