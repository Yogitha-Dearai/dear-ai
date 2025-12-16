import React from "react";
import { View, Text } from "react-native";

export default function PostCard({ post }: { post: any }) {
  return (
    <View style={{ borderRadius:10, padding:12, backgroundColor:'#fff', shadowColor:'#000', elevation:1 }}>
      <Text style={{ fontWeight:'700' }}>{post.author?.display_name ?? post.author_id ?? "Unknown"}</Text>
      <Text style={{ marginTop:6 }}>{post.content}</Text>
      <View style={{ flexDirection:'row', marginTop:10, justifyContent:'flex-start' }}>
        <Text style={{ marginRight:12 }}>👏 {post.counts?.likes ?? 0}</Text>
        <Text>💬 {post.counts?.comments ?? 0}</Text>
      </View>
    </View>
  );
}
