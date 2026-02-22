import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UploadAchievementsScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upload Achievements</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>New Entry</Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Competition Level</Text>
                        <View style={styles.inputView}>
                            <Text style={styles.placeholderText}>Select level (e.g. National)</Text>
                            <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>Year</Text>
                            <View style={styles.inputView}>
                                <Text style={styles.placeholderText}>Year</Text>
                                <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
                            </View>
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Result</Text>
                            <View style={styles.inputView}>
                                <Text style={styles.placeholderText}>Medal</Text>
                                <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Certificate Proof</Text>
                        <TouchableOpacity style={styles.uploadArea}>
                            <Ionicons name="cloud-upload" size={40} color={Colors.primary} />
                            <Text style={styles.uploadTitle}>Tap to upload image or PDF</Text>
                            <Text style={styles.uploadInfo}>SVG, PNG, JPG or PDF (MAX. 5MB)</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add-circle" size={20} color={Colors.primary} />
                        <Text style={styles.addButtonText}>Add to List</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listHeader}>
                    <Text style={styles.sectionTitle}>Added Certificates <Text style={styles.countText}>(2)</Text></Text>
                </View>

                <View style={styles.certificateList}>
                    <View style={styles.certCard}>
                        <View style={styles.certIconBg}>
                            <Ionicons name="document-text" size={24} color={Colors.primary} />
                        </View>
                        <View style={styles.certInfo}>
                            <Text style={styles.certName}>National Athletics Meet</Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.nationalBadge}>
                                    <Text style={styles.badgeText}>NATIONAL</Text>
                                </View>
                                <Text style={styles.certMeta}> • 2023 • 🏆 Gold</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="trash-outline" size={24} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.certCard}>
                        <View style={styles.certIconBgLight}>
                            <MaterialCommunityIcons name="file-pdf-box" size={30} color={Colors.primary} />
                        </View>
                        <View style={styles.certInfo}>
                            <Text style={styles.certName}>State Swimming Champio...</Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.stateBadge}>
                                    <Text style={styles.badgeText}>STATE</Text>
                                </View>
                                <Text style={styles.certMeta}> • 2022 • 🏆 Silver</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="trash-outline" size={24} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.submitText}>Submit Applications</Text>
                </TouchableOpacity>
            </ScrollView>
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
        justifyContent: 'space-between',
        padding: Spacing.md,
        backgroundColor: Colors.white,
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 20,
    },
    form: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
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
    placeholderText: {
        flex: 1,
        fontSize: 16,
        color: Colors.textSecondary,
    },
    row: {
        flexDirection: 'row',
    },
    uploadArea: {
        borderWidth: 2,
        borderColor: '#3B82F6',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
    },
    uploadTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginTop: 12,
    },
    uploadInfo: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        height: 50,
        marginTop: 10,
    },
    addButtonText: {
        marginLeft: 8,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    countText: {
        color: Colors.textSecondary,
        fontWeight: 'normal',
    },
    certificateList: {
        marginBottom: 30,
    },
    certCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    certIconBg: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    certIconBgLight: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    certInfo: {
        flex: 1,
    },
    certName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    nationalBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    stateBadge: {
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    certMeta: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    submitText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
