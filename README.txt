Hyperlink.io

Abstraction layer between hyperlinks and their corresponding content.

Immediately useful:
[DONE] * normal links 
[DONE] * visited links change color

[DONE] * broken links change color
[DONE] * 404'd links change color

* redirected links change color
* spam links change color

* popular links have indicators (normalized ranking, percent clicks)

* link favicon support 
  - <a href="http://reddit.com" class="hyperlink-fav-left"></a>
* external/internal link indicator
  - <a href="http://reddit.com" class="hyperlink-external-right"></a>


Private data:
* link analytics
  - clicks
  - hovers
  - no-click on hovers
  - compare link titles
  - websites that link to you (only useful if they have hyperlink.io)
  - titles of links that link to you (only useful if they have hyperlink.io)
  - redirect incoming link

Public data:
* list of broken links (ask to redirect)
* list of 404'd links (ask to redirect)
* list of most clicked links
* list of most linked links

Just place this script right before </body>
<script src="http://hyperlink.io/hyperlink.js"></script>


Chrome extension:
* Injects script.
* Does the hyperlink color changing.
* Collects valuable hover/click/title data.

Authenticating website with hyperlink service:
Hyperlink.io must find the <script src="http://hyperlink.io/hyperlink.js"> somewhere on site


User enters hyperlink.io
Wants to see his/her website analytics. 
Social login
On first login, given a generated auth key
<script src="http://hyperlink.io/hyperlink.js"></script> (add the auth key somewhere)


Dev Notes:
- need to ignore non-http(s) links such as javascript:void(0);
  # function created. now need to use it.
  + now need to test for edge cases. http://site.com#tag
- use db cache, then fresh lookup, updating db if necessary
  # initial set up done.
  # now need to added counts
  + solidify schema
- need to follow 3XX redirects and detect loops
  # done using http-redirects library


get a list of hrefs.
check the db cache for each href.
check the http directly. update db with new code and incremented shows.

link collection:
{
  href: "http://website.com",
  code: 200,
  shows: 1,
  titles: [{title: "Click here", freq: 1}]; 
} // seeing a title vs. existing a title per page


# Fetching URLs 20 at a time:




# dead code that I'm not willing to forget just yet:
if( accessType == "modify" ) {
  collection.findAndModify(q, null, { $inc: {loads: 1} }, {upsert: true}, function (err, res) {
  db.close();
  console.log('find and modifying ' + res);
  callback(res);
  });
}

# more dead code. why am I so attached?
collection.update(sel, data, {upsert:true}, function(err, res) {                                                                                                        
  console.log('upsert output: '+JSON.stringify(res));                                                                                                                 
  db.close();                                                                                                                                                         
  callback(res);                                                                                                                                                      
}); 
