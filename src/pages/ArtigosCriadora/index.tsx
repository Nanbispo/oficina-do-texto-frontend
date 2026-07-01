import React from 'react';
import { usePosts } from '../../hooks/usePosts'; 
import styles from './style.module.css';
import lapisIcon from '../../assets/pen.svg'; 
import lixeiraIcon from '../../assets/trash.svg';

export function ArtigosCriadora() {
  const isCriadora = !!localStorage.getItem('@App:token');

  // Os dados já vêm perfeitos da API!
  const { data: posts = [], isLoading, error } = usePosts();

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
        {isCriadora && <button className={styles.newArticleButton}>Novo Artigo</button>}
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
            <article key={post.id} className={styles.card}>
              
              <div className={styles.cardHeader}>
                {/* Nome correto do json: title */}
                <h2 className={styles.cardTitle}>{post.title}</h2>
                
                {isCriadora && (
                  <div className={styles.actionsGrid}>
                    <button className={`${styles.actionIcon} ${styles.editBtn}`} title="Editar">
                      <img src={lapisIcon} alt="Editar" className={styles.iconImage} />
                    </button>
                    <button className={`${styles.actionIcon} ${styles.deleteBtn}`} title="Excluir">
                      <img src={lixeiraIcon} alt="Excluir" className={styles.iconImage} />
                    </button>
                  </div>
                )}
              </div>

              {/* Nome correto do json: content */}
              <p className={styles.cardBody}>
                {post.content.length > 140 ? `${post.content.substring(0, 140)}...` : post.content}
              </p>
              
              {/* Nome correto do json: author */}
              <div className={styles.cardAuthor}>
                Autor:<br /><strong>{post.author}</strong>
              </div>

              {/* O Go já entrega o array de tags, é só mapear */}
              <div className={styles.tagsRow}>
                {post.tags?.map((tag) => (
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