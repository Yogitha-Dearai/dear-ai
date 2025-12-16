import React, { useState } from "react";
import { View, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function CreateScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitStamp = async () => {
    
    if (!text.trim()) {
      alert("Empty stamp");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:3000/api/posts", {
        method: "POST",
        headers: {
 	 "Content-Type": "application/json",
 	 "Authorization": `Bearer ${localStorage.getItem("sb-access-token")}`,
	},
        body: JSON.stringify({
          content: text.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Post failed");
      }

      setText("");
      router.back(); // go back to feed
    } catch (err) {
      console.log("POST ERROR:", err);
      alert("POST ERROR");
    } finally {
      setLoading(false);
    }
  };

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

      {/* 🔥 WEB-SAFE CLICKABLE DIV */}
      <div
        onClick={submitStamp}
        style={{
          marginTop: 20,
          backgroundColor: loading ? "#999" : "#2196f3",
          padding: 14,
          borderRadius: 8,
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {loading ? "Posting..." : "Post Stamp"}
      </div>
    </View>
  );
}
