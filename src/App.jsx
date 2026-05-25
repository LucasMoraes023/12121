import React, { useEffect, useMemo, useState } from 'react'
import Camera from './components/Camera.jsx'
import AssistenteIA from './components/AssistenteIA.jsx'

const STORAGE_KEY = 'imperio-detailer-agendamentos'

const horarios = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'
]

const servicos = [
  'Estetica automotiva',
  'Lavagem profissional',
  'Polimento',
  'Vitrificacao',
  'Restauracao de farois',
  'Higienizacao interna',
  'Remocao de manchas'
]

const contatos = {
  lucas: '5591991984345',
  levi: '5591981176981'
}

function loadAgendamentos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveAgendamentos(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function App() {
  const [formData, setFormData] = useState({
    cliente: '',
    telefone: '',
    veiculo: '',
    servico: servicos[0],
    data: new Date().toISOString().slice(0, 10),
    horario: horarios[0],
    responsavel: 'Lucas',
    observacoes: ''
  })
  const [agendamentos, setAgendamentos] = useState(loadAgendamentos)
  const [selecionadoId, setSelecionadoId] = useState(null)

  const selecionado = useMemo(
    () => agendamentos.find((item) => item.id === selecionadoId) || agendamentos[0],
    [agendamentos, selecionadoId]
  )

  useEffect(() => {
    saveAgendamentos(agendamentos)
    if (!selecionadoId && agendamentos.length) {
      setSelecionadoId(agendamentos[0].id)
    }
  }, [agendamentos, selecionadoId])

  function handleInputChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function criarAgendamento(event) {
    event.preventDefault()

    if (!formData.cliente.trim() || !formData.telefone.trim() || !formData.veiculo.trim()) {
      alert('Preencha cliente, telefone e veiculo.')
      return
    }

    const novo = {
      id: crypto.randomUUID(),
      ...formData,
      status: 'Pendente',
      fotos: [],
      criadoEm: new Date().toISOString()
    }

    setAgendamentos((current) => [novo, ...current])
    setSelecionadoId(novo.id)
    setFormData((current) => ({
      ...current,
      cliente: '',
      telefone: '',
      veiculo: '',
      observacoes: ''
    }))
  }

  function atualizarAgendamento(id, patch) {
    setAgendamentos((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  function adicionarFoto(agendamentoId, foto) {
    setAgendamentos((current) =>
      current.map((item) =>
        item.id === agendamentoId
          ? { ...item, fotos: [{ ...foto, id: crypto.randomUUID() }, ...item.fotos] }
          : item
      )
    )
  }

  function removerFoto(agendamentoId, fotoId) {
    setAgendamentos((current) =>
      current.map((item) =>
        item.id === agendamentoId
          ? { ...item, fotos: item.fotos.filter((foto) => foto.id !== fotoId) }
          : item
      )
    )
  }

  function removerAgendamento(id) {
    const restante = agendamentos.filter((item) => item.id !== id)
    setAgendamentos(restante)
    setSelecionadoId(restante[0]?.id || null)
  }

  function mensagemWhatsApp(numero, item) {
    const texto = item
      ? `Ola, quero confirmar o agendamento de ${item.cliente} para ${item.data} as ${item.horario}. Servico: ${item.servico}. Veiculo: ${item.veiculo}.`
      : 'Ola, quero falar com a Imperio Studio Automotivo.'

    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="topbar">
          <img src="/imperio-logo.png" alt="Imperio Studio Automotivo" />
          <div>
            <a href={`https://wa.me/${contatos.lucas}`}>Lucas</a>
            <a href={`https://wa.me/${contatos.levi}`}>Levi</a>
          </div>
        </nav>

        <section className="hero-grid">
          <div>
            <p className="eyebrow">App profissional de detalhamento</p>
            <h1>Agenda, fotos e IA para cuidar de cada veiculo.</h1>
            <p>
              Controle horarios, documente o antes e depois com a camera do celular
              e tenha uma assistente gratuita para orientar cuidados automotivos.
            </p>
            <div className="quick-actions">
              <a href="#agenda" className="button primary">Novo agendamento</a>
              <a href="#ia" className="button secondary">Abrir IA</a>
            </div>
          </div>
          <img className="poster" src="/imperio-servicos.png" alt="Servicos Imperio Studio Automotivo" />
        </section>
      </header>

      <main>
        <section className="panel form-panel" id="agenda">
          <div className="section-title">
            <p className="eyebrow">Agenda</p>
            <h2>Criar agendamento</h2>
          </div>

          <form onSubmit={criarAgendamento} className="appointment-form">
            <label>
              Cliente
              <input name="cliente" value={formData.cliente} onChange={handleInputChange} placeholder="Nome do cliente" />
            </label>
            <label>
              Telefone
              <input name="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(91) 00000-0000" />
            </label>
            <label>
              Veiculo
              <input name="veiculo" value={formData.veiculo} onChange={handleInputChange} placeholder="Modelo, cor e placa" />
            </label>
            <label>
              Servico
              <select name="servico" value={formData.servico} onChange={handleInputChange}>
                {servicos.map((servico) => <option key={servico}>{servico}</option>)}
              </select>
            </label>
            <label>
              Data
              <input type="date" name="data" value={formData.data} onChange={handleInputChange} />
            </label>
            <label>
              Horario
              <select name="horario" value={formData.horario} onChange={handleInputChange}>
                {horarios.map((horario) => <option key={horario}>{horario}</option>)}
              </select>
            </label>
            <label>
              Responsavel
              <select name="responsavel" value={formData.responsavel} onChange={handleInputChange}>
                <option>Lucas</option>
                <option>Levi</option>
              </select>
            </label>
            <label className="wide">
              Observacoes
              <textarea name="observacoes" value={formData.observacoes} onChange={handleInputChange} placeholder="Detalhes do servico, estado do carro, combinados..." />
            </label>
            <button className="button primary wide" type="submit">Salvar agendamento</button>
          </form>
        </section>

        <section className="workspace">
          <aside className="panel schedule-list">
            <div className="section-title">
              <p className="eyebrow">Horarios</p>
              <h2>Agendados</h2>
            </div>

            {agendamentos.length === 0 ? (
              <p className="empty">Nenhum horario cadastrado ainda.</p>
            ) : (
              agendamentos.map((item) => (
                <button
                  key={item.id}
                  className={`schedule-card ${item.id === selecionado?.id ? 'active' : ''}`}
                  onClick={() => setSelecionadoId(item.id)}
                >
                  <span>{item.data} - {item.horario}</span>
                  <strong>{item.cliente}</strong>
                  <small>{item.servico} | {item.fotos.length} foto(s)</small>
                </button>
              ))
            )}
          </aside>

          <section className="panel details-panel">
            {selecionado ? (
              <>
                <div className="details-header">
                  <div>
                    <p className="eyebrow">Galeria do horario</p>
                    <h2>{selecionado.cliente}</h2>
                    <p>{selecionado.data} as {selecionado.horario} | {selecionado.veiculo}</p>
                  </div>
                  <select
                    value={selecionado.status}
                    onChange={(event) => atualizarAgendamento(selecionado.id, { status: event.target.value })}
                  >
                    <option>Pendente</option>
                    <option>Em andamento</option>
                    <option>Finalizado</option>
                  </select>
                </div>

                <div className="detail-actions">
                  <a className="button primary" href={mensagemWhatsApp(contatos.lucas, selecionado)}>Lucas</a>
                  <a className="button secondary" href={mensagemWhatsApp(contatos.levi, selecionado)}>Levi</a>
                  <button className="button danger" onClick={() => removerAgendamento(selecionado.id)}>Excluir</button>
                </div>

                <Camera agendamento={selecionado} onPhotoAdd={adicionarFoto} />

                <div className="gallery">
                  {selecionado.fotos.length === 0 ? (
                    <p className="empty">A galeria deste horario ainda nao tem fotos.</p>
                  ) : (
                    selecionado.fotos.map((foto) => (
                      <article key={foto.id} className="photo-card">
                        <img src={foto.dataUrl} alt={foto.nome} />
                        <div>
                          <strong>{foto.etapa}</strong>
                          <small>{foto.nome}</small>
                          <button onClick={() => removerFoto(selecionado.id, foto.id)}>Remover</button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="empty">Crie um agendamento para liberar camera e galeria.</p>
            )}
          </section>
        </section>

        <section className="panel ai-panel" id="ia">
          <AssistenteIA agendamento={selecionado} />
        </section>
      </main>
    </div>
  )
}

export default App
