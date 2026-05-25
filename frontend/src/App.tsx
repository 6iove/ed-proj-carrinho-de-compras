import CadastrarProduto from './CadastrarProduto'

const produtos = [
  {
    id: 1,
    nome: 'Camisa Polo',
    preco: 79.9,
    quantidade: 3,
  },
  {
    id: 2,
    nome: 'Tênis Esportivo',
    preco: 249.99,
    quantidade: 1,
  },
  {
    id: 3,
    nome: 'Boné Street',
    preco: 49.9,
    quantidade: 2,
  },
]

function App() {
  return (
    <div className="min-h-screen bg-purple-100">
      <header className="bg-purple-200">
        <div className="max-w-6xl mx-auto px-3 py-5 md:px-5 md:py-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">Produtos</h1>
          </div>

          <button type="button" onClick={() => {}} className="inline-flex items-center justify-center rounded-full bg-purple-700 px-6 py-3 text-white font-semibold shadow hover:bg-purple-800 transition" > Cadastrar Produto </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-8 mt-8 px-6 md:px-10">
        <div className="bg-white p-6 rounded-3xl shadow">
          <CadastrarProduto />
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
              <div className="mt-6 rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700"> Total: R$ {(produto.preco * produto.quantidade).toFixed(2)}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App
