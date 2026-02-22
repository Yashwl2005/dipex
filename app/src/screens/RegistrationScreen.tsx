import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RegistrationScreen() {
    const navigation = useNavigation<any>();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');

    const handleNext = () => {
        if (!name || !email || !password) {
            Alert.alert("Required Fields", "Please enter your Name, Email, and Password.");
            return;
        }

        navigation.navigate('SportsProfile', {
            registrationData: {
                name,
                email,
                password,
                dateOfBirth: dob
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

                <View style={styles.photoContainer}>
                    <View style={styles.photoCircle}>
                        <Ionicons name="person" size={60} color="#D1D5DB" />
                        <TouchableOpacity style={styles.cameraIcon}>
                            <Ionicons name="camera" size={20} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.uploadText}>Upload Profile Photo</Text>
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
                            <View style={styles.inputView}>
                                <TextInput
                                    style={styles.flexInput}
                                    placeholder="mm/dd/yyyy"
                                    placeholderTextColor={Colors.textPlaceholder}
                                    value={dob}
                                    onChangeText={setDob}
                                />
                                <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                            </View>
                        </View>
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
    photoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
    },
    uploadText: {
        marginTop: 12,
        color: Colors.primary,
        fontWeight: 'bold',
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
});
