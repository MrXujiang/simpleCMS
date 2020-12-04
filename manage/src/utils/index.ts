export const title: string = 'simpleCMS'

export const TIME_FORMAT: string = 'YYYY-MM-DD HH:mm'

export const getBase64: (img: any, cb: any) => void = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}