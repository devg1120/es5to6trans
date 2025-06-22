/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 *
 * Class: mxAnimation
 * 
 * Implements a basic animation in JavaScript.
 * 
 * Constructor: mxAnimation
 * 
 * Constructs an animation.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 */
class mxAnimation extends mxEventSource {
 constructor(delay) {
     this.delay = (delay != null) ? delay : 20;
 }

 /**
  * Function: isRunning
  * 
  * Returns true if the animation is running.
  */
 isRunning() {
     return this.thread != null;
 }

 /**
  * Function: startAnimation
  *
  * Starts the animation by repeatedly invoking updateAnimation.
  */
 startAnimation() {
     if (this.thread == null)
     {
         this.thread = window.setInterval(mxUtils.bind(this, this.updateAnimation), this.delay);
     }
 }

 /**
  * Function: updateAnimation
  *
  * Hook for subclassers to implement the animation. Invoke stopAnimation
  * when finished, startAnimation to resume. This is called whenever the
  * timer fires and fires an mxEvent.EXECUTE event with no properties.
  */
 updateAnimation() {
     this.fireEvent(new mxEventObject(mxEvent.EXECUTE));
 }

 /**
  * Function: stopAnimation
  *
  * Stops the animation by deleting the timer and fires an <mxEvent.DONE>.
  */
 stopAnimation() {
     if (this.thread != null)
     {
         window.clearInterval(this.thread);
         this.thread = null;
         this.fireEvent(new mxEventObject(mxEvent.DONE));
     }
 }
}

/**
 * Variable: delay
 * 
 * Specifies the delay between the animation steps. Defaul is 30ms.
 */
mxAnimation.prototype.delay = null;

/**
 * Variable: thread
 * 
 * Reference to the thread while the animation is running.
 */
mxAnimation.prototype.thread = null;
