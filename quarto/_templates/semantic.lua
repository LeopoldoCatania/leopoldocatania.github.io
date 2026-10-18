function Div(el)
  if el.classes:includes('paper') then
    local year = el.attributes['year'] or 'WP'
    local blocks = pandoc.List({pandoc.RawBlock('html', '<article class="paper" data-paper><div class="paper-year">' .. year .. '</div><div>')})
    local para = 0
    for _,b in ipairs(el.content) do
      if b.t == 'Para' then
        para = para + 1
        if para == 1 then
          blocks:insert(pandoc.RawBlock('html', '<p class="authors">'))
          blocks:insert(pandoc.Plain(b.content))
          blocks:insert(pandoc.RawBlock('html', '</p>'))
        elseif #b.content == 1 and b.content[1].t == 'Emph' then
          blocks:insert(pandoc.RawBlock('html', '<p class="journal">'))
          blocks:insert(pandoc.Plain(b.content[1].content))
          blocks:insert(pandoc.RawBlock('html', '</p>'))
        else blocks:insert(b) end
      else blocks:insert(b) end
    end
    blocks:insert(pandoc.RawBlock('html', '</div></article>'))
    return blocks
  end
  local tag = el.attributes["tag"] or el.attributes["data-tag"]
  if not tag then return nil end
  el.attributes["tag"] = nil
  el.attributes["data-tag"] = nil
  local function esc(s) return s:gsub("&", "&amp;"):gsub('"', "&quot;"):gsub("<", "&lt;") end
  local attrs = ''
  if el.identifier ~= '' then attrs = attrs .. ' id="' .. esc(el.identifier) .. '"' end
  if #el.classes > 0 then attrs = attrs .. ' class="' .. esc(table.concat(el.classes, ' ')) .. '"' end
  for k,v in pairs(el.attributes) do attrs = attrs .. ' ' .. k .. '="' .. esc(v) .. '"' end
  local blocks = pandoc.List({pandoc.RawBlock('html', '<' .. tag .. attrs .. '>')})
  for _,b in ipairs(el.content) do
    if (tag == 'p' or tag == 'address') and b.t == 'Para' then b = pandoc.Plain(b.content) end
    blocks:insert(b)
  end
  blocks:insert(pandoc.RawBlock('html', '</' .. tag .. '>'))
  return blocks
end
