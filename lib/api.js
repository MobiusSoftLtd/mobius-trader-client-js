const querystring = require('querystring');
const io = require('socket.io-client');

function auth(host, login, password, userAgent) {
  return new Promise((resolve, reject) => {
    const url = new URL(host);

    let http = require(url.protocol.replace(':', ''));

    let cookie = '';

    const postData = querystring.stringify({
      login,
      password,
    });
    const request = http.request(
      {
        hostname: url.host,
        port: url.port,
        path: '/login',
        method: 'POST',
        headers: {
          'User-Agent': userAgent,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      res => {
        let body = '';

        if (res.statusCode === 200) {
          cookie = res.headers['set-cookie'];

          res.on('data', chunk => {
            body += chunk;
          });

          res.on('end', () => {
            body = JSON.parse(body);
            const error = body['errors']
              ? Object.values(body['errors']).join(', ')
              : null;
            if (error) {
              reject(error);
            } else {
              resolve(cookie);
            }
          });
        }
      }
    );

    request.on('error', e => {
      reject(e.message);
    });

    request.write(postData);
    request.end();
  });
}

module.exports = async function(config) {
  const { host, login, password, userAgent } = config;

  const cookie = await auth(host, login, password, userAgent);

  const url = new URL(host);

  const socket = io(url.origin, {
    transports: ['websocket'],
    extraHeaders: {
      Host: url.hostname,
      Origin: url.origin,
      'User-Agent': userAgent,
      Cookie: cookie,
    },
  });

  socket.on('connect', () => {
    console.log('connect');
  });

  socket.on('error', data => {
    console.log('error', data);
  });

  socket.on('disconnect', () => {
    console.log('disconnect');
  });

  socket.on('connect_failed', () => {
    console.log('connect_failed');
  });

  return socket;
};
