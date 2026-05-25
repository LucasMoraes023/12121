import { useRef, useState } from 'react'

const etapas = ['Antes', 'Durante', 'Depois', 'Detalhe', 'Avaria']

export default function Camera({ agendamento, onPhotoAdd }) {
  const fileInput = useRef(null)
  const [etapa, setEtapa] = useState(etapas[0])
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')

  function openCamera() {
    fileInput.current?.click()
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file || !agendamento) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setPreview(dataUrl)
      setFileName(file.name)
      onPhotoAdd(agendamento.id, {
        dataUrl,
        nome: file.name,
        etapa,
        tamanho: file.size,
        criadaEm: new Date().toISOString()
      })
      event.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="camera-box">
      <div>
        <p className="eyebrow">Camera do celular</p>
        <h3>Adicionar foto ao horario {agendamento?.horario}</h3>
        <p>As fotos ficam salvas na galeria deste agendamento.</p>
      </div>

      <div className="camera-controls">
        <select value={etapa} onChange={(event) => setEtapa(event.target.value)}>
          {etapas.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button className="button primary" type="button" onClick={openCamera}>
          Tirar foto
        </button>
      </div>

      {preview && (
        <div className="latest-photo">
          <img src={preview} alt="Ultima foto capturada" />
          <span>Ultima foto: {fileName}</span>
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        hidden
      />
    </div>
  )
}
