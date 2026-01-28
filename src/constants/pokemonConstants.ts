// Переводы типов покемонов на русский язык
export const TYPE_TRANSLATIONS: Record<string, string> = {
   normal: 'Нормальный',
   fire: 'Огонь',
   water: 'Вода',
   grass: 'Трава',
   electric: 'Электричество',
   ice: 'Лёд',
   fighting: 'Боевой',
   poison: 'Яд',
   ground: 'Земля',
   flying: 'Полёт',
   psychic: 'Психика',
   bug: 'Жук',
   rock: 'Камень',
   ghost: 'Призрак',
   dragon: 'Дракон',
   dark: 'Тьма',
   steel: 'Сталь',
   fairy: 'Фея',
};

// Переводы редкости на русский язык
export const RARITY_TRANSLATIONS: Record<string, string> = {
   common: 'Обычный',
   legendary: 'Легендарный',
   mythical: 'Мифический',
};

// Градиенты для каждого типа покемонов
export const TYPE_GRADIENTS: Record<string, string> = {
   normal: 'linear-gradient(27.44deg, #A8A878 20.18%, #C6C6A7 88.08%)',
   fire: 'linear-gradient(27.44deg, #F08030 20.18%, #FF9C54 88.08%)',
   water: 'linear-gradient(27.44deg, #6890F0 20.18%, #9DB7F5 88.08%)',
   grass: 'linear-gradient(27.44deg, #418E50 20.18%, #59E49C 88.08%)',
   electric: 'linear-gradient(27.44deg, #FFAB38 20.18%, #FFDA27 88.08%)',
   ice: 'linear-gradient(27.44deg, #98D8D8 20.18%, #BCE6E6 88.08%)',
   fighting: 'linear-gradient(27.44deg, #C03028 20.18%, #E74347 88.08%)',
   poison: 'linear-gradient(27.44deg, #A040A0 20.18%, #C159C1 88.08%)',
   ground: 'linear-gradient(27.44deg, #E0C068 20.18%, #EDD591 88.08%)',
   flying: 'linear-gradient(27.44deg, #A890F0 20.18%, #C6B7F5 88.08%)',
   psychic: 'linear-gradient(27.44deg, #F85888 20.18%, #FF99AA 88.08%)',
   bug: 'linear-gradient(27.44deg, #A8B820 20.18%, #C6D16E 88.08%)',
   rock: 'linear-gradient(27.44deg, #B8A038 20.18%, #D1BC5C 88.08%)',
   ghost: 'linear-gradient(27.44deg, #705898 20.18%, #A292BC 88.08%)',
   dragon: 'linear-gradient(27.44deg, #7038F8 20.18%, #A27DFA 88.08%)',
   dark: 'linear-gradient(27.44deg, #705848 20.18%, #A29288 88.08%)',
   steel: 'linear-gradient(27.44deg, #B8B8D0 20.18%, #D1D1E0 88.08%)',
   fairy: 'linear-gradient(27.44deg, #EE99AC 20.18%, #F5BED6 88.08%)',
};

// Специальные градиенты для редкости
export const RARITY_GRADIENTS: Record<string, string> = {
   mythical: 'linear-gradient(27.44deg, #090816 20.18%, #4A40B9 88.08%)', // Темный мистический
   legendary: 'linear-gradient(27.44deg, #E91E63 20.18%, #9C27B0 88.08%)', // Яркий перламутровый с розовым
};
