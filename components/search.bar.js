import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (text) => {
        setSearchTerm(text);
        onSearch(text);
    };

    return (
        <View style={styles.Container}>
            <View style={styles.Main}>
                <TextInput
                    style={styles.Input}
                    placeholder="Search"
                    value={searchTerm}
                    onChangeText={handleSearch}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
    },
    Main: {
        marginTop: 30,
        backgroundColor: '#FFF',
        width: 350,
        height: 50,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#C0C0C0',
    },
    Input: {
        marginLeft: 10,
        marginTop: 5,
        flex: 1,
        padding: 10,
    },
});
