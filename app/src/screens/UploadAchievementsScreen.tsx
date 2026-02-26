import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform, Image, Modal, KeyboardAvoidingView, StatusBar } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/apiClient';

export default function UploadAchievementsScreen() {
    const navigation = useNavigation<any>();

    // Form State
    const [modalVisible, setModalVisible] = useState(false);
    const [level, setLevel] = useState('');
    const [year, setYear] = useState('');
    const [result, setResult] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Achievements List State
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await api.get('/achievements');
            setAchievements(res.data);
        } catch (error) {
            console.error('Error fetching achievements', error);
        } finally {
            setLoadingData(false);
        }
    };

    const pickDocument = async () => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const resetForm = () => {
        setLevel('');
        setYear('');
        setResult('');
        setImageUri(null);
    };

    const handleAddToList = async () => {
        if (!level || !year || !result || !imageUri) {
            Alert.alert('Incomplete Form', 'Please fill all fields and select a certificate image.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();

            let fileUri = imageUri;
            if (Platform.OS === 'android' && !fileUri.startsWith('file://')) {
                fileUri = `file://${fileUri}`;
            }

            const filename = imageUri.split('/').pop() || 'cert.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image/jpeg`;

            formData.append('proof', {
                uri: fileUri,
                name: filename,
                type: type,
            } as any);

            const titleStr = `${level} Championship ${year}`;
            const descStr = `Result: ${result}`;

            formData.append('title', titleStr);
            formData.append('description', descStr);
            formData.append('dateEarned', new Date(`${year}-01-01`).toISOString());

            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${api.defaults.baseURL}/achievements`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload certificate');
            }

            const newAchievement = await response.json();

            setAchievements(prev => [newAchievement, ...prev]);
            resetForm();
            setModalVisible(false);

            // Re-fetch to guarantee sync
            fetchAchievements();
            Alert.alert('Success', 'Achievement successfully added to your profile!');

        } catch (error: any) {
            console.error('Upload Error:', error);
            Alert.alert('Upload Failed', error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Delete Certificate',
            'Are you sure you want to remove this achievement?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/achievements/${id}`);
                            setAchievements(prev => prev.filter(a => a._id !== id));
                        } catch (err) {
                            Alert.alert('Error', 'Failed to delete certificate.');
                        }
                    }
                }
            ]
        );
    };

    const handleFinish = () => {
        if (achievements.length === 0) {
            Alert.alert(
                'No Certificates',
                'You haven\'t uploaded any achievements. Are you sure you want to return home without adding any?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes, Leave', style: 'default', onPress: () => navigation.navigate('Home') }
                ]
            );
            return;
        }

        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

            {/* Minimalist Premium Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Achievements</Text>
                    <Text style={styles.headerSubtitle}>{achievements.length} Uploaded</Text>
                </View>
                <TouchableOpacity onPress={handleFinish} style={styles.doneBtn}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {loadingData ? (
                    <View style={styles.centerBox}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Fetching your records...</Text>
                    </View>
                ) : achievements.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIconBg}>
                            <MaterialCommunityIcons name="medal-outline" size={60} color="#94A3B8" />
                        </View>
                        <Text style={styles.emptyTitle}>No Achievements Yet</Text>
                        <Text style={styles.emptyDesc}>Showcase your talent by uploading your sports certificates, medals, and past records.</Text>

                        <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setModalVisible(true)}>
                            <Ionicons name="add" size={20} color={Colors.white} />
                            <Text style={styles.emptyAddText}>Upload First Certificate</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.listContainer}>
                        {achievements.map((item) => (
                            <View key={item._id} style={styles.achievementCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="trophy" size={22} color="#F59E0B" />
                                    </View>
                                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
                                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.cardBody}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                                    <Text style={styles.cardDesc} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                </View>

                                <View style={styles.cardFooter}>
                                    <View style={styles.detailPill}>
                                        <Ionicons name="calendar-outline" size={14} color="#64748B" />
                                        <Text style={styles.detailText}>{new Date(item.dateEarned).getFullYear()}</Text>
                                    </View>
                                    <View style={styles.detailPill}>
                                        <Ionicons name="document-attach-outline" size={14} color="#64748B" />
                                        <Text style={styles.detailText}>Proof Attached</Text>
                                    </View>
                                </View>
                            </View>
                        ))}

                        {/* Bottom Spacer */}
                        <View style={{ height: 100 }} />
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            {!loadingData && achievements.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color={Colors.white} />
                </TouchableOpacity>
            )}

            {/* Add Achievement Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    if (!isSubmitting) setModalVisible(false);
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Achievement</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    if (!isSubmitting) {
                                        setModalVisible(false);
                                        resetForm();
                                    }
                                }}
                                style={styles.closeModalBtn}
                            >
                                <Ionicons name="close" size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Competition Level</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="e.g. National, State, District"
                                    value={level}
                                    onChangeText={setLevel}
                                    placeholderTextColor="#94A3B8"
                                    editable={!isSubmitting}
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                    <Text style={styles.label}>Year</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="e.g. 2023"
                                        value={year}
                                        onChangeText={setYear}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        placeholderTextColor="#94A3B8"
                                        editable={!isSubmitting}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1.5 }]}>
                                    <Text style={styles.label}>Result / Position</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="e.g. Gold, 1st Place"
                                        value={result}
                                        onChangeText={setResult}
                                        placeholderTextColor="#94A3B8"
                                        editable={!isSubmitting}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Certificate Proof <Text style={{ color: '#EF4444' }}>*</Text></Text>
                                <TouchableOpacity
                                    style={[styles.uploadArea, imageUri && styles.uploadAreaFilled, isSubmitting && { opacity: 0.5 }]}
                                    onPress={pickDocument}
                                    disabled={isSubmitting}
                                    activeOpacity={0.7}
                                >
                                    {imageUri ? (
                                        <>
                                            <Image source={{ uri: imageUri }} style={styles.previewImage} blurRadius={isSubmitting ? 5 : 0} />
                                            {!isSubmitting && (
                                                <View style={styles.replaceBadge}>
                                                    <Ionicons name="pencil" size={14} color={Colors.white} />
                                                    <Text style={styles.replaceText}>Replace</Text>
                                                </View>
                                            )}
                                        </>
                                    ) : (
                                        <View style={styles.uploadPlaceholder}>
                                            <View style={styles.uploadIconCircle}>
                                                <Ionicons name="image-outline" size={32} color="#4F46E5" />
                                            </View>
                                            <Text style={styles.uploadTitle}>Tap to select image</Text>
                                            <Text style={styles.uploadInfo}>Supports JPG, PNG (Max 5MB)</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled, (!level || !year || !result || !imageUri) && styles.submitBtnInactive]}
                                onPress={handleAddToList}
                                disabled={isSubmitting || !level || !year || !result || !imageUri}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color={Colors.white} />
                                ) : (
                                    <>
                                        <Ionicons name="cloud-upload" size={20} color={Colors.white} />
                                        <Text style={styles.submitBtnText}>Upload & Save</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Slate 50
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9', // Slate 100
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B', // Slate 800
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#64748B', // Slate 500
        fontWeight: '600',
        marginTop: 2,
    },
    doneBtn: {
        marginLeft: 'auto',
        backgroundColor: '#EEF2FF', // Indigo 50
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    doneText: {
        color: '#4F46E5', // Indigo 600
        fontWeight: 'bold',
        fontSize: 15,
    },
    scrollContent: {
        padding: Spacing.md,
        flexGrow: 1,
    },
    centerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#64748B',
        fontSize: 15,
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginTop: 40,
    },
    emptyIconBg: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 12,
    },
    emptyDesc: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    emptyAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4F46E5',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 100,
        gap: 8,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    emptyAddText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingTop: 10,
    },
    achievementCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#94A3B8',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFFBEB', // Amber 50
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FEF2F2', // Red 50
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardBody: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    detailPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    detailText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569', // Slate 600
    },
    fab: {
        position: 'absolute',
        bottom: 40,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#4F46E5', // Indigo 600
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Slate 900, 60% opacity
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 24,
        paddingHorizontal: 24,
        maxHeight: '90%',
        minHeight: '60%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
    },
    closeModalBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formScroll: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155', // Slate 700
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    textInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0', // Slate 200
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 56,
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
    },
    uploadArea: {
        borderWidth: 2,
        borderColor: '#C7D2FE', // Indigo 200
        borderStyle: 'dashed',
        borderRadius: 20,
        height: 180,
        backgroundColor: '#EEF2FF', // Indigo 50
        overflow: 'hidden',
    },
    uploadAreaFilled: {
        borderStyle: 'solid',
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    uploadPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    uploadTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginBottom: 4,
    },
    uploadInfo: {
        fontSize: 13,
        color: '#64748B',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    replaceBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(15, 23, 42, 0.75)', // Slate 900
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    replaceText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    modalFooter: {
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4F46E5', // Indigo 600
        height: 56,
        borderRadius: 16,
        gap: 10,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    submitBtnDisabled: {
        backgroundColor: '#818CF8', // Indigo 400
        shadowOpacity: 0.1,
    },
    submitBtnInactive: {
        backgroundColor: '#CBD5E1', // Slate 300
        shadowColor: 'transparent',
        elevation: 0,
    },
    submitBtnText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
