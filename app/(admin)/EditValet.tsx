import React, { useState, useEffect } from 'react';
import {Modal,View,Text,TextInput,Button,StyleSheet,TouchableWithoutFeedback,Keyboard,} from 'react-native';

interface EditValetProps {
  visible: boolean;
  valetId: string;
  valetName: string;
  valetEmail?: string;
  valetPhone?: string;
  onClose: () => void;
  onSave: (updatedData: { name: string; email: string; phoneNumber: string }) => void;
}

const EditValet: React.FC<EditValetProps> = ({
  visible,
  valetId,
  valetName,
  valetEmail = '',
  valetPhone = '',
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(valetName);
  const [email, setEmail] = useState(valetEmail);
  const [phoneNumber, setPhoneNumber] = useState(valetPhone);

  useEffect(() => {
    setName(valetName);
    setEmail(valetEmail);
    setPhoneNumber(valetPhone);
  }, [valetName, valetEmail, valetPhone]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, email, phoneNumber });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Valet</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <View style={styles.buttonGroup}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={onClose} color="red" />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditValet;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});