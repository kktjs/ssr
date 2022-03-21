
const proxy = {
  'GET /api/user/:id': { id: 1, username: 'kenny', sex: 6 },
  'GET /api/user/verify': {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    id: 13,
    username: 'kenny',
    sex: 'male',
  },
}
module.exports = proxy


