import { useMemo, useState } from 'react'

const baseConhecimento = [
  {
    termos: ['polimento', 'risco', 'arranhao', 'pintura'],
    resposta:
      'Para polimento, lave e descontamine a pintura antes. Comece com teste em uma pequena area, use boina adequada e finalize com protecao. Riscos fundos que pegam na unha podem exigir repintura.'
  },
  {
    termos: ['vitrificacao', 'ceramica', 'proteção', 'protecao'],
    resposta:
      'Na vitrificacao, a preparacao manda no resultado: lavagem tecnica, descontaminacao, polimento de refino e aplicacao em ambiente limpo. Oriente o cliente a evitar chuva forte e lavagem agressiva nas primeiras horas.'
  },
  {
    termos: ['farol', 'farois', 'amarelado', 'restauracao'],
    resposta:
      'Para farois amarelados, lixe em etapas, refine a superficie e aplique protecao UV. Sem protecao final, o amarelado volta mais rapido.'
  },
  {
    termos: ['higienizacao', 'banco', 'interno', 'odor', 'cheiro'],
    resposta:
      'Na higienizacao interna, aspire bem antes, teste produto em area escondida e controle a umidade. Secagem completa evita odor e mofo.'
  },
  {
    termos: ['lavagem', 'shampoo', 'motor', 'limpeza'],
    resposta:
      'Use pre-lavagem para soltar sujeira, luva macia, dois baldes quando possivel e secagem com toalha de microfibra. Evite detergente comum, ele remove protecoes e resseca borrachas.'
  },
  {
    termos: ['preco', 'valor', 'cobrar', 'orcamento'],
    resposta:
      'Para calcular preco, considere tamanho do veiculo, estado de sujeira, tempo de mao de obra, produtos usados e nivel de acabamento. Fotografe o antes para justificar servicos extras.'
  }
]

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function responder(pergunta, agendamento) {
  const texto = normalizar(pergunta)
  const item = baseConhecimento.find((entrada) =>
    entrada.termos.some((termo) => texto.includes(normalizar(termo)))
  )

  const contexto = agendamento
    ? `\n\nContexto do horario selecionado: ${agendamento.cliente}, ${agendamento.veiculo}, ${agendamento.servico}, ${agendamento.data} as ${agendamento.horario}.`
    : ''

  if (item) return item.resposta + contexto

  return (
    'Sugestao profissional: avalie o estado do veiculo, fotografe antes do servico, confirme expectativa do cliente e escolha produtos adequados para a superficie. Para uma resposta melhor, pergunte sobre polimento, vitrificacao, farois, lavagem, higienizacao ou preco.' +
    contexto
  )
}

export default function AssistenteIA({ agendamento }) {
  const [pergunta, setPergunta] = useState('')
  const [historico, setHistorico] = useState([])

  const sugestoes = useMemo(
    () => [
      'Como preparar o carro para vitrificacao?',
      'Como cobrar por polimento?',
      'O que fazer em farol amarelado?',
      'Como higienizar banco com cheiro forte?'
    ],
    []
  )

  function perguntarIA(event) {
    event.preventDefault()
    if (!pergunta.trim()) return

    const resposta = responder(pergunta, agendamento)
    setHistorico((current) => [
      { id: crypto.randomUUID(), pergunta, resposta, horario: new Date().toLocaleTimeString() },
      ...current
    ])
    setPergunta('')
  }

  return (
    <div className="assistant">
      <div className="section-title">
        <p className="eyebrow">IA gratis</p>
        <h2>Assistente automotiva local</h2>
        <p>
          Funciona sem chave paga e sem enviar dados do cliente para fora do aparelho.
          Ela usa uma base de conhecimento interna sobre estetica automotiva.
        </p>
      </div>

      <form onSubmit={perguntarIA} className="ai-form">
        <textarea
          value={pergunta}
          onChange={(event) => setPergunta(event.target.value)}
          placeholder="Pergunte sobre polimento, vitrificacao, lavagem, farois, higienizacao ou preco..."
        />
        <button className="button primary" type="submit">Perguntar</button>
      </form>

      <div className="suggestions">
        {sugestoes.map((sugestao) => (
          <button key={sugestao} type="button" onClick={() => setPergunta(sugestao)}>
            {sugestao}
          </button>
        ))}
      </div>

      <div className="chat-list">
        {historico.length === 0 ? (
          <p className="empty">A IA ainda nao recebeu perguntas.</p>
        ) : (
          historico.map((item) => (
            <article key={item.id} className="chat-card">
              <small>{item.horario}</small>
              <strong>{item.pergunta}</strong>
              <p>{item.resposta}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
