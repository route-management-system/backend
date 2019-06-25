const express = require('express');
const router = express.Router();

const Saves = require('./savesModel.js');
const requireToken = require("../middleware/requireToken-MW.js")

router.post('/', requireToken, (req, res) => {
  const save = req.body
  Saves.add(save)
    .then(data => res.status(201).json(data))
    .catch(err => {
      res.status(500).json({message: "you've met with a terrible fate, haven't you?", error: err});
    });
  });

router.get('/', requireToken, (req, res) => {
  Saves.find()
  .then(data => res.status(200).json(data))
  .catch(err => res.status(500).json(
    { message: "you've met with a terrible fate, haven't you?", error: err }
  ))
});

router.get('/:id', requireToken, (req, res) => {
  const id = req.params.id
  Saves.findById(id)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
  });

router.put('/:id', requireToken, (req, res) => {
  const id = req.params.id
  const changes = req.body
  Saves.update(id, changes)
    .then(data => data ? res.status(201).json(data) : res.status(400).json({ message: "invalid save id" }))
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
  });

router.delete('/:id', requireToken, (req, res) => {
  const id = req.params.id
  Saves.remove(id)
    .then(data => {
      data ? res.status(204).end() : res.status(404).json({ message: "invalid save id" })
    })
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
  });

module.exports = router;