'use client';

import Link from 'next/link';

export default function LinkCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <div className="rounded-xl border border-dashed p-6 hover:bg-muted cursor-pointer transition-colors">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
