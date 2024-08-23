const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const { OpenAI } = require("openai"); // Corrected import to require syntax

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.CHAT_API_KEY }); // Initialize OpenAI with API key

router.get('/canned', async (req, res) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Another model name: gpt-4
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: "Write a haiku about recursion in programming.",
                },
            ],
        });
        
        console.log('MSG: ' + openai + " " + completion.choices[0].message.content); // Corrected to access message content

        return res.json(completion.choices[0].message); // Return the message object
    } catch (error) {
        console.error("Error generating completion:", error);
        return res.status(500).json({ error: "An error occurred while generating the completion." });
    }
});

module.exports = router;
