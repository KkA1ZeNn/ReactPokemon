import PokemonMainControl from '../PokemonMainControl/PokemonMainControl';
import PokemonMainGallery from '../PokemonMainGallery/PokemonMainGallery';

import './PokemonMain.css'


const PokemonMain = () => {
   return (
      <>
         <div className='pokemon-main__content'>
            <div className='content__logo'></div>
            <PokemonMainControl/>
            <PokemonMainGallery />
         </div>
      </>
   )
}

export default PokemonMain;