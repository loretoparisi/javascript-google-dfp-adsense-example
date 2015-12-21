####AdsScramble
#####version 1.0-0
######@author loreto at musixmatch dot com

Example of usage

Supposed to have a html container likelihood

```html
<div id="dfp_ads_container"></div>
```

```javascript
// Inject DFP Script
    AdsScrambler.injectDFP();
    // Inject Adsense Script
    AdsScrambler.injectAdsense();

    // DFP Slots
    var slotList =  [
          {
            'id' : '/1234678/leaderboard_728_90',
            'size' :  [728, 90],
            'container' : 'div-gpt-ad-123456789-1', // example
            'containerid' : 'dfp_ads_container'
          },
          {
            'id' : '/12345678/mrect',
            'size' :  [336, 280],
            'container' : 'div-gpt-ad-123456789-2', // example
            'containerid' : 'dfp_ads_container'
          }
       ];
    // DFP options
    var options = { ' delay' : 500,
         'backfill' : true,
         'collapse' : true
    };

    // Inject DFP Script
    AdsScrambler.injectDFP();
    // Inject Adsense Script
    AdsScrambler.injectAdsense();

    // Initialize the Ads Scrambler
    adsScrambler = new AdsScrambler(slotList, options);

    // Execute setup async when the page is ready
    AdsScrambler.run(function() {
      adsScrambler.pushAllTags();
      adsScrambler.push();  
     });
