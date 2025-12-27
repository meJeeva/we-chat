import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const UserItem = ({ item }) => {

    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('ChatScreen', { receiver: item })}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                </Text>
            </View>

            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default UserItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 14,
        borderBottomWidth: 0.5,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
        alignItems: 'center',
        margin: 10,
        marginVertical: 5,
        borderRadius: 8
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    info: {
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
    },
    email: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
});
