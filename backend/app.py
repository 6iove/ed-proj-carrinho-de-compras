from flask import Flask, request, jsonify
from flask_cors import CORS

from cadastro_produto import ArrayProdutos

app = Flask(__name__)
CORS(app)

array_produtos = ArrayProdutos()

#aqui passo a rota igual fizemos no outro 
# cadastrar produto
@app.route('/produtos', methods=['POST'])
def cadastrar_produto():

    dados = request.json

    nome = dados['nome']
    preco = dados['preco']
    quantidade = dados['quantidade']

    produto_salvo = array_produtos.cadastrar_produto(
        nome=dados['nome'],
        preco=dados['preco'],
        quantidade=dados['quantidade']
    )

    return jsonify(produto_salvo)

#aqui eu listo no servidor http://localhost:8000/produtos no navegador 
# listar produtos
@app.route('/produtos', methods=['GET'])
def listar_produtos():
    return jsonify(array_produtos.listar_produtos())


if __name__ == '__main__':
    app.run(debug=True, port=8000)