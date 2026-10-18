// Quarto runs this using its bundled JavaScript runtime; no Node installation is needed.
for (const entry of Deno.readDirSync("_site")) {
  if (!entry.isFile || !entry.name.endsWith(".html")) continue;
  const path = `_site/${entry.name}`;
  let html = Deno.readTextFileSync(path);
  if (!/^\s*<!doctype html>/i.test(html)) html = "<!doctype html>\n" + html;
  html = html.replace(/(<section[^>]*class="research-section"[^>]*>)([\s\S]*?)(<\/section>)/g,
    (_all, start, body, end) => {
      const count = (body.match(/<article[^>]*data-paper/g) || []).length;
      return start + body.replace(/(<span class="count">)\d+(<\/span>)/, `$1${count}$2`) + end;
    });
  Deno.writeTextFileSync(path, html);
  // Remove only byte-equivalent generated HTML retained beside the Markdown.
  try {
    const intermediate = Deno.readTextFileSync(entry.name);
    const strip = (s: string) => s.replace(/^\s*<!doctype html>\s*/i, "");
    if (strip(intermediate) === strip(html)) Deno.removeSync(entry.name);
  } catch (e) { if (!(e instanceof Deno.errors.NotFound)) throw e; }
}
