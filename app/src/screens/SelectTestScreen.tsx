import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/apiClient';

export default function SelectTestScreen() {
    const navigation = useNavigation<any>();
    const isFocused = useIsFocused();
    const [selectedTest, setSelectedTest] = useState<string | null>(null);
    const [completedTests, setCompletedTests] = useState<string[]>([]);
    const [evalStatus, setEvalStatus] = useState<string>('pending');
    const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);

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
            id: '100m Endurance Run',
            title: '100m Endurance Run',
            subtitle: 'Measures cardiovascular endurance',
            tag: 'TIMED',
            icon: 'run',
            iconType: 'MaterialCommunityIcons'
        },
    ];

    useFocusEffect(
        React.useCallback(() => {
            const loadData = async () => {
                try {
                    // Load completed tests from local storage
                    const stored = await AsyncStorage.getItem('completedTests');
                    if (stored) setCompletedTests(JSON.parse(stored));

                    // Fetch user evaluation status
                    const res = await api.get('/auth/me');
                    if (res.data) {
                        if (res.data.evaluationStatus) setEvalStatus(res.data.evaluationStatus);
                        setIsTestSubmitted(res.data.isTestSubmitted || false);
                    }
                } catch (err) {
                    console.log('Error loading test data', err);
                }
            };
            loadData();
        }, [])
    );

    const allTestsCompleted = completedTests.length === tests.length;

    // Disable tests if approved OR pending and already submitted. Only allow if status is 'rejected' or they haven't submitted yet.
    const isDisabled = evalStatus === 'approved' || (evalStatus === 'pending' && isTestSubmitted === true);

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

                {isDisabled ? (
                    <View style={[styles.approvedBanner, evalStatus === 'pending' && { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
                        <Ionicons
                            name={evalStatus === 'approved' ? "checkmark-circle" : "time"}
                            size={20}
                            color={evalStatus === 'approved' ? Colors.success : '#F59E0B'}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={[styles.approvedBannerText, evalStatus === 'pending' && { color: '#B45309' }]}>
                            {evalStatus === 'approved'
                                ? 'Your profile is already approved. No further testing is required.'
                                : 'Your profile is currently under review. Testing is disabled until an evaluator reviews your submission.'}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.subtitle}>
                        Choose a test below to begin the athlete evaluation.
                    </Text>
                )}

                {/* Tests List */}
                <View style={styles.testsContainer}>
                    {tests.map((test) => {
                        const isSelected = selectedTest === test.id;
                        const isCompleted = completedTests.includes(test.id);

                        return (
                            <TouchableOpacity
                                key={test.id}
                                style={[
                                    styles.testCard,
                                    isSelected && styles.testCardSelected,
                                    isCompleted && styles.testCardCompleted,
                                    isDisabled && styles.testCardDisabled
                                ]}
                                onPress={() => {
                                    if (!isCompleted && !isDisabled) {
                                        setSelectedTest(test.id);
                                    }
                                }}
                                activeOpacity={isDisabled ? 1 : 0.7}
                            >
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons
                                        name={test.icon as any}
                                        size={24}
                                        color={isCompleted ? Colors.success : Colors.primary}
                                    />
                                </View>

                                <View style={styles.textContainer}>
                                    <View style={styles.titleRow}>
                                        <Text style={[
                                            styles.testTitle,
                                            isCompleted && { color: Colors.textSecondary, textDecorationLine: 'line-through' },
                                            isDisabled && { color: Colors.textSecondary }
                                        ]}>
                                            {test.title}
                                        </Text>
                                        <View style={[styles.tagContainer, isDisabled && { opacity: 0.5 }]}>
                                            <Text style={styles.tagText}>{test.tag}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.testSubtitle}>{test.subtitle}</Text>
                                </View>

                                <View style={styles.radioContainer}>
                                    {isDisabled ? (
                                        <Ionicons name="lock-closed" size={20} color="#D1D5DB" />
                                    ) : isCompleted ? (
                                        <View style={styles.completedBadge}>
                                            <Ionicons name="checkmark" size={14} color={Colors.white} />
                                            <Text style={styles.completedText}>Done</Text>
                                        </View>
                                    ) : isSelected ? (
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

            {!isDisabled && (
                <View style={styles.bottomFooter}>
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            (!selectedTest && !allTestsCompleted) && { opacity: 0.5 }
                        ]}
                        onPress={async () => {
                            if (allTestsCompleted) {
                                try {
                                    await api.put('/auth/submit-test');
                                } catch (e) {
                                    console.log('Error setting test submitted flag:', e);
                                }
                                // Clear tests out after submitting mapping them to completed (for now we assume done)
                                await AsyncStorage.removeItem('completedTests');
                                navigation.navigate('UploadingData');
                            } else if (selectedTest) {
                                const testSpec = tests.find(t => t.id === selectedTest);
                                navigation.navigate('TestInstructions', { testId: selectedTest, testName: testSpec?.title });
                            }
                        }}
                        disabled={!selectedTest && !allTestsCompleted}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.continueButtonText}>
                            {allTestsCompleted ? 'Submit Final Assessment' : 'Continue with Selected'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
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
    approvedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    approvedBannerText: {
        flex: 1,
        color: '#065F46',
        fontSize: 14,
        fontWeight: '600',
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
    testCardCompleted: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        opacity: 0.8,
    },
    testCardDisabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
        opacity: 0.6,
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
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.success,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    completedText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
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
