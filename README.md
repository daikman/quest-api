# Quest Journal API
node.js REST API for [my quest journal app](https://daikman.github.io/quest-journal/) that stores users' quests and fetches them.

It is hosted on Glitch, [here](https://quest-journal-api.glitch.me/). I chose Glitch because it has a persistent file system, so I could store user data across time.

It uses [`express`](https://expressjs.com/) to define the server logic, and [`bcrypt`](https://github.com/kelektiv/node.bcrypt.js#readme) to hash passwords. 

The server has three endpoints `/register`, `/login` and `/save`. They all work by accessing the file system with the package `fs` and reading/writing to a hidden "/.data" directory, where JSON files are stored to define the users and their journals.  

# Personal notes
This project is how I learned about `node`, `npm` and `express`. It's the back-end for my [Quest Journal project](https://github.com/daikman/quest-journal). 

The main advantage of separating the front and back end of this project was that I was able to learn about each more effectively. The second advantage