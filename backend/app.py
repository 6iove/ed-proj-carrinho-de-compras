from flask import Flask, request, jsonify
from flask_cors import CORS

class Produto:
    def __init__(self, id, nome, preco, quantidade):
        self.id = id
        self.nome = nome
        self.preco = preco
        self.quantidade = quantidade

class ArrayProdutos:
    def __init__(self):
        self.produtos = []
        self.proximo_id = 1

    def cadastrar_produto(self, nome, preco, quantidade):
        produto = Produto(self.proximo_id, nome, preco, quantidade)
        self.produtos.append(produto)
        self.proximo_id += 1
        return {"id": produto.id, "nome": produto.nome, "preco": produto.preco, "quantidade": produto.quantidade}

    def listar_produtos(self):
        return [{"id": p.id, "nome": p.nome, "preco": p.preco, "quantidade": p.quantidade} for p in self.produtos]

    def buscar_id(self, id_produto):
        for p in self.produtos:
            if p.id == id_produto:
                return p
        return None

class Carrinho:
    def __init__(self):
        self.items = {}

    def add_produto(self, id_produto, quantidade):
        if id_produto in self.items:
            self.items[id_produto] += quantidade
        else:
            self.items[id_produto] = quantidade

    def deletar_produto(self, id_produto, quantidade):
        if id_produto not in self.items:
            return 0

        if quantidade >= self.items[id_produto]:
            total_deletado = self.items[id_produto]
            del self.items[id_produto]
        else:
            total_deletado = quantidade
            self.items[id_produto] -= quantidade

        return total_deletado

    def resumo(self, array_produtos):
        total = 0
        for id_produto, qtd in self.items.items():
            produto = array_produtos.buscar_id(id_produto)
            if produto:
                total += produto.preco * qtd
        return total

# Configuração do Flask
app = Flask(__name__)
CORS(app)

array_produtos = ArrayProdutos()
carrinho = Carrinho()
historico_compras = []

# Rota para cadastrar produto
@app.route('/produtos', methods=['POST'])
def cadastrar_produto():
    dados = request.json
    produto_salvo = array_produtos.cadastrar_produto(
        nome=dados['nome'],
        preco=dados['preco'],
        quantidade=dados['quantidade']
    )
    return jsonify(produto_salvo)

# Rota para listar produtos
@app.route('/produtos', methods=['GET'])
def listar_produtos():
    busca = request.args.get('busca', '').lower()
    ordem = request.args.get('ordem', 'nome')
    direcao = request.args.get('direcao', 'asc')

    produtos = array_produtos.listar_produtos()

    if busca:
        produtos = [p for p in produtos if busca in p['nome'].lower()]

    if ordem == 'nome':
        produtos.sort(key=lambda p: p['nome'].lower())
    elif ordem == 'preco':
        if direcao == 'asc':
            produtos.sort(key=lambda p: p['preco'])
        else:
            produtos.sort(key=lambda p: p['preco'], reverse=True)

    return jsonify(produtos)

# Adicionar produto ao carrinho
@app.route('/carrinho/adicionar', methods=['POST'])
def adicionar_ao_carrinho():
    dados = request.json
    id_produto = dados.get('id_produto')
    quantidade = dados.get('quantidade', 1)

    produto = array_produtos.buscar_id(id_produto)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    if quantidade < 1:
        return jsonify({"erro": "Quantidade inválida"}), 400

    if produto.quantidade < quantidade:
        return jsonify({"erro": "Estoque insuficiente"}), 400

    carrinho.add_produto(id_produto, quantidade)
    produto.quantidade -= quantidade
    return jsonify({"mensagem": "Produto adicionado ao carrinho", "carrinho": carrinho.items})

# Remover produto do carrinho
@app.route('/carrinho/remover', methods=['POST'])
def remover_do_carrinho():
    dados = request.json
    id_produto = dados.get('id_produto')
    quantidade = dados.get('quantidade', 1)

    if id_produto not in carrinho.items:
        return jsonify({"mensagem": "Nenhuma alteração no carrinho", "carrinho": carrinho.items})

    produto = array_produtos.buscar_id(id_produto)
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    if quantidade < 1:
        return jsonify({"erro": "Quantidade inválida"}), 400

    total_deletado = carrinho.deletar_produto(id_produto, quantidade)
    produto.quantidade += total_deletado
    return jsonify({"mensagem": "Produto removido do carrinho", "carrinho": carrinho.items})

# Listar carrinho
@app.route('/carrinho', methods=['GET'])
def listar_carrinho():
    itens = []
    for id_produto, quantidade in carrinho.items.items():
        produto = array_produtos.buscar_id(id_produto)
        if produto:
            itens.append({
                "id": id_produto,
                "nome": produto.nome,
                "preco": produto.preco,
                "quantidade": quantidade,
                "total": produto.preco * quantidade
            })
    total_geral = carrinho.resumo(array_produtos)
    return jsonify({"itens": itens, "total": total_geral})

# Limpar carrinho
@app.route('/carrinho/limpar', methods=['POST'])
def limpar_carrinho():
    carrinho.items.clear()
    return jsonify({"mensagem": "Carrinho limpo"})

# Finalizar compra
@app.route('/carrinho/finalizar', methods=['POST'])
def finalizar_compra():
    if not carrinho.items:
        return jsonify({"erro": "Carrinho vazio"}), 400

    compra_finalizada = carrinho.items.copy()
    historico_compras.append(compra_finalizada)

    carrinho.items.clear()
    return jsonify({"mensagem": "Compra finalizada com sucesso"})

# Histórico de compras
@app.route('/historico', methods=['GET'])
def obter_historico():
    return jsonify(historico_compras)


if __name__ == '__main__':
    app.run(debug=True, port=8000)