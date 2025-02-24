import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView>
      <View className="h-full content-stretch bg-orange-400">
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
}
