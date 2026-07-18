import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts'; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import styles from './style.module.css';
import lapisIcon from '../../assets/pen.svg'; 
import lixeiraIcon from '../../assets/trash.svg';

export function ArtigosCriadora() {
  const isCriadora = !!localStorage.getItem('@App:token');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Os dados já vêm perfeitos da API!
  const { data: posts = [], isLoading, error } = usePosts();

  // --- MUTATION PARA EXCLUIR POST (DELETE /posts/:id) ---
  const { mutateAsync: excluirPost } = useMutation({
    mutationFn: async (id: number | string) => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      alert('Artigo excluído com sucesso!');
      // Invalida o cache para recarregar a lista de posts atualizada da API
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) => {
      console.error('Erro ao excluir artigo:', err);
      alert('Não foi possível excluir o artigo. Verifique suas permissions.');
    }
  });

  const openArticle = (id: number | string) => navigate(`/artigo/${id}`);

  // --- FUNÇÃO QUE CHAMA A EXCLUSÃO ---
  const handleDeleteClick = async (event: React.MouseEvent, id: number | string, title: string) => {
    event.stopPropagation(); // Impede de abrir o artigo ao clicar no botão
    
    const confirmou = window.confirm(`Tem certeza que deseja excluir o artigo "${title}"?`);
    if (confirmou) {
      await excluirPost(id);
    }
  };

  // --- FUNÇÃO QUE REDIRECIONA PARA A EDIÇÃO ---
  const handleEditClick = (event: React.MouseEvent, id: number | string) => {
    event.stopPropagation(); // Impede de abrir o artigo ao clicar no botão
    // Redireciona para a rota passando o id do artigo para edição
    navigate(`/novo-artigo?edit=${id}`);
  };

  if (isLoading) {
    return <div className={styles.container} style={{ padding: '40px', textAlign: 'center' }}>Carregando artigos...</div>;
  }

  if (error) {
    return <div className={styles.container} style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Erro ao conectar com a API.</div>;
  }

  return (
    <div className={styles.container}>
      
      <header className={styles.banner}>
        <div className={styles.gradientBadge}>Redação para Enem</div>
        {isCriadora && <button className={styles.newArticleButton} onClick={() => navigate('/novo-artigo')}>Novo Artigo</button>}
      </header>

      <main className={styles.contentSection}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Artigos</h1>
          <button className={styles.filterButton}>
            <span className={styles.filterLine}></span>
            <span className={styles.filterLine}></span>
            <span className={styles.filterLine}></span>
          </button>
        </div>

        <div className={styles.grid}>
          {posts.map((post) => {
            // 👇 CORREÇÃO: Limpa de vez as tags e corta a string com segurança
            const textoLimpo = (post.content || '').replace(/<[^>]*>/g, '');
            const resumo = textoLimpo.length > 140 ? `${textoLimpo.slice(0, 140)}...` : textoLimpo;

            // Tratamento preventivo para o autor
            const nomeAutor = post.author && typeof post.author === 'object' 
              ? (post.author.name || post.author.username || 'Autor Desconhecido') 
              : (post.author || 'Autor Desconhecido');

            return (
              <article
                key={post.id}
                className={styles.card}
                role="button"
                tabIndex={0}
                onClick={() => openArticle(post.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openArticle(post.id);
                  }
                }}
                aria-label={`Abrir artigo ${post.title}`}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{post.title}</h2>

                  {isCriadora && (
                    <div className={styles.actionsGrid}>
                      <button
                        className={`${styles.actionIcon} ${styles.editBtn}`}
                        title="Editar"
                        onClick={(event) => handleEditClick(event, post.id)}
                      >
                        <img src={lapisIcon} alt="Editar" className={styles.iconImage} />
                      </button>
                      <button
                        className={`${styles.actionIcon} ${styles.deleteBtn}`}
                        title="Excluir"
                        onClick={(event) => handleDeleteClick(event, post.id, post.title)}
                      >
                        <img src={lixeiraIcon} alt="Excluir" className={styles.iconImage} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Agora renderizando a constante 'resumo' 100% livre de códigos HTML */}
                <p className={styles.cardBody}>
                  {resumo}
                </p>
                
                <div className={styles.cardAuthor}>
                  Autor:<br /><strong>{nomeAutor}</strong>
                </div>

                <div className={styles.tagsRow}>
                  {post.tags?.slice(0, 2).map((tag) => (
                    <span key={tag.id} className={`${styles.tag} ${styles.tagDefault}`}>
                      {tag.name || tag.title}
                    </span>
                  ))}
                  
                  {post.tags && post.tags.length > 2 && (
                    <span className={styles.tagCounter}>
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>

              </article>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        Todos os direitos reservados a Sara Loia de Menezes
      </footer>
    </div>
  );
}