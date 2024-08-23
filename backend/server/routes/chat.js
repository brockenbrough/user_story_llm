const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const { OpenAI } = require("openai");

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.CHAT_API_KEY });

router.post('/canned', async (req, res) => {
    try {
        // Extract values from the JSON body
        const { messageHistory } = req.body;

        // Validate the request body
        if (!messageHistory) {
            return res.status(400).json({ error: "messageHistory is required." });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Another model name: gpt-4
            messages: messageHistory,  // Use the combined message array
        });

        console.log('MSG: ' 
            + completion.choices[0].message.role + " "
            + completion.choices[0].message.content);

        // Add the completion response to the messageHistory
        const updatedMessageHistory = [
            ...messageHistory,
            completion.choices[0].message // Add the AI's response
        ];

        return res.json({
            message: completion.choices[0].message,
            messageHistory: updatedMessageHistory
        });

    } catch (error) {
        console.error("Error generating completion:", error);
        return res.status(500).json({ error: "An error occurred while generating the completion." });
    }
});

module.exports = router;
