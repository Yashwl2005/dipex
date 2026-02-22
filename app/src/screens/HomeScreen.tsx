import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSubtitle}>SAI TALENT ASSESSMENT</Text>
                    <Text style={styles.headerTitle}>Welcome, Rahul</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <Ionicons name="notifications" size={24} color="#374151" />
                    <View style={styles.dot} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={50} color="#D1D5DB" />
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                            </View>
                        </View>
                    </View>
                    <Text style={styles.profileName}>Rahul Kumar</Text>
                    <Text style={styles.verifiedTag}>Verified Athlete</Text>
                    <View style={styles.idBadge}>
                        <Text style={styles.idText}>ID: SAI-2023-8892</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>AGE</Text>
                            <Text style={styles.statValue}>17</Text>
                        </View>
                        <View style={[styles.statItem, styles.statBorder]}>
                            <Text style={styles.statLabel}>SPORT</Text>
                            <Text style={styles.statValue}>Boxing</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>STATE</Text>
                            <Text style={styles.statValue}>HR</Text>
                        </View>
                    </View>
                </View>

                {/* Profile Completion */}
                <View style={styles.completionCard}>
                    <View style={styles.completionHeader}>
                        <Text style={styles.cardTitle}>Profile Completion</Text>
                        <Text style={styles.percentText}>75%</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressFill, { width: '75%' }]} />
                    </View>
                    <Text style={styles.suggestionText}>Complete your profile to apply for national schemes.</Text>
                </View>

                {/* Start Fitness Test */}
                <TouchableOpacity style={styles.fitnessButton}>
                    <View style={styles.fitnessLeft}>
                        <View style={styles.timerIconBox}>
                            <Ionicons name="timer" size={30} color={Colors.white} />
                        </View>
                        <View>
                            <Text style={styles.fitnessTitle}>Start Fitness Test</Text>
                            <Text style={styles.fitnessSubtitle}>Battery of tests pending</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={Colors.white} />
                </TouchableOpacity>

                {/* Grid Actions */}
                <View style={styles.gridContainer}>
                    <TouchableOpacity style={styles.gridCard}>
                        <View style={styles.iconCircleBlue}>
                            <Ionicons name="document-text" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.gridTitle}>Upload Certificates</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.gridCard}>
                        <View style={styles.iconCircleLightBlue}>
                            <MaterialCommunityIcons name="history" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.gridTitle}>View Submissions</Text>
                    </TouchableOpacity>
                </View>

                {/* Announcements */}
                <View style={styles.announcementHeader}>
                    <Text style={styles.cardTitle}>Announcements</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.announcementCard}>
                    <View style={styles.annIconBox}>
                        <Ionicons name="megaphone" size={24} color="#F59E0B" />
                    </View>
                    <View style={styles.annContent}>
                        <Text style={styles.annTitle}>Khelo India Selection Trials</Text>
                        <Text style={styles.annDesc} numberOfLines={2}>Selection trials for the upcoming national games will begin from next Monday in...</Text>
                        <Text style={styles.annTime}>2 hours ago</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Nav Placeholder */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <View style={styles.activeNavBg}>
                        <Ionicons name="home" size={24} color={Colors.primary} />
                    </View>
                    <Text style={[styles.navText, { color: Colors.primary }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="timer-outline" size={24} color={Colors.textSecondary} />
                    <Text style={styles.navText}>Tests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="folder-outline" size={24} color={Colors.textSecondary} />
                    <Text style={styles.navText}>Submissions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person-outline" size={24} color={Colors.textSecondary} />
                    <Text style={styles.navText}>Profile</Text>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.white,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.primary,
        letterSpacing: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    notificationBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    dot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.error,
        borderWidth: 1,
        borderColor: Colors.white,
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 100,
    },
    profileCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FDE68A', // Light gold from design
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    checkIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderRadius: 10,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    verifiedTag: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    idBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    idText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 20,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statBorder: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#F3F4F6',
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '600',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    completionCard: {
        backgroundColor: '#EFF6FF', // Light blue
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    completionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    percentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    progressContainer: {
        height: 8,
        backgroundColor: Colors.white,
        borderRadius: 4,
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 4,
    },
    suggestionText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    fitnessButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 6,
    },
    fitnessLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    fitnessTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    fitnessSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    gridContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    gridCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconCircleBlue: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    iconCircleLightBlue: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    announcementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAll: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    announcementCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    annIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#FFF7ED',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    annContent: {
        flex: 1,
    },
    annTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    annDesc: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    annTime: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 8,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingTop: 12,
        paddingBottom: 25,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        width: '100%',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
    activeNavBg: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 16,
    },
    navText: {
        fontSize: 12,
        marginTop: 4,
        color: Colors.textSecondary,
        fontWeight: '500',
    }
});
