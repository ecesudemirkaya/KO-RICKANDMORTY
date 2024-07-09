import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavoriteCharacters, removeFavoriteCharacter } from '../components/fav.char.slice';
import { Ionicons } from '@expo/vector-icons';

const FavoriteCharactersPage = () => {
    const favoriteCharacters = useSelector(selectFavoriteCharacters);
    const dispatch = useDispatch();
    const [displayedCharacters, setDisplayedCharacters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allLoaded, setAllLoaded] = useState(false);
    const [page, setPage] = useState(1);

    const itemsPerPage = 10;

    const fetchMoreCharacters = (page) => {
        if (loading || allLoaded) return;

        setLoading(true);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const newCharacters = favoriteCharacters.slice(start, end);

        const uniqueNewCharacters = newCharacters.filter(character =>
            !displayedCharacters.some(displayedCharacter => displayedCharacter.id === character.id)
        );

        if (uniqueNewCharacters.length === 0 || newCharacters.length < itemsPerPage) {
            setAllLoaded(true);
        } else {
            setDisplayedCharacters((prev) => [...prev, ...uniqueNewCharacters]);
            setPage(prevPage => prevPage + 1);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchMoreCharacters(page);
    }, [page]);

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
        dispatch(removeFavoriteCharacter(id));
        setDisplayedCharacters((prev) => prev.filter(character => character.id !== id));
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
            <Text style={styles.title}>Favori Karakterler</Text>
            {favoriteCharacters.length === 0 ? (
                <Text style={styles.message}>Henüz favori karakter yok.</Text>
            ) : (
                <FlatList
                    data={displayedCharacters}
                    renderItem={renderCharacter}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => fetchMoreCharacters(page)}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? <Text>Loading...</Text> : null}
                    contentContainerStyle={styles.flatListContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    BG: {
        backgroundColor: '#e6e6fa',
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    message: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    tinyContainer: {
        backgroundColor: 'white',
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    characterName: {
        fontSize: 20,
    },
    flatListContainer: {
        paddingBottom: 20,
    },
});

export default FavoriteCharactersPage;
