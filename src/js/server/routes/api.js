import express from "express";
const router = express.Router()

// define the home page route
router.get('/', (req, res) => {
  res.end('Birds home page')
})
// define the about route
router.get('/about', (req, res) => {
  res.end('About birds')
})

export default router;