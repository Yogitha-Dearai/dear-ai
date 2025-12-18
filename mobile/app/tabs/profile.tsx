import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  const router = useRouter();

  const logout = async () => {
  await supabase.auth.signOut();

  // hard refresh session on web
  window.location.href = "/login";
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        Profile
      </Text>

      <Text style={{ marginTop: 6, fontSize: 16, color: "#555" }}>
        Logged in via GitHub
      </Text>

      <Pressable
        onPress={logout}
        style={{
          marginTop: 30,
          backgroundColor: "#d9534f",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
}
