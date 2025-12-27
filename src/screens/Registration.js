import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { registerAPI } from '../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux'

export default function Registration({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { registerStatus, registerMessage } = useSelector(state => state.user);

    useEffect(() => {
        if (registerStatus === 'ok') {
            navigation.navigate('Login');
        }
    }, [registerStatus]);

    const dispatch = useDispatch();

    const onHandleRegistration = () => {
        let request = { name, email, password };
        dispatch(registerAPI(request))
            .unwrap()
            .then((res) => {
                Alert.alert('Success', res.message);
            })
            .catch((err) => {
                Alert.alert('Failed', err.message || 'Something went wrong');
            });
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
            </LinearGradient>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Icon name="account-outline" size={24} color="#333" />
                    <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="email-outline" size={24} color="#333" />
                    <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={24} color="#333" />
                    <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                </View>

                <TouchableOpacity onPress={onHandleRegistration} style={styles.button}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.switchText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { height: '35%', justifyContent: 'center', alignItems: 'center' },
    title: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
    form: { flex: 1, padding: 20, justifyContent: 'center' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 5 },
    input: { flex: 1, marginLeft: 10 },
    button: { backgroundColor: '#3b5998', padding: 15, borderRadius: 30, alignItems: 'center', marginVertical: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    switchText: { color: '#3b5998', textAlign: 'center', marginTop: 10 }
});
