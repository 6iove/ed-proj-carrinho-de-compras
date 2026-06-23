import { useState } from 'react'

interface ItemCarrinho {
  id: number
  nome: string
  preco: number
  quantidade: number
  total: number
}

// componente simples do carrinho, só para mostrar os itens e finalizar

interface CarrinhoProps {
  isOpen: boolean
  onClose: () => void
  itens: ItemCarrinho[]
  totalGeral: number
  onRemover: (id: number, quantidade: number) => void
  onFinalizar: () => void
}

export default function Carrinho({
  isOpen,
  onClose,
  itens,
  totalGeral,
  onRemover,
  onFinalizar,
}: CarrinhoProps) {
  const [carregando, setCarregando] = useState(false)

  const handleFinalizar = async () => {
    setCarregando(true)
    await onFinalizar()
    setCarregando(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50" onClick={onClose} />

      <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-lg flex flex-col">
        <div className="flex justify-between border-b p-4">
          <h2 className="text-xl font-bold">Carrinho</h2>
          <button onClick={onClose}>×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {itens.length === 0 ? (
            <p className="text-center text-gray-500">Carrinho vazio</p>
          ) : (
            itens.map((item) => (
              <div key={item.id} className="border rounded p-2 mb-2">
                <div className="flex justify-between">
                  <span>{item.nome}</span>
                  <button
                    onClick={() => onRemover(item.id, item.quantidade)}
                    className="text-red-500"
                  >
                    Remover
                  </button>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{item.quantidade}x R$ {item.preco.toFixed(2)}</span>
                  <span>R$ {item.total.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex justify-between font-bold mb-2">
            <span>Total:</span>
            <span>R$ {totalGeral.toFixed(2)}</span>
          </div>

          <button onClick={handleFinalizar} disabled={itens.length === 0 || carregando} className="w-full bg-purple-600 text-white py-2 rounded mb-2" >
            {carregando ? 'Finalizando...' : 'Finalizar Compra'}
          </button>

          <button onClick={onClose} className="w-full border py-2 rounded">
            Continuar Comprando
          </button>
        </div>
      </div>
    </>
  )
}