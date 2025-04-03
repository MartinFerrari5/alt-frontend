/**
 * Configuración de Tailwind CSS.
 *
 * Este archivo configura aspectos fundamentales de Tailwind, como:
 * - Modo oscuro basado en clases.
 * - Rutas de los archivos que Tailwind debe analizar en busca de clases utilizadas.
 * - Personalización del tema, incluyendo colores, bordes, animaciones y tipografías.
 * - Plugins adicionales.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
    // Configuración para el modo oscuro basado en clases.
    darkMode: ["class"],

    // Rutas de los archivos a escanear para obtener las clases utilizadas.
    content: [
        "./pages/**/*.{js, jsx,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],

    // Prefijo opcional para las clases de Tailwind.
    prefix: "",

    // Personalización del tema.
    theme: {
        // Configuración para centrar contenedores y definir padding y anchos máximos.
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        // Extensión de los estilos por defecto.
        extend: {
            // Definición de paletas de colores personalizadas.
            colors: {
                // Colores básicos derivados de variables CSS.
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Colores específicos para la barra lateral (sidebar).
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground":
                        "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground":
                        "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                // Colores personalizados adicionales.
                greenApp: "#418d35",
                darkGreen: "#4A6645",
                darkGreen2: "#2F6627",
                mainColor: "#1E293B",
                blackColor: "#222222",
                greyBg: "#F8F8F8",
                greyStrongBg: "#e7e7e7",
                blueBg: "#abb8c3",
            },
            // Configuración de bordes redondeados usando variables CSS.
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            // Definición de keyframes para animaciones personalizadas.
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(10px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0)",
                    },
                },
                "slide-in": {
                    "0%": {
                        transform: "translateX(-100%)",
                    },
                    "100%": {
                        transform: "translateX(0)",
                    },
                },
                "slide-out": {
                    "0%": {
                        transform: "translateX(0)",
                    },
                    "100%": {
                        transform: "translateX(-100%)",
                    },
                },
            },
            // Definición de animaciones utilizando los keyframes anteriores.
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "slide-in": "slide-in 0.3s ease-out",
                "slide-out": "slide-out 0.3s ease-out",
            },
            // Configuración de la familia tipográfica.
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    // Inclusión de plugins adicionales de Tailwind.
    plugins: ["tailwindcss-animate"],
}
