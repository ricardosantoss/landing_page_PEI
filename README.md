# PEI Inteligente

Site estático completo para apresentar o projeto PEI Inteligente a instituições, reitorias, secretarias de educação, escolas e potenciais parceiros.

## Publicar no GitHub e Vercel

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. No Vercel, clique em **Add New Project**.
4. Importe o repositório do GitHub.
5. Mantenha as configurações padrão para projeto estático e publique.

O site não depende de instalação, build ou banco de dados. Ele usa apenas HTML, CSS, JavaScript simples e imagens locais.

## Ajustes recomendados antes do deploy final

- Troque `SEU-DOMINIO.vercel.app` pelo domínio real em `index.html`, `robots.txt` e `sitemap.xml`.
- Confirme se o link de WhatsApp do botão final deve continuar sendo o atual.
- Se usar domínio próprio, atualize o sitemap após configurar o domínio no Vercel.

## Estrutura

- `index.html`: conteúdo, SEO, navegação e seções do site.
- `styles.css`: layout, responsividade e identidade visual.
- `assets/`: imagens, logotipo e fotos da equipe.
- `vercel.json`: cabeçalhos e ajustes simples para publicação no Vercel.
