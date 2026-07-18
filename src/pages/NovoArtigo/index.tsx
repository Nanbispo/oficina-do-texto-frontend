import { useMemo, useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { type Tag } from '../../types';
import styles from './style.module.css';
import iconeGlobo from '../../assets/world-wide-global.svg';

export function NovoArtigo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Captura o ID do post caso esteja no modo edição (?edit=ID)
  const editPostId = searchParams.get('edit');
  const isEditing = !!editPostId;

  const [title, setTitle] = useState('');
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [activeCommands, setActiveCommands] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // --- BUSCA DE TAGS DISPONÍVEIS ---
  const { data: availableTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get<Tag[]>('/tags');
      return data;
    },
  });

  // --- SE ESTIVER EDITANDO: BUSCA OS DADOS DO POST ANTIGO ---
  const { data: postAntigo, isLoading: carregandoPostAntigo } = useQuery({
    queryKey: ['post', editPostId],
    queryFn: async () => {
      if (!editPostId) return null;
      const { data } = await api.get(`/posts/${editPostId}`);
      return data;
    },
    enabled: isEditing, // Só dispara a busca se houver ID de edição na URL
  });

  // --- EFEITO PARA PREENCHER O FORMULÁRIO COM OS DADOS DO BACKEND ---
  useEffect(() => {
    if (isEditing && postAntigo) {
      setTitle(postAntigo.title || '');
      
      if (editorRef.current) {
        editorRef.current.innerHTML = postAntigo.content || '';
      }
      
      if (postAntigo.tags) {
        setSelectedTags(postAntigo.tags);
      }
      
      // Para as animações de digitação se estiver editando
      stopTitleTyping();
      stopContentTyping();
    }
  }, [postAntigo, isEditing]);

  // --- MUTATION: SALVAR (CRIA OU ATUALIZA) ---
  const { mutateAsync: salvarArtigo, isPending: estaSalvando } = useMutation({
    mutationFn: async (postData: { 
      title: string; 
      content: string; 
      published: boolean; 
      tags: Array<{ id: number; name: string; title: string }> 
    }) => {
      if (isEditing) {
        // Se estiver editando, faz um PUT para atualizar o post específico
        const { data } = await api.put(`/posts/${editPostId}`, postData);
        return data;
      } else {
        // Se não, faz um POST tradicional para criar
        const { data } = await api.post('/posts', postData);
        return data;
      }
    },
    onSuccess: () => {
      alert(isEditing ? 'Artigo atualizado com sucesso!' : 'Artigo publicado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/artigos'); // Redireciona de volta para a lista após sucesso
    },
    onError: (error: any) => {
      console.error('Erro ao salvar artigo:', error);
      alert('Ocorreu um erro ao tentar salvar o artigo.');
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

  const getTagStyle = (index: number) => tagColorScheme[index % tagColorScheme.length];

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
    if (isEditing) return; // Não roda efeito de digitação automática no modo de edição

    const titleText = 'Insira o título do seu novo artigo';
    const contentText = 'O que iremos ensinar hoje?';

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
      if (inEl.value.trim() === '' && edEl.innerText.trim() === '') {
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
      if (restartTimer.current !== null) window.clearInterval(restartTimer.current);
      inputEl?.removeEventListener('focus', onInputInteraction);
      inputEl?.removeEventListener('input', onInputInteraction);
      editorEl?.removeEventListener('focus', onEditorInteraction);
      editorEl?.removeEventListener('input', onEditorInteraction);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isEditing]);

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
      queryClient.setQueryData<Tag[]>(['tags'], (old) => (old ? [...old, data] : [data]));
      setSelectedTags((current) => [...current, data]);
      setNewTagInput('');
    } catch (error) {
      alert('Não foi possível criar a tag.');
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

    await salvarArtigo({
      title: title,
      content: contentHTML,
      published: true, 
      tags: tagsFormatadas,
    });
  };

  if (isEditing && carregandoPostAntigo) {
    return <div className={styles.container} style={{ padding: '40px', textAlign: 'center' }}>Carregando dados do artigo...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>
          {isEditing ? 'EDITANDO SEU ARTIGO' : 'PEGUE UM CAFÉ\nE COMECE A ESCREVER'}
        </h1>
      </header>

      <main className={styles.editorSection}>
        <input 
          ref={titleInputRef}
          type="text" 
          className={styles.titleInput}
          placeholder={isEditing ? "" : "Título do artigo"}
          value={title}
          onChange={(e) => { setTitle(e.target.value); stopTitleTyping(); }}
          onFocus={() => stopTitleTyping()}
        />

        {selectedTags.length > 0 && (
          <div className={styles.selectedTagsContainer}>
            {selectedTags.map((tag, index) => (
              <div key={tag.id} className={styles.selectedTag} style={getTagStyle(index)}>
                <span>{tag.name || tag.title}</span>
                <button type="button" onClick={() => handleRemoveTag(tag.id)} className={styles.selectedTagRemove}>×</button>
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
                          <button key={tag.id} type="button" className={styles.suggestionItem} onClick={() => handleSelectTag(tag)}>
                            {tag.name || tag.title}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.noSuggestionsText}>
                        {newTagInput.trim() === '' ? 'Digite para ver tags.' : 'Nenhuma tag encontrada.'}
                      </p>
                    )}

                    {canCreateTag && (
                      <div className={styles.createTagSection}>
                        <button type="button" className={styles.createTagButton} onClick={handleCreateTag}>
                          Criar "{newTagInput.trim()}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="button" className={`${styles.toolBtn} ${activeCommands.bold ? styles.toolBtnActive : ''}`} onClick={() => formatText('bold')}>B</button>
              <button type="button" className={`${styles.toolBtn} ${activeCommands.italic ? styles.toolBtnActive : ''}`} onClick={() => formatText('italic')}>I</button>
              <button type="button" className={`${styles.toolBtn} ${activeCommands.underline ? styles.toolBtnActive : ''}`} style={{ textDecoration: 'underline' }} onClick={() => formatText('underline')}>U</button>
              
              <label className={`${styles.toolBtn} ${styles.colorToolBtn}`}>
                A
                <input type="color" className={styles.hiddenColorPicker} onChange={(e) => formatText('foreColor', e.target.value)} />
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
            disabled={estaSalvando}
          >
            <span className={styles.globeIcon}>
              <img src={iconeGlobo} alt="Globo" />
            </span>
            {estaSalvando ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Publicar'}
          </button>
        </div>
      </main>
    </div>
  );
}