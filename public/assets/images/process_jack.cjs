const fs = require('fs');
const zlib = require('zlib');

function removeWhiteBackground(inputPath, outputPath) {
  const buf = fs.readFileSync(inputPath);
  
  // Read IHDR
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log(`Dimensions: ${width}x${height}`);

  // Collect IDAT
  const idatChunks = [];
  let pos = 8;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.slice(pos + 4, pos + 8).toString('ascii');
    if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  // Decompress raw scanlines
  const inflated = zlib.inflateSync(Buffer.concat(idatChunks));
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const reconstructed = Buffer.alloc(width * height * bytesPerPixel);

  let inOffset = 0;
  let prevRow = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const filterType = inflated[inOffset++];
    const currentRow = Buffer.alloc(stride);

    for (let x = 0; x < stride; x++) {
      const raw = inflated[inOffset++];
      const a = (x >= bytesPerPixel) ? currentRow[x - bytesPerPixel] : 0;
      const b = prevRow[x];
      const c = (x >= bytesPerPixel) ? prevRow[x - bytesPerPixel] : 0;

      let val = raw;
      if (filterType === 0) val = raw;
      else if (filterType === 1) val = (raw + a) & 0xff;
      else if (filterType === 2) val = (raw + b) & 0xff;
      else if (filterType === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        else pr = c;
        val = (raw + pr) & 0xff;
      }
      currentRow[x] = val;
    }

    currentRow.copy(reconstructed, y * stride);
    prevRow = currentRow;
  }

  // Flood fill / Alpha keying on background pixels
  // Any pixel with high brightness on the outer mask
  const processed = Buffer.alloc(height * (1 + stride));
  let outOffset = 0;

  for (let y = 0; y < height; y++) {
    processed[outOffset++] = 0; // Filter None for output
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let r = reconstructed[idx];
      let g = reconstructed[idx + 1];
      let b = reconstructed[idx + 2];
      let a = reconstructed[idx + 3];

      // If near pure white background
      if (r > 235 && g > 235 && b > 235) {
        // Linear fade for smooth edges
        const minVal = Math.min(r, g, b);
        if (minVal > 248) {
          a = 0;
        } else {
          a = Math.floor((248 - minVal) / 13 * 255);
        }
      }

      processed[outOffset++] = r;
      processed[outOffset++] = g;
      processed[outOffset++] = b;
      processed[outOffset++] = a;
    }
  }

  const deflated = zlib.deflateSync(processed);

  // Write new PNG
  const parts = [];
  parts.push(buf.slice(0, 8)); // Signature

  // IHDR chunk
  const ihdr = buf.slice(8, 33);
  parts.push(ihdr);

  // IDAT chunk
  const idatHeader = Buffer.alloc(8);
  idatHeader.writeUInt32BE(deflated.length, 0);
  idatHeader.write('IDAT', 4);
  const crc32 = require('zlib').crc32;
  const idatCrc = Buffer.alloc(4);
  const crcVal = crc32(Buffer.concat([Buffer.from('IDAT'), deflated]));
  idatCrc.writeUInt32BE(crcVal >>> 0, 0);

  parts.push(idatHeader);
  parts.push(deflated);
  parts.push(idatCrc);

  // IEND chunk
  const iend = Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
  parts.push(iend);

  fs.writeFileSync(outputPath, Buffer.concat(parts));
  console.log(`Saved transparent Jack PNG to ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
}

removeWhiteBackground('public/assets/images/jack_skellington.png', 'public/assets/images/jack_transparent.png');
