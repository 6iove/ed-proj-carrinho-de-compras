import { FaSearch } from "react-icons/fa"

interface Props {
  busca: string
  ordem: 'nome' | 'preco'
  direcao: 'asc' | 'desc'
  onBuscaChange: (valor: string) => void
  onOrdemChange: (ordem: 'nome' | 'preco') => void
  onDirecaoChange: (direcao: 'asc' | 'desc') => void
}

export default function BuscarProduto({ busca, ordem, direcao, onBuscaChange, onOrdemChange, onDirecaoChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="w-48 pl-9 pr-8 py-2 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {busca.length > 0 && (
          <button onClick={() => onBuscaChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
            ✕
          </button>
        )}
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => onOrdemChange('nome')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${ordem === 'nome' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Nome
        </button>
        <button
          onClick={() => onOrdemChange('preco')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${ordem === 'preco' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Preço
        </button>

        {/* botão de direção, só aparece quando ordem é preço */}
        {ordem === 'preco' && (
          <button
            onClick={() => onDirecaoChange(direcao === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            {direcao === 'asc' ? '↑ Menor' : '↓ Maior'}
          </button>
        )}
      </div>
    </div>
  )
}