import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const favoriteCharactersSlice = createSlice({
    name: 'favoriteCharacters',
    initialState: {
        characters: [],
    },
    reducers: {
        addFavoriteCharacter: (state, action) => {
            const { character } = action.payload;
            const existingCharacter = state.characters.find(char => char.id === character.id);

            if (!existingCharacter && state.characters.length < 10) {
                state.characters.push(character);
                AsyncStorage.setItem('favoriteCharacters', JSON.stringify(state.characters))
                    .catch(error => console.error('AsyncStorage error:', error));
            } else if (state.characters.length >= 10) {
                alert('Favori karakter ekleme sayısını aştınız. Başka bir karakteri favorilerden çıkarmalısınız.');
            }
        },
        removeFavoriteCharacter: (state, action) => {
            const { characterId } = action.payload;
            state.characters = state.characters.filter(char => char.id !== characterId);
            AsyncStorage.setItem('favoriteCharacters', JSON.stringify(state.characters))
                .catch(error => console.error('AsyncStorage error:', error));
        },
        setFavoriteCharacters: (state, action) => {
            state.characters = action.payload;
        },
    },
});

export const { addFavoriteCharacter, removeFavoriteCharacter, setFavoriteCharacters } = favoriteCharactersSlice.actions;

export default favoriteCharactersSlice.reducer;

export const selectFavoriteCharacters = (state) => state.favoriteCharacters.characters;
export const isCharacterFavorite = (state, characterId) => state.favoriteCharacters.characters.some(char => char.id === characterId);
