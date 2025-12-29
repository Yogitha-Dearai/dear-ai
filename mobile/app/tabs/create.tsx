import { useState } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

type Mode = "manual" | "ai";

export default function CreateScreen() {
  const [mode, setMode] = useState<Mode>("manual");
  const [text, setText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsed, setAiUsed] = useState(false);

  const router = useRouter();

  const callAI = async (instruction: "refine" | "draft") => {
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
          mode: instruction, // 🔥 THIS IS THE FIX
        }),
      });

      const result = await res.json();

      if (result.refinedText) {
        setText(result.refinedText);
        setAiUsed(true);
      }
    } catch (err) {
      console.log("AI error", err);
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
    setAiUsed(false);
    router.replace("/tabs/feed");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* MODE TOGGLE */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <Text
          onPress={() => {
            setMode("manual");
            setText("");
            setAiUsed(false);
          }}
          style={{
            marginRight: 16,
            fontWeight: mode === "manual" ? "700" : "400",
          }}
        >
          ✍️ Write myself
        </Text>

        <Text
          onPress={() => {
            setMode("ai");
            setText("");
            setAiUsed(false);
          }}
          style={{
            fontWeight: mode === "ai" ? "700" : "400",
          }}
        >
          🤖 Ask Doly
        </Text>
      </View>

      {/* INPUT */}
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={
          mode === "manual"
            ? "Write your Stamp..."
            : "What do you want to post about today?"
        }
        multiline
        style={{
          minHeight: 150,
          borderColor: "#ddd",
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
        }}
      />

      {/* AI ACTIONS */}
      {text.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {mode === "manual" && (
            <Text
              onPress={() => callAI("refine")}
              style={{ fontSize: 13, fontWeight: "600" }}
            >
              {aiLoading
                ? "Doly is refining…"
                : aiUsed
                ? "Refine once more"
                : "Refine with Doly"}
            </Text>
          )}

          {mode === "ai" && (
            <Text
              onPress={() => callAI("draft")}
              style={{ fontSize: 13, fontWeight: "600" }}
            >
              {aiLoading
                ? "Doly is drafting…"
                : aiUsed
                ? "Refine again"
                : "Ask Doly to draft"}
            </Text>
          )}
        </View>
      )}

      {/* POST BUTTON */}
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
