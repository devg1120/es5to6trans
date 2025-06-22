/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxAbstractCanvas2D
 *
 * Base class for all canvases. A description of the public API is available in <mxXmlCanvas2D>.
 * All color values of <mxConstants.NONE> will be converted to null in the state.
 * 
 * Constructor: mxAbstractCanvas2D
 *
 * Constructs a new abstract canvas.
 */
class mxAbstractCanvas2D {
 constructor() {
     /**
      * Variable: converter
      * 
      * Holds the <mxUrlConverter> to convert image URLs.
      */
     this.converter = this.createUrlConverter();
     
     this.reset();
 }

 /**
  * Function: createUrlConverter
  * 
  * Create a new <mxUrlConverter> and returns it.
  */
 createUrlConverter() {
     return new mxUrlConverter();
 }

 /**
  * Function: reset
  * 
  * Resets the state of this canvas.
  */
 reset() {
     this.state = this.createState();
     this.states = [];
 }

 /**
  * Function: createState
  * 
  * Creates the state of the this canvas.
  */
 createState() {
     return {
         dx: 0,
         dy: 0,
         scale: 1,
         alpha: 1,
         fillAlpha: 1,
         strokeAlpha: 1,
         fillColor: null,
         gradientFillAlpha: 1,
         gradientColor: null,
         gradientAlpha: 1,
         gradientDirection: null,
         strokeColor: null,
         strokeWidth: 1,
         dashed: false,
         dashPattern: '3 3',
         fixDash: false,
         lineCap: 'flat',
         lineJoin: 'miter',
         miterLimit: 10,
         fontColor: '#000000',
         fontBackgroundColor: null,
         fontBorderColor: null,
         fontSize: mxConstants.DEFAULT_FONTSIZE,
         fontFamily: mxConstants.DEFAULT_FONTFAMILY,
         fontStyle: 0,
         shadow: false,
         shadowColor: mxConstants.SHADOWCOLOR,
         shadowAlpha: mxConstants.SHADOW_OPACITY,
         shadowDx: mxConstants.SHADOW_OFFSET_X,
         shadowDy: mxConstants.SHADOW_OFFSET_Y,
         rotation: 0,
         rotationCx: 0,
         rotationCy: 0
     };
 }

 /**
  * Function: format
  * 
  * Rounds all numbers to integers.
  */
 format(value) {
     return Math.round(parseFloat(value));
 }

 /**
  * Function: addOp
  * 
  * Adds the given operation to the path.
  */
 addOp() {
     if (this.path != null)
     {
         this.path.push(arguments[0]);
         
         if (arguments.length > 2)
         {
             const s = this.state;

             for (let i = 2; i < arguments.length; i += 2)
             {
                 this.lastX = arguments[i - 1];
                 this.lastY = arguments[i];
                 
                 this.path.push(this.format((this.lastX + s.dx) * s.scale));
                 this.path.push(this.format((this.lastY + s.dy) * s.scale));
             }
         }
     }
 }

 /**
  * Function: rotatePoint
  * 
  * Rotates the given point and returns the result as an <mxPoint>.
  */
 rotatePoint(x, y, theta, cx, cy) {
     const rad = theta * (Math.PI / 180);
     
     return mxUtils.getRotatedPoint(new mxPoint(x, y), Math.cos(rad),
         Math.sin(rad), new mxPoint(cx, cy));
 }

 /**
  * Function: save
  * 
  * Saves the current state.
  */
 save() {
     this.states.push(this.state);
     this.state = mxUtils.clone(this.state);
 }

 /**
  * Function: restore
  * 
  * Restores the current state.
  */
 restore() {
     if (this.states.length > 0)
     {
         this.state = this.states.pop();
     }
 }

 /**
  * Function: setLink
  * 
  * Sets the current link. Hook for subclassers.
  */
 setLink(link) {
     // nop
 }

 /**
  * Function: scale
  * 
  * Scales the current state.
  */
 scale(value) {
     this.state.scale *= value;
     this.state.strokeWidth *= value;
 }

 /**
  * Function: translate
  * 
  * Translates the current state.
  */
 translate(dx, dy) {
     this.state.dx += dx;
     this.state.dy += dy;
 }

 /**
  * Function: rotate
  * 
  * Rotates the current state.
  */
 rotate(theta, flipH, flipV, cx, cy) {
     // nop
 }

 /**
  * Function: setAlpha
  * 
  * Sets the current alpha.
  */
 setAlpha(value) {
     this.state.alpha = value;
 }

 /**
  * Function: setFillAlpha
  * 
  * Sets the current solid fill alpha.
  */
 setFillAlpha(value) {
     this.state.fillAlpha = value;
 }

 /**
  * Function: setStrokeAlpha
  * 
  * Sets the current stroke alpha.
  */
 setStrokeAlpha(value) {
     this.state.strokeAlpha = value;
 }

 /**
  * Function: setFillColor
  * 
  * Sets the current fill color.
  */
 setFillColor(value) {
     if (value == mxConstants.NONE)
     {
         value = null;
     }
     
     this.state.fillColor = value;
     this.state.gradientColor = null;
 }

 /**
  * Function: setGradient
  * 
  * Sets the current gradient.
  */
 setGradient(color1, color2, x, y, w, h, direction, alpha1, alpha2) {
     const s = this.state;
     s.fillColor = color1;
     s.gradientFillAlpha = (alpha1 != null) ? alpha1 : 1;
     s.gradientColor = color2;
     s.gradientAlpha = (alpha2 != null) ? alpha2 : 1;
     s.gradientDirection = direction;
 }

 /**
  * Function: setStrokeColor
  * 
  * Sets the current stroke color.
  */
 setStrokeColor(value) {
     if (value == mxConstants.NONE)
     {
         value = null;
     }
     
     this.state.strokeColor = value;
 }

 /**
  * Function: setStrokeWidth
  * 
  * Sets the current stroke width.
  */
 setStrokeWidth(value) {
     this.state.strokeWidth = value;
 }

 /**
  * Function: setDashed
  * 
  * Enables or disables dashed lines.
  */
 setDashed(value, fixDash) {
     this.state.dashed = value;
     this.state.fixDash = fixDash;
 }

 /**
  * Function: setDashPattern
  * 
  * Sets the current dash pattern.
  */
 setDashPattern(value) {
     this.state.dashPattern = value;
 }

 /**
  * Function: setLineCap
  * 
  * Sets the current line cap.
  */
 setLineCap(value) {
     this.state.lineCap = value;
 }

 /**
  * Function: setLineJoin
  * 
  * Sets the current line join.
  */
 setLineJoin(value) {
     this.state.lineJoin = value;
 }

 /**
  * Function: setMiterLimit
  * 
  * Sets the current miter limit.
  */
 setMiterLimit(value) {
     this.state.miterLimit = value;
 }

 /**
  * Function: setFontColor
  * 
  * Sets the current font color.
  */
 setFontColor(value) {
     if (value == mxConstants.NONE)
     {
         value = null;
     }
     
     this.state.fontColor = value;
 }

 /**
  * Function: setFontColor
  * 
  * Sets the current font color.
  */
 setFontBackgroundColor(value) {
     if (value == mxConstants.NONE)
     {
         value = null;
     }
     
     this.state.fontBackgroundColor = value;
 }

 /**
  * Function: setFontColor
  * 
  * Sets the current font color.
  */
 setFontBorderColor(value) {
     if (value == mxConstants.NONE)
     {
         value = null;
     }
     
     this.state.fontBorderColor = value;
 }

 /**
  * Function: setFontSize
  * 
  * Sets the current font size.
  */
 setFontSize(value) {
     this.state.fontSize = parseFloat(value);
 }

 /**
  * Function: setFontFamily
  * 
  * Sets the current font family.
  */
 setFontFamily(value) {
     this.state.fontFamily = value;
 }

 /**
  * Function: setFontStyle
  * 
  * Sets the current font style.
  */
 setFontStyle(value) {
     if (value == null)
     {
         value = 0;
     }
     
     this.state.fontStyle = value;
 }

 /**
  * Function: setShadow
  * 
  * Enables or disables and configures the current shadow.
  */
 setShadow(enabled) {
     this.state.shadow = enabled;
 }

 /**
  * Function: setShadowColor
  * 
  * Enables or disables and configures the current shadow.
  */
 setShadowColor(value) {
     if (value == mxConstants.NONE)
     {
         value = null;
     }
     
     this.state.shadowColor = value;
 }

 /**
  * Function: setShadowAlpha
  * 
  * Enables or disables and configures the current shadow.
  */
 setShadowAlpha(value) {
     this.state.shadowAlpha = value;
 }

 /**
  * Function: setShadowOffset
  * 
  * Enables or disables and configures the current shadow.
  */
 setShadowOffset(dx, dy) {
     this.state.shadowDx = dx;
     this.state.shadowDy = dy;
 }

 /**
  * Function: begin
  * 
  * Starts a new path.
  */
 begin() {
     this.lastX = 0;
     this.lastY = 0;
     this.path = [];
 }

 /**
  * Function: moveTo
  * 
  *  Moves the current path the given coordinates.
  */
 moveTo(x, y) {
     this.addOp(this.moveOp, x, y);
 }

 /**
  * Function: lineTo
  * 
  * Draws a line to the given coordinates. Uses moveTo with the op argument.
  */
 lineTo(x, y) {
     this.addOp(this.lineOp, x, y);
 }

 /**
  * Function: quadTo
  * 
  * Adds a quadratic curve to the current path.
  */
 quadTo(x1, y1, x2, y2) {
     this.addOp(this.quadOp, x1, y1, x2, y2);
 }

 /**
  * Function: curveTo
  * 
  * Adds a bezier curve to the current path.
  */
 curveTo(x1, y1, x2, y2, x3, y3) {
     this.addOp(this.curveOp, x1, y1, x2, y2, x3, y3);
 }

 /**
  * Function: arcTo
  * 
  * Adds the given arc to the current path. This is a synthetic operation that
  * is broken down into curves.
  */
 arcTo(rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
     const curves = mxUtils.arcToCurves(this.lastX, this.lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y);
     
     if (curves != null)
     {
         for (let i = 0; i < curves.length; i += 6) 
         {
             this.curveTo(curves[i], curves[i + 1], curves[i + 2],
                 curves[i + 3], curves[i + 4], curves[i + 5]);
         }
     }
 }

 /**
  * Function: close
  * 
  * Closes the current path.
  */
 close(x1, y1, x2, y2, x3, y3) {
     this.addOp(this.closeOp);
 }

 /**
  * Function: end
  * 
  * Empty implementation for backwards compatibility. This will be removed.
  */
 end() { }
}

/**
 * Variable: state
 * 
 * Holds the current state.
 */
mxAbstractCanvas2D.prototype.state = null;

/**
 * Variable: states
 * 
 * Stack of states.
 */
mxAbstractCanvas2D.prototype.states = null;

/**
 * Variable: path
 * 
 * Holds the current path as an array.
 */
mxAbstractCanvas2D.prototype.path = null;

/**
 * Variable: rotateHtml
 * 
 * Switch for rotation of HTML. Default is false.
 */
mxAbstractCanvas2D.prototype.rotateHtml = true;

/**
 * Variable: lastX
 * 
 * Holds the last x coordinate.
 */
mxAbstractCanvas2D.prototype.lastX = 0;

/**
 * Variable: lastY
 * 
 * Holds the last y coordinate.
 */
mxAbstractCanvas2D.prototype.lastY = 0;

/**
 * Variable: moveOp
 * 
 * Contains the string used for moving in paths. Default is 'M'.
 */
mxAbstractCanvas2D.prototype.moveOp = 'M';

/**
 * Variable: lineOp
 * 
 * Contains the string used for moving in paths. Default is 'L'.
 */
mxAbstractCanvas2D.prototype.lineOp = 'L';

/**
 * Variable: quadOp
 * 
 * Contains the string used for quadratic paths. Default is 'Q'.
 */
mxAbstractCanvas2D.prototype.quadOp = 'Q';

/**
 * Variable: curveOp
 * 
 * Contains the string used for bezier curves. Default is 'C'.
 */
mxAbstractCanvas2D.prototype.curveOp = 'C';

/**
 * Variable: closeOp
 * 
 * Holds the operator for closing curves. Default is 'Z'.
 */
mxAbstractCanvas2D.prototype.closeOp = 'Z';

/**
 * Variable: pointerEvents
 * 
 * Boolean value that specifies if events should be handled. Default is false.
 */
mxAbstractCanvas2D.prototype.pointerEvents = false;
