import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react'; // Import useState
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'; // Import SafeAreaView and ScrollView
import * as SQLite from 'expo-sqlite';

// Import FileSystem and Asset from 'expo-file-system'
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

async function openDatabase(pathToDatabaseFile) {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require('./assets/database/biopro_mobile.sqlite')).uri,
    FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
  );
  return SQLite.openDatabase('myDatabaseName.db');
}

export default function App() {
  const [equipmentData, setEquipmentData] = useState([]); // Initialize equipmentData state

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const db = await openDatabase('./assets/database/biopro_mobile.sqlite');
        console.log(db);
        console.log('Database opened successfully!');

        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM equipment LIMIT 100',
            [],
            (_, { rows }) => {
              // Success callback
              const data = rows._array;
              setEquipmentData(data);
            },
            (_, error) => {
              // Error callback
              console.error('Error fetching data from equipment table:', error);
            }
          );
        });

        // You can now use 'db' for database operations here
      } catch (error) {
        console.error('Failed to open database:', error);
        // Handle the error appropriately (e.g., show an error message)
      }
    };

    initDatabase();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          {equipmentData.map((equipment) => (
            <View key={equipment.id}>
              <Text>{equipment.label_no}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
