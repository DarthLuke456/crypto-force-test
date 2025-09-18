import { ReactNode } from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-exo font-bold border-none cursor-pointer transition-all duration-300 text-decoration-none",
  {
    variants: {
      variant: {
        primary: "bg-red-500 text-white shadow-lg shadow-red-500/40 hover:bg-red-600 hover:shadow-red-500/60 hover:-translate-y-1",
        secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10",
        google: "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/40",
        crypto: "bg-gradient-to-r from-crypto-blue to-blue-500 text-white hover:from-blue-500 hover:to-crypto-blue hover:-translate-y-1 hover:shadow-lg hover:shadow-crypto-blue/40",
        outline: "border-2 border-crypto-blue text-crypto-blue bg-transparent hover:bg-crypto-blue hover:text-white"
      },
      size: {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-3 text-base rounded-xl",
        lg: "px-8 py-4 text-lg rounded-xl",
        xl: "px-10 py-5 text-xl rounded-2xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({ 
  children, 
  variant, 
  size, 
  href, 
  onClick, 
  className,
  target,
  rel,
  type = 'button',
  ...props 
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className)
  
  if (href) {
    if (href.startsWith('http')) {
      return (
        <a 
          href={href} 
          className={classes}
          target={target}
          rel={rel}
          {...props}
        >
          {children}
        </a>
      )
    }
    
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}