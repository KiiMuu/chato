import { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import firebase from './firebase';

// components
import Home from './components/home/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Spinner from './components/layout/spinner/Spinner';

import { connect } from 'react-redux';
import { setUser, clearUser } from './actions/index';

const App = ({ isLoading, setUser, clearUser }) => {

    let history = useHistory();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user);

                history.push('/');
            } else {
                history.push('/login');

                clearUser();
            }
        });
    }, [history, isLoading, setUser, clearUser]);

    return isLoading ? <Spinner /> : (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
        </Switch>
    );
}

const mapStateToProps = state => ({
    isLoading: state.user.isLoading
});

export default connect(mapStateToProps, { setUser, clearUser })(App);