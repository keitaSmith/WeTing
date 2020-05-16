import Producer from '../../models/producer';

export const DELETE_PRODUCER = 'DELETE_PRODUCER';
export const CREATE_PRODUCER = 'CREATE_PRODUCER';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCERS = 'SET_PRODUCERS';

export const fetchProducers = () => {
    return async (dispatch,getState) => {
      const userId=getState().auth.userId;
      try {
        const response = await fetch('https://weting-c2f6b.firebaseio.com/producers.json');
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
        const resData = await response.json();
        const loadedProducers = [];
  
        for (const key in resData) {
          loadedProducers.push(
            new Producer(
              key,
              resData[key].ownerId,
              resData[key].businessName,
              resData[key].logoUrl,
              //resData[key].certificate,
              resData[key].description
            )
          );
        };
        dispatch({ type: SET_PRODUCERS, producers: loadedProducers});
      } catch (err) {
        throw err;
      }
    }
  }
export const createProducer = (businessName, logoUrl, description) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://weting-c2f6b.firebaseio.com/producers.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ownerId: userId,
                businessName,
                logoUrl,
                //certificate,
                description,
            })
        });

        const resData = await response.json();

        dispatch({
            type: CREATE_PRODUCER,
            producerData: {
                id: resData.name,
                ownerId: userId,
                businessName,
                logoUrl,
                //certificate,
                description,        
            }
        });
        console.log(resData);
    }
};