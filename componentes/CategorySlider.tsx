import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import EventoCard from './eventoCard';

interface CategorySliderProps {
  category: string;
  eventos: any[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ category, eventos }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category}</Text>
      <FlatList
        horizontal
        data={eventos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <EventoCard evento={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sliderContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  sliderContent: {
    paddingHorizontal: 10,
  },
});

export default CategorySlider;