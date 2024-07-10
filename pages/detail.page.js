import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from '../components/search.bar';
import { useDispatch, useSelector } from 'react-redux';
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
    const favoriteCharacters = useSelector(state => state.favoriteCharacters.characters);

    const fetchEpisodeDetail = async () => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
            setEpisode(response.data);

            const characterResponses = await Promise.all(response.data.characters.map(url => axios.get(url)));
            const characterData = characterResponses.map(res => ({ ...res.data }));
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

    const toggleFavorite = (character) => {
        const isFavorite = favoriteCharacters.some(char => char.id === character.id);
        if (isFavorite) {
            dispatch(removeFavoriteCharacter({ characterId: character.id }));
        } else {
            dispatch(addFavoriteCharacter({ character }));
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    const renderCharacter = ({ item }) => {
        const isFavorite = favoriteCharacters.some(char => char.id === item.id);
        return (
            <TouchableOpacity onPress={() => navigation.navigate('CharacterPage', { url: item.url })} style={styles.tinyContainer}>
                <Text>{item.name}</Text>
                <TouchableOpacity style={styles.favoriteIcon} onPress={() => toggleFavorite(item)}>
                    <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={isFavorite ? 'red' : 'black'} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.BG}>
            <SearchBar onSearch={handleSearch} />
            <View style={styles.infoContainer}>
                <Text>Name: {episode.name}</Text>
                <Text>Episode: {episode.episode}</Text>
                <Text>Air date: {episode.air_date}</Text>
            </View>
            <View style={styles.charactersHeader}>
                <Text style={styles.charactersHeaderText}>Characters:</Text>
            </View>
            <FlatList
                data={filteredCharacters}
                renderItem={renderCharacter}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => fetchEpisodeDetail()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <Text>Loading...</Text> : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 16,
    },
    charactersHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tinyContainer: {
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 8,
        marginHorizontal: 16,
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
