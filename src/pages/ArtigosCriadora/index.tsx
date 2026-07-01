import React from 'react';
import styles from './style.module.css';

export function ArtigosCriadora() {
  // Mantemos a mesma lógica inteligente: deteta se o token existe
  const isCriadora = !!localStorage.getItem('@App:token');

  const mockArticles = [
    { id: 1, title: 'Título', content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum' },
    { id: 2, title: 'Título', content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum' },
    { id: 3, title: 'Título', content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum' },
  ];

  return (
    <div className={styles.container}>
      {/* BANNER SUPERIOR */}
      <header className={styles.banner}>
        <div className={styles.gradientBadge}>
          Redação para Enem
        </div>
        
        {/* Só a criadora vê o botão de criar novos artigos */}
        {isCriadora && (
          <button className={styles.newArticleButton}>
            Novo Artigo
          </button>
        )}
      </header>

      {/* SEÇÃO DOS ARTIGOS */}
      <main className={styles.contentSection}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Artigos</h1>
          <button className={styles.filterButton}>░</button>
        </div>

        <div className={styles.grid}>
          {mockArticles.map((article) => (
            <article key={article.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                
                {/* Só a criadora tem acesso aos botões de edição e eliminação */}
                {isCriadora && (
                  <div className={styles.actionsGrid}>
                    <button className={`${styles.actionIcon} ${styles.editBtn}`} title="Editar">✏️</button>
                    <button className={`${styles.actionIcon} ${styles.deleteBtn}`} title="Excluir">🗑️</button>
                  </div>
                )}
              </div>

              <p className={styles.cardBody}>{article.content}</p>
              
              <div className={styles.cardAuthor}>
                Autor:<br /><strong>Sara Loia</strong>
              </div>

              <div className={styles.tagsRow}>
                <span className={`${styles.tag} ${styles.tagEnem}`}>Enem</span>
                <span className={`${styles.tag} ${styles.tagRedacao}`}>Redação</span>
                <span className={`${styles.tag} ${styles.tagMore}`}>+ 2</span>
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