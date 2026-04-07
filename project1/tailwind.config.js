import forms from "@tailwindcss/forms";

export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ["'Space Grotesk'", "system-ui", "sans-serif"],
                body: ["'Work Sans'", "system-ui", "sans-serif"],
            },
            colors: {
                midnight: {
                    950: "#0b0f1a",
                    900: "#101629",
                    800: "#18213a",
                    700: "#223153",
                },
                ember: {
                    500: "#ff6b35",
                    400: "#ff8256",
                },
                mist: "#f4f6fb",
            },
            boxShadow: {
                glow: "0 0 40px rgba(255, 107, 53, 0.25)",
            },
        },
    },
    plugins: [forms],
};
