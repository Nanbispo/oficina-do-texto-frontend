import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
import iconeGlobo from '../../assets/world-wide-global.svg';

export function NovoArtigo() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  
  // Estados para o menu de Tags
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Referência para capturar o que for digitado na div editável
  const editorRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Refs para controlar intervalos de digitação e permitir cancelamento
  const titleTypingTimer = useRef<number | null>(null);
  const contentTypingTimer = useRef<number | null>(null);
  const restartTimer = useRef<number | null>(null);

  const stopTitleTyping = () => {
    if (titleTypingTimer.current !== null) {
      window.clearInterval(titleTypingTimer.current);
      titleTypingTimer.current = null;
    }
  };

  const stopContentTyping = () => {
    if (contentTypingTimer.current !== null) {
      window.clearInterval(contentTypingTimer.current);
      contentTypingTimer.current = null;
    }
  };

  // Animação de máquina de escrever para placeholder do título e do editor
  useEffect(() => {
    const titleText = 'Insira o título do seu novo artigo';
    const contentText = 'Oque iremos ensinar hoje?';

    const inputEl = titleInputRef.current;
    const editorEl = editorRef.current;

    const startTyping = () => {
      if (!inputEl || !editorEl) return;
      // só inicia se ambos campos estiverem vazios
      if (inputEl.value.trim() !== '' || editorEl.innerText.trim() !== '') return;

      stopTitleTyping();
      stopContentTyping();

      // título
      let ti = 1;
      inputEl.placeholder = '';
      titleTypingTimer.current = window.setInterval(() => {
        if (ti <= titleText.length) {
          inputEl.placeholder = titleText.slice(0, ti);
          ti++;
        } else {
          stopTitleTyping();
        }
      }, 40);

      // conteúdo
      let ci = 1;
      editorEl.setAttribute('data-placeholder', '');
      contentTypingTimer.current = window.setInterval(() => {
        if (ci <= contentText.length) {
          editorEl.setAttribute('data-placeholder', contentText.slice(0, ci));
          ci++;
        } else {
          stopContentTyping();
        }
      }, 50);
    };

    // iniciar imediatamente
    startTyping();

    // reiniciar a cada 10s se os campos ainda estiverem vazios
    restartTimer.current = window.setInterval(() => {
      const inEl = titleInputRef.current;
      const edEl = editorRef.current;
      if (!inEl || !edEl) return;
      const isTitleEmpty = inEl.value.trim() === '';
      const isContentEmpty = edEl.innerText.trim() === '';
      if (isTitleEmpty && isContentEmpty) {
        stopTitleTyping();
        stopContentTyping();
        startTyping();
      }
    }, 10000);

    const onInputInteraction = () => {
      stopTitleTyping();
    };
    const onEditorInteraction = () => {
      stopContentTyping();
    };

    inputEl?.addEventListener('focus', onInputInteraction);
    inputEl?.addEventListener('input', onInputInteraction);
    editorEl?.addEventListener('focus', onEditorInteraction);
    editorEl?.addEventListener('input', onEditorInteraction);

    return () => {
      stopTitleTyping();
      stopContentTyping();
      if (restartTimer.current !== null) {
        window.clearInterval(restartTimer.current);
        restartTimer.current = null;
      }

      inputEl?.removeEventListener('focus', onInputInteraction);
      inputEl?.removeEventListener('input', onInputInteraction);
      editorEl?.removeEventListener('focus', onEditorInteraction);
      editorEl?.removeEventListener('input', onEditorInteraction);

      if (inputEl) inputEl.placeholder = titleText;
      if (editorEl) editorEl.setAttribute('data-placeholder', contentText);
    };
  }, []);

  // Função mágica que aplica negrito, itálico, cor, etc. no texto selecionado
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Volta o foco para o texto para você continuar digitando
    editorRef.current?.focus(); 
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput)) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handlePublish = () => {
    // Captura o HTML gerado (com as tags <b>, <i>, <font color=>, etc)
    const contentHTML = editorRef.current?.innerHTML || '';
    
    console.log({ 
      title, 
      content: contentHTML, 
      tags 
    });
    alert('Artigo formatado pronto para envio! Olhe o console (F12).');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>
          PEGUE UM CAFÉ<br />E COMECE A ESCREVER
        </h1>
      </header>

      <main className={styles.editorSection}>
        <input 
          ref={titleInputRef}
          type="text" 
          className={styles.titleInput}
          placeholder=""
          value={title}
          onChange={(e) => { setTitle(e.target.value); stopTitleTyping(); }}
          onFocus={() => stopTitleTyping()}
        />

        <div className={styles.editorContainer}>
          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
              
              {/* Botão T - Abre o menu de Tags */}
              <div className={styles.tagWrapper}>
                <button 
                  className={styles.toolBtn} 
                  onClick={() => setShowTagMenu(!showTagMenu)}
                >
                  T
                </button>
                
                {/* O Menu Suspenso de Tags */}
                {showTagMenu && (
                  <div className={styles.tagDropdown}>
                    <p className={styles.tagDropdownTitle}>Adicionar Tags</p>
                    <div className={styles.tagInputRow}>
                      <input 
                        type="text" 
                        placeholder="Ex: Redação..." 
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        className={styles.tagDropdownInput}
                      />
                      <button onClick={handleAddTag} className={styles.tagAddBtn}>+</button>
                    </div>
                    <div className={styles.addedTags}>
                      {tags.map((t, idx) => (
                        <span key={idx} className={styles.miniTag}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botão B - Negrito */}
              <button className={styles.toolBtn} onClick={() => formatText('bold')}>
                B
              </button>
              
              {/* Botão I - Itálico */}
              <button className={styles.toolBtn} onClick={() => formatText('italic')}>
                I
              </button>
              
              {/* Botão U - Sublinhado */}
              <button 
                className={styles.toolBtn} 
                style={{ textDecoration: 'underline' }}
                onClick={() => formatText('underline')}
              >
                U
              </button>
              
              {/* Botão A - Cor (Um input disfarçado de botão) */}
              <label className={styles.toolBtn} style={{ borderBottom: '2px solid black', height: '24px', cursor: 'pointer' }}>
                A
                <input 
                  type="color" 
                  className={styles.hiddenColorPicker}
                  onChange={(e) => formatText('foreColor', e.target.value)}
                  title="Escolher cor do texto"
                />
              </label>

            </div>
          </div>
          
          {/* A mágica do contentEditable: Parece uma textarea, mas aceita formatação rica */}
          <div 
            className={styles.contentArea}
            contentEditable={true}
            ref={editorRef}
            data-placeholder="Comece a escrever..."
            suppressContentEditableWarning={true}
          />
        </div>

        <div className={styles.footerActions}>
          <button className={styles.publishButton} onClick={handlePublish}>
            <span className={styles.globeIcon}>
              <img src={iconeGlobo} alt="Globo" />
            </span>
            Publicar
          </button>
        </div>
      </main>
    </div>
  );
}