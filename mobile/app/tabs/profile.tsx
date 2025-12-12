import React from "react";
import { View, Text, Button } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Yogitha R</Text>
      <Text style={{ marginTop: 6, fontSize: 16, color: "#555" }}>
        @dear_ai_user
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Edit Profile (Soon)" onPress={() => {}} />
      </View>
    </View>
  );
}
