import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PokemonListPage from './pages/PokemonListPage/PokemonListPage';
import PokemonDetailPage from './pages/PokemonDetailPage/PokemonDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PokemonListPage />} />
        <Route path='/pokemon/:id' element={<PokemonDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
