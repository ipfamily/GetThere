async function captureDataUrl(elementId: string): Promise<string> {
  const { toPng } = await import('html-to-image')
  const el = document.getElementById(elementId)
  if (!el) throw new Error('找不到卡片元素，请稍后再试')

  // html-to-image 使用浏览器 computedStyle 序列化，不自行解析 CSS 文本，
  // 因此 Tailwind v4 的 oklch 颜色已由浏览器解析为 rgb，无兼容性问题。
  return toPng(el as HTMLElement, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    skipAutoScale: false,
    style: { margin: '0' },
  })
}

function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    document.body.removeChild(link)
  }, 500)
}

export async function exportAsImage(elementId: string, filename: string): Promise<void> {
  const dataUrl = await captureDataUrl(elementId)
  triggerDownload(dataUrl, `${filename}.png`)
}

export async function exportAsPDF(elementId: string, filename: string): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const dataUrl = await captureDataUrl(elementId)

  // 从 data URL 获取图片尺寸
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = dataUrl
  })

  const isLandscape = img.naturalWidth > img.naturalHeight
  const pageW = isLandscape ? 297 : 210
  const imgH = Math.round((img.naturalHeight / img.naturalWidth) * pageW)

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [pageW, imgH + 4],
  })

  pdf.addImage(dataUrl, 'PNG', 0, 2, pageW, imgH)
  pdf.save(`${filename}.pdf`)
}
