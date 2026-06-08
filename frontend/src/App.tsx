import { useEffect, useState } from 'react'
import CadastrarProduto from './CadastrarProduto'
import Carrinho from './Carrinho'
import { FaShoppingCart } from "react-icons/fa";

interface Produto {
  id: number
  nome: string
  preco: number
  quantidade: number
}

interface ItemCarrinho {
  id: number
  nome: string
  preco: number
  quantidade: number
  total: number
}

// App simples de carrinho para aprender React e conectar com o backend
function App() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([])
  const [totalCarrinho, setTotalCarrinho] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    carregarProdutos()
  }, [])

  // Carregar carrinho ao abrir
  useEffect(() => {
    if (carrinhoAberto) {
      carregarCarrinho()
    }
  }, [carrinhoAberto])

  function carregarProdutos() {
    fetch('http://localhost:8000/produtos')
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao carregar produtos')
        return response.json()
      })
      .then((data: Produto[]) => {
        setProdutos(data)
        const iniciais = data.reduce((acc: { [key: number]: number }, produto: Produto) => {
          acc[produto.id] = 1
          return acc
        }, {})
        setQuantidadeSelecionada(iniciais)
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErro(error.message)
        }
      })
  }

  function carregarCarrinho() {
    fetch('http://localhost:8000/carrinho')
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao carregar carrinho')
        return response.json()
      })
      .then((data) => {
        setItensCarrinho(data.itens)
        setTotalCarrinho(data.total)
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErro(error.message)
        }
      })
  }

  function handleAdicionarAoCarrinho(produtoId: number, quantidade: number) {
    if (quantidade < 1) return
    setCarregando(true)
    // envio para o backend
    fetch('http://localhost:8000/carrinho/adicionar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_produto: produtoId, quantidade }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.erro || 'Falha ao adicionar ao carrinho')
          })
        }
        return response.json()
      })
      .then(() => {
        carregarCarrinho()
        carregarProdutos()
        setCarrinhoAberto(true)
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErro(error.message)
        }
      })
      .finally(() => {
        setCarregando(false)
      })
  }

  function handleRemoverDoCarrinho(produtoId: number, quantidade: number) {
    fetch('http://localhost:8000/carrinho/remover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_produto: produtoId, quantidade }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.erro || 'Falha ao remover do carrinho')
          })
        }
        return response.json()
      })
      .then(() => {
        carregarCarrinho()
        carregarProdutos()
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErro(error.message)
        }
      })
  }

  function handleFinalizarCompra() {
    fetch('http://localhost:8000/carrinho/finalizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.erro || 'Falha ao finalizar compra')
          })
        }
        return response.json()
      })
      .then(() => {
        carregarProdutos()
        setItensCarrinho([])
        setTotalCarrinho(0)
        setCarrinhoAberto(false)
        alert('Compra finalizada com sucesso!')
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErro(error.message)
        }
      })
  }

  function handleQuantidadeSelecionadaChange(produtoId: number, valor: number) {
    setQuantidadeSelecionada((current) => ({
      ...current,
      [produtoId]: Math.max(1, valor),
    }))
  }

  function handleSalvarProduto(novoProduto: Omit<Produto, 'id'>) {
    setErro(null)
    return fetch('http://localhost:8000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha ao salvar produto')
        }
        return response.json()
      })
      .then((produtoSalvo) => {
        setProdutos((current) => [...current, produtoSalvo])
        carregarProdutos()
      })
      .catch((error) => {
        if (error instanceof Error) {
          setErro(error.message)
        }
      })
  }


  return (
    <div className="min-h-screen bg-purple-100">
      <header className="bg-purple-200">
        <div className="max-w-6xl mx-auto px-3 py-5 md:px-5 md:py-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">Produtos</h1>
          </div>

          <div className="flex gap-3 items-center">
            <button type="button" className="inline-flex items-center justify-center rounded-full bg-purple-700 px-6 py-3 text-white font-semibold shadow hover:bg-purple-800 transition">
              Cadastrar Produto
            </button>
            <button onClick={() => setCarrinhoAberto(true)} className="relative cursor-pointer hover:opacity-80 transition" >
              <FaShoppingCart size={30} className="text-slate-950" />
              {itensCarrinho.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itensCarrinho.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>


      <div className="max-w-6xl mx-auto space-y-8 mt-8 px-6 md:px-10">
        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-3xl shadow">
            <CadastrarProduto onSalvar={handleSalvarProduto} onFechar={() => setMostrarFormulario(false)} />
            {erro ? <p className="mt-4 text-sm text-red-600">{erro}</p> : null}
          </div>
        )}


        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {produtos.map((produto) => (
            <article key={produto.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{produto.nome}</h2>
              </div>
              <p className="text-gray-600 mb-2">Preço unitário</p>
              <p className="text-2xl font-semibold mb-4">R$ {produto.preco.toFixed(2)}</p>
              <div className="flex items-center justify-between text-gray-700 mb-4">
              </div>
              <div className="mt-auto space-y-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                  <label className="flex flex-col text-sm text-gray-600">
                    Quantidade
                    <input type="number" min={1} max={produto.quantidade} value={quantidadeSelecionada[produto.id] ?? 1} onChange={(event) => handleQuantidadeSelecionadaChange(produto.id, Number(event.target.value))} className="mt-2 w-24 border rounded-xl px-2 py-2" disabled={produto.quantidade === 0} />
                  </label>

                  <button onClick={() => handleAdicionarAoCarrinho(produto.id, quantidadeSelecionada[produto.id] ?? 1)} disabled={carregando || produto.quantidade === 0} className="rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition" >
                    {carregando ? 'Adicionando...' : 'Adicionar'}
                  </button>
                </div>

                <div className="rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700">
                  Estoque: {produto.quantidade}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      <Carrinho
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
        itens={itensCarrinho}
        totalGeral={totalCarrinho}
        onRemover={handleRemoverDoCarrinho}
        onFinalizar={handleFinalizarCompra}
      />
    </div>
  )
}


export default App



