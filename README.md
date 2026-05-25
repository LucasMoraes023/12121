# Imperio Studio Automotivo - App Profissional

Aplicativo web e Android para agenda de servicos automotivos, camera por horario agendado, galeria individual e assistente de IA gratuita/local.

## Funcionalidades

- Agenda local de clientes, veiculos, servicos, datas e horarios.
- Galeria separada para cada horario agendado.
- Acesso a camera do celular via captura de imagem.
- Botao de WhatsApp para Lucas e Levi com mensagem pronta do agendamento.
- Assistente automotiva gratuita, sem token e sem API paga.
- PWA instalavel e projeto Capacitor para gerar APK.

## Como usar

### Desenvolvimento local

```bash
npm install
npm run dev
```

### Build web

```bash
npm run build
```

### APK Android

```bash
npm run build
npx cap sync android
cd android
gradlew.bat assembleDebug
```

O APK debug fica em `android/app/build/outputs/apk/debug/app-debug.apk`.

## Observacoes

- A IA funciona localmente com uma base de conhecimento interna, por isso nao precisa de chave paga.
- Os agendamentos e fotos ficam salvos no aparelho/navegador via `localStorage`.
- Para sincronizar dados entre varios celulares, sera necessario adicionar um banco online depois.
