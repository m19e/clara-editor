import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { parse } from "path";
import { readDraft } from "lib/draft";
import { getFormat } from "lib/config";
import { useFontType, useTitle, useFormat, useDraftDir } from "hooks";
import Menu from "foundations/Menu";
import DraftEditor from "components/organisms/DraftEditor";
import Frame from "components/organisms/Editor/Frame";

const Draft = () => {
    const { theme } = useTheme();
    const router = useRouter();
    const [draftDir] = useDraftDir();
    const [, setTitle] = useTitle();
    const [ft] = useFontType();
    const setFormat = useFormat();
    const [text, setText] = useState("");

    useEffect(() => {
        const { draft } = router.query;
        if (router.route !== router.asPath && typeof draft === "string") {
            const data = readDraft(draftDir, draft);
            const { name } = parse(draft);
            const fmt = getFormat();

            setFormat(fmt);
            setText(data);
            setTitle(name);
        }
    }, [router]);

    return (
        <>
            <Menu page="editor" />
            {typeof theme === "string" ? (
                <div className={`${ft} clara-text__${theme} clara-bg__${theme}`}>
                    <DraftEditor text={text} />
                    <Frame />
                </div>
            ) : null}
        </>
    );
};

export default Draft;
