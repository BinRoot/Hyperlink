Hyperlink.io

Abstraction layer between hyperlinks and their corresponding content.

Immediately useful:
* normal links
* visited links change color

* broken links change color
* 404'd links change color

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
  + now need to added counts as well as solidify schema
