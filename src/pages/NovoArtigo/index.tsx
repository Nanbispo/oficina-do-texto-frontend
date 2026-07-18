import { useMemo, useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '../../api/client';
import { type Tag } from '../../types';
import styles from './style.module.css';
import iconeGlobo from '../../assets/world-wide-global.svg';

export function NovoArtigo() {
  const [title, setTitle] = useState('');
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [activeCommands, setActiveCommands] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const queryClient = useQueryClient();

  // --- BUSCA DE TAGS (GET /tags - Sem autenticação conforme doc) ---
  const { data: availableTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get<Tag[]>('/tags');
      return data;
    },
  });

  // --- MUTATION AJUSTADA COM A TIPAGEM CORRETA DOS OBJETOS DE TAGS ---
  const { mutateAsync: publicarArtigo, isPending: estaPublicando } = useMutation({
    mutationFn: async (novoPost: { 
      title: string; 
      content: string; 
      published: boolean; 
      tags: Array<{ id: number; name: string; title: string }> // Corrigido aqui para aceitar objetos
    }) => {
      const { data } = await api.post('/posts', novoPost);
      return data;
    },
    onSuccess: () => {
      alert('Artigo publicado com sucesso!');
      setTitle('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      setSelectedTags([]);
    },
    onError: (error: any) => {
      console.error('Erro ao publicar artigo:', error);
      if (error.response?.status === 401) {
        alert('Sua sessão expirou ou você não está autenticado. Faça login novamente.');
      } else if (error.response?.status === 404) {
        alert('Rota de publicação não encontrada no servidor (Erro 404). Verifique a URL base.');
      } else {
        alert('Ocorreu um erro ao tentar publicar o artigo.');
      }
    },
  });

  const normalizedInput = newTagInput.trim().toLowerCase();
  
  const filteredTagSuggestions = useMemo(
    () =>
      availableTags
        .filter((tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id))
        .filter((tag) => tag.name.toLowerCase().includes(normalizedInput)),
    [availableTags, normalizedInput, selectedTags],
  );

  const existingTagMatch = availableTags.find(
    (tag) => tag.name.toLowerCase() === normalizedInput,
  );

  const canCreateTag = normalizedInput !== '' && !existingTagMatch;

  const tagColorScheme = [
    { backgroundColor: '#310062', color: '#ffffff' },
    { backgroundColor: '#5a00a3', color: '#ffffff' },
    { backgroundColor: '#f4057d', color: '#ffffff' },
    { backgroundColor: '#f66dba', color: '#ffffff' },
    { backgroundColor: '#fab6db', color: '#310062' },
    { backgroundColor: '#f8e6f2', color: '#310062' },
  ];

  const getTagStyle = (index: number) =>
    tagColorScheme[index % tagColorScheme.length];

  const editorRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const titleText = 'Insira o título do seu novo artigo';
    const contentText = 'Oque iremos ensinar hoje?';

    const inputEl = titleInputRef.current;
    const editorEl = editorRef.current;

    const startTyping = () => {
      if (!inputEl || !editorEl) return;
      if (inputEl.value.trim() !== '' || editorEl.innerText.trim() !== '') return;

      stopTitleTyping();
      stopContentTyping();

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

    startTyping();

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

    const onInputInteraction = () => stopTitleTyping();
    const onEditorInteraction = () => stopContentTyping();

    inputEl?.addEventListener('focus', onInputInteraction);
    inputEl?.addEventListener('input', onInputInteraction);
    editorEl?.addEventListener('focus', onEditorInteraction);
    editorEl?.addEventListener('input', onEditorInteraction);

    const handleSelectionChange = () => {
      if (document.activeElement === editorEl) {
        updateActiveCommands();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

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
      document.removeEventListener('selectionchange', handleSelectionChange);

      if (inputEl) inputEl.placeholder = titleText;
      if (editorEl) editorEl.setAttribute('data-placeholder', contentText);
    };
  }, []);

  const updateActiveCommands = () => {
    setActiveCommands({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveCommands();
    editorRef.current?.focus(); 
  };

  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.some((selectedTag) => selectedTag.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setNewTagInput('');
  };

  const handleCreateTag = async () => {
    const name = newTagInput.trim();
    if (name === '' || existingTagMatch) return;

    try {
      const { data } = await api.post<Tag>('/tags', { name });
      queryClient.setQueryData<Tag[]>(['tags'], (old) =>
        old ? [...old, data] : [data],
      );
      setSelectedTags((current) => [...current, data]);
      setNewTagInput('');
    } catch (error: any) {
      console.error('Erro ao criar tag:', error);
      if (error.response?.status === 401) {
        alert('Sua sessão expirou ou você não tem permissão para criar tags. Faça login novamente.');
      } else if (error.response?.status === 400) {
        alert('Não foi possível criar. O nome da tag não pode estar vazio.');
      } else {
        alert('Não foi possível criar a tag.');
      }
    }
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags((current) => current.filter((tag) => tag.id !== tagId));
  };

  const handlePublish = async () => {
    const contentHTML = editorRef.current?.innerHTML || '';

    if (!title.trim()) {
      alert('Por favor, insira um título antes de publicar.');
      titleInputRef.current?.focus();
      return;
    }

    if (!editorRef.current?.innerText.trim()) {
      alert('Por favor, digite o conteúdo do seu artigo.');
      editorRef.current?.focus();
      return;
    }

    const tagsFormatadas = selectedTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      title: tag.name
    }));

    await publicarArtigo({
      title: title,
      content: contentHTML,
      published: true, 
      tags: tagsFormatadas,
    });
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

        {selectedTags.length > 0 && (
          <div className={styles.selectedTagsContainer}>
            {selectedTags.map((tag, index) => (
              <div
                key={tag.id}
                className={styles.selectedTag}
                style={getTagStyle(index)}
              >
                <span>{tag.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className={styles.selectedTagRemove}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.editorContainer}>
          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
              
              <div className={styles.tagWrapper}>
                <button 
                  type="button"
                  className={`${styles.toolBtn} ${showTagMenu ? styles.toolBtnActive : ''}`}
                  aria-pressed={showTagMenu}
                  onClick={() => setShowTagMenu(!showTagMenu)}
                >
                  T
                </button>
                
                {showTagMenu && (
                  <div className={styles.tagDropdown}>
                    <p className={styles.tagDropdownTitle}>Adicionar tags ao post</p>
                    <div className={styles.tagInputRow}>
                      <input 
                        type="text" 
                        placeholder="Ex: redação..." 
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        className={styles.tagDropdownInput}
                      />
                    </div>

                    {filteredTagSuggestions.length > 0 ? (
                      <div className={styles.suggestionList}>
                        {filteredTagSuggestions.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            className={styles.suggestionItem}
                            onClick={() => handleSelectTag(tag)}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.noSuggestionsText}>
                        {newTagInput.trim() === ''
                          ? 'Digite para ver tags existentes.'
                          : 'Nenhuma tag encontrada.'}
                      </p>
                    )}

                    {canCreateTag && (
                      <div className={styles.createTagSection}>
                        <button
                          type="button"
                          className={styles.createTagButton}
                          onClick={handleCreateTag}
                        >
                          Criar "{newTagInput.trim()}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`${styles.toolBtn} ${activeCommands.bold ? styles.toolBtnActive : ''}`}
                onClick={() => formatText('bold')}
                aria-pressed={activeCommands.bold}
              >
                B
              </button>
              
              <button
                type="button"
                className={`${styles.toolBtn} ${activeCommands.italic ? styles.toolBtnActive : ''}`}
                onClick={() => formatText('italic')}
                aria-pressed={activeCommands.italic}
              >
                I
              </button>
              
              <button 
                type="button"
                className={`${styles.toolBtn} ${activeCommands.underline ? styles.toolBtnActive : ''}`} 
                style={{ textDecoration: 'underline' }}
                onClick={() => formatText('underline')}
                aria-pressed={activeCommands.underline}
              >
                U
              </button>
              
              <label className={`${styles.toolBtn} ${styles.colorToolBtn}`}>
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
          
          <div 
            className={styles.contentArea}
            contentEditable={true}
            ref={editorRef}
            data-placeholder="Comece a escrever..."
            suppressContentEditableWarning={true}
          />
        </div>

        <div className={styles.footerActions}>
          <button 
            type="button"
            className={styles.publishButton} 
            onClick={handlePublish}
            disabled={estaPublicando}
          >
            <span className={styles.globeIcon}>
              <img src={iconeGlobo} alt="Globo" />
            </span>
            {estaPublicando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </main>
    </div>
  );
}