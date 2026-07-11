import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts'; 
import styles from './style.module.css';
import lapisIcon from '../../assets/pen.svg'; 
import lixeiraIcon from '../../assets/trash.svg';




export function ArtigosCriadora() {
  const isCriadora = !!localStorage.getItem('@App:token');

  // Os dados já vêm perfeitos da API!
  const { data: posts = [], isLoading, error } = usePosts();
  const navigate = useNavigate();

  const openArticle = (id: number | string) => navigate(`/artigo/${id}`);

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
          {posts.map((post) => (
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
                      onClick={(event) => event.stopPropagation()}
                    >
                      <img src={lapisIcon} alt="Editar" className={styles.iconImage} />
                    </button>
                    <button
                      className={`${styles.actionIcon} ${styles.deleteBtn}`}
                      title="Excluir"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <img src={lixeiraIcon} alt="Excluir" className={styles.iconImage} />
                    </button>
                  </div>
                )}
              </div>

              <p className={styles.cardBody}>
                {post.content.length > 140 ? `${post.content}...` : post.content}
              </p>
              
              <div className={styles.cardAuthor}>
                Autor:<br /><strong>{post.author}</strong>
              </div>

              <div className={styles.tagsRow}>
                {post.tags?.slice(0, 2).map((tag) => (
                  <span key={tag.id} className={`${styles.tag} ${styles.tagDefault}`}>
                    {tag.name}
                  </span>
                ))}
              </div>

            </article>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        Todos os direitos reservados a Sara Loia de Menezes
      </footer>
    </div>
  );
}

// export function ArtigosCriadora() {
//   const navigate = useNavigate(); // Inicialize o navigate
//   // ...
  
//   // No seu botão "Novo Artigo", adicione o onClick:
//   <button 
//     className={styles.newArticleButton} 
//     onClick={() => navigate('/novo-artigo')}
//   >
//     Novo Artigo
//   </button>
// }
