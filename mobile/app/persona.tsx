import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

export default function PersonaScreen() {
  const router = useRouter();

  const [answers, setAnswers] = useState({
    goal: "",
    strength: "",
    struggle: "",
    energy: "",
    growth: "",
  });

  const update = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
  };

  const submit = async () => {
    //alert("STEP 1: submit clicked");

    const { data: sessionData, error } =
      await supabase.auth.getSession();

   // alert("STEP 2: session fetched");

    const token = sessionData?.session?.access_token;

    if (!token) {
     // alert("STEP 3: NO TOKEN");
      return;
    }

   // alert("STEP 3: token exists");

    const res = await fetch(
      "http://127.0.0.1:3000/api/profile/persona",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      }
    );

   // alert("STEP 4: fetch done");

    if (!res.ok) {
     // alert("STEP 5: fetch failed");
      return;
    }

 //   alert("STEP 6: redirecting");
    window.location.href = "/tabs/feed";
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>
        Tell us about yourself
      </Text>

      <Text>What are you working towards right now?</Text>
      <TextInput
        value={answers.goal}
        onChangeText={(v) => update("goal", v)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <Text>What is your biggest strength?</Text>
      <TextInput
        value={answers.strength}
        onChangeText={(v) => update("strength", v)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <Text>What do you struggle with the most?</Text>
      <TextInput
        value={answers.struggle}
        onChangeText={(v) => update("struggle", v)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <Text>Your current energy level?</Text>
      <TextInput
        value={answers.energy}
        onChangeText={(v) => update("energy", v)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 12 }}
      />

      <Text>What kind of growth are you seeking?</Text>
      <TextInput
        value={answers.growth}
        onChangeText={(v) => update("growth", v)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <TouchableOpacity
        onPress={submit}
        style={{
          backgroundColor: "#2196f3",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
