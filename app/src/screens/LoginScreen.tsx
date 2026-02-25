import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const navigation = useNavigation<any>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Required Fields", "Please enter your Email and Password.");
            return;
        }

        try {
            setLoading(true);
            const res = await apiClient.post('/auth/login', {
                email,
                password
            });

            const { token, name, sports } = res.data;
            if (token) {
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userName', name || '');
                if (sports) {
                    await AsyncStorage.setItem('userSports', JSON.stringify(sports));
                }

                navigation.navigate('Home');
            }
        } catch (err: any) {
            console.error('Login failed:', err);
            const msg = err.response?.data?.message || err.message;
            Alert.alert("Login Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>SAI</Text>
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Enter your details to log in to your account</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
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
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={Colors.textPlaceholder}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Log In'}</Text>
                    {!loading && <Ionicons name="arrow-forward" size={20} color={Colors.white} />}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                </View>

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Registration')}
                >
                    <Text style={styles.signupText}>Sign Up</Text>
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
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: Spacing.md,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.primary,
        letterSpacing: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        paddingHorizontal: Spacing.md,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    signupButton: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    signupText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
