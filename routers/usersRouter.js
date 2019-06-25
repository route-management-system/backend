const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const Users = require("./usersModel.js");
const requireToken = require("../middleware/requireToken-MW.js")

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.add(user)
    .then(data => res.status(201).json(data))
    .catch(err => {
      res.status(500).json({message: "you've met with a terrible fate, haven't you?", error: err});
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = makeToken(user);
        res.status(200).json({ message: "Welcome!", token });
      } else {
        res.status(401).json({ message: "invalid username and/or password" });
      }
    })
    .catch(err => {
      res.status(500).json({message: "you've met with a terrible fate, haven't you?", error: err});
    });
});

router.get('/', requireToken, (req, res) => {
  
  Users.find()
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
})

router.get('/:id', requireToken, (req, res) => {
  const id = req.params.id

  Users.findById(id)
    .then(data => data ? res.status(200).json(data) : res.status(400).json({ message: "invalid user id" }))
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
})

router.get('/:id/saves', requireToken, (req, res) => {
  const id = req.params.id

  Users.findSavesByUser(id)
    .then(data => data ? res.status(200).json(data) : res.status(400).json({ message: "invalid user id" }))
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
})

router.put('/:id', requireToken, (req, res) => {
  const id = req.params.id
  let changes = req.body
  if (changes.password) {
    const hash = bcrypt.hashSync(changes.password, 12);
    changes.password = hash;
  }

  Users.update(id, changes)
    .then(data => data ? res.status(201).json(data) : res.status(400).json({ message: "invalid user id" }))
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
});

router.delete('/:id', requireToken, (req, res) => {
  const id = req.params.id

  Users.remove(id)
    .then(data => {
      data ? res.status(204).end() : res.status(404).json({ message: "invalid user id" })
    })
    .catch(err => res.status(500).json(
      { message: "you've met with a terrible fate, haven't you?", error: err }
    ))
});

function makeToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;