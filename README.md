####AdsScramble
#####version 1.0-0
######@author loreto at musixmatch dot com

Example of usage
```javascript
// Inject DFP Script
    AdsScrambler.injectDFP();
    // Inject Adsense Script
    AdsScrambler.injectAdsense();
    
    // DFP Containers
    var containersList = [
        'div-gpt-ad-123456789-1' // example
        'div-gpt-ad-123456789-2' // example
    ];
    
    // DFP Slots
    var slotList =  [
          {
            'id' : '/1234678/leaderboard_728_90',
            'size' :  [728, 90],
            'container' : 'div-gpt-ad-123456789-1' // example
          },
          {
            'id' : '/12345678/mrect',
            'size' :  [336, 280],
            'container' : 'div-gpt-ad-123456789-2' // example
          }
       ];
    // DFP options
    var options = { ' delay' : 500,
         'backfill' : true,
         'collapse' : true
    };
    
    // Initialize the fuck up
    adsScrambler = new AdsScrambler(containersList, slotList, options);
      
    // warm it up
    adsScrambler.push();
