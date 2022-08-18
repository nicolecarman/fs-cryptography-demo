// importing the bcryptjs package
const bcrypt = require("bcryptjs");

// chats is a faux/fake database because we haven't learned databases yet
const chats = [];

module.exports = {
    createMessage: (req, res) => {
        console.log("createMessage endpoint hit");

        // destructure pin and message from the body object
        // the front end has structured it this way (look into frontend index.js for clarification)
        const {pin, message} = req.body;
        console.log(pin, message);

        // first, let's check if the pin currently exists
        for (let i = 0; i < chats.length; i++) {
            // let's compare the pin coming in with hashed versions stored in our chats array
            const pinExists = bcrypt.compareSync(pin, chats[i].pinHash);
            if (pinExists) {
                chats[i].messages.push(message);
                let messagesToReturn = {...chats[i]};
                delete messagesToReturn.pinHash;
                return res.status(200).send(messagesToReturn);
            }
        }

        // Salt represents the complexity of our encryption, in terms of patterns
        const salt = bcrypt.genSaltSync(10);
        console.log(salt);

        // the hash represents the actual encryption of our password
        const pinHash = bcrypt.hashSync(pin, salt);
        console.log(pinHash);

        // write some code to make a new message object with the pin hash
        let msgObj = {
            pinHash, // this is the same as pinHash: pinHash
            messages: [message]
        }

        // add this new msgObj to our array of chat messages
        // this simulates adding a message to our database
        // we will never store raw passwords in our datbaase. always hashed versions
        chats.push(msgObj);
        let messageToReturn = {...msgObj};

        // delete the pinHash from our object
        delete messageToReturn.pinHash;
        res.status(200).send(messageToReturn);
    }
}