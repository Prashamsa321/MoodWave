// Minimal WebPets manifest for the pet MoodWave ships.
// The upstream registry supports more animals; MoodWave only needs the brown rat.
export const PET_MANIFEST = {
  rat: {
    speed: 4.9,
    colors: ["brown", "gray", "white"],
    actions: ["idle", "run", "swipe", "walk", "walk_fast", "with_ball"],
  },
};
