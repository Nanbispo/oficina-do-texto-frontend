import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts'; 
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { type Tag } from '../../types';
import styles from '../ArtigosCriadora/style.module.css';

// Ícones simples em SVG inline para não precisar de dependências externas
const LupaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

export function Home() {
  const { data: posts = [], isLoading, error } = usePosts();

  // --- ESTADOS DE FILTRO E PESQUISA ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('recentes'); // 'recentes' ou 'antigos'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // --- BUSCA AS TAGS DO SISTEMA PARA O SELECT ---
  const { data: availableTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get<Tag[]>('/tags');
      return data;
    },
  });

  // --- LÓGICA DE FILTRAGEM COMBINADA (Título + Tag + Ordenação por Data) ---
  const filteredPosts = useMemo(() => {
    let resultado = [...posts];

    // 1. Filtro por Título (Barra de pesquisa)
    if (searchQuery.trim() !== '') {
      resultado = resultado.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filtro por Tag
    if (selectedTagFilter !== '') {
      resultado = resultado.filter((post) =>
        post.tags?.some((tag) => String(tag.id) === selectedTagFilter || tag.name === selectedTagFilter)
      );
    }

    // 3. Filtro/Ordenação por Data de Criação
    resultado.sort((a, b) => {
      const dataA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dataB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      return selectedDateFilter === 'recentes' ? dataB - dataA : dataA - dataB;
    });

    return resultado;
  }, [posts, searchQuery, selectedTagFilter, selectedDateFilter]);

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
  
  {/* ÁREA DE FILTROS E PESQUISA ESTILIZADA */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
    
    {/* Componente da Barra de Pesquisa Deslizante */}
    <div className={`${styles.searchContainer} ${searchOpen ? styles.searchContainerActive : ''}`}>
      <input
        type="text"
        placeholder="Buscar por título..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`${styles.searchInput} ${searchOpen ? styles.searchInputActive : ''}`}
        autoFocus={searchOpen}
      />
      <button 
        onClick={() => {
          setSearchOpen(!searchOpen);
          if (searchOpen) setSearchQuery(''); // Limpa a busca ao fechar
        }} 
        className={styles.searchIconButton}
        title="Pesquisar por título"
      >
        <LupaIcon />
      </button>
    </div>

    {/* Botão do Filtro Avançado */}
    <button 
      className={styles.filterButton} 
      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
      title="Filtrar artigos"
    >
      <FilterIcon />
    </button>

    {/* Menu Dropdown Suspenso dos Filtros */}
    {showFilterDropdown && (
      <div className={styles.filterDropdown}>
        
        {/* Filtro por Tag */}
        <div className={styles.filterGroup}>
          <label>Filtrar por Tag:</label>
          <select 
            value={selectedTagFilter} 
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas as tags</option>
            {availableTags.map((tag) => (
              <option key={tag.id} value={String(tag.id)}>
                {tag.name || tag.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Data */}
        <div className={styles.filterGroup}>
          <label>Ordenar por Data:</label>
          <select 
            value={selectedDateFilter} 
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="recentes">Mais recentes primeiro</option>
            <option value="antigos">Mais antigos primeiro</option>
          </select>
        </div>

        {/* Botão de Limpar Filtros */}
        {(selectedTagFilter || selectedDateFilter !== 'recentes') && (
          <button
            onClick={() => {
              setSelectedTagFilter('');
              setSelectedDateFilter('recentes');
            }}
            className={styles.clearFilterBtn}
          >
            Limpar Filtros
          </button>
        )}
      </div>
    )}

  </div>
</div>

        {/* --- GRID DE ARTIGOS FILTRADOS --- */}
        <div className={styles.grid}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const textoLimpo = (post.content || '').replace(/<[^>]*>/g, '');
              const resumo = textoLimpo.length > 140 ? `${textoLimpo.slice(0, 140)}...` : textoLimpo;

              const nomeAutor = post.author && typeof post.author === 'object' 
                ? ((post.author as any).name || (post.author as any).username || 'Autor Desconhecido') 
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

                    <p className={styles.cardBody}>
                      {resumo}
                    </p>
                    
                    <div className={styles.cardAuthor}>
                      Autor:<br /><strong>{nomeAutor}</strong>
                    </div>

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
            })
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Nenhum artigo encontrado com os filtros selecionados.
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        Todos os direitos reservados a Sara Menezes
      </footer>
    </div>
  );
}