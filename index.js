const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

const {
  createAndSavePerson,
  findAllPeople,
  saveExercise,
  findPersonById,
  findExercisesByUserid
} = require('./mongoose.js')

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', async (req, res) => {
    const name = req.body.username

    const {_id, username} = await createAndSavePerson(name)
    return res.json({_id, username})
})

app.get('/api/users', async (req, res) => {
    const allUsers = await findAllPeople()
    const allUsersResponse = []
    
    allUsers.forEach(u => allUsersResponse.push({_id: u._id, username: u.username}))
    return res.json(allUsersResponse)
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  let reqUserId = req.params._id
  let {description, duration, date} = req.body

  date? date = new Date(date) : date = new Date()
  date = date.toISOString().split('T')[0]

  let {_id, username} = await findPersonById(reqUserId)
  if(!username) return res.json({error: "user don't found"})

  let savedExercise = await saveExercise(_id, description, duration, date)

  return res.json({
    username,
    description: savedExercise.description,
    duration: parseInt(savedExercise.duration),
    date: new Date(date).toDateString(),
    _id: savedExercise.userId
  })
})

app.get('/api/users/:_id/logs', async (req, res) => {  
  const id = req.params._id
  const {from, to, limit} = req.query

  const {username} = await findPersonById(id)

  let exercises = await findExercisesByUserid(id)

  if(from && to){
    exercises = exercises.filter(e => e.date > from && e.date < to)
  }
  if(limit) {
    exercises = exercises.slice(0, limit)
  }
  
  let log = []
  
  exercises.map(e => log.push({description: e.description, duration: e.duration, date: new Date(e.date).toDateString()}))

  return res.json({username, count: exercises.length, _id: id, log})
})

app.listen(process.env.PORT || 3000)
