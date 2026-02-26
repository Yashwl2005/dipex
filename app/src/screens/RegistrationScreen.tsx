import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function RegistrationScreen() {
    const navigation = useNavigation<any>();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [stateRegion, setStateRegion] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Document state
    const [aadhaarUri, setAadhaarUri] = useState<string | null>(null);
    const [dobUri, setDobUri] = useState<string | null>(null);
    const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
    const [competitionVideoUri, setCompetitionVideoUri] = useState<string | null>(null);

    const pickVideo = async () => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['videos'],
                videoMaxDuration: 120, // 2-minute max length limit
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setCompetitionVideoUri(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick competition video');
        }
    };

    const pickImage = async (setImage: (uri: string) => void, isProfile: boolean = false) => {
        try {
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            const options: ImagePicker.ImagePickerOptions = {
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            };
            if (isProfile) {
                options.aspect = [1, 1];
            }
            const result = await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const onDateChangeAndroid = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setDate(selectedDate);
            const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
            setDob(formattedDate);
        }
    };

    const onDateChangeIos = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
            setDob(formattedDate);
        }
    };

    const handleNext = () => {
        if (!name || !email || !password || !gender || !height || !weight || !stateRegion || !aadhaarUri || (!dob && !dobUri) || !profilePhotoUri) {
            Alert.alert("Required Fields", "Please fill in all mandatory fields, including Height, Weight, Profile Photo, State/Region, and required documents.");
            return;
        }

        navigation.navigate('SportsProfile', {
            registrationData: {
                name,
                email,
                password,
                dateOfBirth: dob,
                gender,
                height,
                weight,
                address,
                state: stateRegion,
                aadhaarUri,
                dobUri,
                profilePhotoUri,
                competitionVideoUri
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Athlete Registration</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '33%' }]} />
                    </View>
                    <Text style={styles.stepText}>Step 1 of 3: Personal Details</Text>
                </View>

                {/* Profile Photo Upload */}
                <View style={styles.photoContainer}>
                    <TouchableOpacity style={styles.photoUploadCircle} onPress={() => pickImage(setProfilePhotoUri, true)}>
                        {profilePhotoUri ? (
                            <Image source={{ uri: profilePhotoUri }} style={styles.profileImage} />
                        ) : (
                            <>
                                <Ionicons name="camera" size={36} color={Colors.primary} />
                                <Text style={styles.photoUploadText}>Upload Photo</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter full name as per Aadhaar"
                            placeholderTextColor={Colors.textPlaceholder}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="athlete@example.com"
                            placeholderTextColor={Colors.textPlaceholder}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Create a password"
                            placeholderTextColor={Colors.textPlaceholder}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 2, marginRight: 10 }]}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TouchableOpacity style={styles.inputView} onPress={() => setShowDatePicker(true)}>
                                <TextInput
                                    style={styles.flexInput}
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor={Colors.textPlaceholder}
                                    value={dob}
                                    editable={false}
                                    pointerEvents="none"
                                />
                                <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                            </TouchableOpacity>

                            {showDatePicker && Platform.OS === 'android' && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChangeAndroid}
                                    maximumDate={new Date()}
                                />
                            )}

                            {showDatePicker && Platform.OS === 'ios' && (
                                <Modal transparent animationType="slide" visible={showDatePicker}>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                                    <Text style={{ color: Colors.primary, fontSize: 16, fontWeight: 'bold' }}>Done</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                display="spinner"
                                                onChange={onDateChangeIos}
                                                maximumDate={new Date()}
                                            />
                                        </View>
                                    </View>
                                </Modal>
                            )}
                        </View>

                        <View style={[styles.inputGroup, { flex: 2 }]}>
                            <Text style={styles.label}>Gender <Text style={styles.required}>*</Text></Text>
                            <View style={{ flexDirection: 'row', gap: 6 }}>
                                {['Male', 'Female', 'Other'].map(g => (
                                    <TouchableOpacity
                                        key={g}
                                        style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: gender === g ? Colors.primary : '#D1D5DB', borderRadius: 8, backgroundColor: gender === g ? '#F0F5FF' : Colors.white }}
                                        onPress={() => setGender(g.toLowerCase())}
                                    >
                                        <Text style={{ color: gender === g.toLowerCase() ? Colors.primary : Colors.textPrimary, fontWeight: gender === g.toLowerCase() ? 'bold' : '600', fontSize: 13 }}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>Height (cm) <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 175"
                                placeholderTextColor={Colors.textPlaceholder}
                                keyboardType="numeric"
                                value={height}
                                onChangeText={setHeight}
                            />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Weight (kg) <Text style={styles.required}>*</Text></Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. 70"
                                placeholderTextColor={Colors.textPlaceholder}
                                keyboardType="numeric"
                                value={weight}
                                onChangeText={setWeight}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Address (Optional)</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            placeholder="Enter your complete residential address"
                            placeholderTextColor={Colors.textPlaceholder}
                            multiline
                            numberOfLines={3}
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>State / Region <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Haryana, Maharashtra"
                            placeholderTextColor={Colors.textPlaceholder}
                            value={stateRegion}
                            onChangeText={setStateRegion}
                        />
                    </View>

                    {/* Document Upload section */}
                    <Text style={[styles.label, { marginTop: 10, fontSize: 16 }]}>Document Uploads</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Aadhaar Card <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity style={styles.uploadArea} onPress={() => pickImage(setAadhaarUri)}>
                            {aadhaarUri ? (
                                <Image source={{ uri: aadhaarUri }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <Ionicons name="cloud-upload-outline" size={32} color={Colors.primary} />
                                    <Text style={styles.uploadTextDark}>Upload Aadhaar</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date of Birth Certificate <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity style={styles.uploadArea} onPress={() => pickImage(setDobUri)}>
                            {dobUri ? (
                                <Image source={{ uri: dobUri }} style={styles.previewImage} />
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <Ionicons name="cloud-upload-outline" size={32} color={Colors.primary} />
                                    <Text style={styles.uploadTextDark}>Upload DOB Certificate</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sports/Competition Video (Optional)</Text>
                        <TouchableOpacity style={styles.uploadArea} onPress={pickVideo}>
                            {competitionVideoUri ? (
                                <View style={styles.uploadPlaceholder}>
                                    <Ionicons name="videocam" size={32} color={Colors.success} />
                                    <Text style={[styles.uploadTextDark, { color: Colors.success, marginTop: 4 }]}>Video Selected</Text>
                                    <Text style={{ fontSize: 10, color: Colors.textSecondary, marginTop: 4 }}>Tap to change</Text>
                                </View>
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <Ionicons name="videocam-outline" size={32} color={Colors.primary} />
                                    <Text style={styles.uploadTextDark}>Upload Video</Text>
                                    <Text style={{ fontSize: 10, color: Colors.textSecondary, marginTop: 4 }}>Max 2 mins (Optional)</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <View style={styles.inputView}>
                            <View style={styles.countryCode}>
                                <Text style={styles.codeText}>+91</Text>
                                <View style={styles.separator} />
                            </View>
                            <TextInput
                                style={styles.flexInput}
                                placeholder="9876543210"
                                keyboardType="phone-pad"
                                placeholderTextColor={Colors.textPlaceholder}
                            />
                            <TouchableOpacity>
                                <Text style={styles.otpLink}>Get OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Text style={styles.helperText}>Fields marked with <Text style={styles.required}>*</Text> are mandatory.</Text>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextText}>Next Step</Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 40 }}>
                    <Text style={{ fontSize: 14, color: Colors.textSecondary }}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.primary }}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    scrollContent: {
        padding: Spacing.md,
    },
    progressContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    stepText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    photoUploadCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F5FF',
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
    },
    photoUploadText: {
        marginTop: 8,
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
    },
    form: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    required: {
        color: Colors.error,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
    },
    flexInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    inputViewText: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    placeholderText: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPlaceholder,
    },
    row: {
        flexDirection: 'row',
    },
    disabledInput: {
        backgroundColor: '#F9FAFB',
        textAlign: 'center',
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    codeText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    separator: {
        width: 1,
        height: '60%',
        backgroundColor: '#D1D5DB',
    },
    otpLink: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginLeft: 4,
    },
    helperText: {
        textAlign: 'center',
        color: Colors.textSecondary,
        fontSize: 12,
        marginBottom: 30,
    },
    nextButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    nextText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    uploadArea: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        borderRadius: 8,
        height: 120,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadPlaceholder: {
        alignItems: 'center',
    },
    uploadTextDark: {
        marginTop: 8,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
