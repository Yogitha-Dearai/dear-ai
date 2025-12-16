import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import PostCard from "../../components/PostCard"; // <- fixed relative path

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:3000/api/posts");
      console.log("RAW RESPONSE:", res.status);
      const data = await res.json();
      console.log("DATA RECEIVED:", data);
      // API returns array of posts — ensure we set an array
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Feed error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      {loading && (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Loading feed…</Text>
        </View>
      )}

      {!loading && Array.isArray(posts) && posts.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No posts yet</Text>
      )}

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
