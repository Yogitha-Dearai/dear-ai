import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import PostCard from "../../components/PostCard";
import { supabase } from "../../lib/supabase";

/* -----------------------------
   PERSONA → TONE MAPPING
----------------------------- */
function getPersonaTone(traits: any): string {
  if (!traits) return "gentle";

  const text = JSON.stringify(traits).toLowerCase();

  if (text.includes("reflect") || text.includes("introspective")) {
    return "reflective";
  }
  if (text.includes("express") || text.includes("creative")) {
    return "expressive";
  }
  if (text.includes("goal") || text.includes("focus")) {
    return "focused";
  }

  return "gentle";
}

const PERSONA_SUGGESTIONS: Record<string, string> = {
  reflective: "Doly feels this might be a good moment to note a thought.",
  expressive: "Something might be bubbling up. Want to capture it?",
  focused: "If there’s a clear thought today, this is a good place for it.",
  gentle: "Doly’s here if you feel like sharing a thought.",
};

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiName, setAiName] = useState<string | null>(null);
  const [personaSuggestion, setPersonaSuggestion] = useState<string | null>(null);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:3000/api/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Feed error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const res = await fetch("http://127.0.0.1:3000/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile = await res.json();

      setAiName(profile.ai_name);

      const tone = getPersonaTone(profile.persona_traits);
      setPersonaSuggestion(PERSONA_SUGGESTIONS[tone]);
    };

    bootstrap();
    loadFeed();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>

      {/* 🌼 DAILY GREETING */}
      {aiName && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            Hi Yogita 👋
          </Text>
          <Text style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
            {aiName} is here.
          </Text>
          <Text style={{ fontSize: 14, color: "#555", marginTop: 2 }}>
            What’s on your mind today?
          </Text>
        </View>
      )}

      {/* 🧠 PERSONA-AWARE SUGGESTION */}
      {personaSuggestion && (
        <Text
          style={{
            fontSize: 13,
            color: "#777",
            marginBottom: 24,
            fontStyle: "italic",
          }}
        >
          {personaSuggestion}
        </Text>
      )}

      {/* LOADING */}
      {loading && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading feed…</Text>
        </View>
      )}

      {/* EMPTY STATE */}
      {!loading && posts.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No posts yet
        </Text>
      )}

      {/* POSTS */}
      {!loading &&
        posts.map((p) => (
          <View key={p.id} style={{ marginBottom: 12 }}>
            <PostCard post={p} />
          </View>
        ))}
    </ScrollView>
  );
}
