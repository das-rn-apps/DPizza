import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const HeroSection = () => {
    const floatingPizzas = Array.from({ length: 20 }, (_, i) => {
        const x = 5 + Math.random() * 90; // horizontal position %
        const size = Math.random() * 7 + 0.5; // size rem
        const duration = 10 + Math.random() * 10; // duration 10-20s
        const rotationSpeed = 360 * (Math.random() * 2 + 1); // rotate 360 to 1080 deg per fall

        return (
            <motion.div
                key={i}
                className="absolute"
                style={{
                    top: 0,
                    left: `${x}%`,
                    fontSize: `${size}rem`,
                    pointerEvents: 'none',
                    transformOrigin: 'center center',
                }}
                initial={{ y: -size * 20, rotate: 0, opacity: 1 }} // start slightly above view
                animate={{
                    y: "110vh",  // move beyond viewport height
                    rotate: rotationSpeed, // continuous rotation
                }}
                transition={{
                    repeat: Infinity,
                    duration,
                    ease: "linear",
                    repeatType: "loop",
                }}
            >
                🍕
            </motion.div>
        );
    });

    return (
        <section className="relative h-screen flex items-center justify-center text-black overflow-hidden">
            {/* 50 Floating Pizza Emojis */}
            <div className="absolute inset-0 z-0">
                {floatingPizzas}
            </div>

            {/* Hero Text Content */}
            <motion.div
                className="relative text-center z-10 p-4"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.3 } },
                }}
            >
                <motion.h1
                    className="text-5xl md:text-7xl font-extrabold mb-4 font-display"
                    variants={{
                        hidden: { opacity: 0, y: -50 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Taste the Tradition
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Freshly baked pizzas, delivered hot and delicious to your door.
                </motion.p>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <Link to="/menu">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-xl">
                            Order Now
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
