import styles from './BasketItem.module.css'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

interface Item {
    name: string,
    count: number,
    price: number,
    img: number[],
    id:number

}

export default function BasketItem(item:Item) {

    const nav = useNavigate()
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        const uint8Array = new Uint8Array(item.img);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        return () => URL.revokeObjectURL(imageUrl);
    }, [item.img]);

    return(
        <div onClick={()=>{
            nav('/product/'+String(item.id))
        }} className={styles.background}>
            <img alt={item.name} src={imageSrc} className={styles.img}/>
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