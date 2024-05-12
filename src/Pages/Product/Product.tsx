import styles from './Product.module.css'
import Header from "../../Components/Header/Header";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Login from "../../Components/Login/Login";
import Registration from "../../Components/Registration/Registration";
import addIcon from '../../Imges/add-items.svg'
import inBasket from '../../Imges/cart-trolly.svg'
import ShortProduct from "../../Components/ShortProduct/ShortProduct";

interface Props {
    product: Product
    similarProducts: SimilarProduct[]
}

interface Product {
    ProductID: number
    Name: string
    FullName: string
    Code: string
    Price: number
    Img: Img
    Count: string
    CategoryID: number
    Products_Characteristics: ProductsCharacteristic[]
    Category: Category
}

interface Img {
    type: string
    data: number[]
}

interface ProductsCharacteristic {
    ProductsCharacteristicsID: number
    ValueNum?: number
    ValueStr?: string
    ValueBool: boolean
    ValueDictionary: string
    CharacteristicsID: number
    ProductID: number
    Characteristic: Characteristic
}

export interface Characteristic {
    Name: string
    Type: number
}

export interface Category {
    Name: string
}

export interface SimilarProduct {
    ProductID: number
    Name: string
    FullName: string
    Code: string
    Price: number
    Img: Img
    Count: string
    CategoryID: number
}


export default function Product() {

    const [data, setData] = useState<Props>()
    const id = useParams().id
    const nav = useNavigate()
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
    const [iconSrc, setIconSrc] = useState(addIcon)
    const [count, setCount] = useState(1)

    useEffect(() => {
        axios.get(`http://localhost:5000/product/${id}`).then((res) => {
            setData(res.data)
            const uint8Array = new Uint8Array(res.data.product.img.data);
            const blob = new Blob([uint8Array], {type: 'image/jpeg'});
            const imageUrl = URL.createObjectURL(blob);
            setImageSrc(imageUrl);
            return () => URL.revokeObjectURL(imageUrl);
        })
    }, [id])

    useEffect(() => {
        const jwt = localStorage.getItem('jwt')
        axios.get('http://localhost:5000/auth/account',
            {headers: {Authorization: "Bearer " + jwt}}).then((res) => {
            console.log(res.data.basketItems.find((e: any) => e.ProductID === data?.product.ProductID))
            if (res.data.basketItems.find((e: any) => e.ProductID === data?.product.ProductID))
                setIconSrc(inBasket)
            else
                setIconSrc(addIcon)
        })
    }, [iconSrc, data])

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
                    <img alt={data?.product.Name} src={imageSrc} className={styles.img}/>
                    <div className={styles.characteristics}>
                        <div className={styles.labelName}>{data?.product.Name}</div>
                        {
                            data?.product.Products_Characteristics.map((characteristic) => {
                                return (
                                    <div className={styles.characteristic}>
                                        <div
                                            className={styles.labelCharacteristic}>{characteristic.Characteristic.Name}</div>
                                        <div
                                            className={styles.labelValue}>{characteristic.Characteristic.Type === 1 ? characteristic.ValueNum : characteristic.ValueStr}</div>
                                    </div>
                                )
                            })
                        }
                        <div className={styles.basketOperations}>
                            <img onClick={() => {
                                if (iconSrc === addIcon)
                                    axios.post('http://localhost:5000/product/basket',
                                        {'productId': data?.product.ProductID, 'count': "1"},
                                        {headers: {Authorization: "Bearer " + localStorage.getItem('jwt')}}
                                    ).then(()=>{
                                        setIconSrc(inBasket)
                                    }).catch((err) => {
                                        console.log(err)
                                        setLoginOpen(true)
                                    })
                                else
                                    nav('/account')
                            }} src={iconSrc} alt={'add-to-basket'} className={styles.addIcon}/>
                            {
                                iconSrc === addIcon &&
                                <input type={"number"} min={1} className={styles.countInput} value={count}
                                       onChange={(e) => {
                                           setCount(parseInt(e.currentTarget.value, 10))
                                       }}/>
                            }
                            {
                                iconSrc !== addIcon &&
                                <label>Вже у кошику!</label>
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.similarProducts}>
                    {
                        data?.similarProducts.map((product) => {
                            return (
                                <ShortProduct name={product.Name} count={product.Count} price={product.Price}
                                              img={product.Img.data} id={product.ProductID}/>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}