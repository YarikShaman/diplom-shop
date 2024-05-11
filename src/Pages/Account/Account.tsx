import styles from './Account.module.css'
import Header from "../../Components/Header/Header";
import BasketItem from "../../Components/BasketItem/BasketItem";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Login from "../../Components/Login/Login";
import Registration from "../../Components/Registration/Registration";
import axios from "axios";
import Product from "../Product/Product";

export interface Props {
    fullName: string
    email: string
    basketItems: BasketItem[]
}

export interface BasketItem {
    BasketID: number
    Count: number
    ProductID: number
    UserID: number
    Product: Product
}

export interface Product {
    ProductID: number
    Name: string
    FullName: string
    Code: string
    Price: number
    Img: Img
    Count: string
    CategoryID: number
}

export interface Img {
    type: string
    data: number[]
}


export default function Account() {

    const [data, setData] = useState<Props>()
    const nav = useNavigate()
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/auth/account',
            {headers: {Authorization: "Bearer " + localStorage.getItem('jwt')}}).then((res) => {
            setData(res.data)
        }).catch((err) => {
            console.log(err)
            nav('/')
        })
    }, [])

    return (
        <div className={styles.screen}>
            {loginOpen &&
                <Login onClose={() => {
                    setLoginOpen(false)
                }}
                       onRegisterClick={() => {
                           setRegisterOpen(true);
                           setLoginOpen(false)
                       }}/>
            }
            {registerOpen &&
                <Registration onClose={() => setRegisterOpen(false)}
                              onLoginClick={() => {
                                  setRegisterOpen(false)
                                  setLoginOpen(true)
                              }}/>
            }
            <Header setLogin={() => {
                setLoginOpen(true)
            }}/>
            <div className={styles.background}>
                <div className={styles.content}>
                    <div className={styles.row}>
                        <div className={styles.labelBold}>Ім'я користувача:</div>
                        <div className={styles.label}>{data?.fullName}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.labelBold}>Пошта:</div>
                        <div className={styles.label}>{data?.email}</div>
                    </div>
                    <div className={styles.basketLabel}>Кошик</div>
                    <div className={styles.basket}>
                        <div className={styles.basketTop}>
                            <div className={styles.img}></div>
                            <div className={styles.name}>Назва</div>
                            <div className={styles.price}>Ціна</div>
                            <div className={styles.count}>Кількість</div>
                            <div className={styles.total}>Підс.</div>
                        </div>
                        {
                            data?.basketItems.map((item) => {
                                return (<BasketItem name={item.Product.Name} img={item.Product.Img.data}
                                                    price={item.Product.Price} count={item.Count} id={item.ProductID}
                                                    key={item.ProductID}/>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}