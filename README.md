# Biblioteca: app mobile (React Native + Expo)

Sistema de Gerenciamento de Biblioteca (DRS): livros, leitores, empréstimos, devoluções e atrasos.

## Ver o app funcionando (sem instalar nada)
Versão web publicada automaticamente pelo GitHub Pages:
**https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/**

Login do bibliotecário (demonstração): `admin` / `admin123`

Dica: no navegador, aperte F12 e ative o modo dispositivo (Ctrl+Shift+M) para ver no formato de celular.

## Rodar o código (Node.js LTS)
```
npm install
npx expo start          # celular: app Expo Go (conta gratuita em expo.dev) ou tecla "a" para emulador
npm run web             # navegador
```

## Arquitetura (MVVM simplificado)
- `src/useLibrary.js` ViewModel: estado e regras de negócio (RN02 a RN06), sem UI.
- `src/storage.js` persistência local assíncrona (AsyncStorage).
- `src/screens/*` e `src/Items.js` Views: só exibem dados e chamam o ViewModel.

## Otimizações aplicadas
- `FlatList` (recicla itens) + `React.memo` nos itens + `useCallback`/`useMemo`.
- Índice de busca normalizado calculado 1 vez por mudança de dados + debounce de 250 ms.
- Persistência assíncrona, dados offline e timers limpos no `useEffect`.

## Medir desempenho (antes vs. depois)
Aba Ajustes: "Gerar 5.000 livros de teste" e a chave "Lista otimizada (FlatList)".
No celular, abra o menu de desenvolvedor > "Show Performance Monitor" (FPS e RAM).
