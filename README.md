# quest-api
node.js REST API for my quest journal app. Stores users' quests and fetches them.

# example use
if you go to [this url](https://sordid-occipital-crayfish.glitch.me/) and add "check_board/AmazingAdventure", it will return an object like this:

```
{
  "name_taken": false
}
```

With "name_taken" indicating whether or not a board (i.e., journal of quests) of the name "AmazingAdventure" exists.
