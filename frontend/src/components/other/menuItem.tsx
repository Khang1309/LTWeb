import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"


type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] }

export function MenuItem() {
    const fileTree: FileTreeItem[] = [
        {
            name: "HOME",
            items: [
                {
                    name: "ui",
                    items: [
                        { name: "button.tsx" },
                        { name: "card.tsx" },
                        { name: "dialog.tsx" },
                        { name: "input.tsx" },
                        { name: "select.tsx" },
                        { name: "table.tsx" },
                    ],
                },
                { name: "login-form.tsx" },
                { name: "register-form.tsx" },
            ],
        },
        {
            name: "ABOUT US",
            items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
        },
        {
            name: "PRODUCTS",
            items: [
                { name: "use-media-query.ts" },
                { name: "use-debounce.ts" },
                { name: "use-local-storage.ts" },
            ],
        },
        {
            name: "FAQ",
            items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
        },
        {
            name: "CONTACT",
            items: [
                { name: "favicon.ico" },
                { name: "logo.svg" },
                { name: "images" },
            ],
        },
    ]

    const renderItem = (fileItem: FileTreeItem) => {
        if ("items" in fileItem) {
            return (
                <Collapsible key={fileItem.name}>
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group  w-full h-12 justify-start text-xl transition-none hover:bg-(--color-hover) hover:text-accent-foreground"
                        >
                            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                            {/* <FolderIcon /> */}
                            {fileItem.name}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
                        <div className="flex flex-col gap-1">
                            {fileItem.items.map((child) => renderItem(child))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )
        }
        return (
            <Button
                key={fileItem.name}
                variant="link"
                size="sm"
                className="w-full justify-start gap-2 text-foreground"
            >
                <FileIcon />
                <span>{fileItem.name}</span>
            </Button>
        )
    }

    return (
        <Card className="mx-4 w-auto gap-2" size="sm">
            {/* <CardHeader>
        <div></div>
      </CardHeader> */}
            <CardContent>
                <div className="flex flex-col gap-1">
                    {fileTree.map((item) => renderItem(item))}
                </div>
            </CardContent>
        </Card>
    )
}
