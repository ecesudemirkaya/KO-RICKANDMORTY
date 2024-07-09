import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import SearchBar from '../components/search.bar';
import Pagination from '../components/pagination';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { addFavoriteCharacter, removeFavoriteCharacter } from '../components/fav.char.slice';

const DetailPage = ({ route, navigation }) => {
    const { id } = route.params;
    const [episode, setEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [allLoaded, setAllLoaded] = useState(false);
    const dispatch = useDispatch();

    const fetchEpisodeDetail = async () => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
            setEpisode(response.data);

            const characterResponses = await Promise.all(response.data.characters.map(url => axios.get(url)));
            const characterData = characterResponses.map(res => ({ ...res.data, isFavorite: false }));
            setCharacters(characterData);
            setFilteredCharacters(characterData);

            if (characterData.length >= response.data.characters.length) {
                setAllLoaded(true);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEpisodeDetail();
    }, []);

    const handleSearch = (text) => {
        setSearchTerm(text);
        if (text) {
            const filtered = characters.filter(character =>
                character.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredCharacters(filtered);
        } else {
            setFilteredCharacters(characters);
        }
    };

    const toggleFavorite = (index, character) => {
        const updatedCharacters = [...filteredCharacters];
        updatedCharacters[index].isFavorite = !updatedCharacters[index].isFavorite;
        setFilteredCharacters(updatedCharacters);

        const { id, name, status, species, type, gender, origin, location, image, episode, url } = character;
        if (character.isFavorite) {
            dispatch(addFavoriteCharacter({ character: { id, name, status, species, type, gender, origin, location, image, episode, url } }));
        } else {
            dispatch(removeFavoriteCharacter({ characterId: id }));
        }
    };


    if (loading) {
        return <Text>Loading...</Text>;
    }

    const renderCharacter = ({ item, index }) => (
        <TouchableOpacity onPress={() => navigation.navigate('CharacterPage', { url: item.url })} style={style.tinyContainer}>
            <Text>{item.name}</Text>
            <TouchableOpacity style={style.favoriteIcon} onPress={() => toggleFavorite(index, item)}>
                <Icon name={item.isFavorite ? 'heart' : 'heart-outline'} size={20} color={item.isFavorite ? 'red' : 'black'} />
            </TouchableOpacity>
        </TouchableOpacity>
    );


    return (
        <View style={style.BG}>
            <SearchBar onSearch={handleSearch} />
            <View style={style.infoContainer}>
                <Text>Name: {episode.name}</Text>
                <Text>Episode: {episode.episode}</Text>
                <Text>Air date: {episode.air_date}</Text>
            </View>
            <View style={style.charactersHeader}>
                <Text style={style.charactersHeaderText}>Characters:</Text>
            </View>
            <Pagination
                data={filteredCharacters}
                renderItem={renderCharacter}
                fetchMoreData={fetchEpisodeDetail}
                loading={loading}
                allLoaded={allLoaded}
            />
        </View>
    );
};

const style = StyleSheet.create({
    BG: {
        backgroundColor: '#e6e6fa',
        flex: 1,
    },
    infoContainer: {
        backgroundColor: 'white',
        padding: 12,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 8,
        marginHorizontal: 16,
    },
    charactersHeader: {
        alignItems: 'center',
    },
    charactersHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tinyContainer: {
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    favoriteIcon: {
        padding: 5,
    },
});

export default DetailPage;
