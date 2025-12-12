import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const loadFeed = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/feed");
      const data = await res.json();
      setPosts(data.posts || []);  // <-- important fix
    } catch (err) {
      console.log("Feed error:", err);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      {Array.isArray(posts) && posts.length === 0 && (
        <Text>No posts yet</Text>
      )}

      {Array.isArray(posts) &&
        posts.map((p) => (
          <View
            key={p.id}
            style={{
              padding: 12,
              marginBottom: 14,
              backgroundColor: "#fff",
              borderRadius: 8,
              shadowColor: "#000",
              elevation: 2,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{p.author?.display_name}</Text>
            <Text>{p.content}</Text>
            <Text>👏 {p.counts?.likes}</Text>
            <Text>💬 {p.counts?.comments}</Text>
          </View>
        ))}
    </ScrollView>
  );
}
