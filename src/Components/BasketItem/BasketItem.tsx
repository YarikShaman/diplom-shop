import styles from './BasketItem.module.css'
import {useNavigate} from "react-router-dom";

interface Item {
    name: string,
    count: number,
    price: number,
    img: number[],
    id:number

}

export default function BasketItem(item:Item) {

    const nav = useNavigate()
    return(
        <div onClick={()=>{
            nav('/product/'+String(item.id))
        }} className={styles.background}>
            <img className={styles.img}/>
            <div className={styles.name}>
                {item.name}
            </div>
            <div className={styles.price}>
                {item.price}
            </div>
            <div className={styles.count}>
                {item.count}
            </div>
            <div className={styles.total}>
                {item.count*item.price}
            </div>
        </div>
    )
}