const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080

// you'll of course want static middleware so your browser can request things like your 'bundle.js'
app.use(express.static(path.join(__dirname, '.', 'public')))

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error(`Not found: ${req.path}`)

    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
)
