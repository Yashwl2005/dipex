import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function TestInstructionsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Get test info from previous screen
    const testId = route.params?.testId || 'Unknown Test';
    const testName = route.params?.testName || 'Fitness Test';

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{testName} Instructions</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Setup Guide */}
                <Text style={styles.sectionTitle}>SETUP GUIDE</Text>

                <View style={styles.guideCardsRow}>
                    <View style={styles.guideCard}>
                        <View style={[styles.guideImagePlaceholder, { backgroundColor: '#374151' }]}>
                            <MaterialCommunityIcons name="camcorder" size={48} color={Colors.primary} />
                        </View>
                        <Text style={styles.guideTitle}>Camera Distance</Text>
                        <Text style={styles.guideSubtitle}>Place phone 3m away on floor or stand.</Text>
                    </View>

                    <View style={styles.guideCard}>
                        <View style={[styles.guideImagePlaceholder, { backgroundColor: '#E5E7EB' }]}>
                            <MaterialCommunityIcons name="human" size={48} color={Colors.primary} />
                        </View>
                        <Text style={styles.guideTitle}>Full Visibility</Text>
                        <Text style={styles.guideSubtitle}>Ensure your entire body fits in frame.</Text>
                    </View>
                </View>

                {/* Safety & Environment */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SAFETY & ENVIRONMENT</Text>

                <View style={styles.safetyContainer}>
                    {/* Item 1 */}
                    <View style={styles.safetyItem}>
                        <View style={styles.safetyIconContainer}>
                            <Ionicons name="water-outline" size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.safetyTextContent}>
                            <Text style={styles.safetyItemTitle}>Safe Surface</Text>
                            <Text style={styles.safetyItemSubtitle}>Ensure the floor is dry and non-slip to prevent falls.</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Item 2 */}
                    <View style={styles.safetyItem}>
                        <View style={styles.safetyIconContainer}>
                            <Ionicons name="sunny-outline" size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.safetyTextContent}>
                            <Text style={styles.safetyItemTitle}>Lighting</Text>
                            <Text style={styles.safetyItemSubtitle}>Avoid strong backlighting. Face the light source.</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Item 3 */}
                    <View style={styles.safetyItem}>
                        <View style={styles.safetyIconContainer}>
                            <Ionicons name="grid-outline" size={20} color={Colors.primary} />
                        </View>
                        <View style={styles.safetyTextContent}>
                            <Text style={styles.safetyItemTitle}>Clear Area</Text>
                            <Text style={styles.safetyItemSubtitle}>Clear a 2m radius around you for safety.</Text>
                        </View>
                    </View>
                </View>

                {/* Confirmation Box */}
                <TouchableOpacity
                    style={[
                        styles.confirmBox,
                        isConfirmed && styles.confirmBoxActive
                    ]}
                    onPress={() => setIsConfirmed(!isConfirmed)}
                    activeOpacity={0.8}
                >
                    <View style={[styles.checkbox, isConfirmed && styles.checkboxActive]}>
                        {isConfirmed && <Ionicons name="checkmark" size={16} color={Colors.white} />}
                    </View>
                    <Text style={styles.confirmText}>
                        I confirm that I will perform this test honestly and have cleared my environment of hazards.
                    </Text>
                </TouchableOpacity>

            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={[
                        styles.startButton,
                        !isConfirmed && styles.startButtonDisabled
                    ]}
                    onPress={() => isConfirmed && navigation.navigate('UploadAssessment', { testId, testName })}
                    activeOpacity={isConfirmed ? 0.8 : 1}
                    disabled={!isConfirmed}
                >
                    <Ionicons name="videocam" size={24} color={isConfirmed ? Colors.white : '#9CA3AF'} />
                    <Text style={[styles.startButtonText, !isConfirmed && { color: '#9CA3AF' }]}>
                        START RECORDING
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        justifyContent: 'center',
        backgroundColor: Colors.white,
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
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 1,
        marginBottom: 16,
    },
    guideCardsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    guideCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    guideImagePlaceholder: {
        height: 120,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    guideTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    guideSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    safetyContainer: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    safetyItem: {
        flexDirection: 'row',
        padding: 16,
    },
    safetyIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    safetyTextContent: {
        flex: 1,
    },
    safetyItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    safetyItemSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 68,
    },
    confirmBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        borderRadius: 12,
        padding: 16,
        alignItems: 'flex-start',
    },
    confirmBoxActive: {
        borderColor: Colors.primary,
        backgroundColor: '#F0F5FF',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#9CA3AF',
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    checkboxActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    confirmText: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
        lineHeight: 20,
    },
    bottomFooter: {
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        paddingBottom: 20,
        paddingTop: 10,
    },
    startButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    startButtonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    startButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
