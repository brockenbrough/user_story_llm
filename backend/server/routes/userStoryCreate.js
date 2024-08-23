const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const { OpenAI } = require("openai");

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.CHAT_API_KEY });

async function openConversationAndGenerateUserStory(feedback, messageHistory) {
    var command = "Create a user story from the following user feedback: " 
    + feedback; 

    var messageHistory = [
        { role: "system", content: 'You are a useful assistant.' },
        { role: "user", content: command }
    ];

    // AI response to creating a user story from the user feedback.
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Another model name: gpt-4
        messages: messageHistory,  // Use the combined message array
    });

    // Add the completion response to the messageHistory
    const updatedMessageHistory = [
        ...messageHistory,
        completion.choices[0].message // Add the AI's response
    ];

    const userStory = completion.choices[0].message.content;

    return { userStory, updatedMessageHistory };
}

router.post('/create', async (req, res) => {
    try {
        // Extract values from the JSON body
        const { feedback } = req.body;

        // Validate the request body
        if (!feedback) {
            return res.status(400).json({ error: "userFeedback is required." });
        }

        var messageHistory = [];

        // Call the refactored function
        const { userStory, updatedMessageHistory } = await openConversationAndGenerateUserStory(feedback);
        
        return res.json({
            userStory: userStory,
            messageHistory: updatedMessageHistory
        });

    } catch (error) {
        console.error("Error generating completion:", error);
        return res.status(500).json({ error: "An error occurred while generating the completion." });
    }
});

module.exports = router;

