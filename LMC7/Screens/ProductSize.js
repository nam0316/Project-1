import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProductSize = ({ sizeImageUrl }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>사이즈 정보</Text>
      <Text style={styles.additionalInfo}>
        이 제품은 S, M, L, XL, XXL 사이즈로 제공됩니다. 상세한 사이즈 정보는 아래와 같습니다:
        {"\n\n"}- S: 어깨 44cm, 가슴 48cm, 소매 60cm, 총장 67cm
        {"\n"}- M: 어깨 46cm, 가슴 50cm, 소매 62cm, 총장 69cm
        {"\n"}- L: 어깨 48cm, 가슴 52cm, 소매 64cm, 총장 71cm
        {"\n"}- XL: 어깨 50cm, 가슴 54cm, 소매 66cm, 총장 73cm
        {"\n"}- XXL: 어깨 52cm, 가슴 56cm, 소매 68cm, 총장 75cm
      </Text>
      {sizeImageUrl && (
        <Image
          source={{ uri: sizeImageUrl }}
          style={styles.sizeImage}
          onError={(e) => console.error('Failed to load image', e)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  additionalInfo: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  sizeImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default ProductSize;
