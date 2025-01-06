import { PdfViewer } from './components/PdfViewer'
import './App.css'
import pdf from './assets/cte.pdf'
import { notification } from 'antd'

function App() {
  const handleClick = (e: any) => {
    const text = `X:${e.clientX}, Y:${e.clientY}`
    navigator.clipboard.writeText(text)
    notification.success({
      message: 'Coordenadas copiadas',
      description: text,
      placement: 'topRight',
    })
  }

  return (
    <div className="App" onClick={(e)=> handleClick(e)}>
      <h1>PDF Navigation</h1>
      <PdfViewer pdfUrl={pdf} />
    </div>
  )
}

export default App
