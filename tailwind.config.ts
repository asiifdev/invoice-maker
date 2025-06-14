// tailwind.config.ts - Enhanced Mobile-First Configuration
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./client/index.html", 
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    // Mobile-first breakpoints
    screens: {
      'xs': '375px',    // Small mobile devices
      'sm': '640px',    // Large mobile devices
      'md': '768px',    // Tablets
      'lg': '1024px',   // Laptops
      'xl': '1280px',   // Desktops
      '2xl': '1536px',  // Large desktops
      
      // Custom breakpoints for specific use cases
      'mobile': {'max': '767px'},        // Mobile only
      'tablet': {'min': '768px', 'max': '1023px'}, // Tablet only
      'desktop': {'min': '1024px'},      // Desktop and up
      
      // Height-based breakpoints for mobile landscape/portrait
      'h-sm': {'raw': '(max-height: 667px)'},  // Short screens
      'h-md': {'raw': '(min-height: 668px)'},  // Standard screens
      'h-lg': {'raw': '(min-height: 800px)'},  // Tall screens
    },
    
    extend: {
      // Enhanced spacing scale for mobile
      spacing: {
        '15': '3.75rem',   // 60px
        '18': '4.5rem',    // 72px
        '88': '22rem',     // 352px
        '92': '23rem',     // 368px
        '96': '24rem',     // 384px
        '104': '26rem',    // 416px
        '112': '28rem',    // 448px
        '128': '32rem',    // 512px
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // Enhanced border radius for modern mobile design
      borderRadius: {
        'lg': "var(--radius)",
        'md': "calc(var(--radius) - 2px)",
        'sm': "calc(var(--radius) - 4px)",
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      
      // Enhanced typography scale
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],    // 10px
        'xs': ['0.75rem', { lineHeight: '1rem' }],         // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],     // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],        // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],    // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],      // 36px
        '5xl': ['3rem', { lineHeight: '1' }],              // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],           // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],            // 72px
        '8xl': ['6rem', { lineHeight: '1' }],              // 96px
        '9xl': ['8rem', { lineHeight: '1' }],              // 128px
      },
      
      // Enhanced color palette
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Custom mobile-optimized colors
        mobile: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      
      // Enhanced animations for mobile interactions
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-left": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-in": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
        "loading-dots": {
          "0%, 20%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)" },
          "80%, 100%": { transform: "scale(1)" },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-left": "slide-left 0.3s ease-out",
        "slide-right": "slide-right 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-in-scale": "fade-in-scale 0.2s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "shake": "shake 0.6s ease-in-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "loading-dots": "loading-dots 1.4s ease-in-out infinite",
      },
      
      // Enhanced shadows for mobile depth
      boxShadow: {
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mobile-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mobile-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'mobile-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'mobile-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
      },
      
      // Mobile-optimized container sizes
      maxWidth: {
        'mobile': '100%',
        'mobile-sm': '320px',
        'mobile-md': '375px',
        'mobile-lg': '414px',
        'tablet': '768px',
        'desktop': '1024px',
      },
      
      // Mobile-friendly z-index scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
      
      // Enhanced grid system for mobile layouts
      gridTemplateColumns: {
        'mobile': 'repeat(1, minmax(0, 1fr))',
        'mobile-2': 'repeat(2, minmax(0, 1fr))',
        'tablet': 'repeat(2, minmax(0, 1fr))',
        'tablet-3': 'repeat(3, minmax(0, 1fr))',
        'desktop': 'repeat(4, minmax(0, 1fr))',
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(200px, 1fr))',
      },
      
      // Mobile-optimized aspect ratios
      aspectRatio: {
        'mobile-card': '16 / 10',
        'mobile-banner': '2 / 1',
        'mobile-thumb': '4 / 3',
        'story': '9 / 16',
      },
      
      // Enhanced backdrop blur for mobile glassmorphism
      backdropBlur: {
        'mobile': '8px',
        'mobile-md': '12px',
        'mobile-lg': '16px',
      },
      
      // Mobile-friendly transform scale
      scale: {
        '102': '1.02',
        '103': '1.03',
        '97': '0.97',
        '98': '0.98',
      },
      
      // Enhanced transition durations for mobile
      transitionDuration: {
        '50': '50ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      
      // Mobile-optimized line heights
      lineHeight: {
        'mobile': '1.4',
        'mobile-relaxed': '1.6',
        'mobile-loose': '1.8',
      },
      
      // Enhanced letter spacing for mobile readability
      letterSpacing: {
        'mobile': '0.01em',
        'mobile-wide': '0.02em',
        'mobile-wider': '0.03em',
      },
    },
  },
  
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    
    // Custom plugin for mobile-specific utilities
    function({ addUtilities, addComponents, theme }) {
      // Mobile-safe area utilities
      addUtilities({
        '.safe-area-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-area-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-area-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.safe-area-all': {
          padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        },
      });
      
      // Touch-friendly utilities
      addUtilities({
        '.touch-manipulation': {
          touchAction: 'manipulation',
        },
        '.touch-pan-x': {
          touchAction: 'pan-x',
        },
        '.touch-pan-y': {
          touchAction: 'pan-y',
        },
        '.touch-pinch-zoom': {
          touchAction: 'pinch-zoom',
        },
        '.touch-none': {
          touchAction: 'none',
        },
      });
      
      // Scroll utilities
      addUtilities({
        '.scroll-smooth': {
          scrollBehavior: 'smooth',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.gray.400'),
            borderRadius: theme('borderRadius.full'),
          },
        },
      });
      
      // Mobile-specific components
      addComponents({
        '.btn-mobile': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.base'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.lg'),
          minHeight: '44px',
          touchAction: 'manipulation',
          transition: 'all 0.2s ease-in-out',
          
          '@media (min-width: 640px)': {
            padding: `${theme('spacing.2')} ${theme('spacing.6')}`,
            minHeight: 'auto',
          },
        },
        
        '.btn-mobile-primary': {
          backgroundColor: theme('colors.blue.600'),
          color: theme('colors.white'),
          
          '&:hover': {
            backgroundColor: theme('colors.blue.700'),
          },
          
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${theme('colors.blue.500')}`,
          },
          
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        
        '.card-mobile': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          border: `1px solid ${theme('colors.gray.200')}`,
          boxShadow: theme('boxShadow.mobile'),
          overflow: 'hidden',
          
          '&:hover': {
            boxShadow: theme('boxShadow.mobile-lg'),
            transform: 'translateY(-1px)',
          },
          
          '@media (min-width: 640px)': {
            borderRadius: theme('borderRadius.xl'),
            boxShadow: theme('boxShadow.mobile-md'),
          },
        },
        
        '.input-mobile': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.base'),
          border: `1px solid ${theme('colors.gray.300')}`,
          borderRadius: theme('borderRadius.lg'),
          minHeight: '44px',
          
          '&:focus': {
            outline: 'none',
            borderColor: 'transparent',
            boxShadow: `0 0 0 2px ${theme('colors.blue.500')}`,
          },
          
          '@media (min-width: 640px)': {
            padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
            fontSize: theme('fontSize.sm'),
            minHeight: 'auto',
          },
        },
        
        '.modal-mobile': {
          position: 'fixed',
          inset: '0',
          zIndex: theme('zIndex.modal'),
          overflowY: 'auto',
          
          '@media (max-width: 767px)': {
            '.modal-content': {
              minHeight: '100vh',
              padding: `${theme('spacing.6')} ${theme('spacing.4')}`,
            },
            
            '.modal-panel': {
              width: '100%',
              backgroundColor: theme('colors.white'),
              borderRadius: '0',
            },
          },
          
          '@media (min-width: 768px)': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme('spacing.4'),
            
            '.modal-panel': {
              maxWidth: theme('maxWidth.lg'),
              margin: '0 auto',
              backgroundColor: theme('colors.white'),
              borderRadius: theme('borderRadius.xl'),
              boxShadow: theme('boxShadow.xl'),
            },
          },
        },
      });
      
      // Responsive visibility utilities
      addUtilities({
        '.mobile-only': {
          display: 'block',
          '@media (min-width: 768px)': {
            display: 'none',
          },
        },
        '.tablet-only': {
          display: 'none',
          '@media (min-width: 768px)': {
            display: 'block',
          },
          '@media (min-width: 1024px)': {
            display: 'none',
          },
        },
        '.desktop-only': {
          display: 'none',
          '@media (min-width: 1024px)': {
            display: 'block',
          },
        },
        '.tablet-up': {
          display: 'none',
          '@media (min-width: 768px)': {
            display: 'block',
          },
        },
      });
    },
  ],
} satisfies Config;
          