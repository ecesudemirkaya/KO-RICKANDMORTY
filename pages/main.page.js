import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import SearchBar from '../components/search.bar';

const MainPage = ({ navigation }) => {
  const [episodes, setEpisodes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchEpisodes = async () => {
    if (loading || allLoaded) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`);
      setEpisodes(prevEpisodes => [...prevEpisodes, ...response.data.results]);

      if (response.data.info.next === null) {
        setAllLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEpisodes();
  }, [page]);

  const loadMoreEpisodes = () => {
    if (!loading && !allLoaded) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderEpisode = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetailPage', { id: item.id })}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <SearchBar
        style={style.BG}
      />
      <FlatList
        data={episodes}
        renderItem={renderEpisode}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMoreEpisodes}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
      />
    </View>
  );
};

const style = StyleSheet.create({
  BG: {
    backgroundColor: 'e6e6fa',
    flex: 1,
  }
});

export default MainPage;