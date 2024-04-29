import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_API_KEY;

const DialogBox = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState(null);

  useEffect(() => {
    const initializeModel = async () => {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const generativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
      setModel(generativeModel);
    };

    initializeModel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!model) {
      console.error('Model not initialized');
      return;
    }

    try {
      const result = await model.generateContent(question);
      const response = await result.response;
      const text = response.text();
      setAnswer(text);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
        <label style={{ color: 'blue', marginBottom: '10px', display: 'block' }}>
          Ingrese su pregunta:
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} style={{ marginLeft: '10px' }} />
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button type="submit" style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: '5px', border: 'none', marginRight: '10px' }}>Enviar</button>
          <button onClick={() => { setQuestion(''); setAnswer(''); }} style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', border: 'none' }}>Limpiar</button>
        </div>
      </form>
      {answer && (
        <div style={{ marginTop: '20px' }}>
          <strong style={{ color: 'green' }}>Respuesta:</strong>
          <p style={{ color: 'black', marginTop: '5px' }}>{answer}</p>
        </div>
      )}
    </div>
  );
  
  
  
    
};

export default DialogBox;
