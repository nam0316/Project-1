import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const PersonalColorModal = ({ isVisible, onClose, userID }) => {
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [showWebView, setShowWebView] = useState(false);

  const handlePersonalColorSave = async () => {
    if (!selectedColor) {
      alert('퍼스널 컬러를 선택하세요.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://192.168.45.126:3000/savePersonalColor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID,
          personalColor: selectedColor,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Personal Color Saved:', data);
        alert('퍼스널 컬러가 저장되었습니다.');
        onClose();
      } else {
        console.error('Error saving personal color:', data);
        alert('퍼스널 컬러 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        {showWebView ? (
          <View style={{ flex: 1, width: '100%' }}>
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loadingIndicator}
              />
            )}
            <WebView
              source={{ uri: 'http://112.167.147.182:5000/' }} // 원하는 URL로 변경
              style={{ flex: 1 }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                alert('웹페이지를 로드할 수 없습니다.');
                setLoading(false);
              }}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowWebView(false)}>
              <Text style={styles.cancelButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>퍼스널 컬러 등록</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.colorButton,
                  selectedColor === 'cool' ? styles.selectedButton : null,
                ]}
                onPress={() => setSelectedColor('cool')}
              >
                <Text style={styles.buttonText}>쿨톤</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.colorButton,
                  selectedColor === 'warm' ? styles.selectedButton : null,
                ]}
                onPress={() => setSelectedColor('warm')}
              >
                <Text style={styles.buttonText}>웜톤</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <TouchableOpacity style={styles.saveButton} onPress={handlePersonalColorSave}>
                  <Text style={styles.saveButtonText}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.webButton} onPress={() => setShowWebView(true)}>
                  <Text style={styles.webButtonText}>퍼스널 컬러 진단</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  colorButton: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  webButton: {
    backgroundColor: '#17a2b8',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  webButtonText: {
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
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default PersonalColorModal;
