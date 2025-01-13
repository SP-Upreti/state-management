// import { useDispatch, useSelector } from "react-redux"
import Image from "../utils/Image"
// import { AppDispatch, RootState } from "../../store/store"
// import { useEffect } from "react";
// import { getAllCategories } from "../../store/categories/allCategories";

export default function Categories() {

    // const Categories = useSelector((state: RootState) => state.categories.categories);
    // const dispatch = useDispatch<AppDispatch>();

    // useEffect(() => {
    //     dispatch(getAllCategories())
    // })

    // console.log("categories", Categories)
    const team = [
        {
            avatar: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
            name: "Beauty",
            title: "Product designer",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
            linkedin: "javascript:void(0)",
            twitter: "javascript:void(0)",
            github: "javascript:void(0)"
        },
        {
            avatar: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png",
            name: "Fragrance",
            title: "Software engineer",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
            linkedin: "javascript:void(0)",
            twitter: "javascript:void(0)",
            github: "javascript:void(0)"
        },
        {
            avatar: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png",
            name: "Furniture",
            title: "Full stack engineer",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
            linkedin: "javascript:void(0)",
            twitter: "javascript:void(0)",
            github: "javascript:void(0)"
        },
        {
            avatar: "https://cdn.dummyjson.com/products/images/groceries/Beef%20Steak/1.png",
            name: "Groceries",
            title: "Head of designers",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
            linkedin: "javascript:void(0)",
            twitter: "javascript:void(0)",
            github: "javascript:void(0)"
        },
        {
            avatar: "https://cdn.dummyjson.com/products/images/home-decoration/Decoration%20Swing/1.png",
            name: "Home Decoration",
            title: "Product designer",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
            linkedin: "javascript:void(0)",
            twitter: "javascript:void(0)",
            github: "javascript:void(0)"
        },
        {
            avatar: "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png",
            name: "Laptops",
            title: "Product manager",
            desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
            linkedin: "javascript:void(0)",
            twitter: "javascript:void(0)",
            github: "javascript:void(0)"
        },
    ]

    return (
        <section className="py-10">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="flex justify-between gap-5 flex-wrap">
                    <div className="">
                        <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
                            Shop By Categories
                        </h3>
                        <p className="text-gray-600 mt-3">
                            Explore the most popular categories on our site
                        </p>
                    </div>
                    <button className="text-xl capitalize hover:text-indigo-500 hover:underline">view all</button>
                </div>
                <div className="mt-12">
                    <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {
                            team.map((item, idx) => (
                                <li key={idx} className="border  overflow-hidden group cursor-pointer">
                                    <h4 className="text-2xl px-4 text-center p-4 text-gray-700 font-semibold">{item.name}</h4>
                                    <div className="w-full h-60 sm:h-52 md:h-56 group-hover:scale-110 transition-all">
                                        <Image src={item.avatar} title={item.title} />
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}