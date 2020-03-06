import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../../store/reducers';

const store = createStore(reducers, applyMiddleware(thunk));

const configuredStore = store;

export default configuredStore;
