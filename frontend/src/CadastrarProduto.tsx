export default function CadastrarProduto() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Cadastrar produto</h2>
        </div>
        <button type="button" onClick={() => {}} className="self-start rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition" > Fechar </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input type="text" placeholder="Nome do produto" className="border p-3 rounded w-full" />
        <input type="number" placeholder="Preço" className="border p-3 rounded w-full" />
        <input type="number" placeholder="Quantidade" className="border p-3 rounded w-full" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => {}} className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition" > Cancelar </button>
        <button type="button" onClick={() => {}} className="rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition" > Salvar produto </button>
      </div>
    </div>
  )
}
