import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const DetailPage = ({ route, navigation }) => {
    const { id } = route.params;
    const [episode, setEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState([]);

    const fetchEpisodeDetail = async () => {
        try {
            const response = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
            setEpisode(response.data);

            // Fetch character details
            const characterResponses = await Promise.all(response.data.characters.map(url => axios.get(url)));
            const characterData = characterResponses.map(res => res.data);
            setCharacters(characterData);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEpisodeDetail();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    const renderCharacter = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('CharacterPage', { url: item.url })}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <Text>Name: {episode.name}</Text>
            <Text>Episode: {episode.episode}</Text>
            <Text>Air date: {episode.air_date}</Text>
            <Text>Characters:</Text>
            <FlatList
                data={characters}
                renderItem={renderCharacter}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

export default DetailPage;
