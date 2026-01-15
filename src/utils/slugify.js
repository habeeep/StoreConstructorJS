export default function slugify(str) {
  if (!str) return ''
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-а-яёйъь]+/gi, '')
    .replace(/-+/g, '-')
}
