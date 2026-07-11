import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './style.module.css';

export function Artigo() {
  const navigate = useNavigate();
  //const { id } = useParams(); // Pega o ID da URL

  // Simulando os dados que viriam do Go baseados na sua imagem
  const mockArtigo = {
    title: "A Independência do Brasil",
    tags: ["Brasil", "História", "Enem", "Redação", "Texto", "Teste"],
    // Aqui usamos uma string HTML simulando o que o nosso editor gerou
    content: `
      <p>A Independência do Brasil foi um dos acontecimentos mais importantes da história nacional, pois marcou o fim do domínio colonial português e o início da formação do Brasil como uma nação soberana. Esse processo ocorreu oficialmente em 7 de setembro de 1822, quando Dom Pedro I proclamou a independência às margens do rio Ipiranga, em São Paulo. No entanto, a conquista de autonomia não foi um evento isolado, mas sim o resultado de diversos fatores políticos, econômicos e sociais que se desenvolveram ao longo de vários anos.</p>
      <br/>
      <p>Durante mais de três séculos, o Brasil foi uma colônia de Portugal. Nesse período, a economia brasileira era voltada principalmente para atender aos interesses da metrópole, fornecendo produtos como açúcar, ouro, algodão e café. As decisões políticas eram tomadas em Lisboa, e a população brasileira possuía pouca autonomia para definir os rumos do território. Esse modelo colonial começou a ser questionado no final do século XVIII e início do século XIX, influenciado pelos ideais iluministas e pelos movimentos de independência que ocorreram em outras partes do mundo, como nos Estados Unidos e em diversas colônias da América Espanhola.</p>
      <br/>
      <p>Um dos acontecimentos que acelerou o processo de independência foi a transferência da corte portuguesa para o Brasil, em 1808. A mudança ocorreu devido às invasões napoleônicas em Portugal. Com a chegada da família real ao Rio de Janeiro, o Brasil passou a ocupar uma posição de maior importância dentro do Império Português. Diversas mudanças foram implementadas, como a abertura dos portos às nações amigas, a criação de instituições públicas, bibliotecas, escolas militares e órgãos administrativos.</p>
    `,
    author: "Sara Menezes",
    createdAt: "02/10/2023",
    updatedAt: "15/10/2023"
  };

  return (
    <div className={styles.container}>
      
      {/* Botão de Voltar */}
      <nav className={styles.navBar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          &lt; Artigos
        </button>
      </nav>

      <main className={styles.articleContent}>
        {/* Título */}
        <h1 className={styles.title}>{mockArtigo.title}</h1>

        {/* Tags */}
        <div className={styles.tagsContainer}>
          {mockArtigo.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* Corpo do Texto - Aqui a mágica acontece para renderizar o HTML do editor */}
        <div 
          className={styles.bodyText}
          dangerouslySetInnerHTML={{ __html: mockArtigo.content }}
        />
      </main>

      {/* Rodapé do Artigo */}
      <footer className={styles.footer}>
        <div className={styles.authorSection}>
          <span className={styles.footerLabel}>AUTOR</span>
          <strong className={styles.authorName}>{mockArtigo.author}</strong>
        </div>
        
        <div className={styles.datesSection}>
          <div className={styles.dateBlock}>
            <span className={styles.footerLabel}>Data de criação</span>
            <span className={styles.dateValue}>{mockArtigo.createdAt}</span>
          </div>
          <div className={styles.dateBlock}>
            <span className={styles.footerLabel}>Última atualização</span>
            <span className={styles.dateValue}>{mockArtigo.updatedAt}</span>
          </div>
        </div>
      </footer>
      
    </div>
  );
}