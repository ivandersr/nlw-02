import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';

import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

const TeacherList: React.FC = () => {
  const [areFiltersVisible, setAreFiltersVisible] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [subject, setSubject] = useState('');
  const [week_day, setWeek_day] = useState('');
  const [time, setTime] = useState('');
  const [teachers, setTeachers] = useState([]);

  const loadFavorites = useCallback(() => {
    AsyncStorage.getItem('favorites').then(response => {
      if (response) {
        const favoritedTeachers = JSON.parse(response);

        const favoritedTeacherIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        });
        setFavorites(favoritedTeacherIds);
      }
    });
  }, []);

  const handleToggleFiltersVisible = useCallback(()=> {
    setAreFiltersVisible(!areFiltersVisible);
  }, [areFiltersVisible]);

  const handleFiltersSubmit = useCallback(async () => {
    loadFavorites();
    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      }
    });
    setAreFiltersVisible(false);
    setTeachers(response.data);

     
  }, []);
  

  return (
    <View style={styles.container}>
      <PageHeader 
        title="Proffys disponíveis" 
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={28} color="#fff" />
          </BorderlessButton>
        )}
      >
        { areFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput  
              style={styles.input}
              value={subject}
              onChangeText={text => setSubject(text)}
              placeholder="Qual a matéria?"
              placeholderTextColor="#c1bccc"
            />
            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput  
                  style={styles.input}
                  placeholder="Qual o dia?"
                  value={week_day}
                  onChangeText={text => setWeek_day(text)}
                  placeholderTextColor="#c1bccc"
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput  
                  style={styles.input}
                  placeholder="Qual horário?"
                  value={time}
                  onChangeText={text => setTime(text)}
                  placeholderTextColor="#c1bccc"
                />
              </View>
            </View>
            <RectButton 
              style={styles.submitButton}
              onPress={()=>handleFiltersSubmit()}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
        
      </PageHeader>
      <ScrollView 
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        style={styles.teacherList}
      >
        {teachers.map((teacher: Teacher) => { 
          return (
            <TeacherItem 
              key={teacher.id} 
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          )
        })}
      </ScrollView>
      
    </View>
  );
};

export default TeacherList;
