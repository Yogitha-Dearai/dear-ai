import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import PostCard from "../../components/PostCard";
import { supabase } from "../../lib/supabase";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiName, setAiName] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Yogitha");
  const [presenceLine, setPresenceLine] = useState<string>("");

  const loadFeed = async () => {
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
      setAiName(profile.ai_name || null);

      if (profile.persona_summary) {
        const firstSentence =
          profile.persona_summary.split(".")[0] + ".";
        setPresenceLine(firstSentence);
      }
    };

    bootstrap();
    loadFeed();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* 🌿 PRESENCE HEADER */}
      {aiName && (
        <View
          style={{
            paddingVertical: 44,
            paddingHorizontal: 24,
            backgroundColor: "#10EDCF", // neon aqua outer
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View
            style={{
              backgroundColor: "#0CD4D0", // inner layer
              padding: 22,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "600",
                marginBottom: 10,
                color: "#042f2e",
              }}
            >
              {userName}
            </Text>

            {presenceLine && (
              <Text
                style={{
                  fontSize: 15,
                  color: "#063b39",
                  lineHeight: 22,
                }}
              >
                {presenceLine}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* CONTENT */}
      <View style={{ padding: 20 }}>
        {loading && (
          <View style={{ alignItems: "center", padding: 20 }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 8 }}>Loading feed…</Text>
          </View>
        )}

        {!loading && posts.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No posts yet
          </Text>
        )}

        {!loading &&
          posts.map((p) => (
            <View key={p.id} style={{ marginBottom: 14 }}>
              <PostCard post={p} />
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
