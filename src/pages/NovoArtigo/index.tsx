import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  world  from '../../assets/world-wide-global.svg';
import styles from './style.module.css';

export function NovoArtigo() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePublish = () => {
    console.log({ title, content });
    // Aqui faremos a chamada para o seu back-end em Go futuramente
    alert('Artigo pronto para ser enviado ao Go!');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>
          PEGUE UM CAFÉ<br />E COMECE A ESCREVER
        </h1>
      </header>

      <main className={styles.editorSection}>
        {/* Campo de Título */}
        <input 
          type="text" 
          className={styles.titleInput}
          placeholder="Insira o título do seu novo artigo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Área do Editor */}
        <div className={styles.editorContainer}>
          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
              <button className={styles.toolBtn}>T</button>
              <button className={styles.toolBtn}>B</button>
              <button className={styles.toolBtn}>I</button>
              <button className={styles.toolBtn} style={{ textDecoration: 'underline' }}>U</button>
              <button className={styles.toolBtn} style={{ borderBottom: '2px solid black', height: '24px' }}>A</button>
            </div>
          </div>
          
          <textarea 
            className={styles.contentArea}
            placeholder="Comece a escrever..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles.footerActions}>
          <button className={styles.publishButton} onClick={handlePublish}>
            <span className={styles.globeIcon}>
              <img src={world} alt="Globo" />
            </span>
            Publicar
          </button>
        </div>
      </main>
    </div>
  );
}