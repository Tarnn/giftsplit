export const theme = {
  colors: {
    primary: {
      from: '#3B82F6', // blue-500
      to: '#9333EA', // purple-600
      hover: {
        from: '#2563EB', // blue-600
        to: '#7E22CE', // purple-700
      }
    },
    background: {
      main: 'from-gray-950 via-blue-950 to-purple-950',
      overlay: 'bg-black/20',
      card: 'bg-white/10',
      border: 'border-white/20'
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-200',
      muted: 'text-gray-300'
    }
  },
  effects: {
    glow: {
      primary: 'shadow-[0_0_20px_2px_rgba(59,130,246,0.3)]',
      hover: 'shadow-[0_0_30px_4px_rgba(59,130,246,0.4)]'
    },
    glass: 'backdrop-blur-md',
    gradient: {
      shimmer: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'
    }
  },
  animation: {
    transition: 'transition-all duration-300',
    hover: 'hover:scale-105',
    active: 'active:scale-95'
  }
}

export const components = {
  card: `${theme.colors.background.card} ${theme.colors.background.border} ${theme.effects.glass} rounded-2xl p-6 shadow-xl hover:shadow-2xl ${theme.animation.transition}`,
  button: {
    primary: `bg-gradient-to-r from-${theme.colors.primary.from} to-${theme.colors.primary.to} text-white shadow-lg ${theme.animation.transition} hover:from-${theme.colors.primary.hover.from} hover:to-${theme.colors.primary.hover.to} ${theme.effects.glow.primary} hover:${theme.effects.glow.hover}`,
    outline: `border ${theme.colors.background.border} text-white hover:bg-white/10 ${theme.animation.transition}`
  },
  input: `bg-white/10 border ${theme.colors.background.border} rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme.effects.glass} ${theme.animation.transition}`,
  container: `max-w-5xl mx-auto w-full p-6`,
  heading: `${theme.colors.text.primary} font-bold tracking-tight`,
  background: `bg-gradient-to-br ${theme.colors.background.main}`
} 