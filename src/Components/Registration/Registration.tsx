import React, {useState} from 'react';
import styles from './Registration.module.css';
import axios from "axios";

interface RegistrationProps {
    onClose: () => void;
    onLoginClick: () => void;
}

export default function Registration({onClose, onLoginClick}: RegistrationProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:5000/auth/registration',
            {'fullName': username, 'email': email, 'password': password}).then(() => {
            onLoginClick()
        }).catch((err)=>{
            console.log(err)
        })
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.loginDiv}>
                        <label htmlFor="registrationEmail">Электронна пошта:</label>
                        <input
                            type="email"
                            id="registrationEmail"
                            name="registrationEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.loginDiv}>
                        <label htmlFor="registrationPassword">Пароль:</label>
                        <input
                            type="password"
                            id="registrationPassword"
                            name="registrationPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.loginDiv}>
                        <label htmlFor="registrationUsername">Ім'я користувача:</label>
                        <input
                            type="text"
                            id="registrationUsername"
                            name="registrationUsername"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit">Зареєструватися</button>
                    </div>

                    <p>Вже маєте акаунт?<br/> <a href="#!" onClick={onLoginClick}>Увійти</a></p>

                </form>
                <span className={styles.close} onClick={onClose}>&times;</span>
            </div>
        </div>
    );
}