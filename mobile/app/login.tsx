import { View, Pressable, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();

  const loginWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/tabs/feed",
      },
    });

    if (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Pressable
        onPress={loginWithGithub}
        style={{
          backgroundColor: "#000",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Login with GitHub
        </Text>
      </Pressable>
    </View>
  );
}
