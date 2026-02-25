import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import api from '../services/apiClient';

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.log('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReadNotification = async (id: string, isRead: boolean) => {
        if (isRead) return;

        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.log('Error marking as read:', error);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
            onPress={() => handleReadNotification(item._id, item.isRead)}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={24} color={!item.isRead ? Colors.primary : Colors.textSecondary} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>No Notifications</Text>
                    <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
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
        paddingVertical: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 8,
    },
    listContent: {
        padding: Spacing.md,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    unreadCard: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    iconContainer: {
        marginRight: 16,
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    unreadText: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
    message: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
        lineHeight: 20,
    },
    time: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        alignSelf: 'center',
        marginLeft: 12,
    }
});
