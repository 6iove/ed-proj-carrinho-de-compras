class Produto: 
    '''Classe para representar um produto com nome, preço e quantidade.'''
    def __init__(self, nome, preco, quantidade): 
        self.nome = nome 
        self.preco = preco 
        self.quantidade = quantidade 

    # método para JSON
    def to_dict(self):
        return {
            "nome": self.nome,
            "preco": self.preco,
            "quantidade": self.quantidade
        }
    
class ArrayProdutos:
    '''Classe para gerenciar um array de produtos.'''
    def __init__(self): 
        self.produtos = [] 
    
    def cadastrar_produto(self, nome: str, preco: float, quantidade: int): 
        '''Adiciona um novo produto ao array de produtos.'''
        novo_produto = Produto(nome, preco, quantidade)
        self.produtos.append(novo_produto) 
        print(f"Produto '{novo_produto.nome}' cadastrado com sucesso!")
        
    def listar_produtos(self): 
        '''Retorna uma lista com todos os produtos cadastrados.'''
        return [produto.to_dict() for produto in self.produtos]