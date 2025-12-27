import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { loginAPI } from '../redux/slices/userSlice';
import { Checkbox } from 'react-native-paper';
import { persistor } from '../redux/store';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRemember, setIsRemember] = useState(false);
    const { isRememberMe, email: userEmail, password: userPassword } = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isRememberMe) {
            setEmail(userEmail);
            setPassword(userPassword);
            setIsRemember(true);
        } else {
            setEmail('');
            setPassword('');
            setIsRemember(false);
        }
    }, [isRememberMe]);


    const onHandleLogin = async () => {
        let request = { email, password, isRemember };
        dispatch(loginAPI(request))
            .unwrap()
            .then(async (res) => {
                Alert.alert('Success', res.message);
                navigation.replace('Home')
            })
            .catch((err) => {
                Alert.alert('Failed', err.message || 'Something went wrong');
            });
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
            </LinearGradient>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Icon name="email-outline" size={24} color="#333" />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholderTextColor={'gray'}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={24} color="#333" />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor={'gray'}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <Checkbox.Android
                        status={isRemember ? 'checked' : 'unchecked'}
                        onPress={() => setIsRemember(!isRemember)}
                        color='#3b5998'
                        uncheckedColor='#3b5998'
                    />
                    <Text>Remember Me</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={onHandleLogin} >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                    <Text style={styles.switchText}>Don't have an account? Register</Text>
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
    input: { flex: 1, marginLeft: 10, color: 'black' },
    button: { backgroundColor: '#3b5998', padding: 15, borderRadius: 30, alignItems: 'center', marginVertical: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    switchText: { color: '#3b5998', textAlign: 'center', marginTop: 10 }
});
