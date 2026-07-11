import { usePosts } from '../../hooks/usePosts'; 
// Reutilizamos EXATAMENTE o mesmo CSS da página da criadora para manter o padrão
import styles from '../ArtigosCriadora/style.module.css';

export function Home() {
  // Busca os artigos perfeitamente do Go, igual à tela da criadora
  const { data: posts = [], isLoading, error } = usePosts();

  if (isLoading) {
    return <div className={styles.container} style={{ padding: '40px', textAlign: 'center' }}>Carregando artigos...</div>;
  }

  if (error) {
    return <div className={styles.container} style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Erro ao carregar os artigos.</div>;
  }

  return (
    <div className={styles.container}>
      
      <header className={styles.banner}>
        <div className={styles.gradientBadge}>Redação para Enem</div>
        {/* Botão de "Novo Artigo" removido para os visitantes */}
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
                <h2 className={styles.cardTitle}>{post.title}</h2>
                {/* Lápis e Lixeira removidos para os visitantes */}
              </div>

              <p className={styles.cardBody}>
                {post.content.length > 140 ? `${post.content}...` : post.content}
              </p>
              
              <div className={styles.cardAuthor}>
                Autor:<br /><strong>{post.author}</strong>
              </div>

              {/* LÓGICA DAS TAGS: Mostra as 2 primeiras e conta o resto */}
              <div className={styles.tagsRow}>
                {post.tags?.slice(0, 2).map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
                
                {/* Se houver mais de 2 tags, renderiza o botão cinza com a diferença */}
                {post.tags && post.tags.length > 2 && (
                  <span className={styles.tagCounter}>
                    +{post.tags.length - 2}
                  </span>
                )}
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
