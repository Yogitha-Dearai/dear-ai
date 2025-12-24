import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [aiName, setAiName] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("http://127.0.0.1:3000/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = await res.json();

      // Persona already done → skip welcome
      if (profile.persona_completed) {
        router.replace("/tabs/feed");
        return;
      }

      setAiName(profile.ai_name);
      setLoading(false);
    };

    bootstrap();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: "700", marginBottom: 12 }}>
        Hi, I’m {aiName} 🌼
      </Text>

      <Text style={{ fontSize: 16, color: "#444", marginBottom: 24 }}>
        I’m your AI companion inside Dear AI.
        {"\n\n"}
        I’ll learn how you think and grow with you over time.
        {"\n\n"}
        Let’s start by understanding you a little better.
      </Text>

      <Pressable
        onPress={() => router.replace("/persona")}
        style={{
          backgroundColor: "#222",
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Continue
        </Text>
      </Pressable>
    </View>
  );
}
