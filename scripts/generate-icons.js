 const sharp = require("sharp")
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
  sizes.forEach(size =>
    sharp("public/icon-source.png")
      .resize(size, size)
      .toFile(`public/icons/icon-${size}.png`)
  )