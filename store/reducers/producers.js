import {
    //DELETE_PRODUCER,
    CREATE_PRODUCER,
    //UPDATE_PRODUCER,
    SET_PRODUCERS
} from '../actions/producers';
import Producer from '../../models/producer';

const initialState = {
    allProducers: [],
    //userId: null
    //userProducts: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCERS:
            return {
                allProducers: action.producers,
                //userId: action.userId
            };
        case CREATE_PRODUCER:
            const newProducer = new Producer(
                action.producerData.id,
                action.producerData.ownerId,
                action.producerData.businessName,
                action.producerData.logoUrl,
                //action.producerData.certificate,
                action.producerData.description,
            );
            // Toast.show('Product Added', {
            //     position: Toast.position.center,
            //     containerStyle: styles.toastStyle
            // });
            return {
                ...state,
                allProducers: state.allProducers.concat(newProducer),
                //console.log(allProducers);
                //userProducts: state.userProducts.concat(newProduct)
            };
    
            //console.log(allProducers);
    };
    return state;
};