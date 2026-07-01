import  { useState, type FormEvent } from 'react';
import { useLogin } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; 

// 1. Importamos o ficheiro CSS como se fosse um objeto JavaScript
import styles from './styles.module.css';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ username, password }, {
      onSuccess: () => {
        alert('Login efetuado com sucesso!');
        navigate('/dashboard');
      },
      onError: () => alert('Falha no login.')
    });
  };

  return (
    // 2. Usamos className={styles.nomeDaClasse} em vez de style={{...}}
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        
        <input 
          type="text" 
          placeholder="User"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

        <input 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button 
          type="submit" 
          disabled={isPending}
          className={styles.button}
        >
          {isPending ? 'Carregando...' : 'Login'}
        </button>

      </form>
    </div>
  );
}