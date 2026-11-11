import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const About = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>About</Text>
            <Link href={"/"}>Home</Link>
        </View>
    )
}

export default About


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "purple",
    },
    heading: {
        color: "white",
        fontSize: 26,
    }
})