import { useState } from 'react';
import firebase from '../../firebase';
import styles from './Auth.module.scss';
import { Link } from 'react-router-dom';
import md5 from 'md5';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const Register = () => {

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    });

    const { username, email, password, confirmPassword, errors, loading, usersRef } = user;

    const handleChange = e => setUser({
        ...user,
        [e.target.name]: e.target.value 
    });

    const isFormEmpty = (username, email, password, confirmPassword) => {
        return !username.length || !email.length || !password.length || !confirmPassword.length;
    }

    const isPasswordValid = (password, confirmPassword) => {
        if (password.length < 6 || confirmPassword.length < 6) {
            return false;
        } else if (password !== confirmPassword) {
            return false;
        } else {
            return true;
        }
    }

    const isFormValid = () => {
        let errors = [];
        let error;

        if (isFormEmpty(username, email, password, confirmPassword)) {
            error = { message: 'Fill in all fields' };

            setUser({ errors: errors.concat(error) });

            return false;
        } else if (!isPasswordValid(password, confirmPassword)) {
            error = { message: 'Password is invalid' }

            setUser({ errors: errors.concat(error) });

            return false;
        } else {
            return true;
        }
    }

    const displayErrors = errors => errors.map((error, i) => {
        return (
            <p key={i} className={styles.errorMsg}>
                <span><FontAwesomeIcon icon={faExclamationCircle} /></span>
                {error.message}
            </p>
        );
    });

    const saveUser = createdUser => {
        return usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (isFormValid()) {
            setUser({
                errors: [],
                loading: true
            });

            firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(createdUser => {
                createdUser.user.updateProfile({
                    displayName: username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                .then(() => {
                    saveUser(createdUser).then(() => {
                        console.log('User saved');
                    });
                })
                .catch(err => {
                    setUser({
                        errors: errors.concat(err),
                        loading: false
                    });
                });
            })
            .catch(err => {
                setUser({
                    errors: errors.concat(err),
                    loading: false
                });
            });
        }
    }

    return (
        <div className={styles.register}>
            <div className="px-2">
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full lg:w-3/4">
                        <div className={styles.registerImage}>
                            <h1>Welcome to <span className={styles.appName}>{process.env.REACT_APP_NAME}</span></h1>
                            <p>Make the world smaller</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/4">
                        <div className={styles.registerForm}>
                            <div className={styles.formHeading}>
                                <h1>Register to <span className={styles.appName}>{process.env.REACT_APP_NAME}</span></h1>
                            </div>
                            <form onSubmit={handleSubmit}>
                                {errors && errors.length > 0 && displayErrors(errors)}
                                <div className={styles.formInput}>
                                    <input
                                        className={styles.inputField}
                                        name="username"
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={handleChange}
                                    />
                                </div>
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
                                <div className={styles.formInput}>
                                    <input
                                        className={styles.inputField}
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.registerButtons}>
                                    <div className="flex flex-wrap -mx-2">
                                        <div className="w-1/2 text-left px-2">
                                            <button 
                                                className={styles.registerBtn}
                                            >{loading ? 'Loading...' : 'Register'}</button>
                                        </div>
                                        <div className="w-1/2 text-right px-2">
                                            <button type="button" className={styles.loginBtn}><Link to="/login">Login?</Link></button>
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

export default Register;
