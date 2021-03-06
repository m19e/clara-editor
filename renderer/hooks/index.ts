import { useRecoilState, useRecoilValue, useSetRecoilState, SetterOrUpdater } from "recoil";
import { FontType, LineHeightClassType } from "types";
import {
    fontTypeState,
    displayFontSizeState,
    realFontSizeState,
    lineHeightState,
    lineHeightClassState,
    lineWordsState,
    wrapperHeightState,
    editorHeightState,
    disabledIncFSState,
    disabledDecFSState,
    disabledIncLHState,
    disabledDecLHState,
    disabledIncLWState,
    disabledDecLWState,
    titleState,
    contentState,
    isTitleEditState,
    autosaveDurationState,
    displayCharCountState,
    draftDirState,
} from "store";
import {
    setFontTypeConfig,
    setFontSizeConfig,
    setLineHeightConfig,
    setLineWordsConfig,
    setAutosaveDurationConfig,
    setDisplayCharCountConfig,
    setDraftDirConfig,
} from "lib/config";

// App
export const useDraftDir = (): [string, (dir: string) => void] => {
    const [draftDir, setDraftDir] = useRecoilState(draftDirState);
    const setDir = (dir: string) => {
        setDraftDirConfig(dir);
        setDraftDir(dir);
    };
    return [draftDir, setDir];
};

// Editor
export const useFontType = (): [FontType, () => void] => {
    const [fontType, setFontType] = useRecoilState(fontTypeState);
    const toggleFontType = () =>
        setFontType((prev) => {
            const curr = prev === "mincho" ? "gothic" : "mincho";
            setFontTypeConfig(curr);
            return curr;
        });

    return [fontType, toggleFontType];
};

export const useDisplayCharCount = (): [boolean, SetterOrUpdater<boolean>, () => void] => {
    const [displayCharCount, setDisplayCharCount] = useRecoilState(displayCharCountState);
    const toggleDCC = () => {
        setDisplayCharCount((prev) => {
            setDisplayCharCountConfig(!prev);
            return !prev;
        });
    };

    return [displayCharCount, setDisplayCharCount, toggleDCC];
};

export const useFontSize = (): [number, () => void, () => void] => {
    const [fs, setFS] = useRecoilState(displayFontSizeState);
    const incFS = () =>
        setFS((prev) => {
            setFontSizeConfig(prev + 1);
            return prev + 1;
        });

    const decFS = () =>
        setFS((prev) => {
            setFontSizeConfig(prev - 1);
            return prev - 1;
        });

    return [fs, incFS, decFS];
};

export const getRealFontSize = (): number => {
    const rfs = useRecoilValue(realFontSizeState);
    return rfs;
};

export const useLineWords = (): [number, () => void, () => void] => {
    const [lw, setLW] = useRecoilState(lineWordsState);
    const incLW = () =>
        setLW((prev) => {
            setLineWordsConfig(prev + 1);
            return prev + 1;
        });
    const decLW = () =>
        setLW((prev) => {
            setLineWordsConfig(prev - 1);
            return prev - 1;
        });

    return [lw, incLW, decLW];
};

export const useLineHeight = (): [number, () => void, () => void] => {
    const [lh, setLH] = useRecoilState(lineHeightState);
    const incLH = () =>
        setLH((prev) => {
            setLineHeightConfig(prev + 1);
            return prev + 1;
        });
    const decLH = () =>
        setLH((prev) => {
            setLineHeightConfig(prev - 1);
            return prev - 1;
        });

    return [lh, incLH, decLH];
};

export const getLineHeightClass = (): LineHeightClassType => {
    const lineHeightClass = useRecoilValue(lineHeightClassState);
    return lineHeightClass;
};

type FormatProps = {
    fontType: FontType;
    fontSize: number;
    lineHeight: number;
    lineWords: number;
};

export const useFormat = (): (({ fontType, fontSize, lineHeight, lineWords }: FormatProps) => void) => {
    const setFontType = useSetRecoilState(fontTypeState);
    const setFontSize = useSetRecoilState(displayFontSizeState);
    const setLineHeight = useSetRecoilState(lineHeightState);
    const setLineWords = useSetRecoilState(lineWordsState);

    const setFormat = ({ fontType, fontSize, lineHeight, lineWords }: FormatProps) => {
        setFontType(fontType);
        setFontSize(fontSize);
        setLineHeight(lineHeight);
        setLineWords(lineWords);
    };

    return setFormat;
};

export const setWrapperHeight = (): SetterOrUpdater<number> => {
    const setWH = useSetRecoilState(wrapperHeightState);
    return setWH;
};

export const getEditorHeight = (): number => {
    const eh = useRecoilValue(editorHeightState);
    return eh;
};

type DisabledType = {
    incFS: boolean;
    decFS: boolean;
    incLH: boolean;
    decLH: boolean;
    incLW: boolean;
    decLW: boolean;
};

export const getDisabled = (): DisabledType => {
    const incFS = useRecoilValue(disabledIncFSState);
    const decFS = useRecoilValue(disabledDecFSState);
    const incLH = useRecoilValue(disabledIncLHState);
    const decLH = useRecoilValue(disabledDecLHState);
    const incLW = useRecoilValue(disabledIncLWState);
    const decLW = useRecoilValue(disabledDecLWState);

    return { incFS, decFS, incLH, decLH, incLW, decLW };
};

export const useAutosaveDuration = (): [number, (sec: number) => void] => {
    const [duration, setDuration] = useRecoilState(autosaveDurationState);
    const setDurationWithConfig = (sec: number) => {
        setDuration(() => {
            setAutosaveDurationConfig(sec);
            return sec;
        });
    };

    return [duration, setDurationWithConfig];
};

// Draft
export const useTitle = (): [string, SetterOrUpdater<string>] => {
    const [title, setTitle] = useRecoilState(titleState);
    return [title, setTitle];
};

export const useContent = (): [string, SetterOrUpdater<string>] => {
    const [content, setContent] = useRecoilState(contentState);
    return [content, setContent];
};

export const useIsTitleEdit = (): [boolean, SetterOrUpdater<boolean>] => {
    const [isEdit, setIsEdit] = useRecoilState(isTitleEditState);
    return [isEdit, setIsEdit];
};
