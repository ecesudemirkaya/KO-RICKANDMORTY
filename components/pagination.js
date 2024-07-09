import React, { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';

const Pagination = ({ data, renderItem, fetchMoreData, loading, allLoaded }) => {
  const [page, setPage] = useState(1);

  const loadMoreData = () => {
    if (!loading && !allLoaded) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchMoreData(page);
  }, [page]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <Text>Loading...</Text> : null}
    />
  );
};

export default Pagination;
