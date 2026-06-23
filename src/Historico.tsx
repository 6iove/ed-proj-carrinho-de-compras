type CompraBruta = { [key: number]: number }

interface Produto {
    id: number
    nome: string
    preco: number
    quantidade: number
}

interface HistoricoProps {
    isOpen: boolean
    onClose: () => void
    compras: CompraBruta[] // Nós da lista encadeada
    produtos: Produto[] // lista global
}

export default function Historico({
    isOpen, 
    onClose, 
    compras, 
    produtos, 
}: HistoricoProps) {

    if (!isOpen) return null

    return (
        <>
          <div className="fixed inset-0 bg-opacity-50" onClick={onClose} />
          
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-lg flex flex-col z-50">
            <div className="flex justify-between border-b p-4">
              <h2 className="text-xl font-bold">Histórico de Compras</h2>
              <button onClick={onClose}>×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {compras.length === 0 ? (
                <p className="text-center text-gray-500">Nenhuma compra realizada ainda</p>
            ) : (

            // Mapeia cada nó de compra inserido na Lista Encadeada
            compras.map((compra, index) => {

              let totalDaCompra = 0;

              return (
                <div key={index} className="border rounded p-2 mb-2">
                  <div className="flex justify-between border-b pb-2 mb-2 font-bold">
                    <span>Compra #{index + 1}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(compra).map(([idProd, qtd]) => {
                      // Busca o objeto original no estoque
                      const produtoOriginal = produtos.find((p) => p.id === Number(idProd));
                      const precoUnitario = produtoOriginal ? produtoOriginal.preco : 0;
                      const nomeProduto = produtoOriginal ? produtoOriginal.nome : `Produto (ID: ${idProd})`;
                      const subtotalItem = precoUnitario * qtd;

                      totalDaCompra += subtotalItem;

                      return (
                        <div key={idProd} className="flex justify-between text-sm text-gray-700">
                          <div>
                            <span className="font-medium">{nomeProduto}</span>
                            <span className="text-xs text-gray-500 block">
                              {qtd}x R$ {precoUnitario.toFixed(2)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">
                            R$ {subtotalItem.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t mt-3 pt-2 flex justify-between font-semibold text-sm text-gray-900">
                    <span>Total do Pedido:</span>
                    <span>R$ {totalDaCompra.toFixed(2)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t p-4 bg-white">
          <button onClick={onClose} className="w-full bg-purple-600 text-white py-2 rounded font-semibold hover:bg-purple-700 transition">
            Fechar Histórico
          </button>
        </div>
      </div>
    </>
  )
}