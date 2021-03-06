import { remote } from "electron";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { parse } from "path";
import { useTheme } from "next-themes";
import { getTheme, getDraftDir, getDisplayCharCount, getAutosaveDuration, setThemeConfig } from "lib/config";
import { importDraft, exportDraft, loadDraftList, makeNewDraftName, writeDraft } from "lib/draft";
import { useTitle, useDraftDir, useAutosaveDuration, useDisplayCharCount } from "hooks";

type Props = {
    page: "home" | "editor";
};

const Menu = ({ page }: Props) => {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [title] = useTitle();
    const [draftDir, setDraftDir] = useDraftDir();
    const [displayCharCount, setDisplayCharCount, toggleDisplayCharCount] = useDisplayCharCount();
    const [autosaveDuration, setAutosaveDuration] = useAutosaveDuration();

    useEffect(() => {
        const dir = getDraftDir();
        setDraftDir(dir);

        const dcc = getDisplayCharCount();
        const ad = getAutosaveDuration();
        setDisplayCharCount(dcc);
        setAutosaveDuration(ad);

        const t = getTheme();
        setTheme(t);
    }, []);

    useEffect(() => {
        const localMenu = remote.Menu.buildFromTemplate([
            {
                label: "原稿",
                submenu: [
                    {
                        id: "import-draft",
                        label: "読み込む…",
                        accelerator: "CmdOrCtrl+O",
                        click: (_, win) => {
                            if (win) {
                                const paths = remote.dialog.showOpenDialogSync(win, {
                                    filters: [
                                        {
                                            name: "テキストファイル",
                                            extensions: ["txt"],
                                        },
                                    ],
                                    properties: ["openFile"],
                                });
                                if (paths === undefined || paths.length !== 1) return;
                                const text = importDraft(paths[0]);
                                const { base } = parse(paths[0]);
                                const list = loadDraftList(draftDir);
                                const exist = list.map((d) => d.title).includes(base);
                                const draft = exist ? makeNewDraftName(list) : base;
                                writeDraft(draftDir, draft, text);
                                router.push({ pathname: "/editor/[draft]", query: { draft } });
                            }
                        },
                    },
                    {
                        id: "export-draft",
                        label: "書き出す…",
                        accelerator: "CmdOrCtrl+Shift+S",
                        enabled: page === "editor",
                        click: (_, win) => {
                            if (win) {
                                const path = remote.dialog.showSaveDialogSync(win, {
                                    defaultPath: `${title}.txt`,
                                    filters: [
                                        {
                                            name: "テキストファイル",
                                            extensions: ["txt"],
                                        },
                                    ],
                                    properties: ["showOverwriteConfirmation"],
                                });
                                if (typeof path === "undefined") return;
                                exportDraft(draftDir, `${title}.txt`, path);
                            }
                        },
                    },
                    {
                        type: "separator",
                    },
                    {
                        id: "open-directory",
                        label: "フォルダを開く…　",
                        accelerator: "CmdOrCtrl+Shift+O",
                        click: (_, win) => {
                            if (win) {
                                const paths = remote.dialog.showOpenDialogSync(win, {
                                    properties: ["openDirectory"],
                                });
                                if (paths === undefined || paths.length !== 1) return;
                                setDraftDir(paths[0]);
                                router.push("/");
                            }
                        },
                    },
                    {
                        label: "　" + draftDir + (draftDir === "draft" ? "(default)" : ""),
                        visible: draftDir !== "draft",
                        enabled: false,
                    },
                    {
                        id: "reset-directory",
                        label: "フォルダを初期設定に戻す",
                        visible: draftDir !== "draft",
                        click: (_, win) => {
                            if (win) {
                                setDraftDir("draft");
                                router.push("/");
                            }
                        },
                    },
                    // {
                    //     id: "delete-draft",
                    //     label: "削除",
                    //     enabled: page === "editor",
                    //     click: (_, win) => {
                    //         if (win) {
                    //             const msg = `「${title}」を削除してもよろしいですか？`;
                    //             const cancel = openConfirmableMessageBox("warning", msg);
                    //             if (cancel) return;
                    //             deleteDraft(`${title}.txt`);
                    //             router.push("/");
                    //         }
                    //     },
                    // },
                ],
            },
            {
                label: "設定",
                submenu: [
                    {
                        id: "dark-mode",
                        label: "ダークモード　",
                        type: "checkbox",
                        accelerator: "CmdOrCtrl+Shift+T",
                        checked: theme === "dark",
                        click: (_, win) => {
                            if (win) {
                                const t = theme === "dark" ? "light" : "dark";
                                setTheme(t);
                                setThemeConfig(t);
                            }
                        },
                    },
                    {
                        id: "char-count-display",
                        label: "字数カウント",
                        type: "checkbox",
                        accelerator: "CmdOrCtrl+Shift+C",
                        checked: displayCharCount,
                        click: (_, win) => {
                            if (win) {
                                toggleDisplayCharCount();
                            }
                        },
                    },
                    { type: "separator" },
                    {
                        id: "autosave-duration",
                        label: "自動保存",
                        submenu: [
                            {
                                id: "duration-1-sec",
                                label: "1秒",
                                type: "checkbox",
                                checked: autosaveDuration === 1,
                                enabled: autosaveDuration !== 1,
                                click: (_, win) => {
                                    if (win) {
                                        setAutosaveDuration(1);
                                    }
                                },
                            },
                            {
                                id: "duration-5-sec",
                                label: "5秒",
                                type: "checkbox",
                                checked: autosaveDuration === 5,
                                enabled: autosaveDuration !== 5,
                                click: (_, win) => {
                                    if (win) {
                                        setAutosaveDuration(5);
                                    }
                                },
                            },
                            {
                                id: "duration-10-sec",
                                label: "10秒",
                                type: "checkbox",
                                checked: autosaveDuration === 10,
                                enabled: autosaveDuration !== 10,
                                click: (_, win) => {
                                    if (win) {
                                        setAutosaveDuration(10);
                                    }
                                },
                            },
                        ],
                    },
                    {
                        type: "separator",
                    },
                    {
                        label: "全画面",
                        sublabel: "Escで戻る",
                        accelerator: (() => {
                            if (process.platform === "darwin") {
                                return "Ctrl+Cmd+F";
                            } else {
                                return "F11";
                            }
                        })(),
                        click: (_, win) => {
                            if (win) {
                                const isF = win.isFullScreen();
                                win.setFullScreen(!isF);
                                win.setMenuBarVisibility(isF);
                            }
                        },
                    },
                    {
                        label: "全画面解除",
                        accelerator: "Esc",
                        visible: false,
                        click: (_, win) => {
                            if (win && win.isFullScreen()) {
                                win.setFullScreen(false);
                                win.setMenuBarVisibility(true);
                            }
                        },
                    },
                ],
            },
        ]);
        remote.Menu.setApplicationMenu(localMenu);
    }, [theme, draftDir, title, displayCharCount, autosaveDuration]);

    return null;
};

export default Menu;
