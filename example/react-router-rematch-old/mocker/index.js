// const delay = require('mocker-api/utils/delay');

// Whether to disable the proxy
const noProxy = process.env.NO_PROXY === 'true';

const proxy = {
  // Priority processing.
  _proxy: {
    proxy: {
      '/repos/*': 'https://api.github.com/',
    },
    changeHost: true,
  },
  'GET /api/user/:id': (req, res) => {
    return res.json({
      id: req.params.id,
      username: 'kenny',
      sex: 'male',
    });
  },
  'GET /api/user/verify': (req, res) => {
    return res.json({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      id: 13,
      username: 'kenny',
      sex: 'male',
    });
  },
};

module.exports = (noProxy ? {} : proxy);
// module.exports = (noProxy ? {} : delay(proxy, 1000));
