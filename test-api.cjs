const http = require('http')

const url = 'http://localhost:5000/api/products?category=accessories'

http
  .get(url, (res) => {
    let data = ''
    res.on('data', (chunk) => (data += chunk))
    res.on('end', () => {
      console.log('STATUS:', res.statusCode)
      console.log('DATA:', data.slice(0, 1000))
    })
  })
  .on('error', (e) => {
    console.log('CONNECTION ERROR:', e.message)
    console.log('Is the server running on port 5000?')
  })
