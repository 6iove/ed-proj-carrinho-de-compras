class Node:
    '''Classe para representar um Nó no Histórico'''
    def __init__(self, data):
        self.data = data
        self.next = None

class Historico:
    '''Lista encadeada simples para armazenar o histórico de compras.'''
    def __init__(self):
        self.head = None 
        
    def add_fim(self, data):
        '''Adiciona uma nova compra no final da lista encadeada.'''
        new_node = Node(data)
        
        if not self.head:
            self.head = new_node
            return
        
        current = self.head
        while current.next: 
            current = current.next
        current.next = new_node # o nó que apontava para None agora aponta para o novo nó
        
    def exibir_historico(self):
        '''Retorna o historico de compras percorrendo a lista do início ao fim.'''
        compras = []
        current = self.head
        
        while current:
            compras.append(current.data)
            current = current.next
        return compras

class Desfazer:
    '''Pilha sequencial para Desfazer'''
    '''A última ação sempre fica no topo'''
    def __init__(self):
        self.items = []
    
    def empilhar(self, comando):
        self.items.append(comando) # o final da lista representará o topo da pilha
        
    def desempilhar(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def is_empty(self):
        return len(self.items) == 0

'''ESTOQUE'''
class Produto: 
    '''Classe para representar um produto com nome, preço e quantidade.'''
    def __init__(self, nome, preco, quantidade):
        self.id = id(self)  # vou colocar aqui para gerar um id pra cada produto, so pra facilitar a identificação no json
        self.nome = nome 
        self.preco = preco 
        self.quantidade = quantidade 

    # método para JSON
    def to_dict(self):
        return {
            "id": self.id,
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
        return novo_produto.to_dict()
    
    def listar_produtos(self): 
        '''Retorna uma lista com todos os produtos cadastrados.'''
        return [produto.to_dict() for produto in self.produtos]
    
    def buscar_id(self, id_produto):
        for produto in self.produtos:
            if produto.id == id_produto:
                return produto

'''CARRINHO'''   
class Carrinho:
    '''Classe para gerenciar as funções do carrinho de compras e estoque.'''
    def __init__(self, estoque: ArrayProdutos, historico: Historico):
        self.items = {} # dicionário
        self.estoque = estoque
        self.historico = historico
        self.desfazer = Desfazer()

    def add_produto(self, id_produto, quantidade, registrar_pilha=True):
        '''Adiciona um produto ao carrinho.'''
        total_atual = self.items.get(id_produto, 0)
        self.items[id_produto] = total_atual + quantidade
        
        if registrar_pilha:
            self.desfazer.empilhar({"operação": "adicionar", "id": id_produto, "total_alterado": quantidade})
    
    def deletar_produto(self, id_produto, quantidade, registrar_pilha=True):
        '''Remove produto do carrinho'''
        if quantidade >= self.items[id_produto]:
            total_deletado = self.items[id_produto]
            del self.items[id_produto] # del apaga chave do dicionario
        else:
            total_deletado = quantidade
            self.items[id_produto] -= quantidade
            
        if registrar_pilha:
            self.desfazer.empilhar({"operação": "deletar", "id": id_produto, "total_alterado": total_deletado})
            
    def desfazer_comando(self):
        '''Desfaz ultimo comando pelo topo da pilha'''
        ultimo_comando = self.desfazer.desempilhar()
        
        # se a operação do ultimo comando foi adicionar, chamamos o método 'deletar' para desfazer o comando 
        if ultimo_comando["operação"] == "adicionar":
            self.deletar_produto(ultimo_comando["id"], ultimo_comando["total_alterado"], registrar_pilha=False)
        
        # se a operação do ultimo comando foi deletar, chamamos o método 'add' para desfazer o comando
        elif ultimo_comando["operação"] == "deletar": 
            self.add_produto(ultimo_comando["id"], ultimo_comando["total_alterado"], registrar_pilha=False)
            
    def resumo(self):
        '''Retorna o valor total do carrinho de compras.'''
        total_geral = 0
        for id_produto, total in self.items.items():
            produto = self.estoque.buscar_id(id_produto)
            total_geral += produto.preco * total
        return total_geral
    
    def finalizar(self):
        for id_produto, total in self.items.items():
            produto = self.estoque.buscar_id(id_produto)
            produto.quantidade -= total
            
        self.historico.add_fim(self.items.copy()) # copy duplica o dicionario para manter no historico
        self.items.clear() # clear limpa todo o dicionário