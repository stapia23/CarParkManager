import { initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "temp",
  authDomain: "temp",
  projectId: "temp",
  storageBucket: "temp",
  messagingSenderId: "temp",
  appId: "temp",
  measurementId: "temp",
};




  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);

  export const usersCollection = collection(db, 'users');
  export const customersCollection = collection(db, 'customers');
  export const vehiclesCollection = collection(db, 'vehicles');
  export const parkingSpotsCollection = collection(db, 'parkingSpotsCollection');
  export const parkingLotsCollection = collection(db, 'parkingLots');
  export const transactionsCollection = collection(db, 'transactions');

  export const getUserProfile = async (userId: string) => {
    const userDoc = await getDoc(doc(usersCollection, userId));
    if(userDoc.exists()){
      return userDoc.data() as { 
        role: 'admin' | 'valet';
        name: string;
        phoneNumber: string;
        email: string;
      };
    } else{
      return null;
    }
  };
  
  export const getVehiclesByCustomer = (customerId: string) => {
    return query(vehiclesCollection, where('customerId', '==', customerId));
  };
  
  export const getActiveVehicles = () => {
    return query(
      vehiclesCollection, 
      where('status', '==', 'checked-in'), 
      orderBy('checkInTime', 'desc')
    );
  };
  
  export const getAvailableParkingSpots = (lotId: string = 'lot1') => {
    return query(
      parkingSpotsCollection,
      where('status', '==', 'available'),
      where('lotId', '==', lotId)
    );
  };
  
  export const getVehicleByLicensePlate = (licensePlate: string) => {
    return query(
      vehiclesCollection,
      where('licensePlate', '==', licensePlate),
      where('status', '==', 'checked-in'),
      limit(1)
    );
  };

  export const addCustomer = async ( data: {
    name: string;
    phoneNumber: string;
    email: string;
  }) => {
    const docRef = await addDoc(customersCollection, {...data, createdAt: Timestamp.now()});
    return docRef.id
  };

  export const addVehicle = async (data: {
    customerId: string;
    make: string;
    model: string;
    color: string;
    licensePlate: string;
    expectedCheckOutTime: Timestamp;
    parkingSpotId: string;
    valetId: string;
    photos?: string[];
  }) => {
    const docRef = await addDoc(vehiclesCollection, {
      ...data,
      checkInTime: Timestamp.now(),
      actualCheckOutTime: null,
      status: 'checked-in'
    });
  
    return docRef.id;
  };

  export const checkOutVehicle = async (vehicleId: string, parkingSpotId: string) => {
    await setDoc(doc(vehiclesCollection, vehicleId), {
      status: "checked-out",
      checkOutTime: Timestamp.now()
    }, { merge: true });
  
    await setDoc(doc(parkingSpotsCollection, parkingSpotId), {
      status: "available"
    }, { merge: true });
  };