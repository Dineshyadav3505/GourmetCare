import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Complent() {
  return (
    <SafeAreaView>
        <View className='h-full content-stretch'>
            <Text>Complent</Text>
        </View>
    </SafeAreaView>
  )
}