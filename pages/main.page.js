import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from '../components/search.bar';

const MainPage = ({ navigation }) => {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const fetchEpisodes = async (page) => {
    if (loading || allLoaded) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`);
      const newEpisodes = response.data.results;

      setEpisodes((prevEpisodes) => [...prevEpisodes, ...newEpisodes]);

      if (searchTerm) {
        const filteredNewEpisodes = newEpisodes.filter((episode) =>
          episode.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEpisodes((prevEpisodes) => [...prevEpisodes, ...filteredNewEpisodes]);
      } else {
        setFilteredEpisodes((prevEpisodes) => [...prevEpisodes, ...newEpisodes]);
      }

      if (response.data.info.next === null) {
        setAllLoaded(true);
      } else {
        setPage(page + 1);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEpisodes(page);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = episodes.filter((episode) =>
        episode.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEpisodes(filtered);
    } else {
      setFilteredEpisodes(episodes);
    }
  }, [searchTerm, episodes]);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const renderEpisode = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('DetailPage', { id: item.id })} style={styles.tinyContainer}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.BG}>
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={handleSearch} />
      </View>
      <FlatList
        data={filteredEpisodes}
        renderItem={renderEpisode}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => fetchEpisodes(page)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
      />
      <TouchableOpacity style={styles.favButton} onPress={() => navigation.navigate('FavoriteCharactersPage')}>
        <Icon name="heart" size={40} color="blue" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  BG: {
    backgroundColor: '#e6e6fa',
    flex: 1,
  },
  searchBarContainer: {
    marginBottom: 20, 
  },
  favButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
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
});

export default MainPage;
