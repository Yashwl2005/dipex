import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/apiClient';

export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const [userName, setUserName] = useState('Athlete');
    const [userSport, setUserSport] = useState('-');
    const [hasUnread, setHasUnread] = useState(false);
    const [evalStatus, setEvalStatus] = useState('pending');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
    const [overallScore, setOverallScore] = useState<number | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            const checkUnread = async () => {
                try {
                    const res = await api.get('/notifications');
                    const unread = res.data.some((n: any) => !n.isRead);
                    setHasUnread(unread);
                } catch (err) {
                    console.log('Error checking notifications:', err);
                }
            };
            checkUnread();
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            const loadProfileData = async () => {
                try {
                    // Fetch full profile from DB instead of just relying on local storage
                    const res = await api.get('/auth/me');
                    if (res.data) {
                        setUserName(res.data.name);
                        setEvalStatus(res.data.evaluationStatus);
                        if (res.data.profilePhotoUrl) {
                            setProfilePhotoUrl(res.data.profilePhotoUrl);
                        }
                        if (res.data.sports && res.data.sports.length > 0) {
                            setUserSport(res.data.sports[0]); // display primary sport
                        }
                        if (res.data.overallScore !== undefined && res.data.overallScore !== null) {
                            setOverallScore(res.data.overallScore);
                        }
                    }
                } catch (err) {
                    console.log('Error loading profile data:', err);
                }
            };
            loadProfileData();
        }, [])
    );

    const getStatusDisplay = () => {
        if (evalStatus === 'approved') return { label: 'Approved Athlete', color: Colors.success };
        if (evalStatus === 'rejected') return { label: 'Profile Rejected', color: Colors.error };
        return { label: 'Verification Pending', color: '#F59E0B' };
    };

    const statusDisp = getStatusDisplay();

    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Helper to format dynamic relative time
    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        // If older than a week, show actual date
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Comprehensive announcements data with actual Dates
    // Using actual recent timestamps to simulate real data aging
    const announcementsData = [
        {
            id: 1,
            title: 'Khelo India Selection Trials 2026',
            description: 'The national selection trials for the upcoming Khelo India Youth Games will commence on the 15th of next month. All registered athletes in Athletics and Swimming must ensure their profiles are 100% complete.',
            postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago from current app load
            type: 'trial',
            iconName: 'flag',
            iconColor: '#F59E0B',
            bgColor: '#FEF3C7',
        },
        {
            id: 2,
            title: 'New Scholarship Opportunities',
            description: 'The Sports Authority of India (SAI) has announced 500 new grassroots scholarships for U-17 athletes. Ensure your fitness assessment videos are uploaded before the end of the quarter to be considered.',
            postedAt: new Date(Date.now() - 26 * 60 * 60 * 1000), // ~1 day ago
            type: 'scholarship',
            iconName: 'school',
            iconColor: '#10B981',
            bgColor: '#D1FAE5',
        },
        {
            id: 3,
            title: 'Mandatory Equipment Check',
            description: 'New standard guidelines for protective gear in Boxing and Taekwondo have been published. Please review the updated sports guidelines under your profile to avoid disqualification during trials.',
            postedAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000), // ~3.5 days ago
            type: 'update',
            iconName: 'shield-checkmark',
            iconColor: '#3B82F6',
            bgColor: '#DBEAFE',
        },
        {
            id: 4,
            title: 'National Assessment Camp',
            description: 'Selected candidates from the Northern zone will be invited to the New Delhi Regional Center for a 3-day high-performance assessment camp. Invitations will be sent via notifications.',
            postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // ~8 days ago
            type: 'camp',
            iconName: 'fitness',
            iconColor: '#8B5CF6',
            bgColor: '#EDE9FE',
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSubtitle}>SAI TALENT ASSESSMENT</Text>
                    <Text style={styles.headerTitle}>Welcome, {userName.split(' ')[0]}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.notificationBtn}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Ionicons name="notifications" size={24} color="#374151" />
                        {hasUnread && <View style={styles.dot} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signOutBtn}
                        onPress={handleSignOut}
                    >
                        <Ionicons name="log-out-outline" size={24} color={Colors.error} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            {profilePhotoUrl ? (
                                <Image source={{ uri: profilePhotoUrl }} style={styles.profileImage} />
                            ) : (
                                <Ionicons name="person" size={50} color="#D1D5DB" />
                            )}
                            <View style={[styles.checkIcon, { backgroundColor: statusDisp.color }]}>
                                <Ionicons name={evalStatus === 'approved' ? 'checkmark-circle' : (evalStatus === 'rejected' ? 'close-circle' : 'time')} size={20} color={Colors.white} />
                            </View>
                        </View>
                    </View>
                    <Text style={styles.profileName}>{userName}</Text>
                    <Text style={[styles.verifiedTag, { color: statusDisp.color }]}>{statusDisp.label}</Text>
                    <View style={styles.idBadge}>
                        <Text style={styles.idText}>ID: SAI-PROFILE</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>STATUS</Text>
                            <Text style={[styles.statValue, { color: statusDisp.color, textTransform: 'capitalize' }]}>{evalStatus}</Text>
                        </View>
                        <View style={[styles.statItem, styles.statBorder]}>
                            <Text style={styles.statLabel}>SPORT</Text>
                            <Text style={styles.statValue} numberOfLines={1}>{userSport}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>DOCS</Text>
                            <Text style={styles.statValue}>-</Text>
                        </View>
                    </View>
                </View>

                {/* Scoreboard Widget */}
                <View style={styles.scoreboardCard}>
                    <View style={styles.scoreLeft}>
                        <Text style={styles.scoreTitle}>SAI Athletic Index</Text>
                        <Text style={styles.scoreSubtitle}>Overall Performance Score</Text>
                    </View>
                    <View style={styles.scoreRight}>
                        <Text style={styles.scoreValue}>{overallScore !== null ? Number(overallScore).toFixed(1) : '-'}</Text>
                        <Text style={styles.scoreMax}>/ 25</Text>
                    </View>
                </View>

                {/* Profile Completion */}
                <View style={styles.completionCard}>
                    <View style={styles.completionHeader}>
                        <Text style={styles.cardTitle}>Global Evaluation</Text>
                        <Text style={[styles.percentText, { color: statusDisp.color }]}>{evalStatus.toUpperCase()}</Text>
                    </View>
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressFill, { width: evalStatus === 'approved' ? '100%' : (evalStatus === 'rejected' ? '100%' : '50%'), backgroundColor: statusDisp.color }]} />
                    </View>
                    <Text style={styles.suggestionText}>
                        {evalStatus === 'approved' ? 'Your profile has been approved! You are ready for national schemes.' :
                            evalStatus === 'rejected' ? 'Your profile was rejected. Please review official feedback in notifications.' :
                                'Your profile is currently under review by evaluators.'}
                    </Text>
                </View>

                {/* Start Fitness Test */}
                <TouchableOpacity style={styles.fitnessButton} onPress={() => navigation.navigate('SelectTest')}>
                    <View style={styles.fitnessLeft}>
                        <View style={styles.timerIconBox}>
                            <Ionicons name="timer" size={30} color={Colors.white} />
                        </View>
                        <View>
                            <Text style={styles.fitnessTitle}>Assessments</Text>
                            <Text style={styles.fitnessSubtitle}>
                                {evalStatus === 'approved' ? 'Profile verified.' : 'Upload assessments to get verified.'}
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={Colors.white} />
                </TouchableOpacity>

                {/* Grid Actions */}
                <View style={styles.gridContainer}>
                    <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('UploadAchievements')}>
                        <View style={styles.iconCircleBlue}>
                            <Ionicons name="document-text" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.gridTitle}>Upload Certificates</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.gridCard} onPress={() => navigation.navigate('Submissions')}>
                        <View style={styles.iconCircleLightBlue}>
                            <MaterialCommunityIcons name="history" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.gridTitle}>View Submissions</Text>
                    </TouchableOpacity>
                </View>

                {/* Announcements Feed */}
                <View style={styles.announcementHeader}>
                    <Text style={styles.cardTitle}>Latest Updates & News</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>Filter</Text>
                    </TouchableOpacity>
                </View>

                {announcementsData.map((announcement) => (
                    <View key={announcement.id} style={styles.announcementCard}>
                        <View style={[styles.annIconBox, { backgroundColor: announcement.bgColor }]}>
                            <Ionicons name={announcement.iconName as any} size={24} color={announcement.iconColor} />
                        </View>
                        <View style={styles.annContent}>
                            <Text style={styles.annTitle}>{announcement.title}</Text>
                            <Text style={styles.annDesc} numberOfLines={3}>{announcement.description}</Text>
                            <Text style={styles.annTime}>{getTimeAgo(announcement.postedAt)}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Nav Placeholder */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <View style={styles.activeNavBg}>
                        <Ionicons name="home" size={24} color={Colors.primary} />
                    </View>
                    <Text style={[styles.navText, { color: Colors.primary }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SelectTest')}>
                    <Ionicons name="timer-outline" size={24} color={Colors.textSecondary} />
                    <Text style={styles.navText}>Tests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Submissions')}>
                    <Ionicons name="folder-outline" size={24} color={Colors.textSecondary} />
                    <Text style={styles.navText}>Submissions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SportsProfile')}>
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
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    notificationBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        position: 'relative',
    },
    signOutBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FEE2E2', // light red background
        marginLeft: 4,
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
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        resizeMode: 'cover',
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
    scoreboardCard: {
        backgroundColor: '#1E1B4B', // Dark indigo/navy for premium feel
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        shadowColor: '#1E1B4B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    scoreLeft: {
        flex: 1,
    },
    scoreTitle: {
        color: '#E0E7FF',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    scoreSubtitle: {
        color: '#818CF8',
        fontSize: 12,
    },
    scoreRight: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    scoreValue: {
        color: Colors.white,
        fontSize: 42,
        fontWeight: '900',
        lineHeight: 48,
    },
    scoreMax: {
        color: '#A5B4FC',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 4,
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
        marginBottom: 12,
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
        marginBottom: 4,
    },
    annDesc: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
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
