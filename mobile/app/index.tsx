import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Home() {
  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text style={{ fontSize:22, fontWeight:"700" }}>Welcome Yogitha 👋</Text>
      <Text style={{ marginTop:10 }}>Choose a section:</Text>

      <View style={{ marginTop:20 }}>
        <Link href="/tabs/feed">
          <Button title="Go to Feed" />
        </Link>
      </View>

      <View style={{ marginTop:10 }}>
        <Link href="/tabs/create">
          <Button title="Create Stamp" />
        </Link>
      </View>

      <View style={{ marginTop:10 }}>
        <Link href="/tabs/profile">
          <Button title="My Profile" />
        </Link>
      </View>
    </View>
  );
}
