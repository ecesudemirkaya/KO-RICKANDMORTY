import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavoriteCharacters, removeFavoriteCharacter } from '../components/fav.char.slice';
import { Ionicons } from '@expo/vector-icons';

const FavoriteCharactersPage = () => {
    const favoriteCharacters = useSelector(selectFavoriteCharacters);
    const dispatch = useDispatch();

    const confirmDelete = (character) => {
        Alert.alert(
            `${character.name} isimli karakteri favorilerden kaldırmak istediğinize emin misiniz?`,
            '',
            [
                {
                    text: 'Hayır',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Evet',
                    onPress: () => handleDelete(character.id),
                }
            ]
        );
    };

    const handleDelete = (id) => {
        dispatch(removeFavoriteCharacter({ characterId: id }));
    };

    const renderCharacter = ({ item }) => (
        <View style={styles.tinyContainer}>
            <Text style={styles.characterName}>{item.name}</Text>
            <TouchableOpacity onPress={() => confirmDelete(item)}>
                <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.BG}>
            <Text style={styles.header}>Favori Karakterler</Text>
            <FlatList
                data={favoriteCharacters}
                renderItem={renderCharacter}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    BG: {
        backgroundColor: '#e6e6fa',
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
        marginHorizontal: 16,
        textAlign: 'center',
    },
    tinyContainer: {
        backgroundColor: 'white',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    characterName: {
        fontSize: 18,
    },
});

export default FavoriteCharactersPage;
