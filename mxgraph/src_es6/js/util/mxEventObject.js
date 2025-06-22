/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxEventObject
 * 
 * The mxEventObject is a wrapper for all properties of a single event.
 * Additionally, it also offers functions to consume the event and check if it
 * was consumed as follows:
 * 
 * (code)
 * evt.consume();
 * INV: evt.isConsumed() == true
 * (end)
 * 
 * Constructor: mxEventObject
 *
 * Constructs a new event object with the specified name. An optional
 * sequence of key, value pairs can be appended to define properties.
 * 
 * Example:
 *
 * (code)
 * new mxEventObject("eventName", key1, val1, .., keyN, valN)
 * (end)
 */
class mxEventObject {
 constructor(name) {
     this.name = name;
     this.properties = [];
     
     for (let i = 1; i < arguments.length; i += 2)
     {
         if (arguments[i + 1] != null)
         {
             this.properties[arguments[i]] = arguments[i + 1];
         }
     }
 }

 /**
  * Function: getName
  * 
  * Returns <name>.
  */
 getName() {
     return this.name;
 }

 /**
  * Function: getProperties
  * 
  * Returns <properties>.
  */
 getProperties() {
     return this.properties;
 }

 /**
  * Function: getProperty
  * 
  * Returns the property for the given key.
  */
 getProperty(key) {
     return this.properties[key];
 }

 /**
  * Function: isConsumed
  *
  * Returns true if the event has been consumed.
  */
 isConsumed() {
     return this.consumed;
 }

 /**
  * Function: consume
  *
  * Consumes the event.
  */
 consume() {
     this.consumed = true;
 }
}

/**
 * Variable: name
 *
 * Holds the name.
 */
mxEventObject.prototype.name = null;

/**
 * Variable: properties
 *
 * Holds the properties as an associative array.
 */
mxEventObject.prototype.properties = null;

/**
 * Variable: consumed
 *
 * Holds the consumed state. Default is false.
 */
mxEventObject.prototype.consumed = false;
