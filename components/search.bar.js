import react from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar() {
    return (
        <View
            style={style.Container}>
            <View
                style={style.Main}>
                <TextInput style={style.Input}></TextInput>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
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
        borderColor: 'C0C0C0',

    },
    Input: {
        marginLeft: 10,
        marginTop: 5,
        flex: 1,
        padding: 10,
    },
})