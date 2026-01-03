import React, { useEffect, useState, useRef } from 'react';
import {
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Text
} from 'react-native';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import io from 'socket.io-client';
import { BASE_URL } from '../services/Http';
import { useDispatch, useSelector } from 'react-redux';
import { View, Keyboard } from 'react-native';
import { messagesAPI } from '../redux/slices/userSlice';
import { RefreshControl } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const socket = io(BASE_URL, {
    transports: ['websocket'],
    autoConnect: true,
});

const ChatScreen = ({ route, navigation }) => {
    const { receiver } = route.params;
    const [message, setMessage] = useState([]);
    const flatListRef = useRef();
    const [isAtEnd, setIsAtEnd] = useState(true);
    const [text, setText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [isOnline, setIsOnline] = useState(false);

    const isFocused = useIsFocused();

    const dispatch = useDispatch();
    const { messagesList } = useSelector(state => state.user);
    const lastMessage = messagesList?.[messagesList.length - 1];

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardHeight(e.endCoordinates.height + 20);
            scrollToId(lastMessage.id);
        });

        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);


    useEffect(() => {
        if (!userId) return;
        if (isFocused) {
            socket.emit('user_online', userId);
        }
        return () => {
            socket.emit('user_offline', userId);
        }
    }, [isFocused, userId]);


    useEffect(() => {
        if (!messagesList) return;
        setMessage(messagesList);
    }, [messagesList]);

    useEffect(() => {
        if (!navigation) return;
        navigation.setOptions({
            title: receiver.name,
            headerRight: () => {
                return (
                    <Text style={{
                        color: isOnline ? 'green' : 'red'
                    }}>{ }{isOnline ? 'Online' : 'Offline'}</Text>
                )
            }
        });
        return () => navigation.setOptions({
            title: '',
        })
    }, [navigation, isOnline]);


    const sendHandler = () => {
        if (!text.trim()) return;
        sendMessage(text);
        setText('');
    };
    const { userId } = useSelector(state => state.user);

    const roomId =
        userId < receiver.id
            ? `room_${userId}_${receiver.id}`
            : `room_${receiver.id}_${userId}`;

    useEffect(() => {
        const handleUserOnline = (ids) => {
            if (ids.includes(receiver.id)) {
                setIsOnline(true);
            }
        };

        const handleUserOffline = (id) => {
            if (receiver.id === id) {
                setIsOnline(false);
            }
        };

        socket.on('user_online', handleUserOnline);
        socket.on('user_offline', handleUserOffline);

        return () => {
            socket.off('user_online', handleUserOnline);
            socket.off('user_offline', handleUserOffline);
        };
    }, []);


    useEffect(() => {
        socket.emit('join_room', roomId);
        socket.on('receive_message', data => {
            setMessage(prev => [...prev, data]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [roomId]);

    useEffect(() => {
        if (flatListRef.current && isAtEnd) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [message]);

    useEffect(() => {
        if (userId && receiver.id) getMessages();
    }, [userId, receiver.id]);

    useEffect(() => {
        socket.emit('join', userId);
    }, [userId])

    const scrollToId = (id) => {
        const findIndex = message.findIndex(msg => msg.id === id);
        if (findIndex !== -1) {
            flatListRef.current?.scrollToIndex({ index: findIndex, animated: true });
        }
    }

    const sendMessage = (msg) => {
        if (!msg.trim()) return;
        const newMessage = {
            roomId,
            sender_id: userId,
            receiver_id: receiver.id,
            message: msg,
            createdAt: new Date().toISOString(),
        };
        socket.emit('send_message', newMessage);
    };


    const getMessages = () => dispatch(messagesAPI({ sender_id: userId, receiver_id: receiver.id }));


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={{
                flex: 1
            }}>
                <FlatList
                    ref={flatListRef}
                    data={message}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <MessageBubble
                            message={item}
                            isMe={item.sender_id === userId}
                        />
                    )}
                    refreshControl={<RefreshControl refreshing={refresh} onRefresh={() => {
                        setRefresh(true);
                        getMessages();
                        setRefresh(false);
                    }} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    onScroll={({ nativeEvent }) => {
                        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                        const isCloseToBottom =
                            layoutMeasurement.height + contentOffset.y >=
                            contentSize.height - 20;
                        setIsAtEnd(isCloseToBottom);
                    }}
                />

                <View
                    style={[
                        styles.inputContainer,
                        { marginBottom: keyboardHeight }
                    ]}
                >
                    <TextInput
                        placeholder="Type a message"
                        value={text}
                        onChangeText={setText}
                        style={styles.input}
                        multiline
                        placeholderTextColor={'gray'}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={sendHandler}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    list: {
        padding: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 0.5,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        paddingHorizontal: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        color: 'black'
    },
    sendBtn: {
        marginLeft: 8,
        backgroundColor: '#4f46e5',
        borderRadius: 20,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
    },
});
