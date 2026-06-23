import { useState } from 'react'

interface CadastrarProdutoProps {
  onSalvar: (produto: {
    nome: string
    preco: number
    quantidade: number
  }) => Promise<void>
  onFechar?: () => void
}


export default function CadastrarProduto({ onSalvar, onFechar }: CadastrarProdutoProps) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [quantidade, setQuantidade] = useState('')


  async function handleSalvar() {
    const precoNumero = Number(preco)
    const quantidadeNumero = Number(quantidade)


    if (!nome.trim() || Number.isNaN(precoNumero) || Number.isNaN(quantidadeNumero)) {
      return
    }


    await onSalvar({
      nome: nome.trim(),
      preco: precoNumero,
      quantidade: quantidadeNumero,
    })


    setNome('')
    setPreco('')
    setQuantidade('')


    onFechar?.()
  }


  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Cadastrar produto</h2>
        </div>
        <button type="button" onClick={onFechar} className="self-start rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
          Fechar
        </button>
      </div>


      <div className="grid gap-4 md:grid-cols-3">
        <input type="text" placeholder="Nome do produto" value={nome} onChange={(event) => setNome(event.target.value)} className="border p-3 rounded w-full" />
        <input type="number" placeholder="Preço" value={preco} onChange={(event) => setPreco(event.target.value)} className="border p-3 rounded w-full" />
        <input type="number"  placeholder="Quantidade" value={quantidade} onChange={(event) => setQuantidade(event.target.value)} className="border p-3 rounded w-full" />
      </div>


      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"> Cancelar </button>
        <button type="button" onClick={handleSalvar} className="rounded-full bg-purple-700 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-800 transition" > Salvar produto </button>
      </div>
    </div>
  )
}