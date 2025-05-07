import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from "../../firebase";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from 'firebase/firestore';


const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const clearFields = () => {
    setEmail('');
    setPassword('');
    setRepeatPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Успішний вхід!");
        clearFields();
        setTimeout(() => navigate('/'), 500);
      } catch (error) {
        setMessage(error.message);
      }
    } else {
      if (password !== repeatPassword) {
        setMessage("Паролі не співпадають.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      
       
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      
        setMessage("Успішна реєстрація!");
        clearFields();
        setTimeout(() => navigate('/'), 500);
      } catch (error) {
        setMessage(error.message);
      }      
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
  
      setMessage("Успішний вхід через Google!");
      clearFields();
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      setMessage(error.message);
    }
  };  

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>{isLogin ? "Вхід" : "Реєстрація"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        {!isLogin && (
          <input
            type="password"
            placeholder="Повторіть пароль"
            required
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
          />
        )}<br />
        <button type="submit">
          {isLogin ? "Увійти" : "Зареєструватися"}
        </button>
      </form>

      <button onClick={handleGoogleLogin} style={{ marginTop: '10px' }}>
        Увійти через Google
      </button>

      <p style={{ marginTop: '10px' }}>
        {isLogin ? "Ще не маєте акаунта?" : "Вже маєте акаунт?"}
        <button onClick={() => setIsLogin(!isLogin)} style={{ marginLeft: '10px' }}>
          {isLogin ? "Зареєструватися" : "Увійти"}
        </button>
      </p>

      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
};

export default AuthForm;
