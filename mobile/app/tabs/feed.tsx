import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import PostCard from "../../components/PostCard";
import { supabase } from "../../lib/supabase";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiName, setAiName] = useState<string | null>(null);

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
    };

    bootstrap();
    loadFeed();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>

      {/* 🌼 DAILY GREETING (NON-BLOCKING) */}
      {aiName && (
        <View style={{ marginBottom: 24 }}>
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

      {/* LOADING */}
      {loading && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading feed…</Text>
        </View>
      )}

      {/* EMPTY STATE */}
      {!loading && Array.isArray(posts) && posts.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No posts yet
        </Text>
      )}

      {/* POSTS */}
      {!loading &&
        Array.isArray(posts) &&
        posts.map((p) => (
          <View key={p.id} style={{ marginBottom: 12 }}>
            <PostCard post={p} />
          </View>
        ))}
    </ScrollView>
  );
}
