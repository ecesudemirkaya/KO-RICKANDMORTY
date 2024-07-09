import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const CharacterPage = ({ route }) => {
    const { url } = route.params;
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCharacterDetail = async () => {
        try {
            const response = await axios.get(url);
            setCharacter(response.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCharacterDetail();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View
            style={style.BG}>
            <Text>Name: {character.name}</Text>
            <Text>Status: {character.status}</Text>
            <Text>Species: {character.species}</Text>
            <Text>Gender: {character.gender}</Text>
        </View>
    );
};

const style = StyleSheet.create({
    BG: {
        backgroundColor: '#E6E6FA',
        flex: 1,
    }
});

export default CharacterPage;
