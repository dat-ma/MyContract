import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Web3ModalProvider } from "./providers/Web3ModalProvider.tsx";
import bgGradientRight from "./assets/background/bgGradient-right.png"
import bgGradientLeft from "./assets/background/bgGradient-left.png";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3ModalProvider>
      <img className='absolute right-0 top-0 z-0' srcSet={bgGradientRight} alt="" style={{ height: '100%' }} />
      <img className='absolute left-0 bottom-0 z-0' srcSet={bgGradientLeft} alt="" style={{ height: '100%' }} />
      <App />
    </Web3ModalProvider>
  </React.StrictMode>,
)
