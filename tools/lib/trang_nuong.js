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
void main() {
  vUv = aUv;
  vNor = aNor;
  vMau = aMau;
  vCoAnh = aCoAnh;
  gl_Position = uMvp * vec4(aPos, 1.0);
}`;

const FS = `
precision mediump float;
uniform sampler2D uAnh;
varying vec2 vUv;
varying vec3 vNor;
varying vec3 vMau;
varying float vCoAnh;
void main() {
  vec3 den = normalize(vec3(-0.55, 0.80, 0.30));
  float d = max(dot(normalize(vNor), den), 0.0);
  // Nen sang mot chut de mat khuat khong den kit; do tuong phan nuong san vao anh.
  float t = 0.55 + 0.45 * d;
  // Vai model co material khong anh (nuoc), chi co mau phang - lay mau do thay vi anh.
  vec3 c = mix(vMau, texture2D(uAnh, vUv).rgb, vCoAnh);
  gl_FragColor = vec4(c * t, 1.0);
}`;

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

  const ct = gl.createProgram();
  gl.attachShader(ct, dich(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(ct, dich(gl, gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(ct);
  if (!gl.getProgramParameter(ct, gl.LINK_STATUS)) {
    throw new Error('Noi shader hong: ' + gl.getProgramInfoLog(ct));
  }
  gl.useProgram(ct);

  const viTri = {
    pos: gl.getAttribLocation(ct, 'aPos'),
    uv: gl.getAttribLocation(ct, 'aUv'),
    nor: gl.getAttribLocation(ct, 'aNor'),
    mau: gl.getAttribLocation(ct, 'aMau'),
    coAnh: gl.getAttribLocation(ct, 'aCoAnh'),
    mvp: gl.getUniformLocation(ct, 'uMvp'),
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

  const dem = gl.createBuffer();
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.SCISSOR_TEST);

  const kq = [];
  for (let trang = 0; trang < bo.soTrang; trang += 1) {
    gl.scissor(0, 0, bo.canh, bo.canh);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const s of bo.sprite) {
      if (s.trang !== trang) continue;
      const dinh = new Float32Array(await (await nap(`/bin/${s.ten}`)).arrayBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, dem);
      gl.bufferData(gl.ARRAY_BUFFER, dinh, gl.STREAM_DRAW);
      const buoc = 12 * 4;
      const dat = (vt, so, lech) => {
        gl.enableVertexAttribArray(vt);
        gl.vertexAttribPointer(vt, so, gl.FLOAT, false, buoc, lech);
      };
      dat(viTri.pos, 3, 0);
      dat(viTri.uv, 2, 12);
      dat(viTri.nor, 3, 20);
      dat(viTri.mau, 3, 32);
      dat(viTri.coAnh, 1, 44);

      // Toa do y cua WebGL dem tu duoi len, cua atlas dem tu tren xuong.
      const duoi = bo.canh - s.y - s.h;
      gl.viewport(s.x, duoi, s.w, s.h);
      gl.scissor(s.x, duoi, s.w, s.h);
      gl.clear(gl.DEPTH_BUFFER_BIT);

      gl.bindTexture(gl.TEXTURE_2D, anh[s.anh]);
      gl.uniformMatrix4fv(viTri.mvp, false, maTran({ ...s, yaw: bo.yaw, pitch: bo.pitch }));
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
