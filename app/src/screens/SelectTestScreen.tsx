import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SelectTestScreen() {
    const navigation = useNavigation<any>();
    const [selectedTest, setSelectedTest] = useState('Vertical Jump');

    const tests = [
        {
            id: 'Vertical Jump',
            title: 'Vertical Jump',
            subtitle: 'Measures explosive leg power',
            tag: '3 ATTEMPTS',
            icon: 'arrow-up-down',
            iconType: 'MaterialCommunityIcons'
        },
        {
            id: '10x5m Shuttle Run',
            title: '10x5m Shuttle Run',
            subtitle: 'Measures agility and speed',
            tag: 'TIMED',
            icon: 'run-fast',
            iconType: 'MaterialCommunityIcons'
        },
        {
            id: 'Sit-ups',
            title: 'Sit-ups',
            subtitle: 'Measures core strength',
            tag: '60 SECONDS',
            icon: 'human',
            iconType: 'MaterialCommunityIcons'
        },
        {
            id: '600m Endurance Run',
            title: '600m Endurance Run',
            subtitle: 'Measures cardiovascular endurance',
            tag: 'TIMED',
            icon: 'run',
            iconType: 'MaterialCommunityIcons'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Test</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Title & Description */}
                <Text style={styles.mainTitle}>Fitness Assessment</Text>
                <Text style={styles.subtitle}>
                    Choose a test below to begin the athlete evaluation.
                </Text>

                {/* Tests List */}
                <View style={styles.testsContainer}>
                    {tests.map((test) => {
                        const isSelected = selectedTest === test.id;
                        return (
                            <TouchableOpacity
                                key={test.id}
                                style={[styles.testCard, isSelected && styles.testCardSelected]}
                                onPress={() => setSelectedTest(test.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons
                                        name={test.icon as any}
                                        size={24}
                                        color={Colors.primary}
                                    />
                                </View>

                                <View style={styles.textContainer}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.testTitle}>{test.title}</Text>
                                        <View style={styles.tagContainer}>
                                            <Text style={styles.tagText}>{test.tag}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.testSubtitle}>{test.subtitle}</Text>
                                </View>

                                <View style={styles.radioContainer}>
                                    {isSelected ? (
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                                    ) : (
                                        <View style={styles.radioOutline} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => navigation.navigate('TestInstructions')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        position: 'absolute',
        left: Spacing.md,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 40,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginTop: 10,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 24,
    },
    testsContainer: {
        gap: 12,
    },
    testCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
    },
    testCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: '#F0F5FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: '#E0E7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    testTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginRight: 8,
    },
    tagContainer: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4B5563',
    },
    testSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    radioContainer: {
        marginLeft: 12,
    },
    radioOutline: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    bottomFooter: {
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        paddingBottom: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    continueButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
