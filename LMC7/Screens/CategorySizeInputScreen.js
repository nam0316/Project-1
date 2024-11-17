import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const categoryFields = {
  '상의': ['총장', '어깨너비', '가슴단면', '소매길이'],
  '아우터': ['총장', '어깨너비', '가슴단면', '소매길이'],
  '원피스': ['총장', '어깨너비', '가슴단면', '소매길이'],
  '하의': ['허리둘레', '길이', '엉덩이둘레'],
  '가방': ['너비', '높이', '깊이'],
  '스니커즈': ['사이즈'],
  '신발': ['사이즈'],
  '모자': ['둘레'],
  '레그웨어/속옷': ['허리둘레', '길이'],
};

const CategorySizeInputScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const [sizes, setSizes] = useState({});

  const handleSave = () => {
    // 데이터를 저장하고 MyInfoScreen으로 돌아갑니다.
    navigation.goBack();
  };

  const handleChange = (field, value) => {
    setSizes(prevSizes => ({
      ...prevSizes,
      [field]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{category} 사이즈 입력</Text>
      {categoryFields[category].map(field => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={`${field} 입력`}
          value={sizes[field]}
          onChangeText={(value) => handleChange(field, value)}
        />
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>취소</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategorySizeInputScreen;
