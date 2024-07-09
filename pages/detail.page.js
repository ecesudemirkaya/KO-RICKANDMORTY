import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import SearchBar from '../components/search.bar';
import Pagination from '../components/pagination';

const DetailPage = ({ route, navigation }) => {
    const { id } = route.params;
    const [episode, setEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [allLoaded, setAllLoaded] = useState(false);

    const fetchEpisodeDetail = async () => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
            setEpisode(response.data);

            const characterResponses = await Promise.all(response.data.characters.map(url => axios.get(url)));
            const characterData = characterResponses.map(res => res.data);
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

    if (loading) {
        return <Text>Loading...</Text>;
    }

    const renderCharacter = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('CharacterPage', { url: item.url })}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={style.BG}>
            <SearchBar onSearch={handleSearch} />
            <Text>Name: {episode.name}</Text>
            <Text>Episode: {episode.episode}</Text>
            <Text>Air date: {episode.air_date}</Text>
            <Text>Characters:</Text>
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
    }
});

export default DetailPage;
