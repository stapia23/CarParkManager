import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Redirect, useRouter } from 'expo-router';
import {View,Text,Button,StyleSheet,Alert,TextInput,FlatList,} from 'react-native';
import CreateUserForm from './CreateUserForm';
import {createUserWithEmailAndPassword,getAuth,} from 'firebase/auth';
import {doc,setDoc,serverTimestamp,getFirestore,collection,getDocs,deleteDoc,updateDoc,query,where,} from 'firebase/firestore';
import globalStyles from '../styles/global';
import EditValet from './EditValet';

export default function UsersScreen() {
  const { role } = useAuth();
  const router = useRouter();
  const [creatingValet, setCreatingValet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valetUsers, setValetUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedValet, setSelectedValet] = useState<any | null>(null);

  const db = getFirestore();

  if (role !== 'admin') {
    return <Redirect href="/login" />;
  }

  const handleCreateUser = async (userData: any) => {
    setLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const { user } = userCredential;

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: userData.email,
        role: userData.role,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Valet profile created successfully!');
      setCreatingValet(false);
      fetchValetUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      Alert.alert('Error', error.message || 'Could not create user.');
    } finally {
      setLoading(false);
    }
  };

  const fetchValetUsers = async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'valet'));
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setValetUsers(users);
    } catch (error) {
      console.error('Error fetching valets:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      Alert.alert('Deleted', 'Valet deleted successfully');
      fetchValetUsers();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not delete user');
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedValet(user);
    setIsModalVisible(true);
  };

  const handleSaveEditedUser = async (
    userId: string,
    updatedData: { name: string; email: string; phoneNumber: string }
  ) => {
    try {
      await updateDoc(doc(db, 'users', userId), updatedData);
      fetchValetUsers();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not update user');
    } finally {
      setIsModalVisible(false);
      setSelectedValet(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedValet(null);
  };

  useEffect(() => {
    fetchValetUsers();
  }, []);

  const filteredUsers = valetUsers.filter(user =>
    (user.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Manage Users</Text>

      {loading && <Text>Creating Valet...</Text>}
      {!creatingValet ? (
        <Button title="Create Valet" onPress={() => setCreatingValet(true)} />
      ) : (
        <CreateUserForm onCreateUser={handleCreateUser} loading={loading} />
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or email"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userText}>{item.name} - {item.email}</Text>
            <Button title="Edit" onPress={() => handleEditUser(item)} />
            <Button title="Delete" color="red" onPress={() => handleDeleteUser(item.id)} />
          </View>
        )}
      />

      {selectedValet && (
        <EditValet
          visible={isModalVisible}
          valetId={selectedValet.id}
          valetName={selectedValet.name}
          valetEmail={selectedValet.email}
          valetPhone={selectedValet.phoneNumber}
          onClose={handleCloseModal}
          onSave={(updatedData) => handleSaveEditedUser(selectedValet.id, updatedData)}
        />
      )}

      <Button
        title="Back to Dashboard"
        onPress={() => router.push('/(admin)/dashboard')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  userCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  userText: {
    marginBottom: 5,
  },
});