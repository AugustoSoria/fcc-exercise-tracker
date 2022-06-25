let mongoose = require('mongoose')
const { Schema } = require('mongoose');

mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new Schema({
  username: {type: String, required: true}
});

let exerciseSchema = new Schema({
  userId: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: String, required: true}
})

const Person = mongoose.model("Person", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

const createAndSavePerson = (username) => {
  const newPerson = new Person()
  newPerson.username = username

  return newPerson.save()
};

const findAllPeople = () => {
  return Person.find()
};

const saveExercise = (userId, description, duration, date) => {
  const newExercise = new Exercise()
  newExercise.userId = userId
  newExercise.description = description
  newExercise.duration = duration
  newExercise.date = date

  return newExercise.save()
};

const findPersonById = (personId) => {
  return Person.findById({_id: personId})
};

const findExercisesByUserid = (personId) => {
  return Exercise.find({userId: personId})
};


module.exports = {
  createAndSavePerson, 
  findAllPeople,
  saveExercise,
  findPersonById,
  findExercisesByUserid
}