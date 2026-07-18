import { Link } from 'react-router-dom';
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
            // 👇 CORREÇÃO AQUI: Remove as tags HTML do conteúdo e faz o corte de caracteres de forma limpa
            const textoLimpo = (post.content || '').replace(/<[^>]*>/g, '');
            const resumo = textoLimpo.length > 140 ? `${textoLimpo.slice(0, 140)}...` : textoLimpo;

            // Tratamento preventivo caso o autor venha como objeto ou string do Go
            const nomeAutor = post.author && typeof post.author === 'object' 
              ? (post.author.name || post.author.username || 'Autor Desconhecido') 
              : (post.author || 'Autor Desconhecido');

            return (
              <Link
                key={post.id}
                to={`/artigo/${post.id}`}
                className={styles.cardLink}
                aria-label={`Abrir artigo ${post.title}`}
              >
                <article className={styles.card}>
                  
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                  </div>

                  {/* Agora exibe o texto puro e sem bugs visuais */}
                  <p className={styles.cardBody}>
                    {resumo}
                  </p>
                  
                  <div className={styles.cardAuthor}>
                    Autor:<br /><strong>{nomeAutor}</strong>
                  </div>

                  {/* LÓGICA DAS TAGS */}
                  <div className={styles.tagsRow}>
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span key={tag.id} className={styles.tag}>
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
              </Link>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        Todos os direitos reservados a Sara Menezes
      </footer>
    </div>
  );
}