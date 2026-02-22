import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Alert } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SportsProfileScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const registrationData = route.params?.registrationData || {};

    const [selectedLevel, setSelectedLevel] = useState('State');
    const [years, setYears] = useState(2);

    const levels = [
        { id: 'Beginner', title: 'Beginner', icon: 'school', iconType: 'Ionicons' },
        { id: 'District', title: 'District', icon: 'business', iconType: 'Ionicons' },
        { id: 'State', title: 'State', icon: 'flag', iconType: 'Ionicons' },
        { id: 'National', title: 'National', icon: 'trophy', iconType: 'Ionicons' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sports Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Progress Bar Segmented */}
                <View style={styles.progressContainer}>
                    <View style={styles.segmentsRow}>
                        <View style={[styles.progressSegment, styles.segmentActive]} />
                        <View style={styles.progressSegment} />
                        <View style={styles.progressSegment} />
                    </View>
                    <Text style={styles.stepText}>Step 1 of 3</Text>
                </View>

                {/* Title & Description */}
                <Text style={styles.mainTitle}>Your Discipline</Text>
                <Text style={styles.subtitle}>
                    Tell us about your primary athletic discipline and experience level to customize your assessment.
                </Text>

                {/* Form Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Primary Sport</Text>
                    <TouchableOpacity style={styles.dropdownInput}>
                        <View style={styles.leftRow}>
                            <MaterialCommunityIcons name="gymnastics" size={24} color={Colors.primary} />
                            <Text style={styles.placeholderText}>Athletics</Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Specific Event / Position</Text>
                    <TouchableOpacity style={styles.dropdownInput}>
                        <View style={styles.leftRow}>
                            <MaterialCommunityIcons name="run" size={24} color={'#9CA3AF'} />
                            <Text style={styles.placeholderText}>Select event (e.g. 100m Sprint)</Text>
                        </View>
                        <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Highest Level Played</Text>
                    <View style={styles.levelGrid}>
                        {levels.map((level) => {
                            const isSelected = selectedLevel === level.id;
                            return (
                                <TouchableOpacity
                                    key={level.id}
                                    style={[styles.levelCard, isSelected && styles.levelCardSelected]}
                                    onPress={() => setSelectedLevel(level.id)}
                                    activeOpacity={0.7}
                                >
                                    {isSelected && (
                                        <View style={styles.checkIcon}>
                                            <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                                        </View>
                                    )}
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name={level.icon as any}
                                            size={28}
                                            color={isSelected ? '#9CA3AF' : '#D1D5DB'}
                                        />
                                    </View>
                                    <Text style={[styles.levelText, isSelected && styles.levelTextSelected]}>
                                        {level.title}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.section, { paddingBottom: 60 }]}>
                    <Text style={styles.label}>Years of Training</Text>
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity
                            style={[
                                styles.stepperButtonMinus,
                                years === 0 && { opacity: 0.5 }
                            ]}
                            onPress={() => setYears(Math.max(0, years - 1))}
                            disabled={years === 0}
                        >
                            <Text style={styles.minusText}>—</Text>
                        </TouchableOpacity>

                        <View style={styles.stepperValueContainer}>
                            <Text style={styles.stepperValue}>{years}</Text>
                            <Text style={styles.stepperLabel}> years</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.stepperButtonPlus}
                            onPress={() => setYears(years + 1)}
                        >
                            <Ionicons name="add" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={async () => {
                        try {
                            const res = await apiClient.post('/auth/register', {
                                name: registrationData.name || `Athlete ${Math.floor(Math.random() * 10000)}`,
                                email: registrationData.email || `athlete${Math.floor(Math.random() * 10000)}@example.com`,
                                password: registrationData.password || 'password123',
                                role: 'athlete',
                                dateOfBirth: registrationData.dateOfBirth,
                                sport: 'Athletics'
                            });
                            const token = res.data.token;
                            if (token) {
                                await AsyncStorage.setItem('userToken', token);
                            }
                            navigation.navigate('SelectTest');
                        } catch (err: any) {
                            console.error('Registration failed:', err);
                            const msg = err.response?.data?.message || err.message;
                            Alert.alert("Registration Failed", msg);
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save & Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
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
    progressContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    segmentsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: Spacing.md,
        gap: 8,
    },
    progressSegment: {
        flex: 1,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    segmentActive: {
        backgroundColor: Colors.primary,
    },
    stepText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 28,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 10,
    },
    dropdownInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#111827',
        marginLeft: 12,
    },
    levelGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    levelCard: {
        width: (width - Spacing.md * 2 - 12) / 2,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        position: 'relative',
    },
    levelCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: '#F0F5FF',
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    iconContainer: {
        marginBottom: 8,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    levelTextSelected: {
        color: '#4B5563',
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 6,
        height: 60,
    },
    stepperButtonMinus: {
        width: 48,
        height: 48,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    minusText: {
        fontSize: 20,
        color: '#6B7280',
        fontWeight: 'bold',
    },
    stepperButtonPlus: {
        width: 48,
        height: 48,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    stepperValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    stepperLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    bottomFooter: {
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        paddingBottom: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
