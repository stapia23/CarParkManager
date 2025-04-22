import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="customers/CustomerForm" 
        options={{ 
          title: "Customers", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          )
        }} 
      />
      <Tabs.Screen 
        name="vehicle/ActiveVehicleScreen" 
        options={{ 
          title: "Active Vehicles", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" color={color} size={size} />
          )
        }} 
      />
      <Tabs.Screen 
        name="vehicle/VehicleForm" 
        options={{ 
          title: "New Vehicle", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport" color={color} size={size} />
          )
        }} 
      />
      <Tabs.Screen 
        name="about" 
        options={{ 
          title: "About", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" color={color} size={size} />
          )
        }} 
      />
    </Tabs>
  );
}