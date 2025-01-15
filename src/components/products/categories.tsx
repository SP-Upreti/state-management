// import { useDispatch, useSelector } from "react-redux"
// import Image from "../utils/Image"
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
    // const team = [
    //     {
    //         avatar: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
    //         name: "Beauty",
    //         title: "Product designer",
    //         desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
    //         linkedin: "javascript:void(0)",
    //         twitter: "javascript:void(0)",
    //         github: "javascript:void(0)"
    //     },
    //     {
    //         avatar: "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.png",
    //         name: "Fragrance",
    //         title: "Software engineer",
    //         desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
    //         linkedin: "javascript:void(0)",
    //         twitter: "javascript:void(0)",
    //         github: "javascript:void(0)"
    //     },
    //     {
    //         avatar: "https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png",
    //         name: "Furniture",
    //         title: "Full stack engineer",
    //         desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
    //         linkedin: "javascript:void(0)",
    //         twitter: "javascript:void(0)",
    //         github: "javascript:void(0)"
    //     },
    //     {
    //         avatar: "https://cdn.dummyjson.com/products/images/groceries/Beef%20Steak/1.png",
    //         name: "Groceries",
    //         title: "Head of designers",
    //         desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
    //         linkedin: "javascript:void(0)",
    //         twitter: "javascript:void(0)",
    //         github: "javascript:void(0)"
    //     },
    //     {
    //         avatar: "https://cdn.dummyjson.com/products/images/home-decoration/Decoration%20Swing/1.png",
    //         name: "Home Decoration",
    //         title: "Product designer",
    //         desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
    //         linkedin: "javascript:void(0)",
    //         twitter: "javascript:void(0)",
    //         github: "javascript:void(0)"
    //     },
    //     {
    //         avatar: "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png",
    //         name: "Laptops",
    //         title: "Product manager",
    //         desc: "Lorem Ipsum is simply dummy text of the printing and typesettin industry.",
    //         linkedin: "javascript:void(0)",
    //         twitter: "javascript:void(0)",
    //         github: "javascript:void(0)"
    //     },
    // ]

    return (
        <section className="py-10 ">
            <div className="container relative  mx-auto ">
                <div className="mb-5 mx-4 lg:mx-6">
                    <h2 className="text-xl lg:text-2xl font-semibold">Shop by Categories</h2>
                    <p className="max-w-xl ">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, nisi!
                    </p>
                </div>
                <div className="flex flex-wrap justify-center  lg:w-full md:w-5/6 xl:shadow-small-blue mx-4 lg:mx-6">

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-portfolio-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                portfolio
                            </p>
                        </div>
                    </a>

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-blog-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                blog
                            </p>
                        </div>
                    </a>

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-ecommerce-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                ecommerce
                            </p>
                        </div>
                    </a>

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-startup-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                startup
                            </p>
                        </div>
                    </a>

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-business-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                business
                            </p>
                        </div>
                    </a>

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-lifestyle-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                lifestyle
                            </p>
                        </div>
                    </a>

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-landing-page-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                landing pages
                            </p>
                        </div>
                    </a>

                    <a href="#" className="block w-1/2 py-10 text-center border lg:w-1/4">
                        <div>
                            <img src="https://redpixelthemes.com/assets/images/icon-health-green.svg" className="block mx-auto" />

                            <p className="pt-4 text-sm font-medium capitalize font-body text-green-900 lg:text-lg md:text-base md:pt-6">
                                health
                            </p>
                        </div>
                    </a>

                </div>

            </div>
        </section>
    )
}