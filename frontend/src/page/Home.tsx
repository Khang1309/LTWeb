import Autoplay from "embla-carousel-autoplay"
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";


import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import testImg from '../assets/Logo.png'
import section1 from '../assets/section1.jpg'

function Home() {

    const section1Ref = useRef(null);
    const { scrollYProgress: progress1 } = useScroll({
        target: section1Ref,
        offset: ["start end", "end start"]
    });
    const imageY1 = useTransform(progress1, [0, 1], [120, -120]);

    const section2Ref = useRef(null);
    const { scrollYProgress: progress2 } = useScroll({
        target: section1Ref,
        offset: ["start end", "end start"]
    });
    const imageY2 = useTransform(progress2, [0, 1], [120, -120]);
    const rotate2 = useTransform(progress2, [0, 1], [0, 90]);

    return (
        <>
            <Carousel opts={{
                align: "start",
                loop: true,
            }}

                plugins={[
                    Autoplay({
                        delay: 10000,
                    }),
                ]}

                className="w-full h-30 md:h-60 relative overflow-hidden">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="">
                                <Card className="">
                                    <CardContent className="flex items-center justify-center">
                                        <img className="object-cover" src={section1} alt="" />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-5" />
                <CarouselNext className="right-5" />
            </Carousel>


            <section ref={section1Ref} className="text-(--color-brand) font-geist">
                <div>
                    <div className="text-5xl font-extrabold flex items-start px-5 py-10">Find what you want</div>
                    <div className="md:flex px-5 py-10">
                        <div className="text-3xl flex-1 font-bold flex flex-col items-start text-left">All type of book you can find
                            <span className="text-xl font-normal items-start flex text-left text-blue-500">With friendly interface</span>
                        </div>
                        <div className="text-2xl flex-1 font-medium flex items-start text-left">"We are a design-led brand, and we strive to deliver an ecommerce experience that reflects that. Webflow allows us to do that.” </div>
                    </div>
                </div>
                <div className="overflow-hidden">

                    <motion.div style={{ y: imageY1 }}>
                        <img className="w-full h-full object-cover scale-150" src={section1} alt="" />
                    </motion.div>
                </div>
            </section>

            <section ref={section2Ref} className="text-(--color-brand) font-geist">
                <div>

                    <div className="md:flex px-5 py-10">
                        <div className="text-3xl flex-1 font-bold flex flex-col items-start text-left pr-10">
                            Design around your unique products
                        </div>
                        <div className="text-2xl flex-1 font-medium flex items-start text-left">
                            Feature the product details that matter most. Highlight specific product features, images, and other information with customizable product fields.
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden">

                    <motion.div style={{ y: imageY2, rotate: rotate2 }}>
                        <img className="w-full h-full object-cover scale-200" src={section1} alt="" />
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default Home