import React, { useState } from 'react';
import axios from 'axios';

function CreateUserStoryPage() {
    const [systemMessage, setSystemMessage] = useState('You are a useful assistant.');
    const [userFeedback, setUserFeedback] = useState('');
    const [appContext, setAppContext] = useState('');
    const [generatedUserStory, setGeneratedUserStory] = useState('');
    const [smallScore, setSmallScore] = useState('');
    const [smallDetails, setSmallDetails] = useState('');
    const [messageHistory, setMessageHistory] = useState([
        { role: "system", content: 'You are a useful assistant.' },
    ]);
    const [loading, setLoading] = useState(false);
    const [showShortDetails, setShowShortDetails] = useState(false); // New state for toggling details

    const handleAsk = async () => {
        setLoading(true);
        document.body.style.cursor = 'wait';

        try {
            const response = await axios.post('http://localhost:8081/userStory/create', {
                feedback: userFeedback,
                appContext: appContext
            });

            setGeneratedUserStory(response.data.userStory);
            setMessageHistory(response.data.messageHistory);
            setSmallScore(response.data.smallScore);
            setSmallDetails(response.data.smallDetails);
        } catch (error) {
            console.error('There was an error!', error);
            setGeneratedUserStory('There was an error processing your request.');
        } finally {
            setLoading(false);
            document.body.style.cursor = 'default';
        }
    };

    return (
        <div className="page-container">
            <h1>Create a User Story</h1>
            <div className="input-container">
                <label>
                    Application:
                    <textarea
                        value={appContext}
                        placeholder="Given a brief description of your application."
                        onChange={(e) => setAppContext(e.target.value)}
                        rows="4"
                        className="user-prompt-textarea"
                    />
                </label>
            </div>
            
            <div className="input-container">
                <label>
                    User Feedback:
                    <textarea
                        value={userFeedback}
                        placeholder="Enter feedback from your customer for a single topic that could be completed in a sprint."
                        onChange={(e) => setUserFeedback(e.target.value)}
                        rows="4"
                        className="user-prompt-textarea"
                    />
                </label>
            </div>

            <button className="ask-button" onClick={handleAsk}>Create Story</button>

            <div className="response-container">
                <h2>User Story:</h2>
                <p>{generatedUserStory}</p>
            </div>

            <div className="response-container">
                 <h4>INVEST Scores</h4>
                <div className="score-container"
                            style={{
                                backgroundColor:
                                smallScore === 5
                                    ? "green"
                                    : smallScore >= 3 && smallScore < 5
                                    ? "yellow"
                                    : smallScore >= 1 && smallScore < 3
                                    ? "red"
                                    : "white"
                            }}
                    >
                    <h4>Small Score: {smallScore} out of 5</h4>
                    <button onClick={() => setShowShortDetails(!showShortDetails)}>
                        {showShortDetails ? 'Hide' : 'More Info'}
                    </button>
                    {showShortDetails && (
                        <div className="message-history-container">
                            <div className="small-details">
                                <p>{smallDetails}</p>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="score-container"
                            style={{
                                backgroundColor:
                                smallScore === 5
                                    ? "green"
                                    : smallScore >= 3 && smallScore < 5
                                    ? "yellow"
                                    : smallScore >= 1 && smallScore < 3
                                    ? "red"
                                    : "white"
                            }}
                    >
                    <h4>Negotiable Score: {smallScore} out of 5</h4>
                    <button onClick={() => setShowShortDetails(!showShortDetails)}>
                        {showShortDetails ? 'Hide' : 'More Info'}
                    </button>
                    {showShortDetails && (
                        <div className="message-history-container">
                            <div className="small-details">
                                <p>{smallDetails}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CreateUserStoryPage;
