import { useRecoilState } from "recoil"

import {
  isFallbackState,
  draftFilepathState,
  fontTypeState,
  fontSizeState,
  lineHeightState,
  lineWordsState,
  charCountState,
  selectedCharCountState,
} from "@/store"

type ReturnType = [number, { increment: () => void; decrement: () => void }]

export const useIsFallback = () => useRecoilState(isFallbackState)

export const useDraftPath = () => useRecoilState(draftFilepathState)

export const useFontType = () => useRecoilState(fontTypeState)

export const useCharCount = () => useRecoilState(charCountState)
export const useSelectedCharCount = () => useRecoilState(selectedCharCountState)

export const useFontSize = (): ReturnType => {
  const [fs, setFS] = useRecoilState(fontSizeState)
  const increment = () => setFS((prev) => prev + 1)
  const decrement = () => setFS((prev) => prev - 1)

  return [fs / 10, { increment, decrement }]
}

export const useLineHeight = (): ReturnType => {
  const [lh, setLH] = useRecoilState(lineHeightState)
  const increment = () => setLH((prev) => prev + 1)
  const decrement = () => setLH((prev) => prev - 1)

  return [lh / 10, { increment, decrement }]
}

export const useLineWords = (): ReturnType => {
  const [lw, setLW] = useRecoilState(lineWordsState)
  const increment = () => setLW((prev) => prev + 1)
  const decrement = () => setLW((prev) => prev - 1)

  return [lw, { increment, decrement }]
}
