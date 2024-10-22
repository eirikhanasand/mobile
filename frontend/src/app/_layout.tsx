import { Tabs } from 'expo-router'
import React from 'react'
import { TabBarIcon } from '../components/navigation/TabBarIcon'
import { Colors } from '../constants/Colors'
import { useColorScheme } from '../hooks/useColorScheme'
import { useSelector } from 'react-redux'
import Wrapper from '../components/wrapper'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'

export default function TabLayout() {
    return (
        <Wrapper>
            <Layout />
        </Wrapper>
    )
}

function Layout() {
    const colorScheme = useColorScheme()
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme, isDark } = useSelector((state: ReduxState) => state.theme)

    return (
        <View style={{flex: 1}}>
            <Tabs screenOptions={{
                tabBarActiveTintColor: theme.orange,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.contrast
                }
            }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: lang ? 'Hjem' : 'Home',
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: lang ? 'Utforsk' : 'Explore',
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: lang ? 'Innstillinger' : 'Settings',
                        tabBarIcon: ({ color, focused }) => (
                            <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />
                        ),
                    }}
                />
            </Tabs>
            <StatusBar style={isDark ? "light" : "dark"} />
        </View>
    )
}