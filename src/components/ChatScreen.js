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

const socket = io(BASE_URL, {
    transports: ['websocket'],
    autoConnect: true,
});

const ChatScreen = ({ route }) => {
    const { receiver } = route.params;
    const [message, setMessage] = useState([]);
    const flatListRef = useRef();
    const [isAtEnd, setIsAtEnd] = useState(true);
    const [text, setText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [refresh, setRefresh] = useState(false);

    const dispatch = useDispatch();
    const { messagesList } = useSelector(state => state.user);

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', e => {
            setKeyboardHeight(e.endCoordinates.height + 20);
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
        if (!messagesList) return;
        setMessage(messagesList);
    }, [messagesList]);


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
