import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_API_KEY;



const DialogBox = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const generativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        setModel(generativeModel);
      } catch (err) {
        console.error('Error initializing model:', err);
        setError('Error initializing model');
      }
    };

    initializeModel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!model) {
      console.error('Model not initialized');
      setError('Model not initialized');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer('');

    try {
      const result = await model.generateContent(question);
      const response = await result.response;
      const text = await response.text();
      setAnswer(text);
    } catch (err) {
      console.error('Error generating response:', err);
      setError('Error generating response');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setClearing(true);
    setQuestion('');
    setAnswer('');
    setError(null);
    setTimeout(() => {
      setClearing(false);
    }, 1000);
  };

  return (
    <div style={styles.container}>
 

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Ingrese su pregunta:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.input}
          />
        </label>
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            style={clearing ? { ...styles.clearButton, ...styles.clearing } : styles.clearButton}
            disabled={clearing}
          >
            {clearing ? 'Limpiando...' : 'Limpiar'}
          </button>
        </div>
      </form>

      {error && <div style={styles.error}>{error}</div>}
      
      {answer && (
        <div style={styles.answerSection}>
          <strong style={styles.answerLabel}>Respuesta:</strong>
          <p style={styles.answer}>{answer}</p>
        </div>
      )}

      <footer style={styles.footer}>
        Desarrollado por Luis Copetti
      </footer>
    </div>
  );
};
const styles = {
  container: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '800px',
    boxSizing: 'border-box',
  },
  form: {
    marginBottom: '10px',
  },
  label: {
    color: 'blue',
    marginBottom: '10px',
    display: 'block',
  },
  input: {
    marginLeft: '10px',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    marginRight: '10px',
  },
  clearButton: {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    transition: 'background-color 0.5s',
  },
  clearing: {
    backgroundColor: '#ff8080',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  answerSection: {
    marginTop: '20px',
  },
  answerLabel: {
    color: 'green',
  },
  answer: {
    color: 'black',
    marginTop: '5px',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
  },
};


export default DialogBox;
