import express from 'express'

import WelcomeMessageRoutes from './WelcomeMessage'

const router = express.Router({ mergeParams: true })

router.use('/welcome-messages', WelcomeMessageRoutes)

export default router