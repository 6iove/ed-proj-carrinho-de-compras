import { useEffect, useState } from 'react'
import CadastrarProduto from './CadastrarProduto'

interface Produto {
  id: number
  nome: string
  preco: number
  quantidade: number
}
//passei usando useeffect e fetch para buscar os produtos cadastrados no backend e exibi-los na tela.
function App() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/produtos')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar produtos')
        return res.json()
      })
      .then((data: Produto[]) => setProdutos(data))
      .catch((error) => setErro(error.message))
  }, [])

  async function handleSalvarProduto(novoProduto: Omit<Produto, 'id'>) {
    setErro(null)

    try {
      const response = await fetch('http://localhost:8000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto),
      })

      if (!response.ok) {
        throw new Error('Falha ao salvar produto')
      }

      const produtoSalvo = await response.json()
      setProdutos((current) => [...current, produtoSalvo])
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-purple-100">
      <header className="bg-purple-200">
        <div className="max-w-6xl mx-auto px-3 py-5 md:px-5 md:py-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">Produtos</h1>
          </div>

          <button type="button" className="inline-flex items-center justify-center rounded-full bg-purple-700 px-6 py-3 text-white font-semibold shadow hover:bg-purple-800 transition">
            Cadastrar Produto
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-8 mt-8 px-6 md:px-10">
        <div className="bg-white p-6 rounded-3xl shadow">
          <CadastrarProduto onSalvar={handleSalvarProduto} />
          {erro ? <p className="mt-4 text-sm text-red-600">{erro}</p> : null}
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {produtos.map((produto) => (
            <article key={produto.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{produto.nome}</h2>
              </div>
              <p className="text-gray-600 mb-2">Preço unitário</p>
              <p className="text-2xl font-semibold mb-4">R$ {produto.preco.toFixed(2)}</p>
              <div className="flex items-center justify-between text-gray-700">
                <span>Quantidade</span>
                <span className="font-semibold">{produto.quantidade}</span>
              </div>
              <div className="mt-6 rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700">
                Total: R$ {(produto.preco * produto.quantidade).toFixed(2)}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App
