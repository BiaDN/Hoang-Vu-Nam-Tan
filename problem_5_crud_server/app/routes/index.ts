import { Router } from 'express'
import { accountRoute } from '../packages';

const api = Router();

api.use('/account', accountRoute)

export default api;