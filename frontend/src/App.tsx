import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Auction from './pages/Auction.tsx'
import Header from './components/header/Header.tsx';

function App() {
  const navItem = [
    {
      value: "Auction",
      url: "/",
      element: <Auction />
    },
    {
      value: "Transaction history",
      url: "/trans-history",
      element: <h1>Hello</h1>
    }
  ]
  
  return (
    <BrowserRouter>
      <Header navItem={navItem} logo="/image.png" />
      <Routes>
        {navItem.map((item) => <Route path={item.url} element={item.element} /> )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
