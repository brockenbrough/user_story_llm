import React, { useState } from 'react';
import axios from 'axios';

function SingleChatPage() {
    const [systemMessage, setSystemMessage] = useState('You are a useful assistant.');
    const [userPrompt, setUserPrompt] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState([
        { role: "system", content: 'You are a useful assistant.' },
    ]);
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        setLoading(true);
        document.body.style.cursor = 'wait';

        const newMessageHistory = [
            ...messageHistory,
            { role: "user", content: userPrompt },
        ];

        try {
            const response = await axios.post('http://localhost:8081/chat/canned', {
                messageHistory: newMessageHistory
            });

            const responseContent = response.data.message.content;
            setResponseMessage(responseContent);

            setMessageHistory([
                ...newMessageHistory,
                { role: "assistant", content: responseContent }
            ]);
        } catch (error) {
            console.error('There was an error!', error);
            setResponseMessage('There was an error processing your request.');
        } finally {
            setLoading(false);
            document.body.style.cursor = 'default';
        }
    };

    return (
        <div className="page-container">
            <h1>Ask Me</h1>
            <div className="input-container">
                <label>
                    Your Prompt:
                    <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        rows="4"
                        className="user-prompt-textarea"
                    />
                </label>
            </div>
            <button className="ask-button" onClick={handleAsk}>Ask</button>
            <div className="response-container">
                <h2>Response:</h2>
                <p>{responseMessage}</p>
            </div>
            <div className="message-history-container">
                <h2>Message History:</h2>
                <div className="message-history">
                    {messageHistory.map((message, index) => (
                        <div key={index} className="message-item">
                            <strong>{message.role}:</strong> {message.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SingleChatPage;
