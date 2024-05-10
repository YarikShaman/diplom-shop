import styles from './ShortProduct.module.css'

export interface Props{
    name:string,
    count: string,
    price:number,
    img: number[]

}

export default function ShortProduct(product:Props){
    // fetch(logo).then(res=>res.arrayBuffer()).then(buffer=>{
    //     const byteArray = new Uint8Array(buffer)
    //     setArray(byteArray)
    //     console.log()
    // })

    const blob = new Blob([new Uint8Array(product.img)], { type: 'image/jpeg' });
    const imgUrl = URL.createObjectURL(blob);

    return(
    <div className={styles.background}>
        <div className={styles.content}>
            <img className={styles.img}
                // ref={imgUrl}
            />
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