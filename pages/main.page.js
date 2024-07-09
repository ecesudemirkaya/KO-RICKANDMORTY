import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import SearchBar from '../components/search.bar';
import Pagination from '../components/pagination';

const MainPage = ({ navigation }) => {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEpisodes = async (page) => {
    if (loading || allLoaded) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`);
      const newEpisodes = response.data.results;
      setEpisodes(prevEpisodes => [...prevEpisodes, ...newEpisodes]);

      if (searchTerm) {
        setFilteredEpisodes([
          ...episodes,
          ...newEpisodes.filter(episode =>
            episode.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ]);
      } else {
        setFilteredEpisodes(prevEpisodes => [...prevEpisodes, ...newEpisodes]);
      }

      if (response.data.info.next === null) {
        setAllLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = episodes.filter(episode =>
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
    <TouchableOpacity onPress={() => navigation.navigate('DetailPage', { id: item.id })}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={style.BG}>
      <SearchBar onSearch={handleSearch} />
      <Pagination
        data={filteredEpisodes}
        renderItem={renderEpisode}
        fetchMoreData={fetchEpisodes}
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

export default MainPage;
