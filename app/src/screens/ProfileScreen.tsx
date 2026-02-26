import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Platform, Image, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [sports, setSports] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
    const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const res = await api.get('/auth/me');
            if (res.data) {
                setName(res.data.name || '');
                setEmail(res.data.email || '');
                setHeight(res.data.height ? res.data.height.toString() : '');
                setWeight(res.data.weight ? res.data.weight.toString() : '');
                setAddress(res.data.address || '');
                setState(res.data.state || '');
                if (res.data.sports && res.data.sports.length > 0) {
                    setSports(res.data.sports.join(', '));
                }
                if (res.data.profilePhotoUrl) {
                    setProfilePhotoUrl(res.data.profilePhotoUrl);
                }
            }
        } catch (err) {
            console.log('Error loading profile data:', err);
            Alert.alert('Error', 'Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setProfilePhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();

            formData.append('name', name);
            if (height) formData.append('height', height);
            if (weight) formData.append('weight', weight);
            formData.append('address', address);
            formData.append('state', state);

            if (sports) {
                // For simplicity assuming single sport or comma separated list
                const sportsArray = sports.split(',').map(s => s.trim()).filter(s => s.length > 0);
                sportsArray.forEach(s => formData.append('sports', s));
            }

            if (profilePhotoUri) {
                const filename = profilePhotoUri.split('/').pop() || 'profile.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                formData.append('profilePhoto', {
                    uri: Platform.OS === 'android' && !profilePhotoUri.startsWith('file://') ? `file://${profilePhotoUri}` : profilePhotoUri,
                    name: filename,
                    type,
                } as any);
            }

            const response = await fetch(`${api.defaults.baseURL}/auth/profile`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const resData = await response.json();

            // update local state
            setProfilePhotoUrl(resData.profilePhotoUrl);
            setProfilePhotoUri(null); // Clear picked URI since it's uploaded now

            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (err: any) {
            console.error('Update profile failed:', err);
            Alert.alert("Update Failed", err.message || 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Photo Upload */}
                <View style={styles.photoContainer}>
                    <TouchableOpacity style={styles.photoCircle} onPress={handlePickImage}>
                        {profilePhotoUri ? (
                            <Image source={{ uri: profilePhotoUri }} style={styles.profileImage} />
                        ) : profilePhotoUrl ? (
                            <Image source={{ uri: profilePhotoUrl }} style={styles.profileImage} />
                        ) : (
                            <Ionicons name="camera" size={40} color={Colors.primary} />
                        )}
                        <View style={styles.editIconBadge}>
                            <Ionicons name="pencil" size={14} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.photoText}>Tap to change photo</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter full name"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={email}
                        editable={false}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput
                            style={styles.input}
                            value={height}
                            onChangeText={setHeight}
                            placeholder="e.g. 175"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="e.g. 65"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                        style={styles.input}
                        value={state}
                        onChangeText={setState}
                        placeholder="Enter your state"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Full Address</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Enter full address"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Sports</Text>
                    <TextInput
                        style={styles.input}
                        value={sports}
                        onChangeText={setSports}
                        placeholder="e.g. Athletics, Swimming"
                        placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.helperText}>Separate multiple sports with a comma.</Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 40,
    },
    photoContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    photoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F0F5FF',
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        resizeMode: 'cover',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    photoText: {
        marginTop: 12,
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
    },
    disabledInput: {
        backgroundColor: '#F3F4F6',
        color: '#6B7280',
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        fontStyle: 'italic',
    },
    footer: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: Colors.white,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
