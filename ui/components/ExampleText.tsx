/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export default function ExampleText({ children }: { children: string; }) {
    return children.split("").map((x, i) => (
        <span key={i}>
            <span
                className={`sitelenpona`}
            // style={{
            //     fontFamily: `Comic Sans MS`,
            // }}
            >
                {x}
            </span>
        </span>
    ));
}
