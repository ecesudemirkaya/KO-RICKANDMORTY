import { configureStore } from '@reduxjs/toolkit';
import favoriteCharactersReducer from './components/fav.char.slice';

const store = configureStore({
    reducer: {
        favoriteCharacters: favoriteCharactersReducer,
    },
});

export default store;
