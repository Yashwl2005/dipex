import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function SplashScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('LanguageSelection');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                    {/* Replace with actual image in future */}
                    <Text style={styles.logoText}>SAI</Text>
                    <Text style={styles.logoSubText}>KHELO INDIA</Text>
                </View>
            </View>

            <Text style={styles.title}>SAI Talent Assessment</Text>
            <Text style={styles.tagline}>Discover Your Sporting Potential</Text>

            <View style={styles.footer}>
                <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
                <Text style={styles.version}>v1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Matches the light gradient look
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoPlaceholder: {
        width: 150,
        height: 150,
        backgroundColor: '#1E293B', // Dark navy box from design
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    logoText: {
        color: '#D4AF37', // Gold-ish color for SAI
        fontSize: 48,
        fontWeight: 'bold',
    },
    logoSubText: {
        color: '#fff',
        fontSize: 10,
        marginTop: -5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginTop: 10,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    loader: {
        marginBottom: 20,
    },
    version: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
});
