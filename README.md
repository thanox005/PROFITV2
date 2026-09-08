# FITPRO 2.0

Aplicativo web/mobile de diário alimentar, preparado para GitHub Pages e instalação como PWA.

## Publicação
1. Envie `index.html`, `manifest.json`, `sw.js` e `icon.svg` para um repositório GitHub.
2. Ative GitHub Pages para a branch principal e pasta `/ (root)`.
3. Abra a URL HTTPS gerada.
4. No celular, use o menu do navegador para adicionar à tela inicial.

## Offline
Depois de carregado pelo menos uma vez via HTTPS, o Service Worker mantém os arquivos do aplicativo em cache. Os dados do usuário continuam no armazenamento local do navegador/app.

## Testes realizados
- Estrutura HTML: 1 `html`, 1 `head`, 1 `body`, scripts balanceados.
- IDs duplicados: nenhum.
- Referências `$()` sem elemento: nenhuma.
- JavaScript: validado com `node --check`.
- Botões sem `type`: corrigidos para `type=button`.
