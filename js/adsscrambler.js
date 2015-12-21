/* global adsScrambler */
/**
 *  Ads Scrambler
 * @author: loreto at musixmatch dot com (Loreto Parisi)
 * @copyright 2015 Musixmatch Spa
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
function AdsScrambler(slots, options) {

  /**
   * Slot performances
   */
  this.stopWatch = new StopWatch();

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
        googletag.cmd.push(function() { // push slot
          googletag.defineSlot( aSlot['id'], aSlot['size'], aSlot['unitid'] ).addService( googletag.pubads() );
        });
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
     //@TODO
     //self.display( self.containers[pos] );
   }, this.options['delay'] * pos);
 }

 /**
  * Display a Slot
  * @param el A slot item
  */
 this.display  = function(el) {
   if(typeof(googletag)!='undefined') {
    googletag.cmd.push( function() { googletag.display( el ); } );
   }
 }

 /**
  * Scramble slots in the slot queue
  */
 this.scramble = function() {
   this.displayAt(AdsScrambler.queue);
   AdsScrambler.queue++;
 };//scramble

 /**
  * Push all tags
  * @param containerId Parent container
  */
 this.pushAllTags = function() {
    for( var slot in this.slots) { // slots
      var aSlot = this.slots[slot];
      var adsContainer = document.getElementById(aSlot['containerid']);
      if(adsContainer==null) {
        console.error(aSlot['unitid'], "No ads container");
        continue;
      }
      AdsScrambler.injectTag(
        adsContainer,
        aSlot['unitid'],
        aSlot['size']
      );
    }//slots
 };

 /**
  * Push GoogleTag Slots
  */
 this.push = function() {

   var self=this;

   console.log("AdsScramblers "  + self.version(), "@2015 https://musixmatch.com" );

   if(typeof(googletag)=='undefined') {
    console.warn("googletag not available.");
    return;
   }

   if( typeof(adsbygoogle)=='undefined' ) {
    console.warn("adsbygoogle not available.");
    return;
   }

   // Google Adsense
   if( typeof(adsbygoogle)!='undefined' ) { // need to have a static lazy loading

   }

   // Google DFP Async commands
   googletag.cmd.push(function() {

    // Load Slots
    for( var slot in self.slots) { // slots
      var aSlot = self.slots[slot];
      googletag.defineSlot(aSlot['id'], aSlot['size'], aSlot['unitid']).addService(googletag.pubads());
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
    googletag.companionAds().setRefreshUnfilledSlots( self.options['backfill'] );


  }); //googletag.cmd.push

 }; //push

 /** Ads Scrambler Version */
 this.version = function() { return "1.0.0"; }; //version

 /** Return available DFP slots */
 this.getSlots = function() { return this.slots; }; //getSlots

}; //AdsScrambler

/**
 * The Ads Scrambler slot queue
 */
AdsScrambler.queue=0;

/**
 * Debug to console
 */
AdsScrambler.DEBUG=1;

/**
 * Log to console
 * @param message Message to log
 */
AdsScrambler.log = function(message) {
  if(AdsScrambler.DEBUG) {
    console.log.apply( this, Array.prototype.slice.call(arguments) );
  }
};

/**
  * Execute when document is ready
  * @param callback Block to be executed
  */
 AdsScrambler.run = function(callback) {
   document.addEventListener("DOMContentLoaded", function(event) {
      callback.apply(this);
   });
 };

/**
 * Inject Ads Div Tag
 * @param container Parent element
 * @param id Tag Identifier
 * @param size Array of sizes of form [width, height]
 */
AdsScrambler.injectTag  = function(container, id, sizes) {
  var el = document.createElement("div");
  el.setAttribute("id", id);
  if(typeof(sizes)!='undefined') {
    if(sizes.length>0) {
        if( typeof(sizes[0]) == "object" ) { //array of [w,h]
          for(var idx in sizes) {
            var aSize = sizes[idx];
            console.log("Unit "+id,aSize);
          }
        }
        else { // [w,h]
          var width = sizes[0];
          var heigth = sizes[1];
          console.log("Unit "+id,sizes);
          el.setAttribute("style",'height:'+width+'px; width:'+heigth+'px;');
      }
    }
  }
  if(AdsScrambler.DEBUG) { // append debug and tag unit
    var cont = document.createElement("div");
    var dbg = document.createElement("span");
    var sep = document.createElement("hr");
    dbg.innerHTML = id;
    cont.appendChild(dbg);
    cont.appendChild(el);
    cont.appendChild(sep);
    container.appendChild(cont);
  } else { // append tag unit
     container.appendChild(el);
  }

};

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
