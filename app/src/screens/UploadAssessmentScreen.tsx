import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../services/apiClient';

const { width } = Dimensions.get('window');

export default function UploadAssessmentScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upload Assessment</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Title & Description */}
                <Text style={styles.mainTitle}>Record or Upload</Text>
                <Text style={styles.subtitle}>
                    Submit your performance video for the 100m sprint assessment. Ensure good lighting.
                </Text>

                {/* Upload Options */}
                <View style={styles.optionsRow}>
                    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
                        <View style={styles.iconCircleRecord}>
                            <Ionicons name="videocam" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.optionText}>Record Video</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
                        <View style={styles.iconCircleGallery}>
                            <Ionicons name="images" size={24} color="#9333EA" />
                        </View>
                        <Text style={styles.optionText}>From Gallery</Text>
                    </TouchableOpacity>
                </View>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Video Preview Section */}
                <View style={styles.previewHeader}>
                    <Text style={styles.previewTitle}>Video Preview</Text>
                    <TouchableOpacity style={styles.removeButton}>
                        <Ionicons name="trash-outline" size={16} color={Colors.error} />
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>

                {/* Video Player Mockup */}
                <View style={styles.videoPlayerContainer}>
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
                        style={styles.videoBackground}
                        imageStyle={styles.videoBackgroundImage}
                    >
                        <View style={styles.videoOverlay}>
                            {/* Play Button */}
                            <TouchableOpacity style={styles.playButtonWrapper}>
                                <View style={styles.playButtonCircle}>
                                    <Ionicons name="play" size={28} color={Colors.white} style={styles.playIcon} />
                                </View>
                            </TouchableOpacity>

                            {/* Progress & Controls */}
                            <View style={styles.controlsContainer}>
                                <View style={styles.progressBarTrack}>
                                    <View style={[styles.progressBarFill, { width: '30%' }]} />
                                </View>
                                <View style={styles.controlsRow}>
                                    <Text style={styles.timeText}>00:12 / 00:45</Text>
                                    <Ionicons name="expand" size={18} color={Colors.white} />
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                {/* Video Metadata Tags */}
                <View style={styles.metadataRow}>
                    <View style={styles.metadataTag}>
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text style={styles.metadataText}>Duration: 12s</Text>
                    </View>
                    <View style={styles.metadataTag}>
                        <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                        <Text style={styles.metadataText}>Size: 4.2 MB</Text>
                    </View>
                </View>

                {/* Error Banner */}
                <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={20} color={Colors.error} style={styles.errorIcon} />
                    <View style={styles.errorTextContent}>
                        <Text style={styles.errorTitle}>Video is too short</Text>
                        <Text style={styles.errorMessage}>
                            The assessment requires a minimum video length of 15 seconds. Please record a longer clip.
                        </Text>
                    </View>
                </View>

            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.retakeButton}
                    activeOpacity={0.7}
                >
                    <Text style={styles.retakeButtonText}>Retake Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={async () => {
                        try {
                            await apiClient.post('/fitness/upload', {
                                testName: '100m Sprint',
                                score: 0, // Pending AI evaluation
                                metrics: { duration: 12 },
                                dateTaken: new Date().toISOString(),
                                videoProofUrl: 'https://example.com/mock-video.mp4'
                            });
                            navigation.navigate('UploadingData');
                        } catch (err) {
                            console.error('Upload failed:', err);
                            navigation.navigate('UploadingData');
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.confirmButtonText}>Confirm Submission</Text>
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
        backgroundColor: '#F9FAFB',
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
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 24,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    optionCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconCircleRecord: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    iconCircleGallery: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FAF5FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
        marginBottom: 24,
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    previewTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    removeText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.error,
    },
    videoPlayerContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#111827',
    },
    videoBackground: {
        flex: 1,
        width: '100%',
    },
    videoBackgroundImage: {
        opacity: 0.7,
    },
    videoOverlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    playButtonWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButtonCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playIcon: {
        marginLeft: 4,
    },
    controlsContainer: {
        width: '100%',
    },
    progressBarTrack: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.white,
    },
    metadataRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    metadataTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    metadataText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '600',
    },
    errorBanner: {
        flexDirection: 'row',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 12,
        padding: 16,
    },
    errorIcon: {
        marginTop: 2,
        marginRight: 10,
    },
    errorTextContent: {
        flex: 1,
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#991B1B',
        marginBottom: 4,
    },
    errorMessage: {
        fontSize: 13,
        color: '#991B1B',
        lineHeight: 18,
    },
    bottomFooter: {
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        paddingBottom: 20,
        paddingTop: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    retakeButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retakeButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '700',
    },
    confirmButton: {
        backgroundColor: '#818CF8', // Disabled state primary look
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
