import React, {useEffect} from "react";
import styles from './Main.module.css'
import Header from "../../Components/Header/Header";
import Login from "../../Components/Login/Login";
import {useRef, useState} from "react";
import ShortProduct from "../../Components/ShortProduct/ShortProduct";
import axios from "axios";

interface Filter {
    CategoryCharacteristicsID: number,
    CharacteristicsID: number,
    CategoryID: number,
    Characteristic: Characteristic,
    Values: number[],
    Denotation: string[]
}

interface Characteristic {
    CharacteristicID: number,
    Name: string,
    Type: number
}

interface Category {
    CategoryID: number,
    Name: string
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
    Products_Characteristics: ProductsCharacteristic[]
}

export interface Img {
    type: string
    data: []
}

export interface ProductsCharacteristic {
    ProductsCharacteristicsID: number
    ValueNum?: number
    ValueStr?: string
    ValueBool: boolean
    ValueDictionary: string[]
    CharacteristicsID: number
    ProductID: number
}

interface FilterOut {
    CharacteristicsID: number,
    Value: any
}

function FiltersToString(filters: FilterOut[]) {

    let result = ''
    filters.map((filter) => {
        if (filter.Value)
            result += `&characteristics=[{"CharacteristicsID":${filter.CharacteristicsID},"Value":${filter.Value}}]`
    })
    return result
}

export default function Main() {

    console.log('start')

    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([])
    const [category, setCategory] = useState<number>()
    const [products, setProducts] = useState<Product[]>([])
    const selectRef = useRef<HTMLSelectElement>(null)
    const [filters, setFilters] = useState<Filter[]>()
    const [filtersOut, setFiltersOut] = useState<FilterOut[]>([])
    const [filtersCurrent, setFiltersCurrent] = useState<FilterOut[]>([])

    const handleCategoryClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
        const categoryId = parseInt(event.currentTarget.id, 10);
        setCategory(categoryId);
        if (selectRef.current) {
            selectRef.current.value = String(categoryId);
        }
    };

    useEffect(() => {
        console.log("uE1")
        axios.get('http://localhost:5000/product/categories').then(
            (res) => {
                console.log('new category set')
                setCategories(res.data.categories)
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        console.log('uE2')
        axios.get(`http://localhost:5000/product/characteristics?categoryId=${category}`).then(
            (res) => {
                setFilters(res.data.filters)
                setFiltersOut([])
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [category])

    useEffect(() => {
        console.log('eU3')
        const temp: FilterOut[] = []
        filters?.map((filter: Filter) => {
            let tempValue
            switch (filter.Characteristic.Type) {
                case 1: {
                    tempValue = []
                    tempValue.push(filter.Values[0])
                    tempValue.push(filter.Values[1])
                    break
                }
                case 2: {
                    tempValue = []
                    filter.Denotation.map((name) => {
                        tempValue.push({name: name, isSelected: false})
                    })
                    break
                }
                // case 3: {
                //     tempValue = 0
                //     break
                // }
                // case 4: {
                //     tempValue=[]
                //     filter.Denotation.map((name)=>{
                //         tempValue.push({})
                //     })
                //     break
                // }
            }
            temp.push({CharacteristicsID: filter.CharacteristicsID, Value: tempValue})
        })
        setFiltersCurrent(temp)
    }, [filters])

    useEffect(() => {
        const temp: FilterOut[] = []
        const valueTemp: number[] = []
        console.log('uE4: ', filtersCurrent)
        filtersCurrent.map((filter) => {
            switch (typeof filter.Value) {
                case "object":
                    switch (typeof filter.Value[0]) {
                        case "number":
                            valueTemp.push(filter.Value[0], filter.Value[1])
                            temp.push({CharacteristicsID: filter.CharacteristicsID, Value: valueTemp})
                            break
                        case "string":
                            filter.Value.map((elem: string) => {
                                temp.push({CharacteristicsID: filter.CharacteristicsID, Value: elem})
                            })
                            break
                    }
                    filter.Value.map(() => {
                        temp.push({CharacteristicsID: filter.CharacteristicsID, Value: filter.Value})
                    })
                    break
                case "number":
                    switch (filter.Value) {
                        case 1:
                            temp.push({CharacteristicsID: filter.CharacteristicsID, Value: true})
                            break
                        case 2:
                            temp.push({CharacteristicsID: filter.CharacteristicsID, Value: false})
                            break
                    }
                    break
            }
        })
        setFiltersOut(temp)
    }, [filtersCurrent])

    useEffect(() => {
        console.log('uE')
        const filterList = FiltersToString(filtersOut)
        axios.get(`http://localhost:5000/product/?categoryId=${category}${filterList}`).then(
            (res) => {
                setProducts(res.data.products)
            }
        ).catch((err) => {
            console.log(err)
        })
    }, [filtersOut, category])

    return (
        <>
            {loginOpen &&
                <Login onClose={() => {
                    setLoginOpen(false)
                }}
                       onRegisterClick={() => {
                           setRegisterOpen(true);
                           setLoginOpen(false)
                       }}/>}
        {/*{registerOpen && <Login/>}*/}
            <div className={styles.background}>

                <Header/>
                <div className={styles.content}>
                    <div className={styles.filters}>
                        <div className={styles.label}>Категорія товарів:</div>
                        <select ref={selectRef} onChange={(e) => {
                            setCategory(parseInt(e.target.value, 10))
                        }}>
                            <option disabled selected hidden key={0}>Оберіть категорію</option>
                            {categories.length > 0 && categories.map((category) => {
                                return (
                                    <option key={category.CategoryID}
                                            value={category.CategoryID}>{category.Name}</option>
                                )
                            })}
                        </select>
                        {
                            filters?.map((filter) => {
                                switch (filter.Characteristic.Type) {
                                    case 1:
                                        return (
                                            <div className={styles.filterDiv}>
                                                <div className={styles.filterLabel}>
                                                    {filter.Characteristic.Name}
                                                </div>
                                                <div className={styles.filterInputsNumber}>
                                                    <input type="number" onChange={(e) => {
                                                        const temp = [...filtersCurrent];
                                                        const index = temp.findIndex(elem => elem.CharacteristicsID === filter.CharacteristicsID);
                                                        temp[index].Value[0] = parseFloat(e.target.value);
                                                        setFiltersCurrent(temp);
                                                    }}
                                                           value={filtersCurrent[filtersCurrent.findIndex((elem) => elem.CharacteristicsID === filter.CharacteristicsID)]?.Value[0] !== undefined ? filtersCurrent[filtersCurrent.findIndex((elem) => elem.CharacteristicsID === filter.CharacteristicsID)].Value[0] : 0}/>
                                                    <div>-</div>
                                                    <input type="number" onChange={(e) => {
                                                        const temp = [...filtersCurrent];
                                                        const index = temp.findIndex(elem => elem.CharacteristicsID === filter.CharacteristicsID);
                                                        temp[index].Value[1] = parseFloat(e.target.value);
                                                        setFiltersCurrent(temp);
                                                    }}
                                                           value={filtersCurrent[filtersCurrent.findIndex((elem) => elem.CharacteristicsID === filter.CharacteristicsID)]?.Value[1] !== undefined ? filtersCurrent[filtersCurrent.findIndex((elem) => elem.CharacteristicsID === filter.CharacteristicsID)].Value[1] : 0}/>
                                                </div>
                                            </div>
                                        )
                                    case 2:
                                        return (
                                            <div className={styles.filterDiv}>
                                                <div className={styles.filterLabel}>
                                                    {filter.Characteristic.Name}
                                                </div>
                                                <div className={styles.filterInputsString}>
                                                    {filter.Denotation.map((elem) => {
                                                        return (
                                                            <div className={styles.filterInputsStringDiv}>
                                                                <input onChange={(e)=>{
                                                                    const updatedFiltersCurrent = [...filtersCurrent]
                                                                    const filterIndex = updatedFiltersCurrent.findIndex(e => e.CharacteristicsID === filter.CharacteristicsID);
                                                                    if (filterIndex !== -1) {
                                                                        const temp = updatedFiltersCurrent[filterIndex];
                                                                        const valueIndex = temp.Value.findIndex((e:{name:string, isSelected:boolean}) => e.name === elem);
                                                                        updatedFiltersCurrent[filterIndex].Value[valueIndex].isSelected=e.target.checked
                                                                    }
                                                                    setFiltersCurrent(updatedFiltersCurrent)
                                                                }} type={"checkbox"} checked={filtersCurrent.find(e=>e.CharacteristicsID===filter.CharacteristicsID)?.Value.find((e:string)=>e===elem)}/>
                                                                <label>{elem}</label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    case 3:
                                        return (
                                            <div className={styles.filterDiv}>
                                                <div className={styles.filterLabel}>
                                                    {filter.Characteristic.Name}
                                                </div>
                                            </div>
                                        )
                                    // case 4:
                                    //     return (
                                    //         <div className={styles.filterDiv}>
                                    //             <div className={styles.filterLabel}>
                                    //                 {filter.Characteristic.Name}
                                    //             </div>
                                    //         </div>
                                    //     )
                                }

                            })
                        }
                    </div>
                    <div className={styles.products}>
                        {
                            category ?
                                products?.map((product) => {
                                        return (
                                            <ShortProduct name={product.Name} count={product.Count} price={product.Price}
                                                          img={product.Img.data}/>)
                                    }
                                ) : categories?.map(category => {
                                    return <div
                                        id={String(category.CategoryID)}
                                        key={category.CategoryID}
                                        onClick={handleCategoryClick}
                                        className={styles.category}>{category.Name}</div>
                                })
                        }
                        {/*{*/}
                        {/*    category ?*/}
                        {/*        products?.map((product) => {*/}
                        {/*                return (*/}
                        {/*                    <ShortProduct name={product.Name} count={product.Count} price={product.Price}*/}
                        {/*                                  img={product.Img.data}/>)*/}
                        {/*            }*/}
                        {/*        ) : categories?.map(category => {*/}
                        {/*            return <div*/}
                        {/*                id={String(category.CategoryID)}*/}
                        {/*                key={category.CategoryID}*/}
                        {/*                onClick={handleCategoryClick}*/}
                        {/*                className={styles.category}>{category.Name}</div>*/}
                        {/*        })*/}
                        {/*}*/}
                    </div>
                </div>
            </div>
        </>
    )
}