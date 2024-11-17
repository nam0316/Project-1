import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisterSize = ({ route, navigation }) => {
  const { subCategory, userID } = route.params;
  const [inputs, setInputs] = useState({
    totalLength: '',
    shoulderWidth: '',
    chestWidth: '',
    sleeveLength: '',
    waistWidth: '',
    hipWidth: '',
    thighWidth: '',
    rise: '',
    hemWidth: '',
    height: '',
    width: '',
    depth: '',
    strapLength: '',
    ankleHeight: '',
    heelHeight: '',
    ballWidth: '',
    footLength: '',
    brimLength: '',
    headCircumference: '',
    length: '',
  });

  const handleChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSave = async () => {
    console.log('Save button clicked');
    console.log('userID:', userID);
    console.log('subCategory:', subCategory);
    console.log('inputs:', inputs);

    try {
      const response = await axios.post('http://192.168.45.126:3000/save-size', {
        userID,
        subCategory,
        ...inputs,
      });

      console.log('Size saved successfully:', response.data);
      alert('Size saved successfully');
    } catch (error) {
      console.error('Error saving size:', error);
      alert('Error saving size');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total Length</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('totalLength', text)}
        value={inputs.totalLength}
      />
      <Text style={styles.label}>Shoulder Width</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('shoulderWidth', text)}
        value={inputs.shoulderWidth}
      />
      <Text style={styles.label}>Chest Width</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('chestWidth', text)}
        value={inputs.chestWidth}
      />
      <Text style={styles.label}>Sleeve Length</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleChange('sleeveLength', text)}
        value={inputs.sleeveLength}
      />
      {/* 다른 입력 필드들을 여기에 추가 */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginVertical: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RegisterSize;
