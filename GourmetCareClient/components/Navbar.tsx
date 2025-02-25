import { View, Text } from 'react-native'
import React from 'react'

export default function Navbar() {
  return (
    <View className='absolute bottom-0 h-16 w-full bg-gray-800 flex items-center justify-center'>
      <Text className='text-red-900 text-2xl'>Navbar</Text>
      <Text>Navbar</Text>
    </View>
  )
}