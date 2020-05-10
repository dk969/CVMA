const moment = require('moment');
//gets the details for the message
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}
module.exports = formatMessage;