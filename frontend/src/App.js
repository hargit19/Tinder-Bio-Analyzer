import React, { useState } from 'react';
import './App.css'; // Import your CSS file
import { makeUnauthenticatedPOSTRequest } from './utils/serverHelpers';

const App = () => {

  
  const [imageUrl, setImageUrl] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [resultVisible, setResultVisible] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [rewriting, setRewriting] = useState(false);

  const handleUploadWidget = () => {
    window.cloudinary.createUploadWidget(
      {
        cloudName: 'dnrxtm9fo',
        uploadPreset: 'x5qgree2',
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log('Image uploaded successfully: ', result.info.secure_url);
          setImageUrl(result.info.secure_url);
        }
      }
    ).open();
  };


  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload a Tinder profile screenshot.');
      return;
    }

    if(!apiKey){
      alert("No Valid API Key Provided");
      return;
    }

    setLoading(true); // Set loading to true when the process starts
    setResultVisible(false);

    try {
      // Simulate a delay or actual backend call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      const data = {content: imageUrl , apiKey:apiKey };
    const response = await makeUnauthenticatedPOSTRequest(
        "/process",
        data
    );

    if (response.err) {
      alert("No Valid image or API key provided");
      return;
  }



    setScore(response.Score);
    setFeedback(response.Feedback[0].Content);
    setResultVisible(true);
  } 
 catch (error) {
      console.error('Error during analysis:', error);
    } finally {
      setLoading(false); // Set loading to false when the process finishes
}

  }


  const RewriteBio = async (e) => {
    setRewriting(true);
    setResultVisible(false)

     e.preventDefault();

     let content = `Score ${score} Feedback ${feedback} ImageURL ${imageUrl}`
     
     if(!content){
      alert("error while rewriting bio")
     }

     const input = {apiKey : apiKey , content : content};

     const data = await makeUnauthenticatedPOSTRequest("/rewrite" , input);
     setScore(data.Score);
     setFeedback(data.Bio);
     setResultVisible(true);
     setRewriting(false);

     

  }
  
  
  return (
    <div className="background-container" id="background-container">
      <div className="overlay"></div>
      <div className="container">
        <div className="logo-header">
          <img src="https://www.cdnlogo.com/logos/t/29/tinder.svg" alt="Tinder Logo" className="logo" />
          <h1 className="title">Tinder Bio Analyzer</h1>
        </div>

        <div className="input-group">
            <input
              type="password"
              className="api-key-input"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

        <form className="upload-form" onSubmit={handleAnalyze}>
          <div className="upload-box">
            <button type="button" onClick={handleUploadWidget} className="cloudinary-button">
              <img src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-white-upload-icon-image_1338675.jpg" alt="Upload Icon" className="icon" /> Upload Image
            </button>
          </div>

          

          <button type="submit" className="analyze-btn">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrXEmpoivasJbgzMOsndMVsmm8sBSgQvseABMF_psH_z8AnLGdzxgnUdm0nGeWHtAduH0&usqp=CAU" alt="Analyze Icon" className="icon" /> Analyze Bio
          </button>
        </form>

        {loading && (
          <div className="loading-message">
            <p>Analyzing your bio... Please wait.</p>
          </div>
        )}

        {rewriting && (
          <div className="loading-message">
            <p>Writing a better bio for you... Please wait.</p>
          </div>
        )}

        {resultVisible && (
          <div>
          <div className="result-container">
            <div className="card">
              <div className="score-area">
                <h2 className="score-text">Score: {score}/10</h2>
              </div>
              <div className="feedback-area">
                <p>{feedback}</p>
              </div>
            </div>
          </div>

<div className="upload-box">
<button type="button" onClick={RewriteBio} className="cloudinary-button">
  <img src="https://png.pngtree.com/element_our/20190601/ourmid/pngtree-white-upload-icon-image_1338675.jpg" alt="Upload Icon" className="icon" /> Rewrite Bio
</button>
</div>

</div>


        )}
      </div>

  


    </div>
  );
};

export default App;
