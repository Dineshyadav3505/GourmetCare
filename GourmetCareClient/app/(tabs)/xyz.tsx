import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function xyz() {
    return (
        <SafeAreaView>

            <View className='h-full content-stretch'>
                <Text>xyz</Text>
            </View>
        </SafeAreaView>
    )
}