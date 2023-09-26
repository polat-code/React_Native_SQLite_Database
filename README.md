# React Native with Expo SQLite.

## <a href="https://docs.expo.dev/versions/latest/sdk/sqlite/#importing-an-existing-database">Expo-SQLite</a>

According to Expo-SQLite documentation , 

### 1)Install Dependency

 ``` 
npx expo install expo-file-system expo-asset
 
 ```
### 2) Create <ins>metro.config.js</ins> file and add this code into it


``` 
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('db');
defaultConfig.resolver.assetExts.push('sqlite');
module.exports = defaultConfig;
 
```

### 3) Use following function to open database 

``` 
async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require(pathToDatabaseFile)).uri,
    FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
  );
  return SQLite.openDatabase('myDatabaseName.db');
}
``` 

Here **pathToDatabaseFile** is replaced with your own database path like in this project such as "./assets/database/biopro_mobile.sqlite" and **myDatabaseName.db** is for application , not your own database. Last code should look like that :

``` 
async function openDatabase() {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require('./assets/database/biopro_mobile.sqlite')).uri,
    FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
  );
  return SQLite.openDatabase('myDatabaseName.db');
}
``` 

Now , it's ready to make sql query with **openDatabase()** function.

``` 
const db = await openDatabase();
``` 