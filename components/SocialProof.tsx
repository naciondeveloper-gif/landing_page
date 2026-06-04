export default function SocialProof() {
  return (
    <section className="bg-surface-container-low py-8 border-y border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-4 md:px-16 flex flex-wrap items-center justify-around gap-8 opacity-60">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">apartment</span>
          <span className="text-title-md tracking-wider text-on-surface">FOVIME</span>
        </div>
        <div className="h-8 w-px bg-outline-variant hidden md:block" />
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">diversity_3</span>
          <span className="text-title-md tracking-wider text-on-surface">CONSORCIO NEPTUNO</span>
        </div>
        <div className="h-8 w-px bg-outline-variant hidden md:block" />
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">park</span>
          <span className="text-title-md tracking-wider text-on-surface">ÁREAS VERDES</span>
        </div>
        <div className="h-8 w-px bg-outline-variant hidden md:block" />
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">location_on</span>
          <span className="text-title-md tracking-wider text-on-surface">KM 52 PAN SUR – Chilca</span>
        </div>
      </div>
    </section>
  );
}
