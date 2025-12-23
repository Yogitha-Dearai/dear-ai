import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  const logout = async () => {
    await supabase.auth.signOut();
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

      <TouchableOpacity
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
      </TouchableOpacity>
    </View>
  );
}
