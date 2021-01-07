import { useState } from 'react';
import firebase from '../../firebase';
import styles from './Auth.module.scss';
import { Link } from 'react-router-dom';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Login = () => {

    const [user, setUser] = useState({
        email: '',
        password: '',
        errors: [],
        loading: false
    });

    const { email, password, errors, loading } = user;

    const handleChange = e => setUser({
        ...user,
        [e.target.name]: e.target.value 
    });

    const displayErrors = errors => errors.map((error, i) => {
        return (
            <p key={i} className={styles.error__msg}>
                <span><FontAwesomeIcon icon={faExclamationCircle} /></span>
                {error.message}
            </p>
        );
    });

    const isFormValid = (email, password) => email && password;

    const handleSubmit = e => {
        e.preventDefault();

        if (isFormValid(email, password)) {
            setUser({
                ...user,
                errors: [],
                loading: true
            });

            firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(signedInUser => {
                console.log(signedInUser);
            })
            .catch(err => {
                setUser({
                    ...user,
                    errors: errors.concat(err),
                    loading: false
                });
            });
        }
    }

    return (
        <div className={styles.login}>
            <div className="px-2">
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full lg:w-3/4">
                        <div className={styles.loginImage}>
                            <h1>Welcome back!</h1>
                            <p>Make the world smaller</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/4">
                        <div className={styles.loginForm}>
                            <div className={styles.formHeading}>
                                <h1>Login to <span className={styles.appName}>{process.env.REACT_APP_NAME}</span></h1>
                            </div>
                            <form onSubmit={handleSubmit}>
                                {errors && errors.length > 0 && displayErrors(errors)}
                                <div className={styles.formInput}>
                                    <input
                                        className={styles.inputField}
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.formInput}>
                                    <input
                                        className={styles.inputField}
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.loginButtons}>
                                    <div className="flex flex-wrap -mx-2">
                                        <div className="w-1/2 text-left px-2">
                                            <button 
                                                className={styles.loginBtn}
                                            >{loading ? 'Loading...' : 'Login'}</button>
                                        </div>
                                        <div className="w-1/2 text-right px-2">
                                            <button type="button" className={styles.registerBtn}><Link to="/register">Register?</Link></button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;