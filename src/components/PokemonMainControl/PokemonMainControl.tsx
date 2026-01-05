import './PokemonMainControl.css'

const PokemonMainControl = () => {
   return (
      <>
         <div className='content__control'>
            <div className='control__wrapper'>
               <input className='wrapper__search' type = "text" name='search' placeholder='Поиск'></input>
               <div className='wrapper__selectbar'>
                  <select className='selectbar__selector'></select>
                  <select className='selectbar__selector'></select>
                  <select className='selectbar__selector'></select>
               </div>
            </div>
         </div>
      </>
   )
}

export default PokemonMainControl

