# Notes for demo day (9/24)

## Demo of app (Ridvan - 2 mins)
- Show the webpage on github pages and show an example search or two
- Describe how it works
- What is the problem this website attempts to solve
    - To allow people to search for things to do and places to go quickly and easily
- What is the target audience 
    - Anyone that can access the internet can use the site

## Layout (Jesus - 2 mins)
- You can use the website up on the screen to describe the layout of the page and how we decided to layout the elements the way we did
- Discuss the choice of bootstrap and why we used it
- Show the mobile responsiveness

## Javascript (Hamrah - 4 mins)
- Show google places api in the code and how we call it to get the map to display (re-center, markers)
- Show weather api and how we call that 
- Show how elements get updated on page after a user searches and the api calls come back
- Talk about the use of algolia places library for auto-completion
- Moment.js library used to format times in weather div

## Problems we encountered during project (Everyone)
- (Hamrah) Google places api gave CORS error when we tried to make calls.  Had to fall back to using places library within the google maps api
- (Jesus) Getting the right time format for weather times since they were returned with a UTC offset (i.e. 2019-09-20T09:30:33+0200)
- (Ridvan) Working with git branches and all of us working on the same files - had merge conflicts multiple times 
- (Ridvan) Getting live share working was initially a struggle since some of us had not hosted a live share before
- (Jesus) Mobile responsiveness - re-adjusting the layout multiple times to make as much content fit on the page as possible

## Improvements we would make to the app if we continued to work on it
- Saving/favoriting locations
- Getting directions to points of interest
- Incorporating additional search filters to narrow results
- Add in more info about locations (link to website, hours, etc.)
- Be able to click on a marker on the map and have it put focus on the location details card
- Be able to search based on future date/time and displaying the results based on what's open and also the weather at that time
