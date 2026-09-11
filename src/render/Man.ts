/**
 * Mot MAN hinh cua game: lop thanh pho hay lop chien dich.
 *
 * Hai man cung song mot luc trong DOM, nhung chi mot cai chay vong ve. Giu ca hai song -
 * thay vi dung lai tu dau moi lan doi - de bam "Về thành phố" la thay dung cho cu: camera
 * o dau, the quyet dinh nao dang mo, thanh pho da chay toi gio nao.
 *
 * Hai bo atlas nam cung luc trong bo nho GPU la 2 trang, tran TECH_SPEC muc 2 la 4.
 */
export interface Man {
  /** Hien man va chay lai vong ve. */
  hien(): void;
  /** An man va DUNG vong ve - khong dung thi may ao/iPhone ve ca hai man mot luc. */
  an(): void;
}
