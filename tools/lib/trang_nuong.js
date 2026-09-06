/**
 * Phan chay TRONG TRINH DUYET cua cong cu nuong sprite.
 *
 * Nhan mot ban do da tinh san tu Node (`/bo.json`): moi sprite da biet nam o trang atlas
 * nao, o dau, to bao nhieu, va hop bao cua no trong khong gian may anh. Viec cua trang chi
 * la ve cho dung cho. Moi phep tinh vi tri lam o Node de con test duoc bang vitest.
 *
 * Khong import gi, khong thu vien 3D. Chay bang WebGL1 cho chac tren Chromium phan mem.
 */

const VS = `
attribute vec3 aPos;
attribute vec2 aUv;
attribute vec3 aNor;
attribute vec3 aMau;
attribute float aCoAnh;
uniform mat4 uMvp;
varying vec2 vUv;
varying vec3 vNor;
varying vec3 vMau;
varying float vCoAnh;
varying float vCao;
void main() {
  vCao = aPos.y;
  vUv = aUv;
  vNor = aNor;
  vMau = aMau;
  vCoAnh = aCoAnh;
  gl_Position = uMvp * vec4(aPos, 1.0);
}`;

const FS = `
precision mediump float;
uniform sampler2D uAnh;
uniform vec3 uNhin;
varying vec2 vUv;
varying vec3 vNor;
varying vec3 vMau;
varying float vCoAnh;
varying float vCao;
void main() {
  vec3 n = normalize(vNor);

  // Den chinh am, cheo tu tren trai - phia truoc, dung huong voi goc may anh isometric.
  vec3 huongDen = normalize(vec3(-0.55, 0.80, 0.35));
  vec3 denChinh = vec3(1.05, 0.99, 0.88) * max(dot(n, huongDen), 0.0) * 0.72;

  // Den nen nua cau: mat ngua len an sang troi lanh, mat cui xuong an sang dat am.
  // Giu TOI de mau khong bac ra - nen sang qua thi moi thu xam xit nhu nhau.
  float bau = n.y * 0.5 + 0.5;
  vec3 denNen = mix(vec3(0.22, 0.20, 0.26), vec3(0.40, 0.44, 0.52), bau);

  // Vien lanh o ria, chi vua du tach hinh khoi nen sam. Manh tay la ra suong mu.
  float vien = pow(1.0 - abs(dot(n, uNhin)), 4.0) * 0.10;

  // vMau vua la mau phang cua material khong anh, vua la mau nhan cua manh trong me.
  // Bong ben trong: cang gan mat dat cang toi. Day la thu lam khoi dung tren dat chu
  // khong lo lung - game 2D cheo nao cung ve, khong ve thi hinh nhu dan len nen.
  float chan = 0.62 + 0.38 * smoothstep(0.0, 0.55, vCao);

  vec3 c = vMau * mix(vec3(1.0), texture2D(uAnh, vUv).rgb, vCoAnh);
  vec3 ra = c * (denChinh + denNen) * chan + vien * vec3(0.75, 0.85, 1.0);
  // Nang tong: vung sang nga am, vung toi nga lanh. Cung mot mau ma tach hai dau ra thi
  // hinh khoi noi han len, khong can them da giac nao.
  ra = mix(ra * vec3(0.92, 0.96, 1.10), ra * vec3(1.08, 1.02, 0.90), smoothstep(0.15, 0.75, dot(ra, vec3(0.299, 0.587, 0.114))));
  float xam = dot(ra, vec3(0.299, 0.587, 0.114));
  gl_FragColor = vec4(clamp(mix(vec3(xam), ra, 1.30), 0.0, 1.0), 1.0);
}`;

// Bong do: mot hinh elip mem tren mat dat, ve TRUOC vat. Khong dung hinh chieu that cua
// model vi cac tam giac chieu xuong de len nhau, cho de nhau ra dam den lo cho. Elip theo
// hop bao chan vat thi mem san, khong can lam mo.
const VS_BONG = `
attribute vec3 aPos;
attribute float aMo;
uniform mat4 uMvp;
varying float vMo;
void main() {
  vMo = aMo;
  gl_Position = uMvp * vec4(aPos, 1.0);
}`;

const FS_BONG = `
precision mediump float;
uniform float uDam;
varying float vMo;
void main() {
  // Mo dan ra ria, nhung giu long dam: bong mem qua thi nhin nhu vet ban.
  gl_FragColor = vec4(0.05, 0.04, 0.09, smoothstep(0.0, 0.65, vMo) * uDam);
}`;

/** Quat tam giac hinh elip: dinh giua duc, ria trong suot. */
function veElip(b, canh = 28) {
  const d = [b.cx, 0.01, b.cz, 1];
  for (let i = 0; i <= canh; i += 1) {
    const g = (i / canh) * Math.PI * 2;
    d.push(b.cx + Math.cos(g) * b.rx, 0.01, b.cz + Math.sin(g) * b.rz, 0);
  }
  // Quat -> tam giac roi rac, khong doi thu tu ve.
  const ra = [];
  for (let i = 1; i <= canh; i += 1) {
    ra.push(...d.slice(0, 4), ...d.slice(i * 4, i * 4 + 4), ...d.slice((i + 1) * 4, i * 4 + 8));
  }
  return new Float32Array(ra);
}

/** @returns {WebGLShader} */
function dich(gl, loai, ma) {
  const s = gl.createShader(loai);
  gl.shaderSource(s, ma);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error('Dich shader hong: ' + gl.getShaderInfoLog(s));
  }
  return s;
}

/**
 * Ma tran dua toa do the gioi thang sang toa do cat, theo may anh truc giao goc cheo.
 * Cot chinh (column-major) nhu WebGL doi.
 */
function maTran(s) {
  const cy = Math.cos(s.yaw);
  const sy = Math.sin(s.yaw);
  const cp = Math.cos(s.pitch);
  const sp = Math.sin(s.pitch);
  const hw = (s.vx1 - s.vx0) / 2;
  const hh = (s.vy1 - s.vy0) / 2;
  const hd = Math.max((s.vz1 - s.vz0) / 2, 1e-4);
  const gx = (s.vx0 + s.vx1) / 2;
  const gy = (s.vy0 + s.vy1) / 2;
  const gz = (s.vz0 + s.vz1) / 2;

  // Hang cua ma tran, viet cho de doi chieu voi tinh toan o Node.
  const h0 = [cy / hw, 0, -sy / hw, -gx / hw];
  const h1 = [(-sy * sp) / hh, cp / hh, (-cy * sp) / hh, -gy / hh];
  // Truc sau doi dau: diem cao va gan may anh phai de len tren.
  const h2 = [(sy * cp) / -hd, -sp / hd, (cy * cp) / -hd, gz / hd];
  const h3 = [0, 0, 0, 1];

  const m = new Float32Array(16);
  [h0, h1, h2, h3].forEach((h, r) => h.forEach((v, c) => { m[c * 4 + r] = v; }));
  return m;
}

async function nap(duong) {
  const res = await fetch(duong);
  if (!res.ok) throw new Error(`Nap hong ${duong}: ${res.status}`);
  return res;
}

async function chay() {
  const bo = await (await nap('/bo.json')).json();
  const canvas = document.createElement('canvas');
  canvas.width = bo.canh;
  canvas.height = bo.canh;
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    antialias: true,
    depth: true,
  });
  if (gl === null) throw new Error('May nay khong mo duoc WebGL');

  const noi = (vs, fs) => {
    const ct = gl.createProgram();
    gl.attachShader(ct, dich(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(ct, dich(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(ct);
    if (!gl.getProgramParameter(ct, gl.LINK_STATUS)) {
      throw new Error('Noi shader hong: ' + gl.getProgramInfoLog(ct));
    }
    return ct;
  };
  const ct = noi(VS, FS);
  const ctBong = noi(VS_BONG, FS_BONG);
  const viTriBong = {
    pos: gl.getAttribLocation(ctBong, 'aPos'),
    mo: gl.getAttribLocation(ctBong, 'aMo'),
    mvp: gl.getUniformLocation(ctBong, 'uMvp'),
    dam: gl.getUniformLocation(ctBong, 'uDam'),
  };
  gl.useProgram(ct);

  const viTri = {
    pos: gl.getAttribLocation(ct, 'aPos'),
    uv: gl.getAttribLocation(ct, 'aUv'),
    nor: gl.getAttribLocation(ct, 'aNor'),
    mau: gl.getAttribLocation(ct, 'aMau'),
    coAnh: gl.getAttribLocation(ct, 'aCoAnh'),
    mvp: gl.getUniformLocation(ct, 'uMvp'),
    nhin: gl.getUniformLocation(ct, 'uNhin'),
  };

  // Moi kit mot anh mau rieng - hai goi Kenney KHONG dung chung colormap.png.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const anh = [];
  for (const duong of bo.anh) {
    const img = new Image();
    img.src = duong;
    await img.decode();
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    anh.push(t);
  }

  // Huong tu vat the ve phia may anh, suy thang tu goc xoay - dung cho phep tinh vien.
  gl.uniform3f(
    viTri.nhin,
    Math.sin(bo.yaw) * Math.cos(bo.pitch),
    Math.sin(bo.pitch),
    Math.cos(bo.yaw) * Math.cos(bo.pitch),
  );

  const dem = gl.createBuffer();
  const demBong = gl.createBuffer();
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.SCISSOR_TEST);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const dat = (vt, so, lech) => {
    gl.enableVertexAttribArray(vt);
    gl.vertexAttribPointer(vt, so, gl.FLOAT, false, 12 * 4, lech);
  };

  const kq = [];
  for (let trang = 0; trang < bo.soTrang; trang += 1) {
    gl.scissor(0, 0, bo.canh, bo.canh);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const s of bo.sprite) {
      if (s.trang !== trang) continue;
      const dinh = new Float32Array(await (await nap(`/bin/${s.ten}`)).arrayBuffer());
      const mt = maTran({ ...s, yaw: bo.yaw, pitch: bo.pitch });
      // Toa do y cua WebGL dem tu duoi len, cua atlas dem tu tren xuong.
      const duoi = bo.canh - s.y - s.h;
      gl.viewport(s.x, duoi, s.w, s.h);
      gl.scissor(s.x, duoi, s.w, s.h);
      gl.clear(gl.DEPTH_BUFFER_BIT);

      // Bong truoc, vat sau. Bong khong ghi vao dem sau nen vat luon de len tren.
      gl.useProgram(ctBong);
      gl.enable(gl.BLEND);
      gl.depthMask(false);
      const elip = veElip(s.bong);
      gl.bindBuffer(gl.ARRAY_BUFFER, demBong);
      gl.bufferData(gl.ARRAY_BUFFER, elip, gl.STREAM_DRAW);
      gl.enableVertexAttribArray(viTriBong.pos);
      gl.vertexAttribPointer(viTriBong.pos, 3, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(viTriBong.mo, 1, gl.FLOAT, false, 16, 12);
      gl.uniformMatrix4fv(viTriBong.mvp, false, mt);
      gl.uniform1f(viTriBong.dam, 0.46);
      gl.drawArrays(gl.TRIANGLES, 0, elip.length / 4);
      gl.disableVertexAttribArray(viTriBong.mo);
      gl.depthMask(true);
      gl.disable(gl.BLEND);

      gl.useProgram(ct);
      gl.bindBuffer(gl.ARRAY_BUFFER, dem);
      gl.bufferData(gl.ARRAY_BUFFER, dinh, gl.STREAM_DRAW);
      dat(viTri.pos, 3, 0);
      dat(viTri.uv, 2, 12);
      dat(viTri.nor, 3, 20);
      dat(viTri.mau, 3, 32);
      dat(viTri.coAnh, 1, 44);
      gl.bindTexture(gl.TEXTURE_2D, anh[s.anh]);
      gl.uniformMatrix4fv(viTri.mvp, false, mt);
      gl.drawArrays(gl.TRIANGLES, 0, dinh.length / 12);
    }
    kq.push(canvas.toDataURL('image/png'));
  }

  window.KQ = kq;
  window.XONG = true;
}

chay().catch((e) => {
  window.LOI = String(e && e.stack ? e.stack : e);
  window.XONG = true;
});
