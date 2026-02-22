import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UploadingDataScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Uploading Data</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Network Alert (Simulation) */}
                <View style={styles.alertBox}>
                    <MaterialCommunityIcons name="wifi-off" size={24} color="#B45309" style={styles.alertIcon} />
                    <View style={styles.alertTextContent}>
                        <Text style={styles.alertTitle}>No Internet Connection</Text>
                        <Text style={styles.alertSubtitle}>
                            Upload paused. Data is safely queued for sync when you're back online.
                        </Text>
                    </View>
                </View>

                {/* Main Illustration */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.pulseRing}>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons name="head-lightbulb" size={40} color={Colors.white} />
                        </View>
                    </View>
                    <Text style={styles.mainTitle}>Analyzing Form...</Text>
                    <Text style={styles.subtitle}>
                        AI is processing biomechanics from the recorded session.
                    </Text>
                </View>

                {/* Video Info Card */}
                <View style={styles.videoCard}>
                    <View style={styles.videoThumbnail}>
                        <MaterialCommunityIcons name="run" size={32} color={Colors.white} />
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={12} color={Colors.textPrimary} />
                        </View>
                    </View>

                    <View style={styles.videoTextContent}>
                        <Text style={styles.videoTitle}>Athlete_042_Sprint.mp4</Text>
                        <Text style={styles.videoSubtitle}>24 MB • 1080p 60fps</Text>
                    </View>

                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Progress Steps */}
                <View style={styles.progressCard}>
                    {/* Step 1 */}
                    <View style={styles.stepRow}>
                        <View style={styles.stepIconContainerActive}>
                            <Ionicons name="cloud-upload" size={20} color={Colors.white} />
                        </View>
                        <View style={styles.stepContent}>
                            <View style={styles.stepTitleRow}>
                                <Text style={styles.stepTitleActive}>Uploading Video</Text>
                                <Text style={styles.percentageText}>45%</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: '45%' }]} />
                            </View>
                            <Text style={styles.stepSubtitleActive}>Est. time remaining: 2m 30s</Text>
                        </View>
                    </View>

                    {/* Connecting Line 1 */}
                    <View style={[styles.connectingLine, { top: 52 }]} />

                    {/* Step 2 */}
                    <View style={styles.stepRow}>
                        <View style={styles.stepIconContainerPending}>
                            <MaterialCommunityIcons name="robot-outline" size={20} color="#9CA3AF" />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitlePending}>AI Verification</Text>
                            <Text style={styles.stepSubtitlePending}>Waiting for upload...</Text>
                        </View>
                    </View>

                    {/* Connecting Line 2 */}
                    <View style={[styles.connectingLine, { top: 124 }]} />

                    {/* Step 3 */}
                    <View style={styles.stepRow}>
                        <View style={styles.stepIconContainerPending}>
                            <Ionicons name="checkmark-circle" size={20} color="#9CA3AF" />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitlePending}>Submission Successful</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.disabledButton}
                    disabled={true}
                >
                    <Ionicons name="refresh" size={20} color="#9CA3AF" style={styles.spinnerIcon} />
                    <Text style={styles.disabledButtonText}>Please wait...</Text>
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
    alertBox: {
        flexDirection: 'row',
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FEF3C7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    alertIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    alertTextContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#92400E',
        marginBottom: 4,
    },
    alertSubtitle: {
        fontSize: 13,
        color: '#92400E',
        lineHeight: 18,
    },
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    pulseRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    videoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    videoThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#C2410C', // Orange placeholder
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        position: 'relative',
    },
    playButton: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 2,
    },
    videoTextContent: {
        flex: 1,
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    videoSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    editButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
    },
    connectingLine: {
        position: 'absolute',
        left: 40,
        width: 2,
        height: 36,
        backgroundColor: '#F3F4F6',
        zIndex: 0,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 24,
        zIndex: 1,
    },
    stepIconContainerActive: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stepIconContainerPending: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stepContent: {
        flex: 1,
        justifyContent: 'center',
    },
    stepTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepTitleActive: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    percentageText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    stepSubtitleActive: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    stepTitlePending: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 4,
    },
    stepSubtitlePending: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    bottomFooter: {
        paddingHorizontal: Spacing.md,
        paddingBottom: 24,
        paddingTop: 10,
    },
    disabledButton: {
        backgroundColor: '#E5E7EB',
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    spinnerIcon: {
        marginRight: 4,
    },
    disabledButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '700',
    },
});
