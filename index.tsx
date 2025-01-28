/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { makeRange } from "@components/PluginSettings/components";
import definePlugin, { OptionType } from "@utils/types";
import { Text } from "@webpack/common";
import { ReactNode } from "react";

import ExampleText from "./ui/components/ExampleText";

const settings = definePluginSettings({});

// const settings = definePluginSettings({
//     intensity: {
//         type: OptionType.SLIDER,
//         description: "Animation intensity in px",
//         markers: makeRange(1, 10, 1),
//         default: 4,
//         stickToMarkers: true,
//         onChange: () => updateStyles()
//     }
// });

// const dirMap = {
//     x: "0.6s wiggle-wavy-x alternate ease-in-out infinite",
//     y: "1.2s wiggle-wavy-y linear infinite"
// };

const classMap = [
    {
        chars: ["$", "$"],
        className: "sitelenpona",
    }
];

let styles: HTMLStyleElement;
const updateStyles = () => {
    styles.textContent = `
@font-face {
    font-family: "sitelen";
    src: url("assets/sitelenselikiwenasuki.ttf") format("truetype");
    font-weight: normal;
    font-style: normal;
}
    
.sitelenpona {
    font-family: "sitelen";
}`;
};

export default definePlugin({
    name: "SitelenPona",
    description: "Adds a new markdown formatting that lets you write in sitelen pona!\nFont from https://www.kreativekorp.com/software/fonts/sitelenselikiwen/",
    authors: [{
        name: "Nexpid",
        id: 853550207039832084n
    }, {
        name: "Sushii64",
        id: 738942562584232007n
    }],
    settings,
    settingsAboutComponent: () => (
        <Text>
            You can make text into sitelen pona with the following:<br />
            <p><ExampleText>toki a</ExampleText> by typing <code>$text$</code></p>
        </Text>
    ),

    patches: [
        {
            find: "parseToAST:",
            replacement: {
                match: /(parse[\w]*):(.*?)\((\i)\),/g,
                replace: "$1:$2({...$3,sitelenpona:$self.sitelenponaRule}),",
            },
        },
    ],

    sitelenponaRule: {
        order: 24,
        match: (source: string) => classMap.map(({ chars }) => source.match(new RegExp(`^(\\${chars[0]})([\\s\\S]+?)(\\${chars[1]})(?!_)`))).find(x => x !== null),
        parse: (
            capture: RegExpMatchArray,
            transform: (...args: any[]) => any,
            state: any
        ) => {
            const className = classMap.find(({ chars }) => chars[0] === capture[1] && chars[1] === capture[3])?.className ?? "";

            return {
                content: transform(capture[2], state),
                className
            };
        },
        react: (
            data: { content: any[]; className: string; },
            output: (...args: any[]) => ReactNode[]
        ) => {
            let offset = 0;
            const traverse = (raw: any) => {
                const children = !Array.isArray(raw) ? [raw] : raw;
                let modified = false;

                let j = -1;
                for (const child of children) {
                    j++;
                    if (typeof child === "string") {
                        modified = true;
                        children[j] = (
                            <span key={j} className={`${data.className}`}>
                                {child}
                            </span>
                        );
                    } else if (child?.props?.children)
                        child.props.children = traverse(child.props.children);
                }

                return modified ? children : raw;
            };

            return traverse(output(data.content));
        },
    },

    start: () => {
        styles = document.createElement("style");
        styles.id = "SitelenPona";
        document.head.appendChild(styles);

        updateStyles();
    },

    stop: () => styles.remove()
});
