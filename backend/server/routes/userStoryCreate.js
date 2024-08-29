const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const { OpenAI } = require("openai");

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.CHAT_API_KEY });

async function openConversationAndGenerateUserStory(command, messageHistory) {

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
    const aiLog = [
        ...messageHistory,
        completion.choices[0].message // Add the AI's response
    ];

    const answer = completion.choices[0].message.content;

    return { answer, aiLog };
}

async function askAI(command, messageHistory) {
    var messageHistoryResult = [
        ...messageHistory,
        { role: "user", content: command }
    ];

    // AI response to creating a user story from the user feedback.
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Another model name: gpt-4
        messages: messageHistoryResult,  // Use the combined message array
    });

    // Add the completion response to the messageHistory
    
    const aiLog = [
        ...messageHistoryResult,
        completion.choices[0].message // Add the AI's response
    ];

    const answer = completion.choices[0].message.content;

    return { answer, aiLog };
}

router.post('/create', async (req, res) => {
    try {
        // Extract values from the JSON body
        const { feedback, appContext } = req.body;

        // Validate the request body
        if (!feedback) {
            return res.status(400).json({ error: "user feedback is required." });
        }
        if (!appContext) {
            return res.status(400).json({ error: "application context is required." });
        }

        var messageHistory = [];

        // Open the conversation.  Store result in userStory.
        var { answer: userStory, aiLog: messageHistory } 
            = await openConversationAndGenerateUserStory(
                    "Here is a description of my application: " + appContext
                    + " Create a one sentence user story from the following user feedback: " + feedback);
        
        // Get Small Score and Details
        var { answer: smallScore, aiLog: messageHistory } 
            = await askAI(
                "Could this user story be completed in one sprint."
                + "Give an answer that is just a single number between 1 and 5 " 
                + "where 1 means very unlikely and 5 is very likely.",
                messageHistory);

        var { answer: smallDetails, aiLog: messageHistory } 
            = await askAI(
                "Explain your score.",
                messageHistory);

        return res.json({
            userStory: userStory,
            smallScore: smallScore,
            smallDetails: smallDetails,
            messageHistory: messageHistory,
        });

        // Get Negotiable Score and Details
        var { answer: negotiableScore, aiLog: messageHistory } 
            = await askAI(
                "Is this user story negotiable with the user and not too detailed?"
                + "Give an answer that is just a single number between 1 and 5 " 
                + "where 1 means very unlikely and 5 is very likely.",
                messageHistory);

        var { answer: negotiableDetails, aiLog: messageHistory } 
            = await askAI(
                "Explain your score.",
                messageHistory);

        return res.json({
            userStory: userStory,
            smallScore: smallScore,
            smallDetails: smallDetails,
            negotiableScore: negotiableScore,
            negotiableDetails: negotiableDetails,
            messageHistory: messageHistory,
        });
 

    } catch (error) {
        console.error("Error generating completion:", error);
        return res.status(500).json({ error: "An error occurred while generating the completion." });
    }
});

module.exports = router;

