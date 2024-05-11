import styles from './ShortProduct.module.css'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export interface Props{
    name:string,
    count: string,
    price:number,
    img: number[],
    id:number

}

export default function ShortProduct(product:Props){

    const nav = useNavigate()
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
        const uint8Array = new Uint8Array(product.img);
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        return () => URL.revokeObjectURL(imageUrl);
    }, [product.img]);

    return(
    <div onClick={()=>{nav('/product/'+String(product.id))}} className={styles.background}>
        <div className={styles.content}>
            {imageSrc &&
                <img className={styles.img} src={imageSrc} alt={'Product'} />
            }
            <div className={styles.name}>{product.name}</div>
            <div className={styles.count}>
                У наявності: {product.count}
            </div>
            <div className={styles.price}>
                {product.price} грн
            </div>
        </div>
    </div>
    )
}