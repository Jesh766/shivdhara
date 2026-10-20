// Single source of truth for the hero's scroll-driven content reveal distance.
// HeroSection imports this so its scroll parallax stays in sync. The cinematic
// arrival splash (LoadingScreen / ArrivalLogoTransition) was removed so the
// homepage loads directly; this value now only drives the hero reveal.
export const SCROLL_DISTANCE = 520;