const express = require('express')
const fs = require("fs")
const cors = require("cors")
const bcrypt = require("bcrypt")

const app = express()
app.use(cors())
app.use(express.json())

const dbPath = "/.data/adventures.json"

app.get('/', (req, res) => {
    res.send("hello")
});

app.post('/register/', (req, res) => {
  const username = req.body.username
  const pw = req.body.password
  
  const users = JSON.parse(fs.readFileSync( __dirname + "/.data/users.json", "utf8"))
  
  // check username is unique
  if (users.map(d => d.n).includes(username)) {
    res.send({
      success: false,
      message: "Username taken."
    })
    return
  }
  
  // check username contains 'normal' characters
  if (!/^[A-Za-z0-9]*$/.test(username)) {
    res.send({
      success: false,
      message: "Username must contain only letters or numbers."
    })
    return
  }
  
  // add user with default journals
  const defaultJournals = JSON.parse(fs.readFileSync( __dirname + "/journals-default.json", "utf8"))
  defaultJournals[0].id = genJournalId()
  
  const user = {
    "n": username,
    "p": bcrypt.hashSync(pw, 10),
    "journals": [defaultJournals[0].id]
  }

  users.push(user)
  
  // save user and journals
  fs.writeFileSync(__dirname + "/.data/users.json", JSON.stringify(users))
  const journals = JSON.parse(fs.readFileSync( __dirname + "/.data/journals.json", "utf8"))
  journals.push(defaultJournals)
  fs.writeFileSync(__dirname + "/.data/journals.json", JSON.stringify(journals))
  
  res.end(JSON.stringify({
    success: true,
    journals: defaultJournals
  }))
  
})

app.post('/login/', (req, res) => {
  const user = req.body.username;
  const pw = req.body.password
  
  const users = JSON.parse(fs.readFileSync( __dirname + "/.data/users.json", "utf8"))
  // check username exists
  if (!users.map(u => u.n).includes(user)) {
    res.send({
      success: false,
      message: "Username can't be found."
    })
    return
  }
  
  const userData = users.filter(d => d.n == user)[0]
  
  // check password
  const hash = userData.p
  
  if (!bcrypt.compareSync(pw, hash)) {
    res.send({
      success: false,
      message: "Password is incorrect."
    })
    return
  }
  
  const journals = JSON.parse(fs.readFileSync( __dirname + "/.data/journals.json", "utf8"))
  const userJournals = journals.filter(journal => userData.journals.includes(journal.id))
  
  res.end(JSON.stringify({
    success: true,
    journals: userJournals
  }))
  
})

function genJournalId() {
  return Date().toString() + Math.random(999999)
}

app.post('/save', function(req, res) {
  const journals = req.body.journals
  const ids = journals.map(j => j.id).filter(j => j)
  
  // get user from IDs of boards
  const users = JSON.parse(fs.readFileSync( __dirname + "/.data/users.json", "utf8"))
  const allJournalIds = users.map(u => u.journals)
  
  const userIndex = allJournalIds.map(l => ids.toString() == l.toString()).indexOf(true)
  const user = users[userIndex]
  
  if (!user) {
    res.send({
      success: false,
      message: "Cannot save, user not found."
    })
    return
  }
  
  // overwrite journals and add new ones
  const allJournals = JSON.parse(fs.readFileSync( __dirname + "/.data/journals.json", "utf8"))
  const allIds = allJournals.map(j => j.id)
  for (let journal of journals) {
    if (allIds.includes(journal.id)) {
      
      // if journal already exists, replace old version
      const index = allIds.indexOf(journal.id)
      allJournals[index] = journal
      
    } else {
      
      // if it's a new journal, push it
      allJournals.push(journal)
      
    }
  }
  
  fs.writeFileSync(__dirname + "/.data/journals.json", JSON.stringify(allJournals))
  
  res.send({
    success: true
  })
  
})

const port = process.env.PORT || 2020
app.listen(port, () => {
    console.log('server is listening on port 2020');
});