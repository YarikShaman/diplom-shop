import React, {useState} from 'react';
import styles from './Login.module.css';

interface LoginProps {
    onClose: () => void;
    onRegisterClick: () => void;
}

export default function Login({onClose, onRegisterClick}: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Отправка данных формы для входа:', {email, password});
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.loginDiv}>
                        <label htmlFor="loginEmail">Электронна пошта:</label>
                        <input
                            type="email"
                            id="loginEmail"
                            name="loginEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.loginDiv}>
                        <label htmlFor="loginPassword">Пароль:</label>
                        <input
                            type="password"
                            id="loginPassword"
                            name="loginPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit">Увійти</button>
                    </div>

                    <p>Немає аккаунту?<br/> <a href="#!" onClick={onRegisterClick}>Зареєструйся</a></p>

                </form>
                <span className={styles.close} onClick={onClose}>&times;</span>
            </div>
        </div>
    );
}