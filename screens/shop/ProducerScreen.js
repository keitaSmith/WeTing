import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { WaveIndicator } from 'react-native-indicators';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as producersActions from '../../store/actions/producers';
const ProducerScreen = props => {
    const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const businesses = useSelector(state => state.producers.allProducers);

    const dispatch = useDispatch();
    const loadProducers = useCallback(async () => {
        setError(null);
        setIsRefreshing(true)
        try {
            await dispatch(producersActions.fetchProducers());
        } catch (err) {
            setError(err.message)
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError])


    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducers);
        return () => {
            willFocusSub.remove();
        }
    }, [loadProducers]);
    useEffect(() => {
        setIsLoading(true);
        loadProducers().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadProducers]);
    if (error) {
        return (
            <LinearGradient colors={[Colors.accent, Colors.primary]} style={{ flex: 1 }}>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons
                        name='react'
                        size={100}
                        color={Colors.primary}
                    />
                    <Text style={styles.emptyText}>An Error Occured</Text>
                    <Button title="Try Again" onPress={loadProducts} color={Colors.primary} />
                </View>
            </LinearGradient>
        )
    }
    if (isLoading) {
        return (
            <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
                <WaveIndicator color={Platform.OS === 'android' ? 'white' : Colors.primary} size={150} waveMode={"outline"} waveFactor={0.4} count={2} />
            </LinearGradient>
        )
    } else {
        return (
            <LinearGradient colors={[Colors.gradeA, Colors.gradeB, Colors.gradeA]} style={{ flex: 1 }}>
                
                    <FlatList
                    style={styles.screen}
                        refreshing={isRefreshing}
                        onRefresh={loadProducers}
                        data={businesses}
                        keyExtractor={item => item.id}
                        renderItem={itemData => (
                            <CartItem
                                producer
                                title={itemData.item.businessName}
                                amount={itemData.item.description}
                                imgUrl={itemData.item.logoUrl}
                                onViewProducts={() => {
                                    props.navigation.navigate('ProductsOverview', {
                                        ownerId: itemData.item.ownerId,
                                        businessName:itemData.item.businessName
                                    });
                                }}
                            />)}
                    />
               
            </LinearGradient>
        )
    }
};
const styles = StyleSheet.create({
    screen: {
        //flex:1,
        paddingHorizontal:20
        //marginHorizontal: 20,
        //width:'100%'
        //marginBottom: 100
    }
});
export default ProducerScreen