import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ImageBackground, Alert, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function UploadAssessmentScreen() {
    const navigation = useNavigation<any>();
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const pickVideo = async (source: 'camera' | 'gallery') => {
        try {
            let result;
            if (source === 'camera') {
                await ImagePicker.requestCameraPermissionsAsync();
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ['videos'],
                    allowsEditing: true,
                    quality: 1,
                });
            } else {
                await ImagePicker.requestMediaLibraryPermissionsAsync();
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['videos'],
                    allowsEditing: true,
                    quality: 1,
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setVideoUri(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick video');
            console.error(error);
        }
    };

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
                    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7} onPress={() => pickVideo('camera')}>
                        <View style={styles.iconCircleRecord}>
                            <Ionicons name="videocam" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.optionText}>Record Video</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7} onPress={() => pickVideo('gallery')}>
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
                    {videoUri && (
                        <TouchableOpacity style={styles.removeButton} onPress={() => setVideoUri(null)}>
                            <Ionicons name="trash-outline" size={16} color={Colors.error} />
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Video Player Mockup */}
                <View style={styles.videoPlayerContainer}>
                    {videoUri ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                            <Ionicons name="videocam" size={48} color={Colors.white} />
                            <Text style={{ color: Colors.white, marginTop: 10 }}>Video Selected</Text>
                        </View>
                    ) : (
                        <ImageBackground
                            source={{ uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
                            style={styles.videoBackground}
                            imageStyle={styles.videoBackgroundImage}
                        >
                            <View style={styles.videoOverlay}>
                                {/* Play Button Mockup */}
                                <TouchableOpacity style={styles.playButtonWrapper}>
                                    <View style={styles.playButtonCircle}>
                                        <Ionicons name="play" size={28} color={Colors.white} style={styles.playIcon} />
                                    </View>
                                </TouchableOpacity>

                                {/* Progress & Controls Mockup */}
                                <View style={styles.controlsContainer}>
                                    <View style={styles.progressBarTrack}>
                                        <View style={[styles.progressBarFill, { width: '0%' }]} />
                                    </View>
                                    <View style={styles.controlsRow}>
                                        <Text style={styles.timeText}>00:00 / 00:00</Text>
                                        <Ionicons name="expand" size={18} color={Colors.white} />
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    )}
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
                {/* <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={20} color={Colors.error} style={styles.errorIcon} />
                    <View style={styles.errorTextContent}>
                        <Text style={styles.errorTitle}>Video is too short</Text>
                        <Text style={styles.errorMessage}>
                            The assessment requires a minimum video length of 15 seconds. Please record a longer clip.
                        </Text>
                    </View>
                </View> */}

            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.retakeButton}
                    activeOpacity={0.7}
                    onPress={() => pickVideo('camera')}
                >
                    <Text style={styles.retakeButtonText}>Retake Video</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.confirmButton, (!videoUri || isUploading) && { opacity: 0.5 }]}
                    disabled={!videoUri || isUploading}
                    onPress={async () => {
                        if (!videoUri) {
                            Alert.alert('Error', 'Please select a video first');
                            return;
                        }

                        setIsUploading(true);
                        try {
                            const formData = new FormData();

                            // Ensure URI has file:// prefix for Android
                            let fileUri = videoUri;
                            if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
                                fileUri = `file://${fileUri}`;
                            }

                            // Append the video file
                            const filename = videoUri.split('/').pop() || 'video.mp4';
                            const match = /\.(\w+)$/.exec(filename);
                            const type = match ? `video/${match[1]}` : `video/mp4`;

                            formData.append('video', {
                                uri: fileUri,
                                name: filename,
                                type: type,
                            } as any);

                            // Append other fields
                            formData.append('testName', '100m Sprint');
                            formData.append('score', '0');
                            formData.append('metrics', JSON.stringify({ duration: 12 }));
                            formData.append('dateTaken', new Date().toISOString());

                            // Use native fetch instead of Axios to avoid the React Native Android FormData boundary stripping bug
                            const token = await AsyncStorage.getItem('userToken');
                            const response = await fetch('http://192.168.31.124:5000/api/fitness', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    // Do NOT set Content-Type here, let fetch generate the boundary
                                },
                                body: formData,
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Upload failed');
                            }

                            Alert.alert('Success', 'Assessment uploaded successfully!');
                            navigation.navigate('UploadingData');
                        } catch (err: any) {
                            console.error('Upload failed:', err);
                            console.error('Upload failed full trace:', JSON.stringify(err));
                            Alert.alert('Upload Failed', err.message || 'Something went wrong');
                        } finally {
                            setIsUploading(false);
                        }
                    }}
                    activeOpacity={0.8}
                >
                    {isUploading ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.confirmButtonText}>Confirm Submission</Text>
                    )}
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
