import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const ProductInformation = ({ infoImageUrls }) => {
  console.log('infoImageUrls in ProductInformation:', infoImageUrls);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.description}>상품 정보</Text>
      <Text style={styles.additionalInfo}>
        이 제품은 최고 품질의 소재로 제작되었으며, 스타일과 편안함을 동시에 제공합니다. 다양한 색상과 사이즈로 제공되어 모든 취향에 맞게 선택할 수 있습니다. 지금 바로 구매하여 멋진 스타일을 완성하세요!
      </Text>
      {infoImageUrls && infoImageUrls.length > 0 ? (
        infoImageUrls.map((url, index) => (
          url !== "null" && (
            <Image 
              key={index} 
              source={{ uri: url }} 
              style={styles.infoImage} 
              onError={(e) => console.error('Failed to load image', e)}
            />
          )
        ))
      ) : (
        <Text style={styles.noImageText}>이미지 정보가 없습니다.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  infoImage: {
    width: '100%',  
    height: 800,
    resizeMode: 'contain',
    marginVertical: 5,  // 위아래 간격 조정
  },
  noImageText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ProductInformation;
