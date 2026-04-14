import React from 'react';
import Link from 'next/link';

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  href?: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

// Frosted-glass tints — subtle translucent gradients, no vivid colors
const gradientMapping: Record<string, string> = {
  blue: 'linear-gradient(hsla(208, 80%, 70%, 0.25), hsla(223, 80%, 60%, 0.12))',
  purple: 'linear-gradient(hsla(268, 80%, 75%, 0.22), hsla(283, 80%, 60%, 0.10))',
  red: 'linear-gradient(hsla(348, 80%, 75%, 0.22), hsla(3, 80%, 60%, 0.10))',
  indigo: 'linear-gradient(hsla(238, 80%, 75%, 0.24), hsla(253, 80%, 60%, 0.12))',
  orange: 'linear-gradient(hsla(28, 80%, 75%, 0.22), hsla(43, 80%, 60%, 0.10))',
  green: 'linear-gradient(hsla(108, 80%, 65%, 0.22), hsla(123, 80%, 50%, 0.10))'
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`grid gap-[5em] grid-cols-2 md:grid-cols-3 mx-auto py-[3em] overflow-visible ${className || ''}`}>
      {items.map((item, index) => {
        const inner = (
          <>
            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] backdrop-blur-[0.5em] [-webkit-backdrop-filter:blur(0.5em)] [will-change:transform] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
              style={{
                ...getBackgroundStyle(item.color),
                boxShadow:
                  '0 0 0 0.08em hsla(0, 0%, 100%, 0.18) inset, 0.5em -0.5em 0.9em hsla(223, 30%, 5%, 0.35)'
              }}
            ></span>

            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] [-moz-backdrop-filter:blur(0.75em)] [will-change:transform] transform group-hover:[transform:translate3d(0,0,2em)]"
              style={{
                boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
              }}
            >
              <span className="m-auto w-[1.5em] h-[1.5em] flex items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
            </span>

            <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-base opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]">
              {item.label}
            </span>
          </>
        );

        const commonClass = `relative bg-transparent outline-none border-none cursor-pointer w-[4.5em] h-[4.5em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
          item.customClass || ''
        }`;

        if (item.href) {
          return (
            <Link
              key={index}
              href={item.href}
              aria-label={item.label}
              className={commonClass}
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={index}
            type="button"
            aria-label={item.label}
            className={commonClass}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
};

export default GlassIcons;
