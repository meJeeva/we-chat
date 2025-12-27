import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout, usersAPI } from '../redux/slices/userSlice';
import { FlatList } from 'react-native';
import UserItem from '../components/UserItem';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { persistor } from '../redux/store';

const Home = () => {
    const [refresh, setRefresh] = useState(false);

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const navigation = useNavigation();

    useEffect(() => {
        if (!user?.userId) navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    }, [user?.userId]);

    const handleLogout = async () => {
        dispatch(logout());
        if (!user.isRememberMe) {
            await persistor.purge();
        }
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });

    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout}>
                    <AntDesign name="logout" size={22} color="black" />
                </TouchableOpacity>
            )
        })

        return () => {
            navigation.setOptions({
                headerRight: undefined
            })
        }

    }, [navigation]);

    useEffect(() => {
        dispatch(usersAPI());
    }, []);

    const refreshUsers = () => {
        setRefresh(true);
        dispatch(usersAPI());
        setRefresh(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={{
                margin: 10,
                fontSize: 20,
                fontWeight: 'bold',
                color: 'black'
            }}>Hi, {user.name}</Text>
            <FlatList
                data={user.usersList ? user.usersList?.filter((item) => item.id !== user.userId) : []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <UserItem item={item} />}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={refreshUsers} />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No users found</Text>
                }
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({})