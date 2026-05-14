import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import OurTeam from "@/assets/ourteam.jpeg"

function AboutUs() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center flex flex-col items-center mb-16">

                    <h1 className="text-4xl md:text-5xl font-bold text-(--color-brand) mt-2">Driven by Excellence, Built for You</h1>
                    <p className="mt-4 max-w-2xl  text-slate-500 text-lg">
                        We believe that technology should be an enabler, not a barrier. Our journey is defined by
                        innovation, quality, and a deep commitment to our users.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={OurTeam}
                                alt="Our Team"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-blue-600 mix-blend-overlay opacity-20"></div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <div className="space-y-6">
                            <div >

                                <div className="flex flex-col items-start justify-start space-x-4">
                                    <h3 className="text-xl font-semibold text-slate-900">Mission Driven</h3>
                                    <p className="text-slate-500 mt-1 text-left">
                                        To empower individuals and businesses with tools that simplify complexity and drive meaningful results.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">

                                <div className="flex flex-col items-start justify-start space-x-4">
                                    <h3 className="text-xl font-semibold text-slate-900">Innovation at Core</h3>
                                    <p className="text-slate-500 mt-1 text-left">
                                        We constantly explore new technologies and methodologies to deliver cutting-edge solutions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">

                                <div className="flex flex-col items-start justify-start space-x-4">
                                    <h3 className="text-xl font-semibold text-slate-900">User-Centric Design</h3>
                                    <p className="text-slate-500 mt-1 text-left">
                                        Every feature is crafted with care, focusing on usability, accessibility, and delight.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center flex flex-col items-center">
                    <h2 className="text-3xl text-(--color-brand) font-bold">Our Values</h2>
                    <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                        These principles guide everything we do and define who we are.
                    </p>

                    <div className="mt-10 grid md:grid-cols-3 gap-8 text-left">
                        <Card className="shadow-lg hover:shadow-xl transition-shadow border-none px-2 py-4 flex flex-col items-center">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-slate-900">Integrity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 text-sm">
                                    Honesty and transparency in all our interactions. Building trust is our foundation.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-shadow border-none px-2 py-4 flex flex-col items-center">
                            <CardHeader>

                                <CardTitle className="text-xl font-semibold text-slate-900">Passion</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 text-sm">
                                    We pour our hearts into our work, striving to create exceptional experiences every day.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg hover:shadow-xl transition-shadow border-none px-2 py-4 flex flex-col items-center">
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-slate-900">Excellence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 text-sm">
                                    We set high standards for ourselves and our products, aiming to exceed expectations.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs
