const express = require('express');
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json())

const dbPath = "/.data/adventures.json"

app.get('/', (req, res) => {
    res.json({
        actions: 'get_board/<board_name>, check_board/<board_name>, save_board'
    });
});

app.get('/get_board/:board_id/:password', (req, res) => {
    let board = req.params.board_id;

    fs.readFile( __dirname + dbPath, 'utf8', function (err, data) {
      let allAdventures = JSON.parse(data);
      let reqBoard = allAdventures[board]
      
      let passwordNeeded = reqBoard["password-for"] == "read-write" |
          reqBoard["password-for"] == "read"
      let password = reqBoard.password
      
      // remove private info
      delete reqBoard.password
      
      if (passwordNeeded) {
        if (req.params.password == password) {
          res.end(JSON.stringify(reqBoard));
        } else {
          res.end(JSON.stringify("wrong password"))
        }
      } else {
        res.end(JSON.stringify(reqBoard));
      }
      
    });
  
});

app.get('/check_board/:board_id', (req, res) => {
    let board = req.params.board_id;

    fs.readFile( __dirname + dbPath, 'utf8', function (err, data) {

      var allAdventures = JSON.parse(data);
      let names = Object.keys(allAdventures)

      let conflict
      if (names.indexOf(board) == -1) {
        conflict = false
      } else {
        conflict = true
      }

      res.end( JSON.stringify(
        {
          name_taken: conflict
        }
      ));

    });

});

app.post('/save_board', function (req, res) {
  
  let bod = req.body
  let passwordInput = bod.password
  let toReplace = Object.keys(bod)[0]
  let replacement = Object.values(bod)[0]
  delete bod.password

  // get old adventures
  fs.readFile( __dirname + dbPath, 'utf8', function (err, allData) {
    
    allData = JSON.parse( allData );
    let data = allData[toReplace];
    
    let password = data.password
    let passwordNeeded = data["password-for"] == "write" | data["password-for"] == "read-write"

    if (passwordNeeded) {
      if (password == passwordInput) {
        replacement.password = password
        allData[toReplace] = replacement
      } else {
        res.end(JSON.stringify("wrong password"))
      }
    } else {
      replacement.password = password
      allData[toReplace] = replacement
    }

    // write over file
    fs.writeFile(__dirname + dbPath, JSON.stringify(allData), (err) => {
      if (err) {
          throw err;
      } else {
        res.end(JSON.stringify("quests saved"))
      }
    });
  });

})

app.post('/new_board', function (req, res) {
  
  let newQuests = Object.values(req.body)[0]
  let newName = Object.keys(req.body)[0]
  let oldName = req.body.oldBoard
  delete req.body.oldBoard
  
  // get old adventures
  fs.readFile( __dirname + dbPath, 'utf8', function (err, allData) {
    
    allData = JSON.parse(allData);
    let allNames = Object.keys(allData)
    
    if (allNames.indexOf(newName) != -1) {
      res.end(JSON.stringify("name taken"))
      return
    }
    
    // if user is working on default board and wants to create a new one
    // then don't replace current quests with default
    if (oldName != "default") {
      newQuests.quests = allData["default"].quests
    }
    allData[newName] = newQuests

    // write over file
    fs.writeFile(__dirname + dbPath, JSON.stringify(allData), (err) => {
      if (err) {
          throw err;
      } else {
        res.end(JSON.stringify(allData[newName]));
      }
    });
  });

})

const port = process.env.PORT || 2020
app.listen(port, () => {
    console.log('server is listening on port 2020');
});
