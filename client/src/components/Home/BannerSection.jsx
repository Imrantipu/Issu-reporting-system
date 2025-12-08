// src/components/Home/BannerSection.jsx

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Dummy data for the slider slides
const slidesData = [
    {
        id: 1,
        title: "Report Issues, Build Better Cities.",
        subtitle: "A digital platform to connect citizens and municipal services seamlessly.",
        imageUrl: "https://i.ibb.co/q04tL3m/city-infrastructure-1.jpg", // Placeholder: cityscape/roads
        buttonText: "Report an Issue Now",
        link: "/dashboard/citizen/report-issue"
    },
    {
        id: 2,
        title: "Track Repairs in Real-Time.",
        subtitle: "Full transparency from report submission to resolution. Never wonder again.",
        imageUrl: "https://i.ibb.co/6P80y8V/city-infrastructure-2.jpg", // Placeholder: workers fixing road/pothole
        buttonText: "View All Issues",
        link: "/all-issues"
    },
    {
        id: 3,
        title: "Potholes to Streetlights: We Fix It All.",
        subtitle: "Select from over 10 categories and prioritize problems that matter most.",
        imageUrl: "https://i.ibb.co/s338LmL/city-infrastructure-3.jpg", // Placeholder: broken streetlight/damage
        buttonText: "See How It Works",
        link: "/extra-page-2"
    }
];

const highlightStats = [
    { label: 'Active issues', value: '128', badge: 'Live' },
    { label: 'Avg. response', value: '2.3 days', badge: 'Faster' },
    { label: 'Resolved this week', value: '76', badge: 'Up 12%' },
];

const BannerSection = () => {
    return (
        <section className="section-shell mb-16">
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-slate-900 shadow-2xl shadow-cyan-200/30">
                <div className="absolute -left-28 top-[-15%] h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" aria-hidden="true" />
                <div className="absolute -right-16 top-[10%] h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden="true" />
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4800, disableOnInteraction: false }}
                    loop={true}
                    className="w-full h-[60vh] md:h-[70vh]"
                >
                    {slidesData.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            {/* Slide Container */}
                            <div className="relative h-full w-full overflow-hidden">
                                
                                {/* Background Image */}
                                <img
                                    src={slide.imageUrl}
                                    alt={slide.title}
                                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/75 to-slate-900/55" />

                                {/* Content Box */}
                                <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-6 py-10 md:px-14 lg:px-20">
                                    <div className="flex items-center gap-3">
                                        <span className="eyebrow bg-white/10 text-cyan-100 ring-1 ring-inset ring-white/15">
                                            Civic Innovation
                                        </span>
                                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/15">
                                            Public Reporting
                                        </span>
                                    </div>
                                    <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                                        {slide.title}
                                    </h1>
                                    <p className="max-w-2xl text-lg text-slate-200 md:text-xl">
                                        {slide.subtitle}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            to={slide.link}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-cyan-200/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-200/40"
                                        >
                                            {slide.buttonText}
                                            <span aria-hidden className="text-lg">↗</span>
                                        </Link>
                                        <Link
                                            to="/all-issues"
                                            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/15"
                                        >
                                            View open issues
                                        </Link>
                                    </div>

                                    <div className="mt-2 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                                        {highlightStats.map((stat) => (
                                            <div key={stat.label} className="glass-panel rounded-2xl border-white/20 bg-white/10 px-4 py-3 text-white shadow-lg shadow-cyan-200/30">
                                                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.08em] text-slate-200/80">
                                                    {stat.label}
                                                    <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-100">
                                                        {stat.badge}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-2xl font-bold">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BannerSection;
