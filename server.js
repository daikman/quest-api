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

app.get('/get_board/:board_id', (req, res) => {
    let board = req.params.board_id;

    fs.readFile( __dirname + dbPath, 'utf8', function (err, data) {
      var allAdventures = JSON.parse(data);
      var adventures = allAdventures[board]
      res.end( JSON.stringify(adventures));
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

  // get old adventures
  fs.readFile( __dirname + dbPath, 'utf8', function (err, data) {
    data = JSON.parse( data );
    // combine with new data
    data = {...data, ...req.body}

    // return as a response
    res.end( JSON.stringify(data));

    // write over file
    fs.writeFile('/.data/adventures.json', JSON.stringify(data), (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
    });
  });

})

const port = process.env.PORT || 2020
app.listen(port, () => {
    console.log('server is listening on port 2020');
});
