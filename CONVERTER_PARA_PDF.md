# 📄 Como Converter a Proposta para PDF

## Opção 1: Usando Pandoc (Recomendado)

### Instalação
```bash
# Windows (usando Chocolatey)
choco install pandoc

# Ou baixe em: https://pandoc.org/installing.html
```

### Conversão
```bash
pandoc PROPOSTA_COMERCIAL_E-COMMERCE.md -o PROPOSTA_COMERCIAL_E-COMMERCE.pdf --pdf-engine=xelatex -V geometry:margin=1in
```

## Opção 2: Usando Markdown-PDF (Node.js)

### Instalação
```bash
npm install -g markdown-pdf
```

### Conversão
```bash
markdown-pdf PROPOSTA_COMERCIAL_E-COMMERCE.md
```

## Opção 3: Usando VS Code

1. Instale a extensão **"Markdown PDF"** no VS Code
2. Abra o arquivo `PROPOSTA_COMERCIAL_E-COMMERCE.md`
3. Clique com botão direito → "Markdown PDF: Export (pdf)"

## Opção 4: Usando Navegador (Mais Simples)

1. Abra o arquivo `PROPOSTA_COMERCIAL_E-COMMERCE.md` no VS Code
2. Clique com botão direito → "Open Preview" (ou pressione Ctrl+Shift+V)
3. Clique com botão direito na preview → "Open Preview to the Side"
4. Use Ctrl+P para imprimir → Escolha "Salvar como PDF"

## Opção 5: Usando Serviços Online

- [Markdown to PDF](https://www.markdowntopdf.com/)
- [Dillinger.io](https://dillinger.io/) - Exportar como PDF
- [StackEdit](https://stackedit.io/) - Exportar como PDF

---

## ⚠️ Antes de Converter

**Lembre-se de preencher:**
- [Data Atual] - Substitua pela data atual
- [VALOR] - Adicione o valor da proposta
- [seu-email@exemplo.com] - Seu email de contato
- [seu-whatsapp] - Seu WhatsApp
- [seu-site.com] - Seu site (se tiver)

---

## 📝 Dica Extra

Para uma versão HTML mais elaborada, você pode usar:
```bash
pandoc PROPOSTA_COMERCIAL_E-COMMERCE.md -o PROPOSTA_COMERCIAL_E-COMMERCE.html --standalone --css=style.css
```

E então imprimir o HTML como PDF no navegador.

