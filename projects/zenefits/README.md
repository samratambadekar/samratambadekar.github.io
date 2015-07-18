A week long project to leverage Google's places API. The design language is loosely based on material design and card UI.

- The application shows nearby places as a list and also loads a map in the background. 
- The list shows open places on top and closed places at the bottom. 
- You can switch between map and list view from the icon next to the search box.
- Details of each place are shown by clicking on the card / marker.

### Design
The design is partly exploratory. Some elements require trial and error by the user to understand its relevance:
- A Green bar on top of card indicates that the place is open. A red bar indicates it's closed.
- Similarly color coding is used for navigation icons. Green(ish) icons are eco-friendly, red icon is not.
- The additional info on the card has two stages. The first list of card shows basic info about an establishment for e.g. time to travel and distance. The same design is used when user searches for a location e.g. New York. But when user searches for specific filters e.g. 'pizza near me' or 'pharmacy' then the card shows the place's ratings and price level.
- The location of an establishment is auto populated in the search box. This will allow user to quickly search the nearby locations.
- The 'Find Similar Locations' link will repopulate the list with filtered establishments. For e.g. similar locations for Walgreens will show other pharmaceuticals and that for CPK will show more pizza places.


### Limitations
- Works on Chrome and Firefox (desktop and mobile). Might not work on IE/Safari/Opera.
- The animations tend to lag on Firefox for Mobile.
- Sometimes the api takes longer to load the page.
- The list has limited entries due to api limit. If very few results are showing up please refresh the page.
- Users location is approximate (based on browser geolocation). GPS tracking is avoided to maintain consistency over phone and PC. Some ad blockers / script blockers might block browser geolocation.