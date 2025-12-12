import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

export default function CreateScreen() {
  const [text, setText] = useState("");

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write your Stamp..."
        multiline
        style={{
          minHeight: 120,
          borderColor: "#ddd",
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Post Stamp" onPress={() => alert("Posting soon")} />
      </View>
    </View>
  );
}
