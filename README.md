# PEI Inteligente

Site estático completo para apresentar o projeto PEI Inteligente a instituições, reitorias, secretarias de educação, escolas e potenciais parceiros.

## Publicar no GitHub e Vercel

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta para o repositório.
3. No Vercel, clique em **Add New Project**.
4. Importe o repositório do GitHub.
5. Mantenha as configurações padrão para projeto estático e publique.

O site não depende de instalação, build ou banco de dados. Ele usa apenas HTML, CSS, JavaScript simples e imagens locais.

## Ajustar as fotos da equipe sem editar código

1. Abra o site e vá até a seção **Equipe**.
2. Clique em **Ajustar enquadramento das fotos**.
3. Arraste cada foto para os lados ou para cima e para baixo.
4. Use os botões **+** e **−** para controlar o zoom entre 50% e 400%.
5. Os ajustes ficam salvos automaticamente no navegador em que foram feitos.
6. Quando terminar, clique em **Baixar configuração para o site**.
7. Substitua o arquivo `photo-settings.json` do repositório pelo arquivo baixado e faça o novo deploy.

Assim, o enquadramento escolhido passa a ser o padrão para todos os visitantes. O botão **Restaurar** retorna apenas uma foto ao padrão; **Restaurar todas** retorna a equipe inteira.

## Ajustes recomendados antes do deploy final

- Confirme o domínio real do deploy em `index.html` (og:url e JSON-LD), `robots.txt` e `sitemap.xml` — atualmente configurado como `pei-inteligente.vercel.app`.
- Confirme se o link de WhatsApp do botão final deve continuar sendo o atual.
- Se usar domínio próprio, atualize o sitemap após configurar o domínio no Vercel.

## Estrutura

- `index.html`: conteúdo, SEO, navegação e seções do site.
- `styles2.css`: layout, responsividade e identidade visual.
- `photo-editor.js`: controles de zoom, arraste, salvamento e exportação das fotos.
- `photo-settings.json`: enquadramentos padrão usados no deploy.
- `assets/`: imagens, logotipo e fotos da equipe.
- `vercel.json`: cabeçalhos e ajustes simples para publicação no Vercel.
