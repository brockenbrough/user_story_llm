import React, { useState } from 'react';
import axios from 'axios';

function CreateUserStoryPage() {
    const [systemMessage, setSystemMessage] = useState('You are a useful assistant.');
    const [userFeedback, setUserFeedback] = useState('');
    const [appContext, setAppContext] = useState('');
    const [generatedUserStory, setGeneratedUserStory] = useState('');
    const [smallScore, setSmallScore] = useState('');
    const [smallDetails, setSmallDetails] = useState('');
    const [negotiableScore, setNegotiableScore] = useState('');
    const [negotiableDetails, setNegotiableDetails] = useState('');
    const [messageHistory, setMessageHistory] = useState([
        { role: "system", content: 'You are a useful assistant.' },
    ]);
    const [loading, setLoading] = useState(false);
    const [showShortDetails, setShowShortDetails] = useState(false); // New state for toggling details
    const [showNegotiableDetails, setShowNegotiableDetails] = useState(false); // New state for toggling details

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
            setNegotiableScore(response.data.negotiableScore);
            setNegotiableDetails(response.data.negotiableDetails);
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
            <label style={{ width: '100%' }}>
                <div>
                    <h3>Application</h3>
                </div>
                <textarea
                    value={appContext}
                    placeholder="Give a brief description of your application."
                    onChange={(e) => setAppContext(e.target.value)}
                    rows="4"
                    className="user-prompt-textarea"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                />
            </label>
            </div>
            
            <div className="input-container">
            <label style={{ width: '100%' }}>
                <div>
                    <h3>User Feedback</h3>
                </div>
                <textarea
                    value={userFeedback}
                    placeholder="Give the user feedback that might be used to form a story that can be completed in one sprint."
                    onChange={(e) => setUserFeedback(e.target.value)}
                    rows="4"
                    className="user-prompt-textarea"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                />
            </label>

            </div>

            <button className="ask-button" onClick={handleAsk}>Create Story</button>

            <div>
                <h2>User Story</h2>
            </div>

            <div className="response-container">
                <p>{generatedUserStory ? generatedUserStory : "Hit Create User Story to generate a user story."}</p>
            </div>

            <div>
                <h4>INVEST Scores</h4>
            </div>

            <div className="response-container">

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
                                negotiableScore === 5
                                    ? "green"
                                    : negotiableScore >= 3 && negotiableScore < 5
                                    ? "yellow"
                                    : negotiableScore >= 1 && negotiableScore < 3
                                    ? "red"
                                    : "white"
                            }}
                    >
                    <h4>Negotiable Score: {negotiableScore} out of 5</h4>
                    
                    <button onClick={() => setShowNegotiableDetails(!showNegotiableDetails)}>
                        {showNegotiableDetails ? 'Hide' : 'More Info'}
                    </button>
                    {showNegotiableDetails && (
                        <div className="message-history-container">
                            <div className="small-details">
                                <p>{negotiableDetails}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CreateUserStoryPage;
