import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LanguageSelectionScreen() {
    const [selected, setSelected] = useState('en');
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoSmall}>
                    <Text style={styles.logoSmallText}>SAI</Text>
                </View>
                <Text style={styles.title}>Select Language</Text>
                <Text style={styles.subtitle}>Choose your preferred language to continue</Text>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.option, selected === 'en' && styles.optionSelected]}
                    onPress={() => setSelected('en')}
                >
                    <View style={styles.optionLeft}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.iconText}>Aa</Text>
                        </View>
                        <Text style={styles.optionText}>English</Text>
                    </View>
                    <View style={[styles.radio, selected === 'en' && styles.radioSelected]}>
                        {selected === 'en' && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.option, selected === 'hi' && styles.optionSelected]}
                    onPress={() => setSelected('hi')}
                >
                    <View style={styles.optionLeft}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.iconText}>अ</Text>
                        </View>
                        <View>
                            <Text style={styles.optionText}>Hindi</Text>
                            <Text style={styles.optionSubText}>हिंदी</Text>
                        </View>
                    </View>
                    <View style={[styles.radio, selected === 'hi' && styles.radioSelected]}>
                        {selected === 'hi' && <View style={styles.radioInner} />}
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation.navigate('Registration')}
            >
                <Text style={styles.continueText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logoSmall: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 20,
    },
    logoSmallText: {
        color: '#059669', // SAI Green
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    optionsContainer: {
        flex: 1,
        marginTop: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    optionSelected: {
        borderColor: Colors.primary,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconText: {
        fontSize: 18,
        color: Colors.textSecondary,
    },
    optionText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    optionSubText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: Colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    continueButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    continueText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
