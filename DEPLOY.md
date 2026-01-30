# 🚀 Guia de Deploy no GitHub Pages

## 📋 Pré-requisitos

1. **Repositório no GitHub**: O código deve estar em um repositório GitHub
2. **Configurações do repositório**:
   - Vá em `Settings` → `Pages`
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` / `/ (root)`

## 🔧 Configurações Implementadas

### ✅ Nuxt.js para GitHub Pages
- **SSG habilitado** (`ssr: false`)
- **BaseURL configurado** (`baseURL: '/gabebet/'`)
- **Arquivo `.nojekyll`** para desabilitar Jekyll
- **Scripts de deploy** no `package.json`

### ✅ GitHub Actions
- **Workflow automático** (`.github/workflows/deploy.yml`)
- **Testes automatizados** antes do deploy
- **Cache de dependências** para builds mais rápidas
- **Deploy automático** na branch `gh-pages`

## 🚀 Deploy Automático (Recomendado)

### 1. Push para o GitHub
```bash
git remote add origin https://github.com/gabecmelo/gabebet.git
git branch -M main
git push -u origin main
```

### 2. Ativar GitHub Pages
1. Vá em `Settings` → `Pages`
2. Source: `Deploy from a branch`
3. Branch: `gh-pages` / `/ (root)`
4. Save

### 3. Aguardar Deploy
- O GitHub Actions executará automaticamente
- Verifique em `Actions` tab do repositório
- Site estará disponível em: `https://gabecmelo.github.io/gabebet/`

## 🛠️ Deploy Manual (Alternativo)

Se preferir fazer deploy manual:

```bash
# Instalar dependências
pnpm install

# Gerar build estático
pnpm generate

# Deploy manual
pnpm deploy
```

## 🔍 Verificações

### Antes do Deploy
```bash
# Executar testes
pnpm test

# Build local para testar
pnpm generate
pnpm preview
```

### Após o Deploy
- ✅ Site acessível em `https://gabecmelo.github.io/gabebet/`
- ✅ Navegação funcionando corretamente
- ✅ Assets carregando (CSS, JS, imagens)
- ✅ Roteamento SPA funcional

## 🐛 Solução de Problemas

### Problema: Assets não carregam
**Solução**: Verificar se `baseURL: '/gabebet/'` está correto

### Problema: 404 em rotas
**Solução**: GitHub Pages foi configurado corretamente para SPA

### Problema: Build falha
**Solução**: Verificar logs no GitHub Actions e executar `pnpm test` localmente

## 📊 Monitoramento

- **GitHub Actions**: Monitore builds em tempo real
- **GitHub Pages**: Status em Settings → Pages
- **Logs**: Disponíveis na aba Actions do repositório

## 🎯 URL Final

Seu projeto estará disponível em:
**https://gabecmelo.github.io/gabebet/**

---

*Configuração implementada seguindo as melhores práticas para GitHub Pages com Nuxt 4*