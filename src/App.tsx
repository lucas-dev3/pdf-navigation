import { PdfViewer } from './components/PdfViewer'
import './App.css'
import pdf from './assets/cte.pdf'

function App() {
  return (
    <div className="App">
      <h1>PDF Navigation</h1>
      <PdfViewer pdfUrl={pdf} />
    </div>
  )
}

export default App
