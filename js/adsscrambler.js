/* global adsScrambler */
/**
 *  Ads Scrambler
 * @author: loreto at musixmatch dot com
 */

/**
* A simple Stop watch
*/
var StopWatch = function() {
    this.StartMilliseconds = 0;
    this.ElapsedMilliseconds = 0;
};
/**
* Measure start time
*/
StopWatch.prototype.start = function() {
    this.StartMilliseconds = new Date().getTime();
};
/**
* Measure stop time
*/
StopWatch.prototype.stop = function() {
    this.ElapsedMilliseconds = new Date().getTime() - this.StartMilliseconds;
};

/**
 * Ads Scrambler
 * @author: loreto at musixmatch dot com
 * @copyright: 2015 Musixmatch
 * @param slotList Array A List of Slots
 * @param options Scrambler settings
 */
function AdsScrambler(containers, slots, options) {
  
  /**
   * Slot performances
   */
  this.stopWatch = new StopWatch();
  
  /**
   * Ads Slot list
   */
  this.containers = containers;
  
  /**
   * Slots
   */
  this.slots = slots;
  
  /**
   * Scrambler options
   */
  this.options = options;
  
  /**
   * Get Slot At Index
   * @param item A slot item
   */
  this.slotAtIndex = function(item) {
    var foundSlot=null;
    for(var pos in this.slots) {
      var aSlot=this.slots[pos];
      if( aSlot['container']==item ) {
        foundSlot=aSlot; 
        break;
      }
    }
    if(foundSlot) {
      console.log( "Rendered slot", foundSlot['id']);
    }
    return foundSlot;
 };
 
 /**
  * Display next slot
  * @param slot A slot item position in the slot array
  */
 this.displayNextSlot = function(item) {
   var slot = this.slotAtIndex(item);
   if(slot) {
      if(typeof(googletag)!='undefined') {
          googletag.defineSlot(aSlot['id'], aSlot['size'], aSlot['container']).addService(googletag.pubads());
        
      }
   }
 };
 
 /**
  * Display a slot with a throttled delay
  * @param slot A slot item position in the slot array
  */
 this.displayAt = function(pos) {
   var self=this;
   AdsScrambler.delay(self, function() {
     self.display( self.containers[pos] );   
   }, this.options['delay'] * pos);
 }
 
 /**
  * Display a Slot
  * @param el A slot item
  */
 this.display  = function(el) {   
   googletag.cmd.push(function() { googletag.display( el ); });
 }
 
 /**
  * Scramble slots in the slot queue
  */
 this.scramble = function() {
   if( AdsScrambler.queue >= this.containers.length ) return;
   this.displayAt(AdsScrambler.queue);
   AdsScrambler.queue++;
 };//scramble
 
 /**
  * Push GoogleTag Slots
  */
 this.push = function() {
   
   var self=this;
   
   console.log("AdsScramblers "  + self.version() );
   
   if( typeof(adsbygoogle)!='undefined' ) { // need to have a static lazy loading
   
   }
   
   googletag.cmd.push(function() {
      
    // Load Slots
    for( var slot in self.slots) { // slots
      var aSlot = self.slots[slot];
      googletag.defineSlot(aSlot['id'], aSlot['size'], aSlot['container']).addService(googletag.pubads());
      //break; // first slot only
    }
    
    // Google PubService settings
    googletag.pubads().collapseEmptyDivs(self.options['collapse']);
    googletag.pubads().enableSingleRequest();
    
    self.stopWatch.start(); // start metrics
    
    // Event Listeners
    var eventsListeners = [{
      'event' : 'slotRenderEnded',
      'listener' : function(event) {
          if( typeof(adsScrambler)!='undefined' ) { // need to have a static lazy loading
            var slotId=event.slot.A;
            var slotContainer = event.slot.l.m;
            
            self.stopWatch.stop();
            var elapsedTime=parseFloat(self.stopWatch.ElapsedMilliseconds);
            console.log('slotRenderEnded', slotContainer,elapsedTime);
            
            adsScrambler.displayNextSlot( slotContainer );
        
        } //adsScrambler
      }//listener
    },
    {
      'event' : 'impressionViewable',
      'listener' : function(event) {
        var slotId=event.slot.A;
        var slotContainer = event.slot.l.m;
        var elapsedTime=parseFloat(self.stopWatch.ElapsedMilliseconds);
        console.log('impressionViewable', slotContainer, elapsedTime);
        if( typeof(adsScrambler)!='undefined' ) { // need to have a static lazy loading
        
        }//adsScrambler
      } //listener
    }
    ];
    
    // Add Event Listeners
    for( var listener in eventsListeners ) {
      var eventObj= eventsListeners[listener];
      googletag.pubads().addEventListener( eventObj['event'], eventObj['listener']); 
    }
    
    // Now enable all slots
    googletag.enableServices();
    
    // Google Tag settings
    googletag.setRefreshUnfilledSlots(self.options['backfill']);
    
    
  }); //googletag.cmd.push
  
 }; //push
 
 /** Ads Scrambler Version */
 this.version = function() { return "1.0.0"; }; //version
 
 /** Return available DFP slots */
 this.getSlots = function() { return this.slots; }; //getSlots
 
 /** Return  DFP containers */
 this.getContainers = function() { return this.containers; }; //getContainers
 
}; //AdsScrambler

/**
 * The Ads Scrambler slot queue
 */
AdsScrambler.queue=0;

/**
   * Inject Adsense script
   */
AdsScrambler.injectAdsense = function(callback) {
    (function() {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') +
      '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
  })();
(adsbygoogle = window.adsbygoogle || []).push({});
adsbygoogle.onload = function() {
      console.log( "adsense ready." ); 
 };
};

/**
 * Inject DFP script
 */
AdsScrambler.injectDFP = function(callback) {
 (function() {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') +
      '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
  })();
   googletag = window.googletag || {};
  googletag.cmd = googletag.cmd || [];
};
/**
 * A static delay function
 */
AdsScrambler.delay = function(self, callback, DELAY) {
  setTimeout(function() {
    callback.apply(this);
  },DELAY,self);  
};

/**
 * A Throttle function
 * Usage: AdsScrambler.throttle( myCallback, THROTTLE_DELAY)
 */
AdsScrambler.throttle  = function(callback, limit) {
    var wait = false;                 // Initially, we're not waiting
    return function () {              // We return a throttled function
        if (!wait) {                  // If we're not waiting
            callback.call();          // Execute users function
            wait = true;              // Prevent future invocations
            setTimeout(function () {  // After a period of time
                wait = false;         // And allow future invocations
            }, limit);
        }
    };
};
