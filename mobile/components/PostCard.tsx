import { View, Text } from "react-native";

export default function PostCard({ post }: { post: any }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
        shadowColor: "#000",
        elevation: 2,
      }}
    >
      <Text style={{ fontWeight: "700", fontSize: 16 }}>{post.author}</Text>
      <Text style={{ marginTop: 8 }}>{post.content}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <Text>👏 {post.likes}</Text>
        <Text>💬 {post.comments}</Text>
      </View>
    </View>
  );
}
