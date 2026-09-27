/**
 * Site logo — the provided Goku picture shown as a clean circular
 * avatar badge with a subtle orange ring (navbar, footer).
 * Uses the untouched original picture — no cutout.
 */
export default function Logo({ size = 32, className = '' }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden ring-2 ring-orange-500/70 shadow-orange-sm select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src="/assets/logo.png"
        alt=""
        width={size}
        height={size}
        className="w-full h-full object-cover"
        draggable="false"
      />
    </div>
  )
}
