# Projeto 02 — Carrinho de compras 

Este projeto simula o funcionamento de um carrinho de compras para uma loja virtual. O objetivo principal é aplicar conceitos práticos de **Estruturas de Dados** integrado a um ecossistema real de desenvolvimento, utilizando um backend em **Python (Flask)** e uma interface em **React.js**

## Funcionalidades Atuais 
- **Cadastro de Produtos:** Armazenamento dinâmico no backend mapeado por IDs autoincrementáveis.
- **Listagem com Filtros e Ordenação:** Busca por nome e ordenação por ordem alfabética ou preço (maior/menor).
- **Gerenciamento do Carrinho:** Adicionar itens, atualizar estoque em tempo real, remover quantidades parciais/totais e cálculo automático do resumo financeiro.
- **Finalização de Compra:** Histórico persistido em memória no backend.

## Estruturas de Dados Aplicadas

O backend foi construído utilizando:
- **Array:** A classe `ArrayProdutos` encapsula uma lista nativa do Python para indexação sequencial, busca linear por ID e manipulação de ordenação.
- **Dicionário**: O `Carrinho` armazena os produtos utilizando chaves mapeadas (`ìd_produto: quantidade`).

## Tecnologias Utilizadas 

### Backend 
- **Python 3**
- **Flask**

### Frontend
- **React.js**

---

## Como Executar

### 1. Configurando o Backend (Python)

Abra outro terminal e navegue até a pasta do backend:

```bash
cd backend
```

Instale as dependências necessárias:
```bash
pip install flask flask-cors
```

Execute o servidor Flask:
```bash
flask run --port=8000 --reload
```

### 2. Configurando o Frontend (React)

Navegue até a pasta do frontend:
```bash
cd frontend
```

Instale as depedências do npm:
```bash
npm install
```

Inicie o servidor de desenvolvimento: 
```bash
npm run dev
```

---

Integrantes do grupo: 
- Julia Caramori
- Izabella Araujo
