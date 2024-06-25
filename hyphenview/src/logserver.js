import axios from "axios";

const logMessage = async (userId,status_code, message) => {
    console.log(userId,message,"lll")
    try {
        const response = await axios.post('http://localhost:3005/log', {
            userId,
            status_code,
            message
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response.status !== 200) {
            throw new Error('Failed to log message');
          }
        } catch (error) {
          console.error('Error logging message:', error);
        }
      };
  
  export default logMessage;
  