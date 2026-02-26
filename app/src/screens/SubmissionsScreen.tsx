import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import api from '../services/apiClient';

const VideoPlayerComponent = ({ url }: { url: string }) => {
    const player = useVideoPlayer(url, player => {
        player.loop = false;
    });

    return (
        <VideoView style={styles.video} player={player} />
    );
};

export default function SubmissionsScreen() {
    const navigation = useNavigation<any>();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await api.get('/fitness');
                setSubmissions(res.data);
            } catch (err: any) {
                console.log('Error fetching submissions:', err);
                setError('Failed to load submissions.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.testIconContainer}>
                    <Ionicons name="fitness" size={24} color={Colors.primary} />
                </View>
                <View style={styles.testInfo}>
                    <Text style={styles.testName}>{item.testName}</Text>
                    <Text style={styles.testDate}>
                        {new Date(item.dateTaken).toLocaleDateString()}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.score ? '#DEF7EC' : '#FEF3C7' }]}>
                    <Text style={[styles.statusText, { color: item.score ? '#03543F' : '#92400E' }]}>
                        {item.score ? 'Evaluated' : 'Pending'}
                    </Text>
                </View>
            </View>

            {!!item.videoProofUrl && (
                <View style={styles.videoContainer}>
                    <VideoPlayerComponent url={
                        item.videoProofUrl.includes('cloudinary.com')
                            ? item.videoProofUrl.replace('http://', 'https://').replace('/upload/', '/upload/q_auto,vc_auto/')
                            : item.videoProofUrl
                    } />
                </View>
            )}

            {!!item.score && (
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreLabel}>Final Score:</Text>
                    <Text style={styles.scoreValue}>{item.score}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Submissions</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); api.get('/fitness').then(r => setSubmissions(r.data)).catch(() => { }).finally(() => setLoading(false)) }}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : submissions.length === 0 ? (
                <View style={styles.centerContent}>
                    <Ionicons name="folder-open-outline" size={64} color={Colors.textSecondary} />
                    <Text style={styles.emptyTitle}>No Submissions Yet</Text>
                    <Text style={styles.emptyDesc}>You haven't uploaded any test assessments yet.</Text>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('SelectTest')}>
                        <Text style={styles.actionBtnText}>Start an Assessment</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={submissions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: Spacing.sm,
        marginLeft: -Spacing.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    errorText: {
        marginTop: Spacing.md,
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.primary,
        borderRadius: 8,
    },
    retryText: {
        color: Colors.white,
        fontWeight: '600',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginTop: Spacing.lg,
    },
    emptyDesc: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    actionBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: 12,
    },
    actionBtnText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
    listContainer: {
        padding: Spacing.md,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    testIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    testInfo: {
        flex: 1,
    },
    testName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    testDate: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    videoPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    videoText: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    scoreLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    scoreValue: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    videoContainer: {
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        height: 200,
    },
    video: {
        width: '100%',
        height: '100%',
    },
});
