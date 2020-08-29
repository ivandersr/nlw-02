import React, { useCallback, useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage';

const Favorites:React.FC = () => {
  const [favorites, setFavorites] = useState<Teacher[]>([]);
  const loadFavorites = useCallback(() => {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);

        setFavorites(favoritedTeachers);
      }
    });
  }, []);

  useFocusEffect(() => {
    loadFavorites();
  });

  return (
  <View style={styles.container}>
    <PageHeader title="Meus proffys favoritos" />

    <ScrollView 
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        style={styles.teacherList}
      >
        {favorites.map((teacher: Teacher) => {
          return (
            <TeacherItem 
              key={teacher.id}
              teacher={teacher}
              favorited
            />
          )
        })
        }
      </ScrollView>
  </View>
  );
}

export default Favorites;