/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                //sm: { max: '1200px' },
                'xl': '986px',
            },
        },
    },
    plugins: [],
};

/*  SCREEN SIZES*/
//sm: 640px(small screens like big smartphones)
//md: 768px(medium screens like tablets)
//lg: 1024px(large screens like laptops)
//xl: 1280px(extra -large screens like desktops)
//2xl: 1536px(huge monitors)
/* */