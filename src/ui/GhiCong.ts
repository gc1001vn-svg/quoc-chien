/**
 * Man ghi cong (Phase 12C): ten tac gia cac model CC-BY dang nuong trong game. CC-BY doi
 * ghi cong o cho nguoi choi thay duoc - no tu Phase 10B (xe tang, dai bac, sung Icosa).
 *
 * Danh sach nam o `data/ghi_cong.json`; `tests/GhiCong.test.ts` giu no khop voi cac me.
 */
import ghiCong from '../../data/ghi_cong.json';

/** Dung bang (an san) trong `chaMe`, tra ve ham bat/tat. */
export function dungGhiCong(chaMe: HTMLElement): () => void {
  const bang: HTMLDivElement = document.createElement('div');
  bang.className = 'ghi-cong';
  bang.hidden = true;

  const dau: HTMLParagraphElement = document.createElement('p');
  dau.innerHTML = '<b>Ghi công</b>';
  const dong: HTMLButtonElement = document.createElement('button');
  dong.type = 'button';
  dong.textContent = '✕';
  dong.addEventListener('click', () => { bang.hidden = true; });
  dau.appendChild(dong);
  bang.appendChild(dau);

  for (const d of ghiCong.cc_by) {
    const p: HTMLParagraphElement = document.createElement('p');
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = d.link;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = `"${d.ten}"`;
    p.append(`${d.dung_o}: `, a, ` — ${d.tac_gia} · ${d.license}`);
    bang.appendChild(p);
  }
  const cc0: HTMLParagraphElement = document.createElement('p');
  cc0.textContent = ghiCong.cc0;
  bang.appendChild(cc0);

  chaMe.appendChild(bang);
  return (): void => { bang.hidden = !bang.hidden; };
}
