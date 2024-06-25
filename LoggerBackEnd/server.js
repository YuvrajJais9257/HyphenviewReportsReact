// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const winston = require('winston');
// const app = express();
// const port = 3005; // Ensure this port matches the one used in your axios request
// const cors = require('cors');
// app.use(cors()) ;
// // Middleware to parse JSON requests
// app.use(express.json());

// // Logger configuration
// const logDirectory = path.join(__dirname, 'logs');
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

// const getLogger = (userId) => {
//   const date = new Date().toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
//   const logFilePath = path.join(logDirectory, `${userId}-${date}.log`);

//   return winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//       ),
//     transports: [
//       new winston.transports.File({ filename: logFilePath })
//     ]
//   });
// };

// app.post('/log', (req, res) => {
//   console.log('Received request:', req.method, req.url); // Logging request method and URL
//   console.log('Request body:', req.body); // Logging request body

//   const { userId, message } = req.body;

//   if (!userId || !message) {
//     console.error('Missing userId or message');
//     return res.status(400).send('Missing userId or message');
//   }

//   try {
//     const logger = getLogger(userId);
//     logger.info({ userId, message, timestamp: new Date().toISOString() });
//     res.send('Log recorded');
//   } catch (error) {
//     console.error('Error logging message:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });



const express = require('express');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const app = express();
const port = 3005; // Ensure this port matches the one used in your axios request
const cors = require('cors');
 
app.use(cors());
 
// Middleware to parse JSON requests
app.use(express.json());
 
// Logger configuration
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
 
const getLogger = (userId) => {
  const date = new Date().toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
  const logFilePath = path.join(logDirectory, `${userId}-${date}.log`);
 
  const customFormat = winston.format.printf(({ level, message, timestamp,status_code }) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toTimeString().split(' ')[0];
 
    // Example: [INFO] 04.Feb 2015 20:49:41: User logged in
    return `[${level.toUpperCase()} ${status_code}] ${day}.${month} ${year} ${time}: ${message}`;
  });
 
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format((info) => {
        info.status_code = info.status_code || 'N/A'; // Default status_code if not provided
        return info;
      })(),
      customFormat
    ),
    transports: [
      new winston.transports.File({ filename: logFilePath })
    ]
  });
};
 
app.post('/log', (req, res) => {
  console.log('Received request:', req.method, req.url); // Logging request method and URL
  console.log('Request body:', req.body); // Logging request body
 
  const { userId,status_code, message} = req.body;
 
  if (!userId || !message || !status_code) {
    console.error('Missing userId or message');
    return res.status(400).send('Missing userId or message or status_code');
  }
  try {
    const logger = getLogger(userId);
    logger.info({ status_code,message });
    res.send('Log recorded');
  } catch (error) {
    console.error('Error logging message:', error);
    res.status(500).send('Internal server error');
  }
});
 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


