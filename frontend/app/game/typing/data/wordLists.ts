import { WordList } from "../components/types";

// 定義打字遊戲的單字列表
export const wordLists: WordList[] = [
  {
    name: "📝 Basic Words",
    words:
      `the, to, i, and, of, he, was, you, her, not, it, in, she, his, that, is, my, with, me, had, on, as, for, but, at, him, have, do, be, what, would, out, said, up, they, we, this, from, did, are, so, could, were, all, if, back, like, one, there, no, into, will, just, when, about, then, them, know, been, am, your, over, down, an, or, time, now, eyes, by, more, get, how, can, who, their, before, around, way, even, going, head, see, us, here, right, off, only, want, through, looked, hand, go, think, some, again, too, away, still, something, than, face, other, never, after, asked, thought, man, good, well, two, where, let, look, made, much, why, because, knew, got, little, door, our, any, room, come, make, take, long, first, say, its, felt, wanted, took, turned, need, hands, tell, really, sure, against, voice, should, has, left, which, very, people, told, came, another, while, last, life, anything, few, body, night, cannot, nothing, behind, being, enough, went, feel, side, does, thing, day, might, saw, until, things, though, those, yes, maybe, put, own, find, ever, every, looking, once, hair, moment, both, love, always, mind, next, place, inside, hard, help, front, without, found, house, mouth, old, same, keep, most, everything, himself, someone, toward, home, open, woman, trying, heard, pulled, arms, better, each, between, new, give, seemed, smile, work`.split(
        ", "
      ),
  },
  {
    name: "🔍 HTML Tags",
    words:
      `html, head, body, div, span, p, a, img, h1, h2, h3, h4, h5, h6, ul, ol, li, table, tr, td, th, form, input, button, label, select, option, textarea, meta, link, script, style, title, br, hr, strong, em, b, i, u, s, code, pre, blockquote, cite, q, abbr, acronym, address, article, aside, footer, header, nav, section, main, figure, figcaption, canvas, svg, path, circle, rect, line, polyline, polygon, audio, video, source, track, iframe, object, embed, param, map, area, details, summary, dialog, menu, menuitem, output, progress, meter, time, mark, ruby, rt, rp, bdi, bdo, wbr, data, picture, source, track, col, colgroup, caption, thead, tbody, tfoot, fieldset, legend, datalist, optgroup, keygen, output, progress, meter, time, mark, ruby, rt, rp, bdi, bdo, wbr, data, picture, source, track, col, colgroup, caption, thead, tbody, tfoot, fieldset, legend, datalist, optgroup, keygen`.split(
        ", "
      ),
  },
];

// 隨機打亂單詞列表並返回指定數量的單詞
export function shuffleWords(words: string[], count = 67) {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
} 