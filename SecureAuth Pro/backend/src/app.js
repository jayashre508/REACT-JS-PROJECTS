const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const { connectDB } = require('./config/db')
const { errorHandler } = require('./middlewares/errorHandler')
const { notFound } = require('./middlewares/notFound')

const { apiRouter } = require('./routes')

function createApp() {
  const app = express()

  app.use(helmet())
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use(morgan('dev'))

  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

  app.use(
    cors({
      origin: clientOrigin,
      credentials: true
    })
  )

  app.get('/health', (req, res) => res.json({ ok: true }))

  app.use('/api', apiRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}

async function start() {
  const app = createApp()
  const port = process.env.PORT || 4000

  await connectDB()

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[auth-backend] listening on :${port}`)
  })
}

module.exports = { createApp, start }

