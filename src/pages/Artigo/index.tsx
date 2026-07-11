import { useNavigate, useParams } from 'react-router-dom';
import { usePost } from '../../hooks/usePosts';
import styles from './style.module.css';
import arrow from '../../assets/Arrow 1.svg'

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('pt-BR');
}

export function Artigo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: artigo, isLoading, error } = usePost(id);

  if (isLoading) {
    return (
      <div className={styles.container} style={{ padding: '40px', textAlign: 'center' }}>
        Carregando artigo...
      </div>
    );
  }

  if (error || !artigo) {
    return (
      <div className={styles.container} style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        Erro ao carregar o artigo.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={arrow} alt="Editar" className={styles.arrow} />
           Artigos
        </button>
      </nav>

      <main className={styles.articleContent}>
        <h1 className={styles.title}>{artigo.title}</h1>

        <div className={styles.tagsContainer}>
          {artigo.tags?.map((tag) => (
            <span key={tag.id} className={styles.tag}>
              {tag.name}
            </span>
          ))}
        </div>

        <div
          className={styles.bodyText}
          dangerouslySetInnerHTML={{ __html: artigo.content }}
        />
      </main>

      <footer className={styles.footer}>
        <div className={styles.authorSection}>
          <span className={styles.footerLabel}>AUTOR</span>
          <strong className={styles.authorName}>{artigo.author}</strong>
        </div>

        <div className={styles.datesSection}>
          <div className={styles.dateBlock}>
            <span className={styles.footerLabel}>Data de criação</span>
            <span className={styles.dateValue}>{formatDate(artigo.createdAt)}</span>
          </div>
          <div className={styles.dateBlock}>
            <span className={styles.footerLabel}>Última atualização</span>
            <span className={styles.dateValue}>{formatDate(artigo.updatedAt)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
