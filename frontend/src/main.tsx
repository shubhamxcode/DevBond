import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './Redux/store'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './components/chatarea/chat.tsx'

createRoot(document.getElementById('root')!).render(
  
    <StrictMode>
      <SocketProvider>
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </Provider>
      </SocketProvider>
    </StrictMode>
)
