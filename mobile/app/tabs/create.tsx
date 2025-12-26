import { useState } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function CreateScreen() {
  const [text, setText] = useState("");
  const [showNudge, setShowNudge] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const router = useRouter();

  const handleChange = (value: string) => {
    setText(value);

    if (value.length > 0) {
      setShowNudge(true);
    } else {
      setShowNudge(false);
      setAiUsed(false);
    }
  };

  const callAI = async () => {
    if (!text.trim()) return;

    setAiLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const res = await fetch("http://127.0.0.1:3000/api/ai/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      const result = await res.json();

      if (result.refinedText) {
        setText(result.refinedText);
        setAiUsed(true);
      }
    } catch (err) {
      console.log("AI refine error", err);
    } finally {
      setAiLoading(false);
    }
  };

  const submitStamp = async () => {
    if (!text.trim()) return;

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    await fetch("http://127.0.0.1:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: text.trim() }),
    });

    setText("");
    setShowNudge(false);
    setAiUsed(false);
    router.replace("/tabs/feed");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        value={text}
        onChangeText={handleChange}
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

      {/* 🤖 AI ASSIST */}
      {showNudge && (
        <View style={{ marginTop: 10 }}>
          {!aiUsed && (
            <Text
              onPress={callAI}
              style={{
                fontSize: 13,
                color: "#222",
                fontWeight: "600",
              }}
            >
              {aiLoading ? "Doly is thinking…" : "Let Doly help"}
            </Text>
          )}

          {aiUsed && (
            <Text
              onPress={callAI}
              style={{
                fontSize: 13,
                color: "#222",
                fontWeight: "600",
              }}
            >
              {aiLoading ? "Refining…" : "Refine once more"}
            </Text>
          )}
        </View>
      )}

      <Text
        onPress={submitStamp}
        style={{
          marginTop: 24,
          backgroundColor: "#222",
          padding: 14,
          borderRadius: 8,
          textAlign: "center",
          color: "white",
          fontWeight: "600",
        }}
      >
        Post Stamp
      </Text>

      {aiLoading && (
        <View style={{ marginTop: 10 }}>
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
}
