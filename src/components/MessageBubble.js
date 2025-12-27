// components/MessageBubble.js
import React from 'react';
import moment from 'moment';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

const MessageBubble = ({ message, isMe }) => {
    return (
        <View
            style={[
                styles.container,
                isMe ? styles.right : styles.left
            ]}
        >
            <Text style={styles.text}>{message.message}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginTop: 4,
            }}>
                <Feather name='clock' size={10} color={'#fff'} />
                <Text style={styles.time}>{moment(message.created_at).format('HH:mm')}</Text>
            </View>
        </View>
    );
};

export default MessageBubble;

const styles = StyleSheet.create({
    container: {
        maxWidth: '75%',
        padding: 10,
        marginVertical: 4,
        borderRadius: 12,
    },
    left: {
        backgroundColor: '#4f46e5',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    right: {
        backgroundColor: '#4f46e5',
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    text: {
        fontSize: 15,
        color: '#fff',
    },
    time: {
        fontSize: 10,
        color: '#fff',
        alignSelf: 'flex-end',
    },
});
