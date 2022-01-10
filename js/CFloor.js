function CFloor(oFloorPhysic, aPoints, oParentContainer) {
    var _iLevel;
    var _iLevelRoadIndex;
    
    var _oFloorPhysic;
    var _oRoadContainer;
    var _oParentContainer;
    
    var _aPoints;
    var _aTerrainSegments;
    var _aTracksTerrain;
    var _aTracksRoad;
    var _aRoadBorders;

    this._init = function(){
        _aTerrainSegments = [];
        _aTracksTerrain = [];
        _aTracksRoad = [];
        _aRoadBorders = [];
        
        _oRoadContainer = new createjs.Container();
        _oParentContainer.addChild(_oRoadContainer);
        
        _iLevel = s_oGame.getLevel();
        _iLevelRoadIndex = LEVEL_ROAD_INDEX[_iLevel];
        
        // CLONE THE COORDINATES TO AVOID MODIFYING THE ORIGINAL ONES
        _aPoints = [];
        for (var i = 0; i < aPoints.length; i++ ) {
            _aPoints[i] = {x: aPoints[i].x + MAPS_X_OFFSET, y: aPoints[i].y + MAPS_Y_OFFSET[_iLevel]};
        };

        this.drawTracksTerrain();
        this.drawTracksRoad();
    };
    
    this.drawTracksTerrain = function(){
        var iStartIndex = 0;
        var iEndIndex = 0;
        
        while (iEndIndex < _aPoints.length) {
            if (iEndIndex === _aPoints.length-1) {
                var oShape = this.createRoadTerrainShape(iStartIndex, iEndIndex);
                _aTracksTerrain.push(oShape);
                return;
            }
            if (_aPoints[iEndIndex].x - _aPoints[iStartIndex].x > ROAD_TERRAIN_SHAPE_WIDTH_MAX) {
                var oShape = this.createRoadTerrainShape(iStartIndex, iEndIndex);
                _aTracksTerrain.push(oShape);
                iStartIndex = iEndIndex;
            }            
            iEndIndex += 1;
        };
    };
    
    this.createRoadTerrainShape = function(iStart, iEnd){
        var oSprite = s_oSpriteLibrary.getSprite('terrain'+_iLevelRoadIndex);
        var oShape = new createjs.Shape();
        _oRoadContainer.addChild(oShape);
        
        oShape.graphics.clear();
        oShape.graphics.beginBitmapFill(oSprite);
        oShape.graphics.moveTo(_aPoints[iStart].x, _aPoints[iStart].y);
        for (var i = 1; i < iEnd+1; i++) {
            oShape.graphics.lineTo(_aPoints[i].x, _aPoints[i].y);
        };
        
        oShape.graphics.lineTo(_aPoints[iEnd].x, _aPoints[iEnd].y + 500);
        oShape.graphics.lineTo(_aPoints[iStart].x, _aPoints[iStart].y + 500);
        oShape.graphics.lineTo(_aPoints[iStart].x, _aPoints[iStart].y);        
        oShape.graphics.endFill();
        // CACHE
        var iWidth = (_aPoints[iEnd].x - _aPoints[iStart].x)*1.1;
        oShape.cache(_aPoints[iStart].x,0,iWidth,CANVAS_HEIGHT);
        
        return oShape;
    };
    
    this.shadeBlend = function(p,c0,c1) {
        var n=p<0?p*-1:p,u=Math.round,w=parseInt;
        if(c0.length>7){
            var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
            return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")";
        }else{
            var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
            return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1);
        }
    };
    
    this.drawTracksRoad = function(){
        var oSpritePattern = s_oSpriteLibrary.getSprite('road_pattern_'+_iLevelRoadIndex);
        var vLight = new CVector2(-1,-1);
        vLight.normalize();
        
        var iOffsetY = 20;
        for (var i = 0; i < _aPoints.length-1; i++) {
            var oEdge = new CEdgeModel(_aPoints[i+1].x, _aPoints[i+1].y,_aPoints[i].x, _aPoints[i].y);
            _aTerrainSegments.push(oEdge);            
            
            // GENERATE COLOR SHADES
            var vCurSegmentNormal = oEdge.getNormal();
            var fDotProduct = vCurSegmentNormal.dotProduct(vLight);
            var szFinalcolor = this.shadeBlend(fDotProduct*ROAD_LIGHT_OFFSET, ROAD_START_COLORS[_iLevelRoadIndex]);

            // ADD ROAD SHADES
            var oShape = new createjs.Shape();        
            _oRoadContainer.addChild(oShape);
            oShape.graphics.clear();
            oShape.graphics.beginFill(szFinalcolor);
            oShape.graphics.moveTo(_aPoints[i].x, _aPoints[i].y + iOffsetY);
            oShape.graphics.lineTo(_aPoints[i+1].x, _aPoints[i+1].y + iOffsetY);
            oShape.graphics.lineTo(_aPoints[i+1].x, _aPoints[i+1].y + iOffsetY*-1);
            oShape.graphics.lineTo(_aPoints[i].x, _aPoints[i].y + iOffsetY*-1);
            oShape.graphics.lineTo(_aPoints[i].x, _aPoints[i].y + iOffsetY);
            oShape.graphics.endFill();
            _aTracksRoad.push(oShape);
            
            // ADD ROAD PATTERN
            var oShape = new createjs.Shape();        
            _oRoadContainer.addChild(oShape);
            oShape.graphics.clear();
            oShape.graphics.beginBitmapFill(oSpritePattern);
            if ($.browser.mozilla === false) {
                oShape.alpha = 1;
                oShape.compositeOperation = "multiply";
            } else {
                oShape.alpha = 0.5;
            };
            oShape.graphics.moveTo(_aPoints[i].x, _aPoints[i].y + iOffsetY);
            oShape.graphics.lineTo(_aPoints[i+1].x, _aPoints[i+1].y + iOffsetY);
            oShape.graphics.lineTo(_aPoints[i+1].x, _aPoints[i+1].y + iOffsetY*-1);
            oShape.graphics.lineTo(_aPoints[i].x, _aPoints[i].y + iOffsetY*-1);
            oShape.graphics.lineTo(_aPoints[i].x, _aPoints[i].y + iOffsetY);
            oShape.graphics.endFill();            
            _aTracksRoad.push(oShape);
            
            var szFinalBorderColor = this.shadeBlend(fDotProduct*ROAD_BORDER_LIGHT_OFFSET, ROAD_BORDER_TOP_START_COLORS[_iLevelRoadIndex]);
            var oTopLine = this.addRoadBorder(i, -1*iOffsetY, szFinalBorderColor);
            _aRoadBorders.push(oTopLine);
            var szFinalBorderColor = this.shadeBlend(fDotProduct*ROAD_BORDER_LIGHT_OFFSET, ROAD_BORDER_BOTTOM_START_COLORS[_iLevelRoadIndex]);
            var oBottomLine = this.addRoadBorder(i, iOffsetY, szFinalBorderColor);                                    
            _aRoadBorders.push(oBottomLine);
        };        
    };
   
    this.addRoadBorder = function(iIndex, iOffsetY, szColor){
        var oLine = new createjs.Shape();
        _oRoadContainer.addChild(oLine);            
        oLine.graphics.setStrokeStyle(ROAD_BORDER_SIZE, "round").beginStroke(szColor);
        oLine.graphics.moveTo(_aPoints[iIndex].x, _aPoints[iIndex].y + iOffsetY);
        oLine.graphics.lineTo(_aPoints[iIndex+1].x, _aPoints[iIndex+1].y + iOffsetY);
        oLine.graphics.endStroke();       
        return oLine;
    };
    
    this.unload = function () {
        for (var i = 0; i < _aTerrainSegments.length; i++) {
            _aTerrainSegments[i].destroy;
            _oRoadContainer.removeChild(_aTerrainSegments[i]);            
        };
        for (var i = 0; i < _aTracksTerrain.length; i++) {
            _aTracksTerrain[i].uncache();            
            _oRoadContainer.removeChild(_aTracksTerrain[i]);            
        };
        for (var i = 0; i < _aTracksRoad.length; i++) {
            _oRoadContainer.removeChild(_aTracksRoad[i]);
        };
        for (var i = 0; i < _aRoadBorders.length; i++) {  
            _oRoadContainer.removeChild(_aRoadBorders[i]);
        };
        
        _oFloorPhysic.SetActive(false);
        _oFloorPhysic = null;
        _oParentContainer.removeChild(_oRoadContainer);
    };
    
    this.getBody = function(){
        return _oFloorPhysic;
    };
    
    _oParentContainer = oParentContainer;
    _oFloorPhysic = oFloorPhysic;

    this._init();
};