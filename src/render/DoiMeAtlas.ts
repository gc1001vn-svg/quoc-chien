/**
 * Giu bo atlas dang chay cua canh thanh pho, va doi ca bo khi len doi.
 *
 * "Len doi la thanh pho doi mat" (GAME_SPEC muc 9). Moi doi khai mot ten me atlas trong
 * `data/balance.json > thoiDai`; `CityScene` goi {@link DoiMeAtlas.theoDoi} moi khung voi
 * ten me cua doi hien tai, o day lo phan nap va nha.
 *
 * Nha atlas cu bang `gl.deleteTexture` NGAY khi bo moi len GPU, dung TECH_SPEC muc 2:
 * khong giu lai "phong khi can". Giu ca hai la 33,6 MB bo nho GPU khong ai dung.
 */
import { Atlas, napTrangLenGpu, taiBoAtlas, type BoAtlas } from './Atlas';
import type { Gl } from './Gl';

/**
 * Me bi ep tu dia chi: `?me=hien_dai`.
 *
 * VI SAO CAN: doi 4 tro di con `len: null` trong `data/balance.json` (chua co cong nghe
 * rieng), va doi 3 doi 270 nha ma thanh pho moi toi 241 - tuc doi 5 CHUA TOI DUOC bang
 * cach choi. Khong co duong ep nay thi me hien dai da nuong xong van khong ai nhin duoc
 * tren may that. No di dung duong `theoDoi` nhu luc len doi, khong phai duong rieng.
 */
export function meEpTuUrl(): string | null {
  return new URLSearchParams(window.location.search).get('me');
}

export class DoiMeAtlas {
  private readonly gl: Gl;
  private readonly co: '1x' | '2x';
  /** Goi sau moi lan doi xong - `CityScene` dung de bao lai sprite con thieu. */
  private readonly xong: (atlas: Atlas) => void;
  private bo: Atlas;
  private ten: string;
  private dangDoi = false;
  /** Me nap hong mot lan thi thoi, dung thu lai - vong ve chay 60 lan mot giay. */
  private readonly hong = new Set<string>();
  /** Me ep tu dia chi. Khac `null` thi moi loi goi `theoDoi` deu ve day. */
  private readonly ep: string | null;

  constructor(gl: Gl, co: '1x' | '2x', ten: string, bo: Atlas, xong: (a: Atlas) => void) {
    this.gl = gl;
    this.co = co;
    this.ten = ten;
    this.bo = bo;
    this.xong = xong;
    this.ep = meEpTuUrl();
    if (this.ep !== null) this.theoDoi(this.ep);
  }

  /** Bo atlas dang ve. Doi bo la doi gia tri nay, nen dung giu ban sao o ngoai. */
  public atlas(): Atlas {
    return this.bo;
  }

  /** Ten me dang chay. */
  public me(): string {
    return this.ten;
  }

  /**
   * Goi moi khung. Ten me khac bo dang chay thi nap bo moi, con lai thi khong lam gi.
   *
   * Khong `await`: vong ve khong duoc dung lai cho tai anh. Dang nap do thi khung sau
   * thay `dangDoi` va bo qua, khong goi chong.
   */
  public theoDoi(me: string): void {
    // Co me ep thi moi loi goi deu ve no. Khong the chi ep mot lan luc mo man: vong ve
    // goi lai moi khung voi me cua doi hien tai, va no se keo nguoc ve me cua doi 1.
    const can: string = this.ep ?? me;
    if (can === this.ten || this.dangDoi || this.hong.has(can)) return;
    this.dangDoi = true;
    this.doi(can)
      .catch((e: unknown) => {
        // Nap hong thi giu nguyen atlas cu va keu DUNG MOT cau. Thuoc `khoi:dong` bat
        // `console.error`, nen loi nay khong the lot qua vong dung bai.
        this.hong.add(can);
        console.error(`doi me atlas hong: ${e instanceof Error ? e.message : String(e)}`);
      })
      .finally(() => {
        this.dangDoi = false;
      });
  }

  /**
   * Ba thu PHAI khop bo dang chay, khong thi nem loi chu khong ve bay: so trang atlas
   * (`Gl` dung so nay luc dich shader nen doi la phai dung lai ca bo ve), `o_px` va
   * `heSo` (`Camera` da nhan hai so do luc dung, doi giua chung thi camera lech ban do).
   * Ca ba nam trong tay may nuong - me moi cu nuong cho khop, dung noi long cho nay.
   */
  private async doi(me: string): Promise<void> {
    const boMoi: BoAtlas = await taiBoAtlas(me, this.co);
    if (boMoi.trang.length !== this.bo.soTrang()) {
      throw new Error(
        `me "${me}" co ${String(boMoi.trang.length)} trang atlas,`
        + ` bo ve dung cho ${String(this.bo.soTrang())}`,
      );
    }
    if (boMoi.o_px !== this.bo.oPx() || boMoi.heSo !== this.bo.heSo()) {
      throw new Error(`me "${me}" lech thuoc o luoi hay he so co voi me dang chay`);
    }
    const texs: WebGLTexture[] = await napTrangLenGpu(boMoi, this.gl);
    const cu: Atlas = this.bo;
    this.bo = new Atlas(boMoi, texs);
    cu.nha(this.gl);
    this.gl.datTrang(this.bo.cacTrang());
    this.ten = me;
    this.xong(this.bo);
  }
}
